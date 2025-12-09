import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn) => setTimeout(fn, 0);
}

