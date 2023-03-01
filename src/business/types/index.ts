export type PlayGridMode = "image" | "cssStyle";
export type CardAppearance = "closed" | "open";
export type TypeOfInventoryCard = "boards" | "health" | "weapon" | null;
export type TypeOfCard = TypeOfInventoryCard | "enemy";
export type CoordItem = { hor: number; vert: number };

export type MoveDirection = "top" | "bottom" | "left" | "right";
export type MoveDirectionList = MoveDirection[];

/* export type BarrierName = "wall" | SwitchedBarrierName; */ /* | null; */
export type SwitchedBarrierName = "window" | "door";
/* export type BarrierDirection = "bottom" | "left"; */

export type ContextMenuButtonType = "share" | "heal";

export type WallItem = {
  name: "wall";
  direction: MoveDirection;
};

export type SwitchedBarrierItem = {
  name: SwitchedBarrierName;
  direction: MoveDirection;
  isOpen: boolean;
};

export type BarrierItem = SwitchedBarrierItem | WallItem;

export type BarrierList = BarrierItem[];

export type CellsBarrierType = {
  coord: CoordItem;
  barrierList: BarrierList;
};

export type CellsBarrierListType = Array<CellsBarrierType>;

export type AvailableCellType = {
  direction: MoveDirection;
  coord: string;
};

export type AvailableCellListType = AvailableCellType[];

export type PlayerName = "player" | "dead";

export type PLayerType = {
  name: "player";
  health: number;
  orderNumber: number;
  coord: string;
  inventory: InventoryType;
  showContextMenu?: boolean;
};

/**
 * index here is orderNumber in enemyList
 */
export type DeadPlayer = {
  name: "dead";
  orderNumber: number;
  index?: number;
};

export type InventoryType = {
  boards: number;
  health: number;
  weapon: number;
  cardSelected: TypeOfInventoryCard;
};

export type CardItem = HealthCardType | BoardsCardType | WeaponCardType;

export type CardItemList = CardItem[] | null;

export type PlayerListType = Record<string, PLayerType>;
export type DeadPlayerListType = Record<string, DeadPlayer> | null;

export type EnemyCardType = {
  name: "enemy";
  power: number;
  coord: string;
  appearance: CardAppearance;
  feature?: "defeated";
};

export type EnemyListType = Record<number, EnemyCardType>;

export type FinishCell = {
  name: "finish";
  cardItem: CardItemList;
};

export type StartCell = {
  name: "start";
  cardItem: CardItemList;
};

export type HealthCardType = {
  name: "health";
  appearance: CardAppearance;
  isSelected?: boolean;
};

export type BoardsCardType = {
  name: "boards";
  appearance: CardAppearance;
  isSelected?: boolean;
};

export type WeaponCardType = {
  name: "weapon";
  appearance: CardAppearance;
  isSelected?: boolean;
};

export type CommonCell = {
  name: "commonCell";
  cardItem: CardItemList;
  barrierList?: BarrierList;
};

export type CellType = CommonCell | FinishCell | StartCell;

export type GameField = {
  order: Array<string>;
  values: GameFieldCells;
};

export type GameFieldCells = Record<string, CellType>;

export type State = {
  gameState: GameState;
  dice: number;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
  playerList: PlayerListType;
  deadPlayerList: DeadPlayerListType | null;
  enemyList: EnemyListType;
  gameField: GameField;
  doEffect: TypeEffect;
  activePlayerNumber: number;
  _config: ConfigType;
};

export type GameState = GameStateTypes & {
  attackInitiator?: number;
  coordOfAvailableCards: string[] | null;
  coordOfAvailableCells: string[] | null;
};

export type ConfigType = {
  //TODO: startCoord hasn`t contain barriers. It`s dont сhange, maybe don`t need in config, but need initialCoord for player?
  startCoord: CoordItem;
  finishCoord: CoordItem;
  amountPlayers: number;
  initialPlayerHealth: number;
  amountHealthItems: number;
  amountBoardsItems: number;
  amountWeaponsItems: number;
  amountEnemies: number;
  cardAppearance: CardAppearance;
  playGridMode: PlayGridMode;
  cellsBarrierList: CellsBarrierListType;
};

export type TypeEffect =
  | { type: "!openCard" }
  | { type: "!takeCard" }
  | { type: "!checkAppearanceInventoryCard" }
  | { type: "!changePlayerHealth" }
  | { type: "!deleteCard" }
  | { type: "!checkAppearanceEnemyCard" }
  | { type: "!openEnemyCard" }
  | { type: "!throwBattleDice" }
  | { type: "!getBattleResult" }
  | { type: "!checkAvailableNeighboringCell" }
  | { type: "!getPlayerMoveResult" }
  | { type: "!switchToNextPlayer" }
  | { type: "!removeEnemyCard" }
  | { type: "!checkAvailableNeighboringCards" }
  | null;

export type GameStateTypes =
  | { type: "waitingStart" }
  | { type: "gameStarted.rollDice" }
  | {
      type: "gameStarted.playerMove";
    }
  | {
      type: "gameStarted.takeCard";
    }
  | { type: "interactWithEnemy.getBattleResult" }
  | {
      type: "gameStarted.applyCard";
    }
  | { type: "interactWithEnemy" }
  | { type: "interactWithEnemy.throwBattleDice" }
  | { type: "interactWithEnemy.makeBattleAction" }
  | { type: "interactWithEnemy.applyCard" }
  | { type: "gameStarted.getPlayersOrder" }
  | { type: "endGame" }
  | { type: "getEndScreen" }
  | {
      type: "enemyMove";
    }
  | {
      type: "enemyMove.chooseEnemy";
    };
