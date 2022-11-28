import React from "react";
import "./styles.css";

import telService from "./telService";

export default function App() {
  const [events, setEvents] = React.useState(() => []);
  const pushEventDisplay = (msg) => {
    setEvents((e) => [
      ...e,
      {
        time: new Date(),
        msg: msg,
      },
    ]);
  };
  return (
    <div className="App">
      <h1>Tel Comp Demo</h1>
      <button
        onClick={() => {
          telService
            .on(telService.EventType.RES_LOAD, () => {
              pushEventDisplay("电话条资源加载");
            })
            .on(telService.EventType.SIP_RE_CONN, () => {
              pushEventDisplay("SIP正在连接");
            })
            .on(telService.EventType.SIP_CONN, () => {
              pushEventDisplay("SIP连接成功");
            })
            .on(telService.EventType.CALL_RING, () => {
              pushEventDisplay("开始振铃");
            })
            .on(telService.EventType.CALL_ANSWER, () => {
              pushEventDisplay("呼叫应答");
            })
            .on(telService.EventType.STATUS_UPDATE, (v) => {
              pushEventDisplay("状态更新", v);
            })
            .callOut("13571817694");
        }}
      >
        开始呼叫
      </button>
      <button>挂断</button>

      <div style={{ textAlign: "left", margin: 20, lineHeight: "200%" }}>
        <div style={{ fontWeight: "bold" }}>日志</div>
        <div
          style={{
            border: "1px solid black",
            padding: 10,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {events.length > 0 ? (
            events
              .sort((i1, i2) => i2.time.getTime() - i1.time.getTime())
              .map((e) => (
                <div key={"LOG_" + Math.random()}>
                  {e.time.toString().replace(/.*?\d{4}\s([\d:]+)\s.*/, "$1.") +
                    e.time.getMilliseconds() +
                    " " +
                    e.msg}
                </div>
              ))
          ) : (
            <div style={{ color: "gray" }}>empty</div>
          )}
        </div>
      </div>
    </div>
  );
}
