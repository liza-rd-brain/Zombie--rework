import {
  State,
  GameField,
  PlayerListType,
  InventoryType,
  CardItem,
} from "../../../types";

import { ActionType } from "../../../reducer";
import { openCard } from "./openCard";
import { deleteCard } from "./deleteCard";
import { getNextPlayerNumber } from "../../common/getNextPlayerNumber";

export const takeCard = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkInventoryCard": {
      return checkInventoryCardAppearance(state);
    }

    case "req-openCard": {
      return getStateOpenCard(state);
    }

    case "req-takeCard": {
      return getStateCardTaken(state);
    }

    case "req-deleteCard": {
      return getStateDeletedCard(state);
    }

    default:
      return state;
  }
};

const getStateOpenCard = (state: State): State => {
  const { gameField, activePlayerNumber, playerList } = state;
  const playerCoordIndex = playerList[activePlayerNumber].coord;
  const currCell = gameField.values[playerCoordIndex];

  const cellWithOpenCard = openCard(currCell);

  const newGameField: GameField = {
    ...gameField,
    values: { ...gameField.values, [playerCoordIndex]: cellWithOpenCard },
  };

  return {
    ...state,
    gameField: newGameField,
    doEffect: { type: "!takeCard" },
  };
};

const getStateCardTaken = (state: State): State => {
  const { gameField, activePlayerNumber, playerList } = state;
  const player = playerList[activePlayerNumber];

  //We now for sure there is the card
  const cardItems = gameField.values[player.coord].cardItem as CardItem[];

  const emptyInventory = {
    boards: 0,
    health: 0,
    weapon: 0,
    cardSelected: null,
  };

  let structuredCardItems: InventoryType = cardItems.reduce(
    (prevItem, currentItem) => {
      if (currentItem) {
        const prevItemObj = prevItem[currentItem.name];

        if (prevItemObj) {
          return {
            ...prevItem,
            [currentItem.name]: prevItem[currentItem.name] + 1,
          };
        } else {
          return { ...prevItem, [currentItem.name]: 1 };
        }
      } else return emptyInventory;
    },
    emptyInventory
  );

  const newInventory = {
    ...player.inventory,
    boards: player.inventory.boards + structuredCardItems.boards,
    health: player.inventory.health + structuredCardItems.health,
    weapon: player.inventory.weapon + structuredCardItems.weapon,
  };

  const newPlayer = {
    ...player,
    inventory: newInventory,
  };

  const newPlayerList: PlayerListType = {
    ...playerList,
    [activePlayerNumber]: newPlayer,
  };

  return {
    ...state,
    doEffect: { type: "!deleteCard" },
    playerList: newPlayerList,
  };
};

const getStateDeletedCard = (state: State): State => {
  const { gameField, activePlayerNumber, playerList } = state;

  const playerCoordIndex = playerList[activePlayerNumber].coord;

  const currCell = gameField.values[playerCoordIndex];

  const cellWithoutCard = deleteCard(currCell);

  const newGameField: GameField = {
    ...gameField,
    values: {
      ...gameField.values,
      [playerCoordIndex]: cellWithoutCard,
    },
  };

  const newPlayerNumber = getNextPlayerNumber(state);

  return {
    ...state,
    gameField: newGameField,
    gameState: { ...state.gameState, type: "gameStarted.rollDice" },
    activePlayerNumber: newPlayerNumber,
    dice: 0,
  };
};

const checkInventoryCardAppearance = (state: State): State => {
  const { gameField, activePlayerNumber, playerList } = state;
  const playerCoordIndex = playerList[activePlayerNumber].coord;
  const currCell = gameField.values[playerCoordIndex];
  //we now for sure there is card
  const cardItemList = currCell.cardItem as CardItem[];
  const isOneCardOnCell = cardItemList.length === 1;

  switch (isOneCardOnCell) {
    case true: {
      const needOpenCard = cardItemList[0]?.appearance === "closed";

      switch (needOpenCard) {
        case true: {
          return {
            ...state,
            doEffect: { type: "!openCard" },
          };
        }
        case false: {
          return { ...state, doEffect: { type: "!takeCard" } };
        }

        default: {
          return state;
        }
      }
    }
    //If the previous player died
    case false: {
      return { ...state, doEffect: { type: "!takeCard" } };
    }

    default: {
      return state;
    }
  }
};
