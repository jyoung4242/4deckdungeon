# 4 Deck Dungeon

**4 Deck Dungeon** is a deck-based campaign runner designed to facilitate tabletop-style RPG gameplay through modular systems. This
repository contains all the core systems for running your campaign, from player generation to encounters, items, and contests. Each
system is designed to be independent yet easily integrated into a larger campaign framework.

---

## Table of Contents

- [Overview](#overview)
- Systems
  - [Player Generation](./PlayerGeneration/readme.md)
  - [Encounters](./Encounters/readme.md)
    - [Combat Encounter](./Combat/readme.md)
    - [Trap Encounter](./Traps/readme.md)
    - [NPC Encounter](./NPC/readme.md)
    - [Exploration Encounter](./Exploration/readme.md)
  - [Contest System](./Contests/readme.md)
  - [Perks and Progression](./Perks/readme.md)
- [Items](./Items/readme.md)
- [Scenes / Levels](./Scenes/readme.md)
- [Schema Reference](./Schema/readme.md)

---

## Overview

**4 Deck Dungeon** is a modular, deck-based campaign runner for tabletop-style RPGs, designed to let GMs and players generate and
resolve narrative-driven gameplay using standard playing cards. The system leverages multiple decks to proceduralize characters,
encounters, contests, and item generation, while giving GMs control over scene design and event triggers.

The repository provides independent, fully-integrated systems for:

- **Player Generation:** Create characters entirely from a deck of cards, determining backstory, class, race, purpose/motivation, skill
  scores, and perk pools. Character generation is randomized yet structured, allowing both variety and GM customization.
- **Encounters:** Procedurally generate combat, NPC interactions, traps, and environmental hazards using the Engagement Deck.
  Encounters scale dynamically with party level, enemy type, and scene metadata, providing flexible challenge design.
- **Contest System:** Resolve in-game challenges—such as skill checks, combat outcomes, and social interactions—using a
  narrative-driven card-based system, without dice. Affinity, perks, and skill scores modify outcomes.
- **Items & Loot:** Generate weapons, gear, consumables, and magical items via procedural draws. Items can have modifiers or
  enhancements applied dynamically during encounters.
- **Scenes / Levels:** Define exploration areas with tiles, entrances/exits, and embedded triggers for engagements. Scene metadata maps
  card draws to scene-specific events and enemy types, enabling unique procedural layouts.
- **Perks and Progression:** Manage optional traits, flaws, and skill progression. Perks are drawn from a pool tied to character
  generation and evolve based on skill usage in contests.

The system emphasizes:

- **Procedural storytelling:** Use card draws to determine narrative and mechanical outcomes, providing a rich, emergent campaign
  experience.
- **Modularity:** Each subsystem can operate independently or together, giving GMs flexibility in campaign design.
- **Digital or Tabletop play:** While designed with a procedural engine in mind, all rules and systems are fully portable to
  traditional tabletop RPG sessions.
- **Customizable decks:** Campaign designers can predefine suit families, enemy types, rank lookups, and scene metadata to tailor
  gameplay to specific storylines or challenges.

With **4 Deck Dungeon**, GMs and players can focus on creative storytelling and tactical decision-making, while the card-based system
handles procedural randomness, scaling, and progression.
