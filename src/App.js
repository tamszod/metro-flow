import { Flow } from "./flow/flow";
import { Start } from "./views/dialogs/Start";
import { LearnToPlay } from "./views/dialogs/LearnToPlay";
import { GameOver } from "./views/dialogs/GameOver";
import { DayEnded } from "./views/dialogs/DayEnded";
import { UI } from "./views/game/ui";

function App() {
  return (
    <>
      <Start />
      <LearnToPlay />
      <GameOver />
      <DayEnded />
      <UI />
      <Flow />
   </>
  );
}

export default App;

    /*<div style={{
      left:0,
      top:0,
    }}>
      <h1>Metro Flow (Alpha 2.2.1)</h1>*/