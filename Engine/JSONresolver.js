"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineCampaignAsync = exports.combineCampaign = exports.CampaignCombiner = void 0;
var fs = require("fs");
var path = require("path");
/**
 * Auto-discovers and combines all JSON files in a campaign directory structure.
 * Automatically organizes files by their folder names.
 */
var CampaignCombiner = /** @class */ (function () {
    function CampaignCombiner(baseDir) {
        this.baseDir = path.resolve(baseDir);
        this.cache = new Map();
    }
    /**
     * Combine all JSON files in the campaign directory
     * @param rootFiles Optional array of root-level files to include (e.g., ['campaign.json', 'playergen.json'])
     */
    CampaignCombiner.prototype.combineSync = function (rootFiles) {
        var _this = this;
        var result = {};
        // First, load root-level JSON files in the base directory
        if (rootFiles && rootFiles.length > 0) {
            rootFiles.forEach(function (file) {
                var filePath = path.join(_this.baseDir, file);
                if (fs.existsSync(filePath)) {
                    var content = _this.loadJsonFile(filePath);
                    Object.assign(result, content);
                }
            });
        }
        else {
            // Load all JSON files in the root directory
            var rootJsonFiles = fs
                .readdirSync(this.baseDir)
                .filter(function (file) { return file.endsWith(".json") && fs.statSync(path.join(_this.baseDir, file)).isFile(); });
            rootJsonFiles.forEach(function (file) {
                var filePath = path.join(_this.baseDir, file);
                var content = _this.loadJsonFile(filePath);
                Object.assign(result, content);
            });
        }
        // Then, discover and load all subdirectories
        var subdirs = fs.readdirSync(this.baseDir).filter(function (item) {
            var itemPath = path.join(_this.baseDir, item);
            return fs.statSync(itemPath).isDirectory();
        });
        subdirs.forEach(function (dir) {
            var categoryName = dir; // Use folder name as the category key
            var categoryPath = path.join(_this.baseDir, dir);
            var items = _this.loadCategorySync(categoryPath);
            if (items.length > 0) {
                result[categoryName] = items;
            }
        });
        return result;
    };
    /**
     * Async version of combine
     */
    CampaignCombiner.prototype.combine = function (rootFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, rootFiles_1, file, filePath, content, rootJsonFiles, _a, rootJsonFiles_1, file, filePath, content, items, subdirs, _b, items_1, item, itemPath, stat, _c, subdirs_1, dir, categoryName, categoryPath, categoryItems;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = {};
                        if (!(rootFiles && rootFiles.length > 0)) return [3 /*break*/, 5];
                        _i = 0, rootFiles_1 = rootFiles;
                        _d.label = 1;
                    case 1:
                        if (!(_i < rootFiles_1.length)) return [3 /*break*/, 4];
                        file = rootFiles_1[_i];
                        filePath = path.join(this.baseDir, file);
                        if (!fs.existsSync(filePath)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadJsonFileAsync(filePath)];
                    case 2:
                        content = _d.sent();
                        Object.assign(result, content);
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, fs.promises.readdir(this.baseDir)];
                    case 6:
                        rootJsonFiles = (_d.sent()).filter(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var filePath, stat;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        filePath = path.join(this.baseDir, file);
                                        return [4 /*yield*/, fs.promises.stat(filePath)];
                                    case 1:
                                        stat = _a.sent();
                                        return [2 /*return*/, file.endsWith(".json") && stat.isFile()];
                                }
                            });
                        }); });
                        _a = 0, rootJsonFiles_1 = rootJsonFiles;
                        _d.label = 7;
                    case 7:
                        if (!(_a < rootJsonFiles_1.length)) return [3 /*break*/, 10];
                        file = rootJsonFiles_1[_a];
                        filePath = path.join(this.baseDir, file);
                        return [4 /*yield*/, this.loadJsonFileAsync(filePath)];
                    case 8:
                        content = _d.sent();
                        Object.assign(result, content);
                        _d.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, fs.promises.readdir(this.baseDir)];
                    case 11:
                        items = _d.sent();
                        subdirs = [];
                        _b = 0, items_1 = items;
                        _d.label = 12;
                    case 12:
                        if (!(_b < items_1.length)) return [3 /*break*/, 15];
                        item = items_1[_b];
                        itemPath = path.join(this.baseDir, item);
                        return [4 /*yield*/, fs.promises.stat(itemPath)];
                    case 13:
                        stat = _d.sent();
                        if (stat.isDirectory()) {
                            subdirs.push(item);
                        }
                        _d.label = 14;
                    case 14:
                        _b++;
                        return [3 /*break*/, 12];
                    case 15:
                        _c = 0, subdirs_1 = subdirs;
                        _d.label = 16;
                    case 16:
                        if (!(_c < subdirs_1.length)) return [3 /*break*/, 19];
                        dir = subdirs_1[_c];
                        categoryName = dir;
                        categoryPath = path.join(this.baseDir, dir);
                        return [4 /*yield*/, this.loadCategoryAsync(categoryPath)];
                    case 17:
                        categoryItems = _d.sent();
                        if (categoryItems.length > 0) {
                            result[categoryName] = categoryItems;
                        }
                        _d.label = 18;
                    case 18:
                        _c++;
                        return [3 /*break*/, 16];
                    case 19: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Recursively load all JSON files in a category directory (sync)
     */
    CampaignCombiner.prototype.loadCategorySync = function (categoryPath) {
        var items = [];
        var entries = fs.readdirSync(categoryPath, { withFileTypes: true });
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            var fullPath = path.join(categoryPath, entry.name);
            if (entry.isFile() && entry.name.endsWith(".json")) {
                var content = this.loadJsonFile(fullPath);
                items.push(content);
            }
            else if (entry.isDirectory()) {
                // Recursively load subdirectories
                var subItems = this.loadCategorySync(fullPath);
                items.push.apply(items, subItems);
            }
        }
        return items;
    };
    /**
     * Recursively load all JSON files in a category directory (async)
     */
    CampaignCombiner.prototype.loadCategoryAsync = function (categoryPath) {
        return __awaiter(this, void 0, void 0, function () {
            var items, entries, _i, entries_2, entry, fullPath, content, subItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        return [4 /*yield*/, fs.promises.readdir(categoryPath, { withFileTypes: true })];
                    case 1:
                        entries = _a.sent();
                        _i = 0, entries_2 = entries;
                        _a.label = 2;
                    case 2:
                        if (!(_i < entries_2.length)) return [3 /*break*/, 7];
                        entry = entries_2[_i];
                        fullPath = path.join(categoryPath, entry.name);
                        if (!(entry.isFile() && entry.name.endsWith(".json"))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.loadJsonFileAsync(fullPath)];
                    case 3:
                        content = _a.sent();
                        items.push(content);
                        return [3 /*break*/, 6];
                    case 4:
                        if (!entry.isDirectory()) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.loadCategoryAsync(fullPath)];
                    case 5:
                        subItems = _a.sent();
                        items.push.apply(items, subItems);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, items];
                }
            });
        });
    };
    /**
     * Load and parse a JSON file with $ref resolution (sync)
     */
    CampaignCombiner.prototype.loadJsonFile = function (filePath) {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }
        var content = fs.readFileSync(filePath, "utf-8");
        var json = JSON.parse(content);
        var resolved = this.resolveRefsSync(json, path.dirname(filePath));
        this.cache.set(filePath, resolved);
        return resolved;
    };
    /**
     * Load and parse a JSON file with $ref resolution (async)
     */
    CampaignCombiner.prototype.loadJsonFileAsync = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var content, json, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cache.has(filePath)) {
                            return [2 /*return*/, this.cache.get(filePath)];
                        }
                        return [4 /*yield*/, fs.promises.readFile(filePath, "utf-8")];
                    case 1:
                        content = _a.sent();
                        json = JSON.parse(content);
                        return [4 /*yield*/, this.resolveRefsAsync(json, path.dirname(filePath))];
                    case 2:
                        resolved = _a.sent();
                        this.cache.set(filePath, resolved);
                        return [2 /*return*/, resolved];
                }
            });
        });
    };
    /**
     * Resolve $ref properties in an object (sync)
     */
    CampaignCombiner.prototype.resolveRefsSync = function (obj, currentDir) {
        var _this = this;
        if (obj === null || typeof obj !== "object") {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(function (item) { return _this.resolveRefsSync(item, currentDir); });
        }
        if ("$ref" in obj && typeof obj.$ref === "string") {
            var refPath = path.resolve(currentDir, obj.$ref);
            var resolved_1 = this.loadJsonFile(refPath);
            var $ref = obj.$ref, rest = __rest(obj, ["$ref"]);
            return __assign(__assign({}, resolved_1), rest);
        }
        var resolved = {};
        for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            resolved[key] = this.resolveRefsSync(value, currentDir);
        }
        return resolved;
    };
    /**
     * Resolve $ref properties in an object (async)
     */
    CampaignCombiner.prototype.resolveRefsAsync = function (obj, currentDir) {
        return __awaiter(this, void 0, void 0, function () {
            var refPath, resolved_2, $ref, rest, resolved, _i, _a, _b, key, value, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (obj === null || typeof obj !== "object") {
                            return [2 /*return*/, obj];
                        }
                        if (Array.isArray(obj)) {
                            return [2 /*return*/, Promise.all(obj.map(function (item) { return _this.resolveRefsAsync(item, currentDir); }))];
                        }
                        if (!("$ref" in obj && typeof obj.$ref === "string")) return [3 /*break*/, 2];
                        refPath = path.resolve(currentDir, obj.$ref);
                        return [4 /*yield*/, this.loadJsonFileAsync(refPath)];
                    case 1:
                        resolved_2 = _e.sent();
                        $ref = obj.$ref, rest = __rest(obj, ["$ref"]);
                        return [2 /*return*/, __assign(__assign({}, resolved_2), rest)];
                    case 2:
                        resolved = {};
                        _i = 0, _a = Object.entries(obj);
                        _e.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        _b = _a[_i], key = _b[0], value = _b[1];
                        _c = resolved;
                        _d = key;
                        return [4 /*yield*/, this.resolveRefsAsync(value, currentDir)];
                    case 4:
                        _c[_d] = _e.sent();
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, resolved];
                }
            });
        });
    };
    /**
     * Clear the internal cache
     */
    CampaignCombiner.prototype.clearCache = function () {
        this.cache.clear();
    };
    return CampaignCombiner;
}());
exports.CampaignCombiner = CampaignCombiner;
/**
 * Convenience function for quick combinations
 */
