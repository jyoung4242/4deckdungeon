# Four Deck Dungeon — Terminal App

A browser-based terminal interface for the **Four Deck Dungeon** RPG engine. Load campaigns, generate party members, and manage your
game entirely from a retro-styled terminal.

## Features

- 🎮 **Campaign Loading** — Drag-and-drop or load JSON campaign files
- 👥 **Party Generation** — Generate unique party members using the card-based system
- 🛡️ **Party Management** — Add, remove, and view party details
- 🎴 **Three Decks** — Player Gen (52 cards), Contest (52 cards), Encounter (104 cards)
- 🔐 **Schema Validation** — Campaign JSON validated with Zod before loading
- 🎨 **Retro Terminal UI** — Green-on-black terminal aesthetic with drag-and-drop support

## Requirements

- **Node.js** (v14+) with npm
- **Modern browser** (Chrome, Firefox, Safari, Edge)
- **FourDeckDungeonEngine** built to `../Engine/dist/engine.js`

## Setup

### 1. Build the Engine

From the `Engine/` directory, compile TypeScript to ESM:

```bash
cd ../Engine
npx esbuild ./engine.ts --bundle --format=esm --target=es2020 --outfile=./dist/engine.js
```

This creates `Engine/dist/engine.js` which the terminal imports.

### 2. Serve the App

From the repository root, start a local HTTP server:

```bash
# Using http-server (recommended)
npx http-server . -c-1 -p 8080

# Or using Python
python -m http.server 8080

# Or using Node's built-in server (if available)
node -e "require('http').createServer((req, res) => require('fs').createReadStream('.'+req.url).pipe(res)).listen(8080)"
```

### 3. Open in Browser

Navigate to:

```
http://localhost:8080/Terminal%20App/index.html
```

## Usage

### Quick Start

1. **Load a Campaign**

   - Drag a `.json` campaign file onto the terminal, or
   - Type `load` and follow the prompt

2. **Generate a Party**

   - Type `gen` to create a party member
   - Enter a player name when prompted
   - Review the character stats and drawn cards
   - Type `add` to add to party, `gen` again, or `cancel` to skip

3. **Manage Party**

   - Type `remove` to remove a player by index
   - Type `start` to begin the campaign

4. **Reset**
   - Type `reset` to clear party and reload a new campaign

### Commands

**Campaign Loading:**

- `load` — Load a campaign from JSON file (or drag & drop)

**Party Generation:**

- `gen` — Generate a new party member
- `add` — Accept generated player and add to party
- `remove` — Remove a player from the party

**Game Control:**

- `start` — Start the campaign (not yet implemented)
- `reset` — Reset campaign and party

**Other:**

- `clear` — Clear the terminal screen
- `help` — Show all available commands

### Drag & Drop

- **Before Campaign Load:** Drop a `.json` file to load it directly (no need to type `load`)
- **After Campaign Load:** Drag-and-drop is disabled to prevent accidental re-loading; type `reset` to enable again

### Input States

The terminal shows contextual prompts:

- `path >` — Waiting for campaign file path (or drag-and-drop)
- `name >` — Waiting for player name
- `index >` — Waiting for player index to remove

Press `Escape` to cancel any input state.

## Campaign JSON Format

Campaign files must be valid JSON with the following structure (at minimum):

```json
{
  "name": "Campaign Name",
  "backstories": [...],
  "motivations": [...],
  "drive": [...],
  "classes": [...],
  "races": [...],
  "Contests": [...],
  "Enemies": [...],
  "Engagements": [...],
  "Items": [...],
  "Lore": [...],
  "NPCs": [...],
  "Perks": [...],
  "Scenes": [...]
}
```

See `../Docs/DefaultCampaign/defaultcampaign.json` for a full example.

## Architecture

```
Terminal App/
├── index.html          # Main browser app (HTML + CSS + JS)
├── readme.md           # This file
├── ../Engine/
│   ├── engine.ts       # TypeScript engine source
│   └── dist/
│       └── engine.js   # Compiled ESM bundle (auto-imported)
```

### Key Files

- **index.html** — Single-page app with integrated Terminal class
  - Zod schema validation for campaigns
  - Drag-and-drop file loading
  - Command processing (load, gen, add, remove, etc.)
  - Multi-state input handling (path, playerName, removeIndex)

## Development

### Rebuild Engine After Changes

If you modify `Engine/engine.ts`:

```bash
cd Engine
npx esbuild ./engine.ts --bundle --format=esm --target=es2020 --outfile=./dist/engine.js
```

Then reload the browser (Ctrl+R or Cmd+R).

### Customizing the Campaign Schema

Edit the Zod schema in `index.html` (around line 180) to match your campaign structure:

```javascript
this.campaignSchema = z.object({
  name: z.string(),
  // Add/remove fields as needed
  // ...
});
```

## Troubleshooting

**"Cannot read properties of undefined (reading 'forEach')"**

- The Zod validation failed. Check that your campaign JSON matches the schema.

**"CORS policy: Cross origin requests are only supported for protocol schemes..."**

- You must serve over HTTP (not `file://`). Use the commands above to start a local server.

**Engine not importing properly**

- Ensure `Engine/dist/engine.js` exists and is an ESM module (starts with `export`).
- Run `npx esbuild ./engine.ts --bundle --format=esm --target=es2020 --outfile=./dist/engine.js` from the `Engine/` directory.

## Future Enhancements

- [ ] `start` command to begin campaigns
- [ ] Game state transitions and turn mechanics
- [ ] Contest resolution UI
- [ ] Save/load game progress
- [ ] Persistent party storage

## License

See `../license.md` for licensing information.
