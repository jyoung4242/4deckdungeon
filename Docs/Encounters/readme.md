# Encounter System

Encounters are the primary moment-to-moment interaction structure in 4 Deck Dungeon. They are driven by Scene Metadata authored by the
GM and resolved through card draws from one or more decks.

Each encounter type defines:

- When it triggers
- What deck(s) are drawn from
- How cards are interpreted
- Whether contests, choices, or scripted outcomes apply

Encounters may be fully procedural, fully scripted, or hybrid, depending on GM intent.

## Core Encounter Concepts

### Scene Metadata (GM-Defined)

Each scene defines:

- Which encounter types are allowed
- Encounter frequency or weighting
- Suit mappings (what each suit represents in this scene)
- Rank lookup tables
- Optional trigger conditions
- Whether outcomes are fixed, random, or conditional

Scene Metadata always overrides global defaults.

### Card Interpretation Rules

- **Suit**: Determines category, theme, or family
- **Rank**: Determines difficulty, scale, or specific table entry
- **Face Cards**: Often represent twists, elites, or narrative shifts
- **Jokers (Optional)**: Catastrophic or exceptional outcomes

## Encounter Types

### Combat Encounter

Combat encounters represent hostile opposition and tactical challenges.

#### Trigger Conditions

- Entering hostile territory
- Failing stealth or detection checks
- Explicit scripted event
- Random encounter roll (if enabled)

#### Deck Usage

- **Primary Deck**: Engagement Deck
- **Optional Modifier Decks** (terrain, weather, faction)

#### Draw Rules

- Draw 1–N cards based on Scene Metadata
- Each card represents an enemy, group, or complication
- Cards are resolved in draw order unless otherwise stated

#### Enemy Composition

**Suit → Enemy Family (Scene-Defined Example)**

| Suit     | Enemy Type          |
| -------- | ------------------- |
| Hearts   | Rogues / Humanoids  |
| Spades   | Beasts              |
| Clubs    | Wyrms / Aberrations |
| Diamonds | Constructs / Arcane |

Suit meaning is always defined by the Scene.

#### Rank Interpretation

Ranks index into a lookup table for the selected enemy family.

Example uses:

- Specific creature selection
- Group size scaling
- Enemy abilities or tiers

Face cards may indicate:

- Leaders
- Elites
- Environmental hazards
- Reinforcements

#### Outcome

- Victory, retreat, or defeat
- Rewards defined by Scene or global loot rules
- Narrative state changes

### Trap Encounter

Trap encounters represent environmental dangers and latent threats.

#### Trigger Conditions

- Entering trapped area
- Failing perception or exploration checks
- Explicit GM trigger
- Delayed or chained effects

#### Deck Usage

- Engagement Deck (or Trap Deck if separated)

#### Draw Rules

- Draw 1 card for trap type
- Optional additional draw for severity or complication

#### Suit Interpretation

| Suit     | Trap Category           |
| -------- | ----------------------- |
| Hearts   | Psychological / Social  |
| Spades   | Physical / Mechanical   |
| Clubs    | Environmental / Natural |
| Diamonds | Magical / Arcane        |

#### Rank Interpretation

- Trap severity
- Damage scale
- Complexity or number of steps
- Difficulty to disable or escape

Face cards may represent:

- Multi-stage traps
- Trap guardians
- Time pressure
- Cascading failures

#### Resolution Options

- Avoidance
- Disarm
- Endure
- Trigger intentionally

Resolution may invoke a Contest, but is not required.

### NPC Encounter

NPC encounters focus on narrative, social interaction, and progression.

NPCs are primarily scripted by the GM, but may include procedural elements.

#### Trigger Conditions

- Entering settlements
- Story progression
- Player choice
- Random social encounter (optional)

#### GM Authorship

NPC encounters typically define:

- Identity
- Role
- Motivation
- Initial disposition
- Available outcomes

Card draws modify or unlock interaction paths rather than create NPCs from scratch.

#### Optional Card Usage

Cards may be used to determine:

- NPC mood or attitude
- Hidden complications
- Faction alignment
- Unexpected offers or demands

#### Optional Contests

NPC encounters may include a Contest to unlock:

- Quests
- Items
- Information
- Lore progression
- Alliance or hostility shifts

Failure does not necessarily block progression — it may alter future states.

#### Outcomes

- Quest unlocked
- Relationship change
- Information gained or withheld
- Scene state updated

### Exploration / Discovery Encounter

Exploration encounters represent discovery, traversal, and environmental storytelling.

#### Trigger Conditions

- Entering unexplored areas
- Player-initiated exploration
- Travel milestones
- Rest or downtime actions

#### Deck Usage

- Engagement Deck
- Optional Discovery or World Deck

#### Draw Rules

- Draw 1 card for discovery type
- Optional draw for complication or opportunity

#### Suit Interpretation

| Suit     | Discovery Type          |
| -------- | ----------------------- |
| Hearts   | Lore, culture, memory   |
| Spades   | Danger, tension, threat |
| Clubs    | Terrain, obstacles      |
| Diamonds | Resources, artifacts    |

#### Rank Interpretation

- Scale of discovery
- Depth of information
- Resource value
- Time investment required

Face cards may represent:

- Hidden locations
- Major revelations
- Environmental shifts
- World state changes

#### Outcomes

- New locations revealed
- Lore unlocked
- Resources gained
- Threats foreshadowed

Exploration encounters often seed future encounters rather than resolve immediately.

## Encounter Design Philosophy

- Encounters are tools, not prescriptions
- GM intent drives structure
- Cards introduce uncertainty, not control
- Systems support both story-first and procedural-first campaigns
