// #region types,defs,consts, enums, interfaces
// Add to your types section
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
// Helper functions for creating results
export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export interface CampaignData {
  name: string;
  scenes: any[];
  perks: any[];
  npcs: any[];
  items: any[];
  lore: any[];
  engagements: any[];
  enemies: any[];
  contests: any[];
  motivations: any[];
  drive: any[];
  backstories: any[];
  classes: any[];
  races: any[];
}
export type CardSuit = "Spades" | "Hearts" | "Clubs" | "Diamonds";
export type PlayerAttribute = "strength" | "agility" | "constitution" | "intelligence" | "perception";
export const ENGINE_STATE = {
  idle: "idle",
  playergen: "playergen",
  runningCampaign: "runningCampaign",
} as const;
export type ENGINE_STATE = (typeof ENGINE_STATE)[keyof typeof ENGINE_STATE];
export interface PartyData {
  affinity: CardSuit;
  oppositeAffinity: CardSuit;
  name: string;
  race: string;
  class: string;
  backstory: string;
  motivation: string;
  drive: string;
  perks: string[];
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
  perception: number;
  playerGenCards: Card[];
}
export interface Card {
  suit: CardSuit;
  rank: string;
}
// #endregion types,defs,consts, enums, interfaces

export class FourDeckDungeonEngine {
  // #region class properties
  //------------------------------------------------
  private static _gameState: keyof typeof ENGINE_STATE = ENGINE_STATE.idle;
  private static _campaignData: CampaignData = {
    name: "",
    scenes: [],
    perks: [],
    npcs: [],
    items: [],
    lore: [],
    engagements: [],
    enemies: [],
    contests: [],
    motivations: [],
    drive: [],
    backstories: [],
    classes: [],
    races: [],
  };
  private static _partyData: PartyData[] = [];
  private static _PlayerGenDeck: Card[] = [];
  private static _ContestDeck: Card[] = [];
  private static _EncounterDeck: Card[] = [];
  //------------------------------------------------
  // #endregion class properties

