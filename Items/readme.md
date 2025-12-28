# Items – 4 Deck Dungeon

Items in 4 Deck Dungeon are modular and are primarily **data-driven**. They can be drawn, modified, and assigned dynamically during
encounters or via the Engagement Deck. Items provide mechanical benefits, narrative flavor, or both.

---

## 1. Item Structure

Each item entry contains the following data:

- **Name** – Base name of the item (e.g., Knife, Potion, Spellbook)
- **Type** – Weapon, Armor, Consumable, Tool, Misc
- **Modifiers** – Optional bonuses or penalties (e.g., +1 Strength on use, resistance to poison)
- **Rarity / Quality** – Common, Uncommon, Rare, Legendary
- **Quantity** – Stackable items (default 1)
- **Tags / Properties** – Special abilities, restrictions, or lore hooks
- **Description** – Narrative flavor or mechanical explanation

**Example Item Entry:**

```
Name: Frost Knife
Type: Weapon
Modifiers:
  +1 to Combat checks every other use
Rarity: Rare
Quantity: 1
Tags: [Cold, Blade, One-Handed]
Description: A dagger imbued with ice magic. Slows enemies on hit.
```

---

## 2. Loot Generation

Items are primarily generated through the **Engagement Deck** during encounters.

- **Primary Draw** – Determines the item type or category
- **Secondary Draw** – Determines quality, modifiers, or special properties
- **Tertiary Draw (optional)** – Additional bonuses, curses, or story hooks

This allows dynamic items such as:

- Legendary weapons with special effects
- Consumables with minor random buffs
- Environment-specific loot based on scene metadata

---

## 3. Item Modifiers

Modifiers are **dynamic enhancements** applied to base items during loot generation.

- Modifiers may affect:
  - Skill checks
  - Combat rolls
  - Player traits or perks
  - Narrative outcomes
- Modifiers can be **temporary** (limited uses) or **permanent**
- Multiple modifiers **stack**, unless the same card triggers a duplicate, which may **intensify or extend** a modifier

**Example Modifiers:**

- +1 Strength for 3 uses
- -1 Agility while wearing heavy armor
- +2 Perception when inspecting traps
- Adds a story hook for discovery (e.g., cursed item, secret engraving)

---

## 4. Item Categories

- **Weapons** – Melee, Ranged, Magical
- **Armor / Shields** – Provides resistances or defensive bonuses
- **Consumables** – Potions, scrolls, temporary buffs
- **Tools** – Lockpicks, climbing gear, thieves' tools
- **Story** – tied to story points for progressing narrative, can't accidentally lose

---

## 5. Integration with Engagements

Items are tightly coupled with the **Engagement Deck**:

- Encounter outcomes can **trigger item draws**
- The same deck that resolves combat or contests can produce loot
- Items may be influenced by **scene metadata**
- Loot can be **environmental**, enemy drops, or quest rewards

---

## 6. GM Notes

- Predefine item types and possible modifiers per campaign
- Allow the Engagement Deck to **randomize modifiers** for variety
- Track rare/legendary items separately to maintain campaign balance
- Items are primarily **data-driven**; avoid hardcoding UI interactions

---

## 7. Future Considerations

- Tie **perks and item modifiers** together (e.g., a player with "Fire Affinity" perk gets extra effect from a fire sword)
- Expand **environmental item generation** (scene-specific loot)
- Define **consumable stacks and usage rules** within the campaign JSON

---

# Campaign Inventory Sheet – 4 Deck Dungeon

> Designed for GM bookkeeping of all player items, modifiers, and sources. Can be updated each session.

---

## Players and Inventory

### Player: Alice

| Item Name     | Type       | Quantity | Modifiers              | Source                 | Notes                   |
| ------------- | ---------- | -------- | ---------------------- | ---------------------- | ----------------------- |
| Frost Knife   | Weapon     | 1        | +1 Combat every 2 uses | Loot – Engagement Deck | Legendary frost blade   |
| Health Potion | Consumable | 5        | +2 Healing             | Loot – Chest           | Stackable               |
| Lockpick      | Tool       | 1        | None                   | Quest Reward           | Can attempt locks/traps |

---

### Player: Bob

| Item Name      | Type       | Quantity | Modifiers       | Source             | Notes                    |
| -------------- | ---------- | -------- | --------------- | ------------------ | ------------------------ |
| Iron Sword     | Weapon     | 1        | +1 Combat       | Loot – Battle Deck | Basic weapon             |
| Mana Potion    | Consumable | 3        | +3 Spell Points | Loot – Chest       | Stackable                |
| Grappling Hook | Tool       | 1        | None            | Scene – Dungeon    | Used to reach high areas |

---

### Player: Clara

| Item Name         | Type       | Quantity | Modifiers              | Source                 | Notes                     |
| ----------------- | ---------- | -------- | ---------------------- | ---------------------- | ------------------------- |
| Longbow           | Weapon     | 1        | +2 Ranged Combat       | Loot – Battle Deck     | Can target flying enemies |
| Quiver Arrows     | Consumable | 20       | None                   | Loot – Scene           | Stackable                 |
| Potion of Stealth | Consumable | 2        | +1 Agility for 3 turns | Loot – Engagement Deck | Short-term buff           |

---

### Player: Darius

| Item Name  | Type       | Quantity | Modifiers      | Source             | Notes                   |
| ---------- | ---------- | -------- | -------------- | ------------------ | ----------------------- |
| Battle Axe | Weapon     | 1        | +2 Combat      | Loot – Battle Deck | Heavy weapon            |
| Shield     | Armor      | 1        | +1 Defense     | Loot – Quest       | Reduces incoming damage |
| Smoke Bomb | Consumable | 3        | Provides cover | Loot – Chest       | Stackable               |

---

## Notes for GM

1. **Modifiers**: Track per-use effects in a separate log if needed.
2. **Source**: Always note where the item originated (scene, chest, NPC, encounter).
3. **Quantity**: Stackable items can be combined; non-stackable items should have separate entries.
4. **Scene Items**: Keep a separate table for items left in the environment.
5. **Special Effects / Story Hooks**: Add in the Notes column for unique narrative items.
6. **Updates**: Adjust quantities and modifiers as items are used or modified.
