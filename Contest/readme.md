# Contest System

The Contest System is a generalized resolution mechanic used throughout 4 Deck Dungeon. It represents moments of uncertainty where
outcomes are determined by drawing cards, applying modifiers, and interpreting results based on rank, suit, and metadata.

Contests are intentionally system-agnostic and can be embedded into:

- Combat
- Trap encounters
- NPC interactions
- Exploration and discovery
- Skill checks, social challenges, puzzles, and more

## Core Concepts

A Contest is composed of:

- A Trigger
- One or more Draws
- Modifiers
- A Resolution Outcome

Each contest is designed by the GM during campaign creation or scene design.

## Contest Anatomy

### 1. Trigger

Defines when the contest occurs.

Common triggers include:

- Entering a scene
- Interacting with an object or NPC
- Failing or succeeding at another action
- Drawing a specific card or suit
- Choosing a narrative option

Triggers are declarative and scene-controlled.

### 2. Contest Type

Determines the narrative intent of the contest.

Common contest types:

- Skill Test
- Social Exchange
- Knowledge Check
- Environmental Hazard
- Puzzle or Mechanism
- Opposed Check (vs NPC or environment)

The contest type informs interpretation but does not change mechanics.

### 3. Draw Rules

Defines how cards are drawn and evaluated.

Each contest specifies:

- Deck Source
- Number of Cards Drawn
- Draw Order (simultaneous or sequential)
- Visibility (face-up or face-down)

Examples:

- Draw 1 card
- Draw 2 and keep highest
- Draw until a condition is met
- Draw one per participating character

### 4. Card Evaluation

Each drawn card is evaluated using one or more of the following attributes:

#### Rank

- Represents magnitude, difficulty, or intensity
- Higher ranks generally imply stronger outcomes

Rank may map to:

- Difficulty thresholds
- Success tiers
- Damage or cost
- Narrative weight

#### Suit

- Represents domain, theme, or approach

Suit meaning is defined by the contest or scene. Examples:

- Physical vs Mental
- Social vs Deceptive
- Arcane vs Mundane
- Known vs Unknown

Suit interpretation is contextual and controlled by the GM.

### 5. Modifiers

Modifiers adjust the contest outcome before or after drawing.

Modifiers may include:

- Player abilities or perks
- Items or equipment
- Scene conditions
- Prior narrative choices
- NPC disposition

Modifiers can:

- Add or subtract effective rank
- Allow redraws
- Ignore certain suits
- Convert one suit into another
- Change success thresholds

### 6. Success Thresholds

Each contest defines what constitutes success.

Common models:

- Fixed target number
- Tiered success (Failure / Partial / Full / Critical)
- Opposed comparison (player vs environment or NPC)
- Suit-based success conditions

Thresholds are always explicit in the contest definition.

### 7. Outcomes

Outcomes define what happens next.

Each contest specifies outcomes for:

- Failure
- Partial Success (optional)
- Full Success
- Exceptional Result (optional)

Outcomes may:

- Advance or block narrative paths
- Trigger additional encounters
- Grant items, information, or status effects
- Modify future scenes or NPC behavior

Outcomes should always be actionable and state-changing.

## Embedding Contests in Other Systems

### Combat

- Skill contests for maneuvers
- Morale checks
- Environmental interactions

### Traps

- Detection checks
- Disarm attempts
- Escape or mitigation contests

### NPC Encounters

- Persuasion or deception checks
- Lore or knowledge validation
- Unlocking quests or rewards

### Exploration

- Discovering hidden paths
- Interpreting ancient ruins
- Navigational hazards

The same contest framework applies universally.

## GM Design Philosophy

- Contests are authored, not purely random
- Randomness creates texture, not chaos
- Every contest should:
  - Serve narrative intent
  - Have clear stakes
  - Produce meaningful outcomes

The GM decides:

- When contests appear
- How difficult they are
- What success or failure means

## Design Goals

- Modular and reusable
- Deck-driven, not dice-driven
- Narrative-first resolution
- Minimal bookkeeping
- Easily extensible by campaign authors
