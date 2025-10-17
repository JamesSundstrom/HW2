import { Status, FF_NAME, PYRO_NAME } from "./tree-game.tsx";

const PREFIX = "./src/assets/"

const TREE_IMG = PREFIX + "tree.png";
const FIRE_IMG = PREFIX + "fire.png";
const PATH_CW_IMG = PREFIX + "path_cw.png"
const PATH_CW_P_IMG = PREFIX + "path_cw_pyro.png";
const PATH_CW_FF_IMG = PREFIX + "path_cw_ff.png";
const HELMET_IMG = PREFIX + "helmet.png";
const TORCH_IMG = PREFIX + "torch.png";

function coords(r, h, k, i, n) {
  const t = (2 * Math.PI * i) / n;
  return {
    top: (k + r * Math.sin(t)).toString() + "%",
    left: (h + r * Math.cos(t)).toString() + "%",
  };
}

// Create the <img> element corresponding to the i-th tree.
function makeTree(tree, i, trees) {
  const r = 40;
  const xy = coords(r, 40, 40, i, trees.length);
  return (
    <img
      id={"tree" + i}
      style={{
        position: "absolute",
        top: xy.top,
        left: xy.left,
        width: (tree == Status.TREE ? r * 0.5 : r * 0.375) + "%",
      }}
      src={tree == Status.TREE ? TREE_IMG : FIRE_IMG}
    />
  );
}

function path_img(winner) {
  switch (winner) {
    case FF_NAME:
      return PATH_CW_FF_IMG;
    case PYRO_NAME:
      return PATH_CW_P_IMG;
    default:
      return PATH_CW_IMG;
  }
}

export default function GameBoard({ tg, toMenu }) {
  const trees = tg.trees.map(makeTree);
  const path = <img className="path" src={path_img(tg.winner)} />;
  const location = coords(25, 45, 45, tg.location, tg.trees.length);
  const locationMarker = (
    <img
      id="location"
      src={tg.locationStatus() == Status.FIRE ? HELMET_IMG : TORCH_IMG}
      style={{ position: "absolute", top: location.top, left: location.left }}
    />
  );
  const menuBtn = (
    <button id="mainmenu" onClick={toMenu}>
      Quit to main menu
    </button>
  );
  return (
    <center className="board">
      {[...trees, path, locationMarker, menuBtn]}
    </center>
  );
}
