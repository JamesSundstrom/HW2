import { useState } from "react";
import { TreeGame, Status } from "./tree-game.tsx"
import GameScreen from "./game-screen.jsx";
import MainMenu from "./main-menu.jsx";
import Settings from "./settings.jsx";
import "./App.css"

// Default values (can be overridden in Settings by user)
const MIN_TREES = 5;
const MAX_TREES = 6;

// Absolute bounds that cannot be overridden by user
const HARD_MIN_TREES = 3;
const HARD_MAX_TREES = 12;

export default function App() {
  const [screen, setScreen] = useState("mainMenu"); // "mainMenu", "settings", or "game"
  const [gameType, setGameType] = useState(null);
  const [pyroWinnable, setPyroWinnable] = useState(false);
  const [minTrees, setMinTrees] = useState(MIN_TREES);
  const [maxTrees, setMaxTrees] = useState(MAX_TREES);
  const [difficulty, setDifficulty] = useState(10);

  function start(gt) {
    setGameType(gt);
    setScreen("game"); // Start game
  }

  const toMenu = () => setScreen("mainMenu");

  if (screen === "mainMenu") {
    return <MainMenu start={start} toSettings={() => setScreen("settings")} />;
  } else if (screen == "settings") {
    return (
      <Settings
        minTrees={minTrees}
        setMinTrees={setMinTrees}
        hardMinTrees={HARD_MIN_TREES}
        maxTrees={maxTrees}
        setMaxTrees={setMaxTrees}
        hardMaxTrees={HARD_MAX_TREES}
        pyroWinnable={pyroWinnable}
        setPyroWinnable={setPyroWinnable}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        toMenu={toMenu}
      />
    );
  } else {
    const n = Math.floor(Math.random() * (maxTrees - minTrees + 1)) + minTrees;
    return (
      <GameScreen toMenu={toMenu} pyroWinnable={pyroWinnable} gameType={gameType} n={n} diff={difficulty} />
    );
  }
}
