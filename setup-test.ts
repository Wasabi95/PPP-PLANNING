import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

// This makes these browser APIs available to Jest in the Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any; // 'as any' is used to avoid type conflicts with JSDOM's types