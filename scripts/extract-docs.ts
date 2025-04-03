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
    // Gestisce le funzioni dichiarate normalmente
    if (ts.isFunctionDeclaration(node) && node.name) {
      const functionDoc = extractFunctionDoc(node, node.name.getText());
      if (functionDoc) {
        functions.push(functionDoc);
      }
    }
    // Gestisce le arrow function assegnate a variabili/costanti
    else if (ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isArrowFunction(node.initializer) &&
      node.name) {
      const functionDoc = extractFunctionDoc(node.initializer, node.name.getText());
      if (functionDoc) {
        functions.push(functionDoc);
      }
    }

    ts.forEachChild(node, visitNode);
  }

  function extractFunctionDoc(
    node: ts.FunctionDeclaration | ts.ArrowFunction | ts.VariableDeclaration,
    functionName: string
  ): FunctionDoc {
    const jsDocTags = ts.getJSDocTags(node);
    let description = '';
    let params: { name: string; description: string; type: string | undefined }[] = [];
    let returnValue: { description: string; type: string | undefined } = { description: '', type: undefined };

    // Estrai i tipi TypeScript per i parametri
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      params = node.parameters.map(param => ({
        name: param.name.getText(),
        description: '', // Verrà popolato dal JSDoc se presente
        type: param.type ? param.type.getText() : undefined
      }));

      // Estrai il tipo di ritorno TypeScript
      if (node.type) {
        returnValue.type = node.type.getText();
      }
    }

    // Processa i tag JSDoc
    jsDocTags.forEach(tag => {
      const tagName = tag.tagName.getText();

      if (ts.isJSDocParameterTag(tag) && tag.name) {
        // Per i tag @param, possiamo accedere sia al nome che alla descrizione
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
        // Per il tag @returns, accediamo al tipo e alla descrizione
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

    return {
      name: functionName,
      description,
      params,
      return: returnValue
    };
  }

  // Scrivi il risultato in un file JSON
  await fs.writeFile(
    'data/function-docs.json',
    JSON.stringify(functions, null, 2),
    'utf-8'
  );

  console.log(`Documentazione estratta per ${functions.length} funzioni`);
}

main().catch(console.error);