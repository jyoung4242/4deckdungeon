# 4 Deck Dungeon – Schemas Reference

This folder contains boilerplate JSON schemas for all modular components of a 4 Deck Dungeon campaign. These schemas serve as
templates, documentation, and reference for creating new campaigns, scenes, items, engagements, enemies, NPCs, perks, and contests.

Each schema defines the expected structure, fields, and types, making it easier to maintain and expand campaigns programmatically or
manually.

## Table of Contents

- Player Generation Schema
- Scenes Schema
- Engagements Schema
- Enemies / NPCs Schema
- Items Schema
- Perks Schema
- Contests Schema

---

## Player Generation Schema

**File:** `player_generation.schema.json`

Defines how characters are created using the deck. Includes backstory, motivation, class, race, skills, and initial perks.

### Key Fields:

- `backstories`, `motivations`, `classes`, `races`: Arrays of objects with `id`, `name`, `description`, and optional `perkPool`.
- `skills`: Numerical values representing player abilities (`strength`, `agility`, `intelligence`, `perception`, `constitution`).
- `perks`: Array of perk IDs assigned based on backstory, class, race, and motivation.

example:

```json
{
  "backstories": [
    {
      "id": "orphan",
      "name": "Orphan",
      "description": "Grew up without parents, learns to survive on their own.",
      "perkPool": ["streetwise", "resilient"]
    }
  ],
  "motivations": [
    {
      "id": "revenge",
      "name": "Revenge",
      "description": "Driven to seek justice or vengeance.",
      "perkPool": ["fierce", "focused"]
    }
  ],
  "classes": [
    {
      "id": "warrior",
      "name": "Warrior",
      "description": "Focuses on combat and strength-based abilities.",
      "perkPool": ["strong", "combat_trained"]
    }
  ],
  "races": [
    {
      "id": "human",
      "name": "Human",
      "description": "Balanced abilities with adaptable traits.",
      "perkPool": ["versatile"]
    }
  ],
  "skills": {
    "strength": 8,
    "agility": 6,
    "intelligence": 5,
    "perception": 7,
    "constitution": 9
  },
  "perks": ["streetwise", "resilient", "strong"]
}
```

---

## Scenes Schema

**File:** `scene.schema.json`

Defines the layout of areas in the campaign, including tiles, triggers, environmental descriptions, and exits.

### Key Fields:

- `sceneId`, `name`, `description`
- `dimensions`: `{ width, height }`
- `tiles`: Each tile can have an optional `trigger` linking to an engagement.
- `exits`: Locations leading to other scenes with descriptions.
- `environmentalDescriptions`: Array of text for investigation/exploration.

example:

```json
{
  "sceneId": "forest_entrance",
  "name": "Forest Entrance",
  "description": "The edge of a dark forest, paths lead deeper into the trees.",
  "dimensions": { "width": 10, "height": 10 },
  "tiles": [
    {
      "x": 3,
      "y": 5,
      "description": "A moss-covered stone with faint carvings.",
      "trigger": { "type": "exploration", "engagementId": "ancient_carving" }
    }
  ],
  "exits": [
    {
      "x": 0,
      "y": 5,
      "leadsTo": "deep_forest",
      "description": "A narrow path veering into the thick woods."
    }
  ],
  "environmentalDescriptions": ["Birds chirp quietly in the trees.", "Sunlight filters through the dense canopy."]
}
```

---

## Engagements Schema

**File:** `engagement.schema.json`

Defines events that occur in scenes, including combat, traps, NPC interactions, and exploration.

### Key Fields:

- `engagementId`
- `type`: `"combat" | "trap" | "npc" | "exploration"`
- `primaryDrawRules`: Suit affinity and severity relative to party level.
- `secondaryDrawRules`: Details for enemy quantity, trap difficulty, or rewards.
- `effects`: Any immediate results or narrative outcomes of the engagement.

example:

```json
{
  "engagementId": "wolf_pack_01",
  "type": "combat",
  "primaryDrawRules": {
    "suitAffinity": "hearts",
    "rankRelativeToPartyLevel": "medium"
  },
  "secondaryDrawRules": {
    "quantityBuckets": { "small": 2, "medium": 4, "large": 6, "massive": 8 },
    "enemyComposition": {
      "hearts": ["rogue_wolf", "alpha_wolf"],
      "spades": ["dire_wolf"]
    }
  },
  "effects": ["initiative_bonus_if_aligned", "loot_drop_on_victory"]
}
```

---

## Enemies / NPCs Schema

**File:** `enemy.schema.json`

Defines NPCs and enemies for combat and interaction.

### Key Fields:

- `entityId`, `name`, `type`: `"enemy"` or `"npc"`
- `baseStats`: `{ strength, agility, intelligence, perception, constitution }`
- `perks`: Array of perk IDs
- `behavior`: Optional AI or scripted reactions for default actions or contest triggers.

example:

```json
{
  "entityId": "wolf",
  "name": "Wolf",
  "type": "enemy",
  "baseStats": {
    "strength": 5,
    "agility": 7,
    "intelligence": 3,
    "perception": 6,
    "constitution": 4
  },
  "perks": ["fast", "pack_hunter"],
  "behavior": {
    "defaultAction": "attack_nearest",
    "reactionTree": [
      { "if": "player_hidden", "action": "pursue" },
      { "if": "player_ranged_attack", "action": "evade" }
    ]
  }
}
```

---

## Items Schema

**File:** `item.schema.json`

Defines campaign items, including weapons, armor, consumables, and miscellaneous objects.

### Key Fields:

- `itemId`, `name`, `type`
- `baseModifiers`: Standard stats or bonuses
- `dynamicModifiers`: Optional array of modifiers triggered by engagement draws or conditions

example:

```json
{
  "itemId": "knife_01",
  "name": "Rusty Knife",
  "type": "weapon",
  "baseModifiers": { "combat": 1 },
  "dynamicModifiers": [{ "trigger": "frost_enchantment", "modifier": "+1 combat every other use" }]
}
```

---

## Perks Schema

**File:** `perk.schema.json`

Defines perks and optional stacking rules, which modify player skills, abilities, or narrative outcomes.

### Key Fields:

- `perkId`, `name`
- `source`: Array of origins (`backstory`, `class`, `motivation`, `race`)
- `effect`: Defines skill affected and modifier value
- `stackable`: Boolean indicating if duplicate perks can stack

example:

```json
{
  "perkId": "stealthy",
  "name": "Stealthy",
  "source": ["backstory", "class", "race"],
  "effect": { "skill": "agility", "modifier": 2 },
  "stackable": false
}
```

---

## Contests Schema

**File:** `contest.schema.json`

Defines skill checks and contest rules within the campaign.

### Key Fields:

- `contestId`
- `skillCheck`: Name of skill tested
- `difficultyValue`: Number representing required value to succeed
- `xpAward`: Experience granted upon success
- `affinityModifier`: Boolean indicating if suit affinity affects the check
- `perksModifier`: Boolean indicating if relevant perks affect the check

example:

```json
{
  "contestId": "lockpicking",
  "skillCheck": "agility",
  "difficultyValue": 7,
  "xpAward": 50,
  "affinityModifier": true,
  "perksModifier": true
}
```

---

## Notes

- Each module should have a unique ID to avoid conflicts.
- JSON schemas serve as templates for creating new campaigns and can be validated programmatically.
- Use modular JSON files to make campaigns easier to maintain, expand, and reuse.
- These schemas are designed to support both tabletop and digital implementations of 4 Deck Dungeon.
