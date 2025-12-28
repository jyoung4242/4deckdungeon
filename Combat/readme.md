# Combat Engagement Draw Rules – Scene-Aware

**Goal:** Construct a procedural combat encounter using card draws from the Engagement Deck, dynamically scaled to party level, and
interpreted through GM-defined Scene Metadata.

---

## 1. Trigger

- Combat engagements occur **only when a GM-defined trigger fires** (enter room, step on tile, story beat, etc.).
- Trigger metadata may restrict:
  - `allowed_engagement_types: ["combat"]`
  - `severity_bounds: {min, max}`

---

## 2. Scene Metadata – GM-Defined

**Purpose:** Dictates how the Engagement Deck draws are interpreted in a given area.

- **Key Fields:**

  1. **Scene Name / ID** – Unique identifier for the area.
  2. **Dimensions (x/y)** – Optional, for tile-based mapping.
  3. **Suit Families / Enemy Types** – Map each suit to a thematic enemy group:

  | Suit     | Enemy Family            |
  | -------- | ----------------------- |
  | Hearts   | Rogues / Humanoids      |
  | Spades   | Beasts                  |
  | Clubs    | Wyrms / Dragons         |
  | Diamonds | Constructs / Elementals |

  4. **Rank Lookup Tables** – Map card rank within each suit to specific enemies, NPCs, or environmental hazards.
  5. **Modifiers / Tags** – Optional status effects, terrain hazards, or narrative hooks applied to drawn enemies.
  6. **Engagement Triggers** – Tiles, doors, events that prompt a card draw.

- **Effect:** Same card in different scenes produces different enemies or events, based on metadata.

---

## 3. Primary Draw – Initiative & Relative Severity

**Draw 1 card**:

| Attribute | Determined By | Meaning                                                                                                                                                                                                                                     |
| --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Suit      | Card suit     | Determines **initiative modifier**: <br>• Aligned with character affinity → +1 initiative <br>• Opposite suit → -1 initiative (surprised) <br>• Neutral → no modifier                                                                       |
| Rank      | Card rank     | Determines **relative encounter severity** compared to party level: <br>• Mild → lower than party rank <br>• Medium → roughly equal to party rank <br>• Hard → higher than party rank <br>• Critical → significantly higher than party rank |

**Severity Mapping Example:**

| Rank | Relative Severity                 |
| ---- | --------------------------------- |
| 2–5  | Mild (1–2 levels below party)     |
| 6–10 | Medium (≈ party level)            |
| J–Q  | Hard (1–2 levels above party)     |
| K–A  | Critical (2–3 levels above party) |

> Primary draw establishes baseline **difficulty** and **initiative modifiers**.

---

## 4. Secondary Draw – Quantity Bucket

**Draw 1 card**:

| Rank | Quantity Bucket                              |
| ---- | -------------------------------------------- |
| 2–5  | Small group (1–2 enemies)                    |
| 6–9  | Medium group (3–4 enemies)                   |
| 10–Q | Large group (5–6 enemies)                    |
| K–A  | Massive group (7+ enemies / elite + minions) |

> Determines **general group size**, not exact composition.

---

## 5. Tertiary & Subsequent Draws – Enemy Composition

- Draw **one card per enemy** in the quantity bucket.
- **Interpret suit and rank using Scene Metadata:**
  - **Suit → Enemy Family** (Hearts = Rogues, Spades = Beasts, etc.)
  - **Rank → Specific Enemy** from the family’s lookup table
- Example:

| Card         | Enemy Type (Scene-Specific) |
| ------------ | --------------------------- |
| 7 of Hearts  | Bandit (Thieves’ Den scene) |
| Q of Spades  | Dire Wolf (Forest scene)    |
| Ace of Clubs | Young Wyrm (Cave scene)     |

---

## 6. Quaternary Draw – Tactical / Environmental Modifier

- Draw **1 card** for **modifier effects**:
  - Morale, aggression, special abilities
  - Terrain advantage, ambush, surprise
  - Formation style (flank, spread, clustered)
- Modifier affects **contest checks**, initiative, and other situational outcomes.

---

## 7. Optional Draw – Boss / Environmental Twist

- Triggered **only for Dangerous / Critical encounters** or GM-specified metadata.
- Determines:
  - Boss or elite variant
  - Environmental hazard (pitfall, collapsing ceiling, fire)
  - Narrative twist or story hook

---

## 8. Affinity Interaction

- Character **suit affinity** vs. encounter **primary suit**:
  - **Aligned:** +1 initiative on first contest
  - **Opposed:** -1 initiative (surprised)
  - Neutral → no modifier

---

## 9. Stop Conditions

- **Mild / Medium:** Minimum 3 draws (Primary, Quantity, Enemy Composition)
- **Hard / Critical:** Minimum 4–5 draws (add modifiers/boss/environment twist)

---

## 10. Procedural Combat Object Output

```json
{
  "type": "combat",
  "scene_id": "thieves_den",
  "severity": "hard",
  "quantity_bucket": "large",
  "enemies": [
    { "rank": "7", "suit": "Hearts", "type": "Bandit" },
    { "rank": "9", "suit": "Hearts", "type": "Scout" },
    { "rank": "10", "suit": "Hearts", "type": "Duelist" },
    { "rank": "J", "suit": "Spades", "type": "Dire Wolf" },
    { "rank": "10", "suit": "Clubs", "type": "Young Wyrm" }
  ],
  "modifiers": ["flanking", "rough_terrain"],
  "affinity_initiative": "+1 aligned",
  "optional_boss": { "rank": "A", "suit": "Hearts", "type": "Rogue Captain" }
}
```
