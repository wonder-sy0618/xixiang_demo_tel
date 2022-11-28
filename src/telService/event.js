const eventRegister = {};

const EventType = {
  RES_LOAD: "RES_LOAD", // 资源开始加载
  SIP_RE_CONN: "SIP_RE_CONN", // SIP开始连接
  SIP_CONN: "SIP_CONN", // SIP连接成功
  CALL_RING: "CALL_RING", // 开始振铃
  CALL_ANSWER: "CALL_ANSWER", // 呼叫应答
  STATUS_UPDATE: "STATUS_UPDATE", // 状态变更
};

const eventNotice = (eventType, parmar) => {
  if (eventRegister[eventType]) eventRegister[eventType](parmar);
};

const eventBind = (eventType, func) => {
  eventRegister[eventType] = func;
};

export { EventType, eventNotice, eventBind };
