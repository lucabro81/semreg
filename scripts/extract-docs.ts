import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import * as ts from 'typescript';

interface FunctionDoc {
  name: string;
  description: string;
  params: { name: string; description: string; type: string | undefined }[];
  return: { description: string; type: string | undefined };
}

async function main() {
  const functions: FunctionDoc[] = [];
  const basePath = resolve('src');
  const folders = ['core', 'operators'];

  for (const folder of folders) {
    const folderPath = join(basePath, folder);
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      if (file.endsWith('.ts')) {
        const filePath = join(folderPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(
          file,
          content,
          ts.ScriptTarget.Latest,
          true
        );

        visitNode(sourceFile);
      }
    }
  }

  function visitNode(node: ts.Node) {
    // Manage normal function declarations
    if (ts.isFunctionDeclaration(node) && node.name) {
      const functionDoc = extractFunctionDoc(node, node.name.getText());
      if (functionDoc) {
        functions.push(functionDoc);
      }
    }
    // Manage arrow functions assigned to variables/constants directly
    else if (ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isArrowFunction(node.initializer) &&
      node.name) {
      // Pass the initializer (the ArrowFunction) for signature, and the node itself for JSDoc context
      const functionDoc = extractFunctionDoc(node, node.name.getText());
      if (functionDoc) {
        functions.push(functionDoc);
      }
    }
    // Manage variables assigned to the result of a HOF that accepts an arrow function
    else if (ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.name) {
      // Check if any argument is an arrow function
      const arrowFuncArg = node.initializer.arguments.find(ts.isArrowFunction);
      if (arrowFuncArg) {
        // Pass the VariableDeclaration for JSDoc, name from declaration
        const functionDoc = extractFunctionDoc(node, node.name.getText());
        if (functionDoc) {
          functions.push(functionDoc);
        }
      }
    }

    ts.forEachChild(node, visitNode);
  }

  function extractFunctionDoc(
    // The primary node, used for JSDoc and potentially signature
    node: ts.FunctionDeclaration | ts.VariableDeclaration,
    functionName: string
  ): FunctionDoc | null { // Return null if signature cannot be determined
    // JSDoc is always attached to the main declaration (Function or Variable)
    const jsDocTags = ts.getJSDocTags(node);
    let description = '';
    let params: { name: string; description: string; type: string | undefined }[] = [];
    let returnValue: { description: string; type: string | undefined } = { description: '', type: undefined };

    // --- Determine the node containing the function signature ---
    let signatureNode: ts.FunctionDeclaration | ts.ArrowFunction | undefined = undefined;

    if (ts.isFunctionDeclaration(node)) {
      signatureNode = node;
    } else if (ts.isVariableDeclaration(node) && node.initializer) {
      if (ts.isArrowFunction(node.initializer)) {
        signatureNode = node.initializer;
      } else if (ts.isCallExpression(node.initializer)) {
        // Find the arrow function passed as an argument in the HOF call
        signatureNode = node.initializer.arguments.find(ts.isArrowFunction) as ts.ArrowFunction | undefined;
      }
    }
    // Add checks for other types like ts.FunctionExpression if needed

    // If we couldn't find a signature node, we can't extract params/return types
    if (!signatureNode) {
      // Optionally log a warning or handle this case
      // console.warn(`Could not determine signature for ${functionName}`);
      // We might still want to return basic info if JSDoc exists, or return null
      // For now, return null if no signature is found
      return null;
    }
    // --- End: Determine signature node ---


    // Extract TypeScript types for parameters from signatureNode
    // (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node))
    params = signatureNode.parameters.map(param => ({
      name: param.name.getText(),
      description: '', // Verrà popolato dal JSDoc se presente
      type: param.type ? param.type.getText() : undefined
    }));

    // Extract TypeScript return type from signatureNode
    if (signatureNode.type) {
      returnValue.type = signatureNode.type.getText();
    }


    // Process JSDoc tags (associated with the passed main node: 'node')
    jsDocTags.forEach(tag => {
      const tagName = tag.tagName.getText();

      if (ts.isJSDocParameterTag(tag) && tag.name) {
        // For @param tags, we can access both the name and the description
        const paramDescription = tag.comment?.toString() || '';
        const paramName = tag.name.getText();

        const index = params.findIndex(p => p.name == paramName);
        if (index !== -1) {
          params[index] = { ...params[index], description: paramDescription };
        } else {
          const paramType = tag.typeExpression?.getText().replace(/[{}]/g, '') || undefined;
          params.push({ name: paramName, description: paramDescription, type: paramType });
        }
      } else if (ts.isJSDocReturnTag(tag)) {
        // For @returns tag, we can access both the type and the description
        returnValue = {
          description: tag.comment?.toString() || '',
          type: tag.typeExpression?.getText().replace(/[{}]/g, '') || undefined
        };
      } else {
        const comment = tag.comment?.toString() || '';

        switch (tagName) {
          case 'description':
            description = comment;
            break;
        }
      }
    });

    // Check if description was found in JSDoc, otherwise try getting it from comments above the node
    if (!description) {
      const comments = ts.getLeadingCommentRanges(node.getSourceFile().getFullText(), node.pos);
      if (comments && comments.length > 0) {
        const commentText = node.getSourceFile().getFullText().substring(comments[0].pos, comments[0].end);
        // Basic cleaning of comment syntax (/*, *, */) - might need refinement
        description = commentText.replace(/\/\*\*?|\*\/|\*\s?/g, '').trim();
        // Attempt to find @description tag within the general comment block if JSDoc parsing failed
        const descMatch = description.match(/@description\s+(.*)/);
        if (descMatch && descMatch[1]) {
          description = descMatch[1].trim();
        } else {
          // If no @description tag, use the first meaningful line as description
          description = description.split('\n').map(line => line.trim()).filter(line => line.length > 0)[0] || '';
        }
      }
    }

    return {
      name: functionName,
      description,
      params,
      return: returnValue
    };
  }

  // Write the result to a JSON file
  await fs.writeFile(
    'data/function-docs.json',
    JSON.stringify(functions, null, 2),
    'utf-8'
  );

  console.log(`Documentazione estratta per ${functions.length} funzioni`);
}

main().catch(console.error);