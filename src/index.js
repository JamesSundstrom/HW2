import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import TreeGameApp from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <TreeGameApp />
    <p>
      <b>Instructions:</b> In the Tree Game, there are two players: a
      firefighter and a pyromaniac. The two of them walk together around a
      circular path lined with trees, some of which are on fire. The
      firefighter's goal is to put out all the fires, while the pyromaniac's
      goal is to prevent the firefighter from doing that.
    </p>
  </StrictMode>
);
