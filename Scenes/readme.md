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

---

## 5. JSON Schema

```json
{
  "sceneId": "forest_entrance",
  "name": "Forest Entrance",
  "dimensions": { "width": 10, "height": 8 },
  "tiles": [
    {
      "x": 1,
      "y": 1,
      "trigger": {
        "type": "combat",
        "engagementId": "wolf_pack_01",
        "conditions": { "playerPresent": true }
      },
      "description": "A dense patch of trees blocks your path."
    },
    {
      "x": 2,
      "y": 3,
      "trigger": {
        "type": "trap",
        "engagementId": "pitfall_trap_01",
        "conditions": { "playerSteps": true }
      },
      "description": "Hidden pitfall covered with leaves."
    }
  ],
  "exits": [{ "x": 10, "y": 4, "leadsTo": "deep_forest", "description": "A narrow path leads deeper into the forest." }],
  "environmentalDescriptions": [
    "The morning sun filters through the thick foliage.",
    "Birds chirp and small critters rustle in the underbrush."
  ]
}
```

---

#### GM Notes / Recommendations

1. Triggers: Define triggers clearly for each tile or location. They can activate:

   - Combat encounters
   - NPC interactions
   - Traps or environmental challenges
   - Discovery or loot

2. Scene Dimensions: Keep dimensions manageable; they represent either logical tiles or narrative zones.
3. Exits / Entrances: Treat them as optional engagement points, which can trigger narrative or contest events.
4. Environmental Descriptions: Include text for "investigate" actions or flavor, but leave them flexible to GM improvisation.
5. Dynamic Metadata: Any modifiers or temporary effects tied to the scene should be defined here, including lighting, terrain effects,
   or difficulty adjustments.
