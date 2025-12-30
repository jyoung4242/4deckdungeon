var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// engine.ts
var Ok = (value) => ({ ok: true, value });
var Err = (error) => ({ ok: false, error });
var ENGINE_STATE = {
  idle: "idle",
  playergen: "playergen",
  runningCampaign: "runningCampaign"
};
var _FourDeckDungeonEngine = class _FourDeckDungeonEngine {
  //------------------------------------------------
  // #endregion class properties
  // #region deck utils
  static createStandardDeck() {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }
  static shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }
    return deck;
  }
  static shufflePlayerGenDeck() {
    _FourDeckDungeonEngine._PlayerGenDeck = _FourDeckDungeonEngine.shuffleDeck(_FourDeckDungeonEngine._PlayerGenDeck);
  }
  static shuffleContestDeck() {
    _FourDeckDungeonEngine._ContestDeck = _FourDeckDungeonEngine.shuffleDeck(_FourDeckDungeonEngine._ContestDeck);
  }
  static shuffleEncounterDeck() {
    _FourDeckDungeonEngine._EncounterDeck = _FourDeckDungeonEngine.shuffleDeck(_FourDeckDungeonEngine._EncounterDeck);
  }
  static resetAndShuffleDeck(deck) {
    deck.length = 0;
    let d1, d2;
    d1 = _FourDeckDungeonEngine.createStandardDeck();
    if (deck === _FourDeckDungeonEngine._EncounterDeck) {
      d2 = _FourDeckDungeonEngine.createStandardDeck();
      d1 = d1.concat(d2);
    }
    deck.push(..._FourDeckDungeonEngine.shuffleDeck(d1));
  }
  static initStandardDecks() {
    _FourDeckDungeonEngine._PlayerGenDeck = _FourDeckDungeonEngine.shuffleDeck(_FourDeckDungeonEngine.createStandardDeck());
    _FourDeckDungeonEngine._ContestDeck = _FourDeckDungeonEngine.shuffleDeck(_FourDeckDungeonEngine.createStandardDeck());
    const d1 = _FourDeckDungeonEngine.createStandardDeck();
    const d2 = _FourDeckDungeonEngine.createStandardDeck();
    _FourDeckDungeonEngine._EncounterDeck = _FourDeckDungeonEngine.shuffleDeck(d1.concat(d2));
    _FourDeckDungeonEngine._ContestDeck = _FourDeckDungeonEngine.shuffleDeck(_FourDeckDungeonEngine.createStandardDeck());
  }
  // Public accessors for testing / UI
  static getPlayerGenDeck() {
    return _FourDeckDungeonEngine._PlayerGenDeck.slice();
  }
  static getContestDeck() {
    return _FourDeckDungeonEngine._ContestDeck.slice();
  }
  static getEncounterDeck() {
    return _FourDeckDungeonEngine._EncounterDeck.slice();
  }
  // #endregion deck utils
  // #region playergen
  static getCurrentParty() {
    return _FourDeckDungeonEngine._partyData;
  }
  static getNumPlayers() {
    return _FourDeckDungeonEngine._partyData.length;
  }
  static addPlayer(PlayerData) {
    if (_FourDeckDungeonEngine._partyData.length >= 4) return Err("Party is full (max 4 players), remove a player and try again");
    PlayerData.playerGenCards.forEach((card) => {
      let index = _FourDeckDungeonEngine._PlayerGenDeck.indexOf(card);
      if (index !== -1) {
        _FourDeckDungeonEngine._PlayerGenDeck.splice(index, 1);
      } else {
        return Err("PlayerGen card not found in deck");
      }
    });
    _FourDeckDungeonEngine._partyData.push(PlayerData);
    return Ok(_FourDeckDungeonEngine._partyData);
  }
  static removePlayer(name) {
    let index = _FourDeckDungeonEngine._partyData.findIndex((player) => player.name === name);
    if (index === -1) return Err("Player not found in party");
    _FourDeckDungeonEngine._partyData.splice(index, 1);
    return Ok(_FourDeckDungeonEngine._partyData);
  }
  static generatePlayer(name) {
    let newPlayer = {
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
      playerGenCards: []
    };
    let perkPool = [];
    if (_FourDeckDungeonEngine._partyData.length >= 4) {
      return Err("Party is full (max 4 players), remove a player and try again");
    }
    if (_FourDeckDungeonEngine._PlayerGenDeck.length < 13) {
      return Err("Not enough cards in playergen deck, check your campaign data and try again");
    }
    let backstoryCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 1];
    let motivationCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 2];
    let classCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 3];
    let raceCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 4];
    if (!backstoryCard || !motivationCard || !classCard || !raceCard) {
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    }
    newPlayer.playerGenCards = [backstoryCard, motivationCard, classCard, raceCard];
    _FourDeckDungeonEngine._setPlayerAffinity(newPlayer, backstoryCard);
    let result = _FourDeckDungeonEngine._setPlayerBackstory(newPlayer, backstoryCard, perkPool);
    if (!result.ok) return Err(result.error);
    result = _FourDeckDungeonEngine._setPlayerMotivationDrive(newPlayer, motivationCard, perkPool);
    if (!result.ok) return Err(result.error);
    result = _FourDeckDungeonEngine._setPlayerClass(newPlayer, classCard, perkPool);
    if (!result.ok) return Err(result.error);
    result = _FourDeckDungeonEngine._setPlayerRace(newPlayer, raceCard, perkPool);
    if (!result.ok) return Err(result.error);
    let strengthCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 5];
    if (!strengthCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = _FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "strength", strengthCard);
    let agilityCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 6];
    if (!agilityCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = _FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "agility", agilityCard);
    let constitutionCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 7];
    if (!constitutionCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = _FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "constitution", constitutionCard);
    let intelligenceCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 8];
    if (!intelligenceCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = _FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "intelligence", intelligenceCard);
    let perceptionCard = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 9];
    if (!perceptionCard)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    result = _FourDeckDungeonEngine._setPlayerAttribute(newPlayer, "perception", perceptionCard);
    let perk1card = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 10];
    let perk2card = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 11];
    let perk3card = _FourDeckDungeonEngine._PlayerGenDeck[_FourDeckDungeonEngine._PlayerGenDeck.length - 12];
    if (!perk1card || !perk2card || !perk3card)
      return Err("Not enough cards in playergen deck, can't generate player, check player count or campaign data and try again");
    _FourDeckDungeonEngine._setPlayerPerk(newPlayer, [perk1card, perk2card, perk3card], perkPool);
    return Ok(newPlayer);
  }
  static _setPlayerAffinity(newPlayer, card) {
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
  static _setPlayerBackstory(newPlayer, card, perkPool) {
    let numBackstories = _FourDeckDungeonEngine._campaignData.backstories.length;
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in backstory card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, 13, numBackstories);
    if (!selectedIndexResult.ok) return Err(`Error in backstory card conversion: ${selectedIndexResult.error}`);
    let selectedBackstoryIndex = selectedIndexResult.value;
    newPlayer.backstory = _FourDeckDungeonEngine._campaignData.backstories[selectedBackstoryIndex];
    let perks = _FourDeckDungeonEngine._campaignData.backstories[selectedBackstoryIndex].perkPool;
    perkPool.push(...perks);
    return Ok(void 0);
  }
  static _setPlayerMotivationDrive(newPlayer, card, perkPool) {
    let getNumMotivaitons = _FourDeckDungeonEngine._campaignData.motivations.length;
    let getNumDrives = _FourDeckDungeonEngine._campaignData.drive.length;
    let resultRank = cardRankToIndex(card.rank);
    let resultSuit = cardRankToIndex(card.suit);
    if (!resultRank.ok) return Err(`Error in Motivation card conversion: ${resultRank.error}`);
    let resultRemapRank = remapIndex(resultRank.value, 13, getNumMotivaitons);
    if (!resultRemapRank.ok) return Err(`Error in Motivation card remapping: ${resultRemapRank.error}`);
    let selectedMotivationIndex = resultRemapRank.value;
    newPlayer.motivation = _FourDeckDungeonEngine._campaignData.motivations[selectedMotivationIndex];
    if (!resultSuit.ok) return Err(`Error in Drive card conversion: ${resultSuit.error}`);
    let resultRemapSuit = remapIndex(resultSuit.value, 4, getNumDrives);
    if (!resultRemapSuit.ok) return Err(`Error in Drive card remapping: ${resultRemapSuit.error}`);
    let selectedDriveIndex = resultRemapSuit.value;
    newPlayer.drive = _FourDeckDungeonEngine._campaignData.drive[selectedDriveIndex];
    let perks = _FourDeckDungeonEngine._campaignData.motivations[selectedMotivationIndex].perkPool;
    perkPool.push(...perks);
    perks = _FourDeckDungeonEngine._campaignData.drive[selectedDriveIndex].perkPool;
    perkPool.push(...perks);
    return Ok(void 0);
  }
  static _setPlayerClass(newPlayer, card, perkPool) {
    let numClasses = _FourDeckDungeonEngine._campaignData.classes.length;
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in class card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, 13, numClasses);
    if (!selectedIndexResult.ok) return Err(`Error in class card remapping: ${selectedIndexResult.error}`);
    let selectedClassIndex = selectedIndexResult.value;
    newPlayer.class = _FourDeckDungeonEngine._campaignData.classes[selectedClassIndex];
    let perks = _FourDeckDungeonEngine._campaignData.classes[selectedClassIndex].perkPool;
    perkPool.push(...perks);
    return Ok(void 0);
  }
  static _setPlayerRace(newPlayer, card, perkPool) {
    let numClasses = _FourDeckDungeonEngine._campaignData.races.length;
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in race card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, 13, numClasses);
    if (!selectedIndexResult.ok) return Err(`Error in race card remapping: ${selectedIndexResult.error}`);
    let selectedRaceIndex = selectedIndexResult.value;
    newPlayer.race = _FourDeckDungeonEngine._campaignData.races[selectedRaceIndex];
    let perks = _FourDeckDungeonEngine._campaignData.races[selectedRaceIndex].perkPool;
    perkPool.push(...perks);
    return Ok(void 0);
  }
  static _setPlayerAttribute(newPlayer, attribute, card) {
    let result = cardRankToIndex(card.rank);
    if (!result.ok) return Err(`Error in attribute card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, 13, 13);
    if (!selectedIndexResult.ok) return Err(`Error in attribute card remapping: ${selectedIndexResult.error}`);
    let attributeValue = selectedIndexResult.value + 1;
    newPlayer[attribute] = attributeValue;
    return Ok(void 0);
  }
  static _setPlayerPerk(newPlayer, cards, perkPool) {
    let numPerks = perkPool.length;
    if (cards.length != 3) return Err(`Error in perk card conversion: ${cards.length} cards in perk pool, 3 expected`);
    if (perkPool.length < 3) return Err(`Error in perk card conversion: ${perkPool.length} perks in perk pool, 3 expected`);
    let result = cardRankToIndex(cards[0].rank);
    if (!result.ok) return Err(`Error in perk card conversion: ${result.error}`);
    let selectedIndexResult = remapIndex(result.value, 13, numPerks);
    if (!selectedIndexResult.ok) return Err(`Error in perk card remapping: ${selectedIndexResult.error}`);
    let selectedPerkIndex = selectedIndexResult.value;
    newPlayer.perks.push(perkPool[selectedPerkIndex]);
    result = cardRankToIndex(cards[1].rank);
    if (!result.ok) return Err(`Error in perk card conversion: ${result.error}`);
    selectedIndexResult = remapIndex(result.value, 13, numPerks);
    if (!selectedIndexResult.ok) return Err(`Error in perk card remapping: ${selectedIndexResult.error}`);
    selectedPerkIndex = selectedIndexResult.value;
    newPlayer.perks.push(perkPool[selectedPerkIndex]);
    result = cardRankToIndex(cards[2].rank);
    if (!result.ok) return Err(`Error in perk card conversion: ${result.error}`);
    selectedIndexResult = remapIndex(result.value, 13, numPerks);
    if (!selectedIndexResult.ok) return Err(`Error in perk card remapping: ${selectedIndexResult.error}`);
    selectedPerkIndex = selectedIndexResult.value;
    newPlayer.perks.push(perkPool[selectedPerkIndex]);
    return Ok(void 0);
  }
  // #endregion playergen
  // #region campaign
  static loadCampaign(campaignData) {
    _FourDeckDungeonEngine._campaignData = campaignData;
    _FourDeckDungeonEngine.initStandardDecks();
    _FourDeckDungeonEngine._gameState = ENGINE_STATE.playergen;
    return _FourDeckDungeonEngine._gameState;
  }
  static resetCampaign() {
  }
  // #endregion campaign
  // #region contestResolver
  // #endregion contestResolver
  // #region engineUtils
  static getEngineState() {
    return _FourDeckDungeonEngine._gameState;
  }
  // #endregion engineUtils
};
// #region class properties
//------------------------------------------------
__publicField(_FourDeckDungeonEngine, "_gameState", ENGINE_STATE.idle);
__publicField(_FourDeckDungeonEngine, "_campaignData", {
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
  races: []
});
__publicField(_FourDeckDungeonEngine, "_partyData", []);
__publicField(_FourDeckDungeonEngine, "_PlayerGenDeck", []);
__publicField(_FourDeckDungeonEngine, "_ContestDeck", []);
__publicField(_FourDeckDungeonEngine, "_EncounterDeck", []);
var FourDeckDungeonEngine = _FourDeckDungeonEngine;
function remapIndex(index, maxIndex, arrayLength) {
  if (maxIndex <= 0) {
    return Err("maxIndex must be greater than 0");
  }
  if (arrayLength < 0) {
    return Err("arrayLength cannot be negative");
  }
  if (index < 0) {
    index = maxIndex + index % maxIndex;
  }
  if (index >= maxIndex) {
    index = index % maxIndex;
  }
  const result = Math.floor(index * arrayLength / maxIndex);
  return Ok(result);
}
function cardRankToIndex(rand) {
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
export {
  ENGINE_STATE,
  Err,
  FourDeckDungeonEngine,
  Ok
};
