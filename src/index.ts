import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMockData } from './generateMockData';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const dataPath = path.join(__dirname, 'data');

await generateMockData(schemaPath, dataPath, 5);