import * as fs from "fs";
import * as path from "path";

interface JsonObject {
  [key: string]: any;
}

interface CampaignStructure {
  [key: string]: any;
  Scenes?: JsonObject[];
  Perks?: JsonObject[];
  NPCs?: JsonObject[];
  Items?: JsonObject[];
  Lore?: JsonObject[];
  Engagements?: JsonObject[];
  Enemies?: JsonObject[];
  Contests?: JsonObject[];
}

/**
 * Auto-discovers and combines all JSON files in a campaign directory structure.
 * Automatically organizes files by their folder names.
 */
export class CampaignCombiner {
  private baseDir: string;
  private cache: Map<string, any>;

  constructor(baseDir: string) {
    this.baseDir = path.resolve(baseDir);
    this.cache = new Map();
  }

  /**
   * Combine all JSON files in the campaign directory
   * @param rootFiles Optional array of root-level files to include (e.g., ['campaign.json', 'playergen.json'])
   */
  combineSync(rootFiles?: string[]): CampaignStructure {
    const result: CampaignStructure = {};

    // First, load root-level JSON files in the base directory
    if (rootFiles && rootFiles.length > 0) {
      rootFiles.forEach(file => {
        const filePath = path.join(this.baseDir, file);
        if (fs.existsSync(filePath)) {
          const content = this.loadJsonFile(filePath);
          Object.assign(result, content);
        }
      });
    } else {
      // Load all JSON files in the root directory
      const rootJsonFiles = fs
        .readdirSync(this.baseDir)
        .filter(file => file.endsWith(".json") && fs.statSync(path.join(this.baseDir, file)).isFile());

      rootJsonFiles.forEach(file => {
        const filePath = path.join(this.baseDir, file);
        const content = this.loadJsonFile(filePath);
        Object.assign(result, content);
      });
    }

    // Then, discover and load all subdirectories
    const subdirs = fs.readdirSync(this.baseDir).filter(item => {
      const itemPath = path.join(this.baseDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    subdirs.forEach(dir => {
      const categoryName = dir; // Use folder name as the category key
      const categoryPath = path.join(this.baseDir, dir);
      const items = this.loadCategorySync(categoryPath);

      if (items.length > 0) {
        result[categoryName] = items;
      }
    });

    return result;
  }

  /**
   * Async version of combine
   */
  async combine(rootFiles?: string[]): Promise<CampaignStructure> {
    const result: CampaignStructure = {};

    // Load root-level JSON files
    if (rootFiles && rootFiles.length > 0) {
      for (const file of rootFiles) {
        const filePath = path.join(this.baseDir, file);
        if (fs.existsSync(filePath)) {
          const content = await this.loadJsonFileAsync(filePath);
          Object.assign(result, content);
        }
      }
    } else {
      const rootJsonFiles = (await fs.promises.readdir(this.baseDir)).filter(async file => {
        const filePath = path.join(this.baseDir, file);
        const stat = await fs.promises.stat(filePath);
        return file.endsWith(".json") && stat.isFile();
      });

      for (const file of rootJsonFiles) {
        const filePath = path.join(this.baseDir, file);
        const content = await this.loadJsonFileAsync(filePath);
        Object.assign(result, content);
      }
    }

    // Discover and load all subdirectories
    const items = await fs.promises.readdir(this.baseDir);
    const subdirs: string[] = [];

    for (const item of items) {
      const itemPath = path.join(this.baseDir, item);
      const stat = await fs.promises.stat(itemPath);
      if (stat.isDirectory()) {
        subdirs.push(item);
      }
    }

    for (const dir of subdirs) {
      const categoryName = dir;
      const categoryPath = path.join(this.baseDir, dir);
      const categoryItems = await this.loadCategoryAsync(categoryPath);

      if (categoryItems.length > 0) {
        result[categoryName] = categoryItems;
      }
    }

    return result;
  }

  /**
   * Recursively load all JSON files in a category directory (sync)
   */
  private loadCategorySync(categoryPath: string): JsonObject[] {
    const items: JsonObject[] = [];

    const entries = fs.readdirSync(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(categoryPath, entry.name);

      if (entry.isFile() && entry.name.endsWith(".json")) {
        const content = this.loadJsonFile(fullPath);
        items.push(content);
      } else if (entry.isDirectory()) {
        // Recursively load subdirectories
        const subItems = this.loadCategorySync(fullPath);
        items.push(...subItems);
      }
    }

    return items;
  }

  /**
   * Recursively load all JSON files in a category directory (async)
   */
  private async loadCategoryAsync(categoryPath: string): Promise<JsonObject[]> {
    const items: JsonObject[] = [];

    const entries = await fs.promises.readdir(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(categoryPath, entry.name);

      if (entry.isFile() && entry.name.endsWith(".json")) {
        const content = await this.loadJsonFileAsync(fullPath);
        items.push(content);
      } else if (entry.isDirectory()) {
        // Recursively load subdirectories
        const subItems = await this.loadCategoryAsync(fullPath);
        items.push(...subItems);
      }
    }

    return items;
  }

  /**
   * Load and parse a JSON file with $ref resolution (sync)
   */
  private loadJsonFile(filePath: string): JsonObject {
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);
    const resolved = this.resolveRefsSync(json, path.dirname(filePath));

    this.cache.set(filePath, resolved);
    return resolved;
  }

  /**
   * Load and parse a JSON file with $ref resolution (async)
   */
  private async loadJsonFileAsync(filePath: string): Promise<JsonObject> {
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath);
    }

    const content = await fs.promises.readFile(filePath, "utf-8");
    const json = JSON.parse(content);
    const resolved = await this.resolveRefsAsync(json, path.dirname(filePath));

    this.cache.set(filePath, resolved);
    return resolved;
  }

