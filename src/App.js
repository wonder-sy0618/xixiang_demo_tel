import { useState } from "react";
import "./styles.css";

import telService from "./telService";

export default function App() {
  const [events, setEvents] = useState([]);
  return (
    <div className="App">
      <h1>Tel Comp Demo</h1>
      <button
        onClick={() => {
          telService.callOut("13571817694").on({
            LOAD_RES: () => {
              // 资源加载事件
              setEvents(...events.push("电话条资源加载"));
            },
          });
        }}
      >
        开始呼叫
      </button>
    </div>
  );
}
