import { GameType } from "./tree-game.tsx";

function newGameButton(gameType, startGame) {
  return (
    <div>
      <button className="mainMenuButton" onClick={() => startGame(gameType)}>
        {gameType.toString()}
      </button>
    </div>
  );
}

export default function MainMenu({ start, toSettings }) {
  return (
    <body>
      <center>
        <h1 className="gameTitle">Tree Game</h1>
        <div id="mainMenuBtnContainer">
          {newGameButton(GameType.TWO_PLAYER, start)}
          {newGameButton(GameType.FF, start)}
          {newGameButton(GameType.PYRO, start)}
          {newGameButton(GameType.ZERO_PLAYER, start)}
          <div>
            <button className="mainMenuButton"  onClick={() => toSettings()}>
              Settings
            </button>
          </div>
        </div>
      </center>
    </body>
  );
}