  // #region deck utils
  private static createStandardDeck(): Card[] {
    const suits: CardSuit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  private static shuffleDeck(deck: Card[]): Card[] {
    // Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }
    return deck;
  }

  private static resetAndShuffleDeck(deck: Card[]): void {
    deck.length = 0;
    let d1, d2;
    d1 = FourDeckDungeonEngine.createStandardDeck();
    // if deck is EncounterDeck, use two decks and shuffle
    if (deck === FourDeckDungeonEngine._EncounterDeck) {
      d2 = FourDeckDungeonEngine.createStandardDeck();
      d1 = d1.concat(d2);
    }
    deck.push(...FourDeckDungeonEngine.shuffleDeck(d1));
  }

  private static initStandardDecks(): void {
    // Player generation deck: one standard deck
    FourDeckDungeonEngine._PlayerGenDeck = FourDeckDungeonEngine.shuffleDeck(FourDeckDungeonEngine.createStandardDeck());

    // Contest deck: one standard deck
    FourDeckDungeonEngine._ContestDeck = FourDeckDungeonEngine.shuffleDeck(FourDeckDungeonEngine.createStandardDeck());

    // Encounter deck: two standard decks combined
    const d1 = FourDeckDungeonEngine.createStandardDeck();
    const d2 = FourDeckDungeonEngine.createStandardDeck();
    FourDeckDungeonEngine._EncounterDeck = FourDeckDungeonEngine.shuffleDeck(d1.concat(d2));
    FourDeckDungeonEngine._ContestDeck = FourDeckDungeonEngine.shuffleDeck(FourDeckDungeonEngine.createStandardDeck());
  }

  // Public accessors for testing / UI
  static getPlayerGenDeck(): Card[] {
    return FourDeckDungeonEngine._PlayerGenDeck.slice();
  }

  static getContestDeck(): Card[] {
    return FourDeckDungeonEngine._ContestDeck.slice();
  }

  static getEncounterDeck(): Card[] {
    return FourDeckDungeonEngine._EncounterDeck.slice();
  }
  // #endregion deck utils

  // #region playergen
  static getCurrentParty(): PartyData[] {
    return FourDeckDungeonEngine._partyData;
  }
  static getNumPlayers(): number {
    return FourDeckDungeonEngine._partyData.length;
  }
  static addPlayer(PlayerData: PartyData): Result<PartyData[], string> {
    if (FourDeckDungeonEngine._partyData.length >= 4) return Err("Party is full (max 4 players), remove a player and try again");
    // navigate added players PlayerGend cards and remove from player gen deck
    PlayerData.playerGenCards.forEach(card => {
      let index = FourDeckDungeonEngine._PlayerGenDeck.indexOf(card);
      if (index !== -1) {
        FourDeckDungeonEngine._PlayerGenDeck.splice(index, 1);
      } else {
        return Err("PlayerGen card not found in deck");
      }
    });
    FourDeckDungeonEngine._partyData.push(PlayerData);
    return Ok(FourDeckDungeonEngine._partyData);
  }

  static removePlayer(name: string): Result<PartyData[], string> {
    let index = FourDeckDungeonEngine._partyData.findIndex(player => player.name === name);
    if (index === -1) return Err("Player not found in party");
    //splice player out of party
    FourDeckDungeonEngine._partyData.splice(index, 1);
    return Ok(FourDeckDungeonEngine._partyData);
  }

  static generatePlayer(name: string): Result<PartyData, string> {
    let newPlayer: PartyData = {
      affinity: "Spades",
      oppositeAffinity: "Hearts",
      name,
      race: "Human",
      backstory: "None",
      motivation: "None",
      drive: "None",
      class: "None",
      perks: [],
      strength: 0,
      agility: 0,
      constitution: 0,
      intelligence: 0,
      perception: 0,
      playerGenCards: [],
    };
    let perkPool: string[] = [];

    //gaurd clauses
    if (FourDeckDungeonEngine._partyData.length >= 4) {
      return Err("Party is full (max 4 players), remove a player and try again");
    }
    if (FourDeckDungeonEngine._PlayerGenDeck.length < 13) {
      return Err("Not enough cards in playergen deck, check your campaign data and try again");
    }

    // Player generation is 13 cards, peek at the top four without removing
    let backstoryCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 1];
    let motivationCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 2];
    let classCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 3];
    let raceCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 4];

    // guard clauses, if you hit this one, somethings terribly gone wrong
    if (!backstoryCard || !motivationCard || !classCard || !raceCard) {
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    }
    newPlayer.playerGenCards = [backstoryCard, motivationCard, classCard, raceCard];

    FourDeckDungeonEngine._setPlayerAffinity(newPlayer, backstoryCard);

    let result = FourDeckDungeonEngine._setPlayerBackstory(newPlayer, backstoryCard, perkPool);
    if (!result.ok) return Err(result.error);

    result = FourDeckDungeonEngine._setPlayerMotivationDrive(newPlayer, motivationCard, perkPool);
    if (!result.ok) return Err(result.error);

    result = FourDeckDungeonEngine._setPlayerClass(newPlayer, classCard, perkPool);
    if (!result.ok) return Err(result.error);

    result = FourDeckDungeonEngine._setPlayerRace(newPlayer, raceCard, perkPool);
    if (!result.ok) return Err(result.error);

    // Player Strength
    let strengthCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 5];
    if (!strengthCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "strength", strengthCard, perkPool);

    // Player Agility
    let agilityCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 6];
    if (!agilityCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "agility", agilityCard, perkPool);

    // Player Constitution
    let constitutionCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 7];
    if (!constitutionCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "constitution", constitutionCard, perkPool);

    // Player Intelligence
    let intelligenceCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 8];
    if (!intelligenceCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "intelligence", intelligenceCard, perkPool);

    // Player Perception
    let perceptionCard = FourDeckDungeonEngine._PlayerGenDeck[FourDeckDungeonEngine._PlayerGenDeck.length - 9];
    if (!perceptionCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "perception", perceptionCard, perkPool);

    return Ok(newPlayer);
  }

  private static _setPlayerAffinity(newPlayer: PartyData, card: Card) {
    // using data from cards, lookup information from campaign data
    newPlayer.affinity = card.suit;
    if (newPlayer.affinity === "Spades") {
      newPlayer.oppositeAffinity = "Hearts";
    } else if (newPlayer.affinity === "Hearts") {
      newPlayer.oppositeAffinity = "Spades";
    } else if (newPlayer.affinity === "Diamonds") {
      newPlayer.oppositeAffinity = "Clubs";
    } else {
      newPlayer.oppositeAffinity = "Diamonds";
    }
  }
  private static _setPlayerBackstory(newPlayer: PartyData, card: Card, perkPool: string[]): Result<void, string> {
    let numBackstories = FourDeckDungeonEngine._campaignData.backstories.length;
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in backstory card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, numBackstories, 13);
    if (!selectedIndexResult.ok) return Err(`Error in backstory card conversion: ${selectedIndexResult.error}`);
    let selectedBackstoryIndex = selectedIndexResult.value;
    newPlayer.backstory = FourDeckDungeonEngine._campaignData.backstories[selectedBackstoryIndex];
    return Ok(undefined);
    //TODO setup Perk pool
  }
  private static _setPlayerMotivationDrive(newPlayer: PartyData, card: Card, perkPool: string[]): Result<void, string> {
    let getNumMotivaitons = FourDeckDungeonEngine._campaignData.motivations.length;
    let getNumDrives = FourDeckDungeonEngine._campaignData.drive.length;

    let resultRank = cardRankToIndex(card.rank);
    let resultSuit = cardRankToIndex(card.suit);

    if (!resultRank.ok) return Err(`Error in Motivation card conversion: ${resultRank.error}`);
    let resultRemapRank = remapIndex(resultRank.value, getNumMotivaitons, 13);
    if (!resultRemapRank.ok) return Err(`Error in Motivation card remapping: ${resultRemapRank.error}`);
    let selectedMotivationIndex = resultRemapRank.value;
    newPlayer.motivation = FourDeckDungeonEngine._campaignData.motivations[selectedMotivationIndex];

    if (!resultSuit.ok) return Err(`Error in Drive card conversion: ${resultSuit.error}`);
    let resultRemapSuit = remapIndex(resultSuit.value, getNumDrives, 4);
    if (!resultRemapSuit.ok) return Err(`Error in Drive card remapping: ${resultRemapSuit.error}`);
    let selectedDriveIndex = resultRemapSuit.value;
    newPlayer.drive = FourDeckDungeonEngine._campaignData.drive[selectedDriveIndex];
    //TODO setup Perk pool
    return Ok(undefined);
  }
  private static _setPlayerClass(newPlayer: PartyData, card: Card, perkPool: string[]): Result<void, string> {
    let numClasses = FourDeckDungeonEngine._campaignData.classes.length;
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in class card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, numClasses, 13);
    if (!selectedIndexResult.ok) return Err(`Error in class card remapping: ${selectedIndexResult.error}`);
    let selectedClassIndex = selectedIndexResult.value;
    newPlayer.class = FourDeckDungeonEngine._campaignData.classes[selectedClassIndex];
    //TODO setup Perk pool
    return Ok(undefined);
  }

  private static _setPlayerRace(newPlayer: PartyData, card: Card, perkPool: string[]): Result<void, string> {
    let numClasses = FourDeckDungeonEngine._campaignData.races.length;
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in race card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, numClasses, 13);
    if (!selectedIndexResult.ok) return Err(`Error in race card remapping: ${selectedIndexResult.error}`);
    let selectedRaceIndex = selectedIndexResult.value;
    newPlayer.race = FourDeckDungeonEngine._campaignData.races[selectedRaceIndex];
    //TODO setup Perk pool
    return Ok(undefined);
  }

  private static _setPlayerAttribute(
    newPlayer: PartyData,
    attribute: PlayerAttribute,
    card: Card,
    perkPool: string[]
  ): Result<void, string> {
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in attribute card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, 13, 13);
    if (!selectedIndexResult.ok) return Err(`Error in attribute card remapping: ${selectedIndexResult.error}`);
    let attributeValue = selectedIndexResult.value;
    newPlayer[attribute] = attributeValue;
    return Ok(undefined);
  }

  // #endregion playergen

  // #region campaign

  static loadCampaign(campaignData: CampaignData): ENGINE_STATE {
    FourDeckDungeonEngine._campaignData = campaignData;

    // initialize decks for the campaign run
    FourDeckDungeonEngine.initStandardDecks();

    FourDeckDungeonEngine._gameState = ENGINE_STATE.playergen;
    return FourDeckDungeonEngine._gameState;
  }

  static resetCampaign() {}

  // #endregion campaign

  // #region contestResolver
  // #endregion contestResolver

  // #region engineUtils
  static getEngineState(): ENGINE_STATE {
    return FourDeckDungeonEngine._gameState;
  }
  // #endregion engineUtils
}

function remapIndex(index: number, maxIndex: number, arrayLength: number): Result<number, string> {
  // Validate inputs
  if (maxIndex <= 0) {
    return Err("maxIndex must be greater than 0");
  }

  if (arrayLength < 0) {
    return Err("arrayLength cannot be negative");
  }

  // Handle negative indices by wrapping from the end
  if (index < 0) {
    index = maxIndex + (index % maxIndex);
  }

  // Handle indices >= maxIndex by wrapping using modulo
  if (index >= maxIndex) {
    index = index % maxIndex;
  }

  const result = Math.floor((index * arrayLength) / maxIndex);
  return Ok(result);
}

function cardRankToIndex(rand: string): Result<number, string> {
  let index = Math.floor(parseInt(rand));
  if (Number.isNaN(index)) {
    switch (rand) {
      case "A":
        return Ok(13);
      case "K":
        return Ok(12);
      case "Q":
        return Ok(11);
      case "J":
        return Ok(10);
      case "Spades":
        return Ok(0);
      case "Hearts":
        return Ok(1);
      case "Diamonds":
        return Ok(2);
      case "Clubs":
        return Ok(3);
      default:
        return Err("Invalid card value passed");
    }
  }
  return Ok(index);
}
