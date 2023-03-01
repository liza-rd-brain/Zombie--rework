import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function usePlayerMove() {
  const doEffect = useSelector((state: State) => state.doEffect);
  const dispatch = useDispatch();

  useEffect(
    function playerMove() {
      switch (doEffect?.type) {
        case "!checkAvailableNeighboringCell": {
          dispatch({
            type: "req-checkAvailableNeighboringCell",
          });
          break;
        }

        case "!getPlayerMoveResult": {
          dispatch({
            type: "req-getPlayerMoveResult",
          });
          break;
        }

        case "!switchToNextPlayer": {
          dispatch({
            type: "req-switchToNextPlayer",
          });
          break;
          // const timerMoveResult = setTimeout(
          //   () =>
          //     dispatch({
          //       type: "req-switchToNextPlayer",
          //     }),
          //   500
          // );

          // return () => {
          //   clearTimeout(timerMoveResult);
          // };
        }

        default:
          break;
      }
    },
    //eslint-disable-next-line
    [doEffect]
  );
}