  /**
   * Resolve $ref properties in an object (sync)
   */
  private resolveRefsSync(obj: any, currentDir: string): any {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveRefsSync(item, currentDir));
    }

    if ("$ref" in obj && typeof obj.$ref === "string") {
      const refPath = path.resolve(currentDir, obj.$ref);
      const resolved = this.loadJsonFile(refPath);
      const { $ref, ...rest } = obj;
      return { ...resolved, ...rest };
    }

    const resolved: JsonObject = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = this.resolveRefsSync(value, currentDir);
    }

    return resolved;
  }

  /**
   * Resolve $ref properties in an object (async)
   */
  private async resolveRefsAsync(obj: any, currentDir: string): Promise<any> {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.resolveRefsAsync(item, currentDir)));
    }

    if ("$ref" in obj && typeof obj.$ref === "string") {
      const refPath = path.resolve(currentDir, obj.$ref);
      const resolved = await this.loadJsonFileAsync(refPath);
      const { $ref, ...rest } = obj;
      return { ...resolved, ...rest };
    }

    const resolved: JsonObject = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = await this.resolveRefsAsync(value, currentDir);
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
 * Convenience function for quick combinations
 */
export function combineCampaign(campaignDir: string, rootFiles?: string[]): CampaignStructure {
  const combiner = new CampaignCombiner(campaignDir);
  return combiner.combineSync(rootFiles);
}

/**
 * Async convenience function
 */
export async function combineCampaignAsync(campaignDir: string, rootFiles?: string[]): Promise<CampaignStructure> {
  const combiner = new CampaignCombiner(campaignDir);
  return combiner.combine(rootFiles);
}

// CLI helper functions
const printUsage = () => {
  console.log(`
Usage: node json-combiner.js [options] <campaign-directory>

Auto-discovers and combines all JSON files in a campaign directory structure.
Root-level JSON files are merged into the base object.
Subdirectories become arrays of their contained JSON files.

Options:
  -r, --root <files>        Comma-separated list of root files to include (default: all .json files)
  -o, --output <file>       Output file (default: stdout)
  -p, --pretty              Pretty print JSON output
  -h, --help                Show this help message

Examples:
  node json-combiner.js ./campaign
  node json-combiner.js -r campaign.json,playergen.json ./campaign
  node json-combiner.js -o combined.json -p ./campaign
  `);
};

const parseArgs = (args: string[]) => {
  const options = {
    campaignDir: null as string | null,
    rootFiles: null as string[] | null,
    output: null as string | null,
    pretty: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-h":
      case "--help":
        printUsage();
        process.exit(0);
        break;

      case "-r":
      case "--root":
        const rootArg = args[++i];
        if (!rootArg) {
          console.error("Error: --root requires a comma-separated list of files");
          process.exit(1);
        }
        options.rootFiles = rootArg.split(",").map(f => f.trim());
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
        options.campaignDir = arg;
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

    if (!options.campaignDir) {
      console.error("Error: No campaign directory specified");
      printUsage();
      process.exit(1);
    }

    // Combine the campaign
    const combiner = new CampaignCombiner(options.campaignDir);
    const result = combiner.combineSync(options.rootFiles || undefined);

    // Format output
    const output = options.pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);

    // Write output
    if (options.output) {
      fs.writeFileSync(options.output, output, "utf-8");
      console.log(`Combined campaign written to: ${options.output}`);
    } else {
      console.log(output);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Example usage:
/*
Campaign structure:
campaign/
├─ campaign.json
├─ playergen.json
├─ Scenes/
│  ├─ forest_entrance.json
│  └─ cave.json
├─ Enemies/
│  ├─ wolf.json
│  └─ bear.json
└─ Items/
   └─ sword.json

Usage:
const combiner = new CampaignCombiner('./campaign');
const fullCampaign = combiner.combineSync(['campaign.json', 'playergen.json']);

// Or auto-discover all root files:
const fullCampaign = combiner.combineSync();

Result:
{
  // Contents of campaign.json and playergen.json merged here
  "name": "Forest Quest",
  "Scenes": [
    { ...forest_entrance.json contents },
    { ...cave.json contents }
  ],
  "Enemies": [
    { ...wolf.json contents },
    { ...bear.json contents }
  ],
  "Items": [
    { ...sword.json contents }
  ]
}
*/
