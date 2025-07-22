import { readFile } from 'fs/promises';

type PrismaField = {
  name: string;
  type: string;
  attributes: string[];
}

type PrismaModel = {
  name: string;
  fields: PrismaField[];
}

export const parsePrismaModels = async (filePath: string): Promise<PrismaModel[]> => {

  const content = await readFile(filePath, 'utf-8');

  // regex expression to match full model blocks
  const modelBlockRegex = /model\s+(\w+)\s*{([^}]*)}/g;

  const models: PrismaModel[] = [];
  let match;

  // look for all models in schema.prisma
  // saying while there is "match" or model in "content"
  // where it is matching it with the regex expression defined earlier
  while ((match = modelBlockRegex.exec(content)) !== null) {

    // using array destructuring 
    // for regex expression returned by match from modelBlockRegex.exec(content)
    // note: match = ["full match", "modelName", "body"], hence the comma at start
    // this is same as, modelName = match[1], body = match[2]
    const [, modelName, body] = match;

    // split lines, remove comments/whitespace
    const lines = body
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'));

    // parse each field
    const fields: PrismaField[] = lines.map(line => {

      // using array spread
      // splits the fields into name, type, attributes[]
      const [name, type, ...rest] = line.split(/\s+/);
      return {
        name,
        type,
        attributes: rest
      };

    });

    // add models to the list
    models.push({
      name: modelName,
      fields
    });
  }

  return models;

};
