import * as fs from "fs";
import * as path from "path";

interface JsonObject {
  [key: string]: any;
}

interface ResolverOptions {
  baseDir: string;
  cache?: Map<string, any>;
}

/**
 * Combines modular, nested JSON objects into one resolved object.
 * Supports $ref syntax for referencing other JSON files.
 *
 * Example reference formats:
 * - "$ref": "./enemies/wolf.json"
 * - "$ref": "../items/sword_01.json"
 */
export class JsonCombiner {
  private cache: Map<string, any>;
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = path.resolve(baseDir);
    this.cache = new Map();
  }

  /**
   * Load and combine a JSON file with all its references
   */
  async combine(entryFile: string): Promise<JsonObject> {
    const entryPath = path.resolve(this.baseDir, entryFile);
    return this.resolveFile(entryPath);
  }

  /**
   * Synchronous version of combine
   */
  combineSync(entryFile: string): JsonObject {
    const entryPath = path.resolve(this.baseDir, entryFile);
    return this.resolveFileSync(entryPath);
  }

  /**
   * Recursively resolve a JSON file and all its references (async)
   */
  private async resolveFile(filePath: string): Promise<any> {
    // Check cache
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath);
    }

    // Read and parse file
    const content = await fs.promises.readFile(filePath, "utf-8");
    const json = JSON.parse(content);

    // Resolve references in the object
    const resolved = await this.resolveObject(json, path.dirname(filePath));

    // Cache the result
    this.cache.set(filePath, resolved);

    return resolved;
  }

  /**
   * Recursively resolve a JSON file and all its references (sync)
   */
  private resolveFileSync(filePath: string): any {
    // Check cache
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath);
    }

    // Read and parse file
    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);

    // Resolve references in the object
    const resolved = this.resolveObjectSync(json, path.dirname(filePath));

    // Cache the result
    this.cache.set(filePath, resolved);

    return resolved;
  }

  /**
   * Recursively resolve all $ref properties in an object (async)
   */
  private async resolveObject(obj: any, currentDir: string): Promise<any> {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.resolveObject(item, currentDir)));
    }

    // Handle $ref property
    if ("$ref" in obj && typeof obj.$ref === "string") {
      const refPath = path.resolve(currentDir, obj.$ref);
      const resolved = await this.resolveFile(refPath);

      // Merge any additional properties from the referencing object
      const { $ref, ...rest } = obj;
      return { ...resolved, ...rest };
    }

    // Recursively resolve all properties
    const resolved: JsonObject = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = await this.resolveObject(value, currentDir);
    }

    return resolved;
  }

  /**
   * Recursively resolve all $ref properties in an object (sync)
   */
  private resolveObjectSync(obj: any, currentDir: string): any {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveObjectSync(item, currentDir));
    }

    // Handle $ref property
    if ("$ref" in obj && typeof obj.$ref === "string") {
      const refPath = path.resolve(currentDir, obj.$ref);
      const resolved = this.resolveFileSync(refPath);

      // Merge any additional properties from the referencing object
      const { $ref, ...rest } = obj;
      return { ...resolved, ...rest };
    }

    // Recursively resolve all properties
    const resolved: JsonObject = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = this.resolveObjectSync(value, currentDir);
    }

    return resolved;
  }

  /**
   * Clear the internal cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Convenience function for quick one-off combinations
 */
export async function combineJson(baseDir: string, entryFile: string): Promise<JsonObject> {
  const combiner = new JsonCombiner(baseDir);
  return combiner.combine(entryFile);
}

/**
 * Synchronous convenience function
 */
export function combineJsonSync(baseDir: string, entryFile: string): JsonObject {
  const combiner = new JsonCombiner(baseDir);
  return combiner.combineSync(entryFile);
}

// Example usage:
/*
// campaign.json
{
  "name": "Forest Quest",
  "scenes": [
    { "$ref": "./scenes/forest_entrance.json" },
    { "$ref": "./scenes/cave.json" }
  ],
  "enemies": {
    "wolf": { "$ref": "./enemies/wolf.json" },
    "bear": { "$ref": "./enemies/bear.json" }
  }
}

// Usage:
const combiner = new JsonCombiner('./campaign');
const fullCampaign = await combiner.combine('campaign.json');

// Or use the convenience function:
const fullCampaign = await combineJson('./campaign', 'campaign.json');

// Synchronous version:
const fullCampaign = combineJsonSync('./campaign', 'campaign.json');
*/

// CLI helper functions
const printUsage = () => {
  console.log(`
Usage: node json-combiner.js [options] <entry-file>

Options:
  -d, --dir <directory>     Base directory (default: current directory)
  -o, --output <file>       Output file (default: stdout)
  -p, --pretty              Pretty print JSON output
  -h, --help                Show this help message

Examples:
  node json-combiner.js campaign.json
  node json-combiner.js -d ./campaign campaign.json
  node json-combiner.js -o output.json -p campaign.json
  node json-combiner.js --dir ./campaign --output combined.json --pretty campaign.json
  `);
};

const parseArgs = (args: string[]) => {
  const options = {
    baseDir: process.cwd(),
    output: null as string | null,
    pretty: false,
    entryFile: null as string | null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-h":
      case "--help":
        printUsage();
        process.exit(0);
        break;

      case "-d":
      case "--dir":
        options.baseDir = args[++i];
        if (!options.baseDir) {
          console.error("Error: --dir requires a directory path");
          process.exit(1);
        }
        break;

      case "-o":
      case "--output":
        options.output = args[++i];
        if (!options.output) {
          console.error("Error: --output requires a file path");
          process.exit(1);
        }
        break;

      case "-p":
      case "--pretty":
        options.pretty = true;
        break;

      default:
        if (arg.startsWith("-")) {
          console.error(`Error: Unknown option ${arg}`);
          printUsage();
          process.exit(1);
        }
        options.entryFile = arg;
        break;
    }
  }

  return options;
};

// CLI tool
if (require.main === module) {
  const args = process.argv.slice(2);

  try {
    const options = parseArgs(args);

    if (!options.entryFile) {
      console.error("Error: No entry file specified");
      printUsage();
      process.exit(1);
    }

    // Combine the JSON
    const combiner = new JsonCombiner(options.baseDir);
    const result = combiner.combineSync(options.entryFile);

    // Format output
    const output = options.pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);

    // Write output
    if (options.output) {
      fs.writeFileSync(options.output, output, "utf-8");
      console.log(`Combined JSON written to: ${options.output}`);
    } else {
      console.log(output);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
