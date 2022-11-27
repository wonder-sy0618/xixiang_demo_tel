import { useState } from "react";
import "./styles.css";

import telService from "./telService";

export default function App() {
  const [events, setEvents] = useState([]);
  console.log("events >> ", events);
  return (
    <div className="App">
      <h1>Tel Comp Demo</h1>
      <button
        onClick={() => {
          telService
            .on(telService.EventType.RES_LOAD, () => {
              setEvents([...events, "电话条资源加载"]);
            })
            .callOut("13571817694");
        }}
      >
        开始呼叫
      </button>

      <div style={{ textAlign: "left", margin: 20, lineHeight: "200%" }}>
        <div style={{ fontWeight: "bold" }}>logs</div>
        <div style={{ border: "1px solid black", padding: 10 }}>
          {events.length > 0 ? (
            events.map((e) => <div>{e}</div>)
          ) : (
            <div style={{ color: "gray" }}>empty</div>
          )}
        </div>
      </div>
    </div>
  );
}
