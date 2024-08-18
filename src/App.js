import { useState } from "react";
import { Flow } from "./flow/flow";
import { PopUp } from "./ui/popup";
import { StartMenu } from "./views/dialogs/StartMenu";

function App() {
  return (
    <>
      <StartMenu />
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