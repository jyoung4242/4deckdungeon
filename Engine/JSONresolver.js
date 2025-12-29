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
exports.combineJsonSync = exports.combineJson = exports.JsonCombiner = void 0;
var fs = require("fs");
var path = require("path");
/**
 * Combines modular, nested JSON objects into one resolved object.
 * Supports $ref syntax for referencing other JSON files.
 *
 * Example reference formats:
 * - "$ref": "./enemies/wolf.json"
 * - "$ref": "../items/sword_01.json"
 */
var JsonCombiner = /** @class */ (function () {
    function JsonCombiner(baseDir) {
        this.baseDir = path.resolve(baseDir);
        this.cache = new Map();
    }
    /**
     * Load and combine a JSON file with all its references
     */
    JsonCombiner.prototype.combine = function (entryFile) {
        return __awaiter(this, void 0, void 0, function () {
            var entryPath;
            return __generator(this, function (_a) {
                entryPath = path.resolve(this.baseDir, entryFile);
                return [2 /*return*/, this.resolveFile(entryPath)];
            });
        });
    };
    /**
     * Synchronous version of combine
     */
    JsonCombiner.prototype.combineSync = function (entryFile) {
        var entryPath = path.resolve(this.baseDir, entryFile);
        return this.resolveFileSync(entryPath);
    };
    /**
     * Recursively resolve a JSON file and all its references (async)
     */
    JsonCombiner.prototype.resolveFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var content, json, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check cache
                        if (this.cache.has(filePath)) {
                            return [2 /*return*/, this.cache.get(filePath)];
                        }
                        return [4 /*yield*/, fs.promises.readFile(filePath, "utf-8")];
                    case 1:
                        content = _a.sent();
                        json = JSON.parse(content);
                        return [4 /*yield*/, this.resolveObject(json, path.dirname(filePath))];
                    case 2:
                        resolved = _a.sent();
                        // Cache the result
                        this.cache.set(filePath, resolved);
                        return [2 /*return*/, resolved];
                }
            });
        });
    };
    /**
     * Recursively resolve a JSON file and all its references (sync)
     */
    JsonCombiner.prototype.resolveFileSync = function (filePath) {
        // Check cache
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }
        // Read and parse file
        var content = fs.readFileSync(filePath, "utf-8");
        var json = JSON.parse(content);
        // Resolve references in the object
        var resolved = this.resolveObjectSync(json, path.dirname(filePath));
        // Cache the result
        this.cache.set(filePath, resolved);
        return resolved;
    };
    /**
     * Recursively resolve all $ref properties in an object (async)
     */
    JsonCombiner.prototype.resolveObject = function (obj, currentDir) {
        return __awaiter(this, void 0, void 0, function () {
            var refPath, resolved_1, $ref, rest, resolved, _i, _a, _b, key, value, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (obj === null || typeof obj !== "object") {
                            return [2 /*return*/, obj];
                        }
                        // Handle arrays
                        if (Array.isArray(obj)) {
                            return [2 /*return*/, Promise.all(obj.map(function (item) { return _this.resolveObject(item, currentDir); }))];
                        }
                        if (!("$ref" in obj && typeof obj.$ref === "string")) return [3 /*break*/, 2];
                        refPath = path.resolve(currentDir, obj.$ref);
                        return [4 /*yield*/, this.resolveFile(refPath)];
                    case 1:
                        resolved_1 = _e.sent();
                        $ref = obj.$ref, rest = __rest(obj, ["$ref"]);
                        return [2 /*return*/, __assign(__assign({}, resolved_1), rest)];
                    case 2:
                        resolved = {};
                        _i = 0, _a = Object.entries(obj);
                        _e.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        _b = _a[_i], key = _b[0], value = _b[1];
                        _c = resolved;
                        _d = key;
                        return [4 /*yield*/, this.resolveObject(value, currentDir)];
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
     * Recursively resolve all $ref properties in an object (sync)
     */
    JsonCombiner.prototype.resolveObjectSync = function (obj, currentDir) {
        var _this = this;
        if (obj === null || typeof obj !== "object") {
            return obj;
        }
        // Handle arrays
        if (Array.isArray(obj)) {
            return obj.map(function (item) { return _this.resolveObjectSync(item, currentDir); });
        }
        // Handle $ref property
        if ("$ref" in obj && typeof obj.$ref === "string") {
            var refPath = path.resolve(currentDir, obj.$ref);
            var resolved_2 = this.resolveFileSync(refPath);
            // Merge any additional properties from the referencing object
            var $ref = obj.$ref, rest = __rest(obj, ["$ref"]);
            return __assign(__assign({}, resolved_2), rest);
        }
        // Recursively resolve all properties
        var resolved = {};
        for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            resolved[key] = this.resolveObjectSync(value, currentDir);
        }
        return resolved;
    };
    /**
     * Clear the internal cache
     */
    JsonCombiner.prototype.clearCache = function () {
        this.cache.clear();
    };
    return JsonCombiner;
}());
exports.JsonCombiner = JsonCombiner;
/**
 * Convenience function for quick one-off combinations
 */
function combineJson(baseDir, entryFile) {
    return __awaiter(this, void 0, void 0, function () {
        var combiner;
        return __generator(this, function (_a) {
            combiner = new JsonCombiner(baseDir);
            return [2 /*return*/, combiner.combine(entryFile)];
        });
    });
}
exports.combineJson = combineJson;
/**
 * Synchronous convenience function
 */
function combineJsonSync(baseDir, entryFile) {
    var combiner = new JsonCombiner(baseDir);
    return combiner.combineSync(entryFile);
}
exports.combineJsonSync = combineJsonSync;
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
var printUsage = function () {
    console.log("\nUsage: node json-combiner.js [options] <entry-file>\n\nOptions:\n  -d, --dir <directory>     Base directory (default: current directory)\n  -o, --output <file>       Output file (default: stdout)\n  -p, --pretty              Pretty print JSON output\n  -h, --help                Show this help message\n\nExamples:\n  node json-combiner.js campaign.json\n  node json-combiner.js -d ./campaign campaign.json\n  node json-combiner.js -o output.json -p campaign.json\n  node json-combiner.js --dir ./campaign --output combined.json --pretty campaign.json\n  ");
};
var parseArgs = function (args) {
    var options = {
        baseDir: process.cwd(),
        output: null,
        pretty: false,
        entryFile: null,
    };
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
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
                    console.error("Error: Unknown option ".concat(arg));
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
    var args = process.argv.slice(2);
    try {
        var options = parseArgs(args);
        if (!options.entryFile) {
            console.error("Error: No entry file specified");
            printUsage();
            process.exit(1);
        }
        // Combine the JSON
        var combiner = new JsonCombiner(options.baseDir);
        var result = combiner.combineSync(options.entryFile);
        // Format output
        var output = options.pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
        // Write output
        if (options.output) {
            fs.writeFileSync(options.output, output, "utf-8");
            console.log("Combined JSON written to: ".concat(options.output));
        }
        else {
            console.log(output);
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}
