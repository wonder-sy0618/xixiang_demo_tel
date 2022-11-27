import jssip from "jssip";
import config from "./config";

const initSip = () => {
  var configuration = {
    sockets: [
      new jssip.WebSocketInterface(
        "wss://" +
          config.sip_addr +
          ":" +
          config.sip_port +
          "/" +
          config.sip_xpath
      )
    ],
    uri: "sip:alice@example.com",
    password: config.sip_pwd
  };

  var ua = new jssip.UA(configuration);

  ua.start();
};

const callOut = (tel) => {
  console.log(tel);
  initSip();
};

console.log(">>> ", jssip);

export { callOut };
