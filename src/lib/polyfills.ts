// Polyfills for React Native
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}

// Also set it on the global object for broader compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

// Polyfill for process.nextTick if not available
if (typeof global !== 'undefined' && !global.process?.nextTick) {
  if (!global.process) {
    global.process = {} as any;
  }
  global.process.nextTick = (callback: Function, ...args: any[]) => {
    setTimeout(() => callback(...args), 0);
  };
}

export { Buffer }; 