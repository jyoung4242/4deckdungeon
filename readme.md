# 4 Deck Dungeon

**4 Deck Dungeon** is a modular deck-based RPG campaign framework designed to facilitate tabletop-style and digital gameplay. The game
is driven entirely by decks of cards, allowing for procedural character generation, randomized encounters, and narrative-based
contests, while remaining platform-agnostic and UI-independent.

---

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Core Systems](#core-systems)

---

## Overview

4 Deck Dungeon allows GMs and players to run campaigns using a **card-driven system**, including:

- Player and NPC generation
- Narrative and contest resolution
- Engagements (combat, traps, exploration, NPC interactions)
- Item generation and loot management
- Scene-based exploration
- Skill progression and perk systems

The framework is **modular**, with each system represented by a static class in the `Engine` folder and campaign content defined in
JSON files. It is designed to be **UI-agnostic**, returning raw structured data and narrative strings for any front-end, tabletop, or
digital interface.

---

## Folder Structure

```
/Engine
└─ Static classes for core game systems
/Docs
└─ Markdown documentation for all systems and schemas
/TerminalApp
└─ Example browser implementation simulating CLI text based game (Zork'ish)
```

---

## Core Systems

All core systems are documented in the `Docs` folder:

- **[Player Generation](./Docs/PlayerGeneration/readme.md)** – Generate characters with 13-card draws covering backstory, class, race,
  motivation, skills, and perks.
- **[Contests](./Docs/Contests/readme.md)** – Narrative-based skill checks using card draws, modifiers, and perk interactions.
- **[Engagements](./Docs/Encounters/readme.md)** – Combat, trap, exploration, and NPC interaction resolution with the Engagement Deck.
- **[Items](./Docs/Items/readme.md)** – Loot generation, dynamic modifiers, inventory management.
- **[Scenes / Levels](./Docs/Scenes/readme.md)** – Define areas with tiles, triggers, and engagement points.
- **[Perks and Progression](./Docs/Perks/readme.md)** – Skill perks, progression rules, stacking, and XP allocation.
- **[Schemas](./Docs/Schemas/readme.md)** – JSON reference schemas for campaigns, characters, encounters, and items.

---
