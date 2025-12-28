# Scenes / Levels – 4 Deck Dungeon

Scenes define the **areas or levels** of your campaign. They contain spatial dimensions, environmental descriptions, and triggers for
encounters, cutscenes, or loot generation.

Each scene is composed of:

- **Dimensions** – Defines the size of the area (x/y grid)
- **Tiles / Positions** – Optional metadata per tile for triggers
- **Triggers / Engagement Points** – Defines when an engagement or story event occurs
- **Environmental Descriptions** – Flavor text or mechanical descriptors for exploration

---

## 1. Scene Structure

- **Scene ID** – Unique identifier
- **Name** – Name of the scene/area
- **Dimensions** – Width (x), Height (y)
- **Tiles** – Optional 2D array or list of tile objects
- **Tile Metadata** – Includes triggers, notes, or environmental hazards
- **Triggers** – Engagements, cutscenes, traps, NPC interactions
- **Exits / Entrances** – Connects to other scenes; may trigger events

---

## 2. Tile / Area Metadata

Each tile or location can optionally include:

- **Trigger Type** – Combat, trap, NPC interaction, discovery
- **Trigger Conditions** – Player presence, item use, time-based
- **Engagement Reference** – Which engagement is activated
- **Description** – Environmental text for "looking" or investigating
- **Modifiers** – Scene-specific modifiers for checks or contests

---

## 3. GM Notes

- Predefine **triggers** during campaign creation
- Use **tile metadata** for dynamic storytelling, such as traps, secret doors, or lore objects
- Separate **scene exploration inventory** from player inventory
- Use **entrances/exits** as both navigation points and narrative triggers
- Scene metadata should be **data-only**, no UI; descriptions can be shown when needed

---

## 4. Scene Design Tips

- Create logical **paths and regions** to guide exploration
- Assign engagement triggers at interesting or challenging points
- Include **flavor descriptions** for immersion, but leave flexibility for player improvisation
- Consider **environmental hazards** or modifiers that influence contests
