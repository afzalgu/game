import React from "react";
import Game from "./Components/Game";

function App() {
  return (
    <div className="bg-gradient-to-r h-2/5 flex items-center justify-center">
      <div className="border-2 border-black-800 p-6 rounded-lg shadow-zinc-700 bg-slate-100">
        <Game />
      </div>
    </div>
  );
}

export default App;
