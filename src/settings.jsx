import { useState, useRef } from "react";

export default function Settings({
  minTrees,
  setMinTrees,
  hardMinTrees,
  maxTrees,
  setMaxTrees,
  hardMaxTrees,
  pyroWinnable,
  setPyroWinnable,
  difficulty,
  setDifficulty,
  toMenu,
}) {
  const [invalidChange, setInvalidChange] = useState(false);

  const minRef = useRef();
  const maxRef = useRef();

  function saveAndReturn() {
    const newMin = parseInt(minRef.current.value);
    const newMax = parseInt(maxRef.current.value);
    if (
      Number.isNaN(newMin) || Number.isNaN(newMax) ||
      newMin < hardMinTrees || newMin > newMax ||
      newMax <= 0 || newMax > hardMaxTrees
    ) {
      setInvalidChange(true);
      return;
    }
    setMinTrees(newMin);
    setMaxTrees(newMax);
    setPyroWinnable(document.getElementById("Yes").checked);
    setDifficulty(document.getElementById("difficultySlider").value);
    toMenu();
  }

  function onDifficultyChange() {
    const newVal = document.getElementById("difficultySlider").value;
    document.getElementById("difficultyDisplay").value = newVal;
  }

  return (
    <>
      <h1 align="center">Settings</h1>
      <div id="settings-container">
        <div class="grid-container">
          <label for="minTrees">Minimum number of trees: </label>
          <div>
            <input
              type="number"
              inputmode="numeric"
              id="minTrees"
              defaultValue={minTrees}
              min={hardMinTrees}
              ref={minRef}
            />
          </div>
          <label for="maxTrees">Maximum number of trees: </label>
          <div>
            <input
              type="number"
              inputmode="numeric"
              id="maxTrees"
              defaultValue={maxTrees}
              max={hardMaxTrees}
              ref={maxRef}
            />
          </div>
        </div>
        <div className="settingsSection">
          <div>Allow pyro to win by threefold repetition?</div>
          <input
            type="radio"
            id="Yes"
            name="winbyrepetition"
            defaultChecked={pyroWinnable}
          />{" "}
          <label for="Yes">Yes</label>
          <input
            type="radio"
            id="No"
            name="winbyrepetition"
            defaultChecked={!pyroWinnable}
          />
          <label for="No">No</label>
        </div>
        <div className="settingsSection">
          <div>
            <label for="difficultySlider">
              Computer player difficulty (10 = hardest):
            </label>
          </div>
          <div id="difficultyDiv">
            <input
              id="difficultySlider"
              type="range"
              min="0"
              max="10"
              defaultValue={difficulty}
              onChange={() => onDifficultyChange()}
            />
            <output id="difficultyDisplay" for="difficultySlider">
              {difficulty}
            </output>
          </div>
        </div>
        <div className="button-container">
          <button className="settingsBtn" onClick={() => saveAndReturn()}>
            Save changes and return to main menu
          </button>
          <button className="settingsBtn" onClick={toMenu}>
            Discard changes and return to main menu
          </button>
        </div>
        <div id="InvalidChangeWarning">
          <p style={{ display: invalidChange ? "inline-block" : "none" }}>
            Invalid settings. Changes not saved.
          </p>
        </div>
      </div>
    </>
  );
}
