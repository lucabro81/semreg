// src/worker-entry.ts
import * as SemReg from './main';

Object.entries(SemReg).forEach(([key, value]) => {
  // @ts-ignore
  self[key] = value;
});

self.onmessage = (event) => {
  const { id, code } = event.data;
  try {

    const wrappedCode = `
      try {
        const result = ${code};
        return { success: true, result };
      } catch (error) {
        return { 
          success: false, 
          error: { 
            message: error.message, 
            stack: error.stack 
          } 
        };
      }
    `;

    const evaluateFunction = new Function(wrappedCode);
    const { success, result, error } = evaluateFunction();

    if (success) {
      if (result instanceof RegExp) {
        self.postMessage({
          id,
          result: {
            type: 'RegExp',
            source: result.source,
            flags: result.flags
          }
        });
      } else {
        self.postMessage({ id, result });
      }
    } else {
      self.postMessage({ id, error });
    }

  } catch (evalError: any) {
    self.postMessage({
      id,
      error: {
        message: evalError.message,
        stack: evalError.stack
      }
    });
  }
};

// Esporta anche le funzioni normalmente per consentire anche l'uso diretto
export * from './main';