import { useState, useLayoutEffect } from "react";
import { Status, TreeGame } from "./tree-game.tsx";
import GameBoard from "./game-board.jsx";
import GameHeader from "./game-header.jsx";

/**
 * The main game screen for a TreeGame with given <gameType>, <n> trees,
 * and difficulty <diff>.
 */
export default function GameScreen({ toMenu, gameType, n, pyroWinnable, diff }) {
/*   const statusList = [Status.TREE, Status.TREE, Status.FIRE, Status.FIRE, Status.TREE]; // testing
  //const statusList = [Status.FIRE, Status.FIRE, Status.TREE, Status.TREE, Status.FIRE]; // testing
  const testTg = new TreeGame(statusList, pyroWinnable, gameType, diff); // testing
  const [tg, setTg] = useState(testTg); // testing  */
  const [tg, setTg] = useState(TreeGame.random(n, pyroWinnable, gameType, diff));

  // If it's the computer's turn, pause 0.75 seconds, then take turn
  useLayoutEffect(() => {
    if (tg.isComputerPlayerTurn()) {
      const move = tg.computerPlayerMove();
      setTimeout(() => makeMove(move), 750);
  }});

  // Define response to move buttons
  function makeMove(move) {
    var newTg = { ...tg };
    Object.setPrototypeOf(newTg, TreeGame.prototype);
    newTg.takeTurn(move);
    setTg(newTg);
  }
  function makeTreeMove() {
    makeMove(Status.TREE);
  }
  function makeFireMove() {
    makeMove(Status.FIRE);
  }

  return (
    <>
      <GameHeader tg={tg} treeMove={makeTreeMove} fireMove={makeFireMove} />
      <GameBoard tg={tg} toMenu={toMenu} />
    </>
  );
}
