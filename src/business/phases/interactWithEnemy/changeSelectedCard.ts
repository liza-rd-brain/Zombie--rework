import { State, PlayerListType, TypeOfInventoryCard } from "../../types";

export const changeSelectedCard = (
  state: State,
  typeOfSelect: TypeOfInventoryCard
) => {
  const { playerList, activePlayerNumber } = state;
  const inventory = playerList[activePlayerNumber].inventory;

  const currentTypeOfSelect =
    playerList[activePlayerNumber].inventory.cardSelected;

  const isTheSameSelectType = currentTypeOfSelect === typeOfSelect;

  const newSelectType = isTheSameSelectType ? null : typeOfSelect;

  const newInventory = { ...inventory, cardSelected: newSelectType };

  const newPlayerList: PlayerListType = {
    ...playerList,
    [activePlayerNumber]: {
      ...playerList[activePlayerNumber],
      inventory: newInventory,
    },
  };

  return newPlayerList;
};