function combineCampaign(campaignDir, rootFiles) {
    var combiner = new CampaignCombiner(campaignDir);
    return combiner.combineSync(rootFiles);
}
exports.combineCampaign = combineCampaign;
/**
 * Async convenience function
 */
function combineCampaignAsync(campaignDir, rootFiles) {
    return __awaiter(this, void 0, void 0, function () {
        var combiner;
        return __generator(this, function (_a) {
            combiner = new CampaignCombiner(campaignDir);
            return [2 /*return*/, combiner.combine(rootFiles)];
        });
    });
}
exports.combineCampaignAsync = combineCampaignAsync;
// CLI helper functions
var printUsage = function () {
    console.log("\nUsage: node json-combiner.js [options] <campaign-directory>\n\nAuto-discovers and combines all JSON files in a campaign directory structure.\nRoot-level JSON files are merged into the base object.\nSubdirectories become arrays of their contained JSON files.\n\nOptions:\n  -r, --root <files>        Comma-separated list of root files to include (default: all .json files)\n  -o, --output <file>       Output file (default: stdout)\n  -p, --pretty              Pretty print JSON output\n  -h, --help                Show this help message\n\nExamples:\n  node json-combiner.js ./campaign\n  node json-combiner.js -r campaign.json,playergen.json ./campaign\n  node json-combiner.js -o combined.json -p ./campaign\n  ");
};
var parseArgs = function (args) {
    var options = {
        campaignDir: null,
        rootFiles: null,
        output: null,
        pretty: false,
    };
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        switch (arg) {
            case "-h":
            case "--help":
                printUsage();
                process.exit(0);
                break;
            case "-r":
            case "--root":
                var rootArg = args[++i];
                if (!rootArg) {
                    console.error("Error: --root requires a comma-separated list of files");
                    process.exit(1);
                }
                options.rootFiles = rootArg.split(",").map(function (f) { return f.trim(); });
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
                    console.error("Error: Unknown option ".concat(arg));
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
    var args = process.argv.slice(2);
    try {
        var options = parseArgs(args);
        if (!options.campaignDir) {
            console.error("Error: No campaign directory specified");
            printUsage();
            process.exit(1);
        }
        // Combine the campaign
        var combiner = new CampaignCombiner(options.campaignDir);
        var result = combiner.combineSync(options.rootFiles || undefined);
        // Format output
        var output = options.pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
        // Write output
        if (options.output) {
            fs.writeFileSync(options.output, output, "utf-8");
            console.log("Combined campaign written to: ".concat(options.output));
        }
        else {
            console.log(output);
        }
    }
    catch (error) {
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
