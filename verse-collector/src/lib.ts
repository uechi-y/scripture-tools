import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = resolve(dirname(__filename), "..");
