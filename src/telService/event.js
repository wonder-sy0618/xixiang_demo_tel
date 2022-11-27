const eventRegister = {};

const EventType = {
  RES_LOAD: "RES_LOAD",
};

const eventNotice = (eventType, parmar) => {
  if (eventRegister[eventType]) eventRegister[eventType](parmar);
};

const eventBind = (eventType, func) => {
  eventRegister[eventType] = func;
};

export { EventType, eventNotice, eventBind };
