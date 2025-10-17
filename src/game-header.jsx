import { Status } from "./tree-game.tsx";

export default function GameHeader({ tg, treeMove, fireMove }) {
  const ffVis = tg.gameType.computerFF() ? "hidden" : "visible";
  const pyroVis = tg.gameType.computerPyro() ? "hidden" : "visible";
  const ffTurn = tg.locationStatus() == Status.FIRE;
  return (
    <div id="header">
      <div className="controls" style={{ textAlign: "right", visibility: ffVis }}>
        <div>
          <button className="gameBtn" onClick={treeMove} disabled={!ffTurn}>
            Extinguish
          </button>
        </div>
        <div>
          <button className="gameBtn" onClick={fireMove} disabled={!ffTurn}>
            Don't extinguish
          </button>
        </div>
      </div>
      <h1 className="gameTitle">Tree Game</h1>
      <div className="controls" style={{ textAlign: "left", visibility: pyroVis }}>
        <div>
          <button className="gameBtn" onClick={fireMove} disabled={ffTurn}>
            Light fire
          </button>
        </div>
        <div>
          <button className="gameBtn" onClick={treeMove} disabled={ffTurn}>
            Don't light
          </button>
        </div>
      </div>
    </div>
  );
}
