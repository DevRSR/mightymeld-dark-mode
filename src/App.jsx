import { useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";
import Theme from "./Theme"

function App() {
  const [gameState, setGameState] = useState("start");

  switch (gameState) {
    case "start":
      return <> <Theme/><StartScreen start={() => setGameState("play")} /></>;
    case "play":
      return <> <Theme /><PlayScreen end={() => setGameState("start")} /></>;
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
