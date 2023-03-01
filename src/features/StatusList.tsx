import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import styled from "styled-components";

import { State, GameState, TypeEffect } from "../business/types";

import { PlayerStatus } from "./PlayerStatus";

const Status = styled.div`
  width: 200px;
  min-height: 18px;
  width: 250px;
  height: 100px;
  border: 1px solid lightgray;
  background-color: #fff2d9;
  text-align: center;
  font-size: 20px;
  color: #5f5757;
  padding-top: 15px;
  box-sizing: border-box;
`;

export const StatusList = () => {
  type statusType = string;
  const initialStatus: statusType = "";
  const [status, updateStatus] = useState(initialStatus);

  const dice = useSelector((state: State) => state.dice);
  const gameState = useSelector((state: State) => state.gameState);
  const doEffect = useSelector((state: State) => state.doEffect);
  const gameResult = useSelector((state: State) => state.gameResult);

  const newStatus = getTextStatus(gameState, doEffect, dice, gameResult);
  const battlePhrase = "pежим боя";
  useEffect(() => {
    updateStatus(() => {
      if (gameState.type.includes("interactWithEnemy")) {
        if (gameState.type === "interactWithEnemy") {
          return newStatus;
        } else {
          return `${battlePhrase}: ${newStatus}`;
        }
      } else {
        return newStatus;
      }
    });
  }, [gameState.type, doEffect?.type, newStatus]);
  return (
    <>
      <Status>{status}</Status>
      <PlayerStatus />
    </>
  );
};

const getTextStatus = (
  gameState: GameState,
  doEffect: TypeEffect,
  dice: number,
  gameResult: string
) => {
  switch (gameState.type) {
    case "gameStarted.rollDice":
      return "бросить кубик";
    case "gameStarted.playerMove":
      return "сделать ход";
    case "gameStarted.takeCard":
      return "открываем карточку";
    case "gameStarted.applyCard":
      return "применить карточку";

    /*   case "interactWithEnemy.applyCard":
      return "применить оружие"; */
    case "interactWithEnemy.throwBattleDice": {
      return "бросить кубик";
    }
    case "interactWithEnemy.applyCard": {
      return "применить оружие";
    }

    case "interactWithEnemy.makeBattleAction":
    case "interactWithEnemy":
      switch (doEffect?.type) {
        case "!openEnemyCard": {
          return "открываем карточку";
        }

        case "!getBattleResult": {
          switch (dice) {
            case 1:
            case 2: {
              return `выпало ${dice}: игрок применяет оружие или бросает кубик `;
            }
            case 3: {
              return `выпало ${dice}: игрок теряет 1 здоровье`;
            }
            case 4: {
              return `выпало ${dice}: игрок спасается бегством `;
            }
            default:
              return "бросить кубик или применить оружие";
          }
        }
        default:
          return "сделать ход";
      }

    /*   case "gameStarted.interactWithEnemy.fightOrKeepBattle":
      return "применить  оружие или бросить кубик"; */
    case "enemyMove.chooseEnemy": {
      return "выбрать карточку врага";
    }
    case "enemyMove": {
      return "передвинуть карточку врага";
    }
    case "endGame":
      return gameResult;
    default:
      return "";
  }
};
