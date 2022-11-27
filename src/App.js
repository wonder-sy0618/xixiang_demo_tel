import "./styles.css";

import { callOut } from "./TelComp/index";

export default function App() {
  return (
    <div className="App">
      <h1>Tel Comp Demo</h1>
      <button
        onClick={() => {
          callOut("13571817694");
        }}
      >
        开始呼叫
      </button>
    </div>
  );
}
