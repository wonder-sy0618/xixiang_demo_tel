import jssip from "jssip";
import thireLoader from "./thireLoader";
import config from "./config";
import { EventType, eventBind, eventNotice } from "./event";

/**
 * 加载资源
 * @returns promise: application object
 */
const loadScript = async () => {
  if (window.application) {
    return window.application;
  }
  if (window._tel_debug) console.log("load tel script ");
  eventNotice(EventType.RES_LOAD);
  const [JsSIP, applicationLoad, setVccBarOnEvent] = await Promise.all([
    thireLoader(
      process.env.PUBLIC_URL + "/thire/JVccBar3/scripts/jssip.min.js",
      "JsSIP"
    ),
    thireLoader(
      process.env.PUBLIC_URL + "/thire/JVccBar3/scripts/jcinvccbar-pure.min.js",
      "applicationLoad"
    ),
    thireLoader(
      process.env.PUBLIC_URL + "/thire/JVccBar3/jbarextent.js",
      "setVccBarOnEvent"
    ),
  ]);
  if (window._tel_debug) console.log("application load");
  applicationLoad("", setVccBarOnEvent, "");
  await new Promise((resolve) => window.setTimeout(resolve, 2000));
  return window["application"];
};

/**
 * Sip连接
 * @param {} application
 * @returns promise
 */
const connSip = async (application) =>
  new Promise((resolve, reject) => {
    if (window._tel_debug) console.log("connect sip", application);
    eventNotice(EventType.SIP_RE_CONN);
    // config
    application.oJVccBar.SetAttribute("MainIP", config.sip_addr);
    application.oJVccBar.SetAttribute("MainPortID", config.sip_port);
    application.oJVccBar.SetAttribute("BackIP", config.sip_addr);
    application.oJVccBar.SetAttribute("MonitorIP", config.sip_addr);
    application.oJVccBar.SetAttribute("MonitorPort", config.sip_port);
    application.oJVccBar.SetAttribute("SipServerIP", config.sip_addr);
    application.oJVccBar.SetAttribute("SipServerPort", config.sip_port);
    application.oJVccBar.SetAttribute("SipProtocol", "wss");
    application.oJVccBar.SetAttribute("MediaFlag", config.group_no);
    application.oJVccBar.SetAttribute("PassWord", config.telephonist_pwd);
    application.oJVccBar.SetAttribute(
      "AgentID",
      "000010" + config.group_no + config.job_no
    );
    application.oJVccBar.SetAttribute(
      "Dn",
      "000002" + config.group_no + config.job_no
    );
    application.oJVccBar.SetAttribute("SipXPath", config.sip_xpath);
    application.oJVccBar.SetAttribute("SipPassWord", config.sip_pwd);
    // Int ：应用类型：0：Agent 1：Monitor 2：agent+minitor
    application.oJVccBar.SetAttribute("AppType", 0);
    // 传输方式 0：http 1：https. 默认值为 0，支持 webrtc 方式必须使用 1：https 方式
    application.oJVccBar.SetAttribute("ProtocolType", 1);
    // Short 传输方式 0：websocket 1：polling 默认值为 0，不支持 websocket 方式的浏览器必须使用 1：polling，支持 webrtc 方式必须使用 0：websocket
    application.oJVccBar.SetAttribute("TransportType", 0);

    application.oJVccBar.SetAttribute("Av", 1);
    application.oJVccBar.SetAttribute("ForeCastCallAutoAnswer", 1); //
    application.oJVccBar.SetAttribute("AutoAnswerDelayTime", 0);
    application.oJVccBar.OnInitalSuccess = (e) => {
      if (window._tel_debug) console.log("OnInitalSuccess");
      eventNotice(EventType.SIP_CONN);
      resolve(e);
    };
    application.oJVccBar.OnCallRing = (v) => {
      if (window._tel_debug) console.log("OnCallRing", v);
      eventNotice(EventType.CALL_RING);
    };
    application.oJVccBar.AnswerCall = (v) => {
      if (window._tel_debug) console.log("AnswerCall", v);
      eventNotice(EventType.CALL_ANSWER, v);
    };
    application.oJVccBar.OnReportBtnStatus = (v) => {
      if (window._tel_debug) console.log("OnReportBtnStatus", v);
      eventNotice(EventType.STATUS_UPDATE, v);
    };
    application.oJVccBar.Initial();
  });

/**
 * 呼出电话
 * @param {String} tel 目标号码
 */
const callOut = async (tel) => {
  const application = await loadScript();
  if (window._tel_debug) console.log(application);
  if (
    !application ||
    !application.oJVccBar ||
    application.oJVccBar.GetAgentStatus() == -1
  ) {
    await connSip(application);
  }
  /**
   * destNum：目标号码
   * serviceDirect：0 或空：正常呼叫
   * taskID：可选参数，服务号，string
   * transParentParam：可选参数，透明参数，string 长度不超过 255 字节
   * phoneID：可选参数，号码编号，string
   * projectID：可选参数，工程 ID，string
   * cryptType：可选参数，DestNum 是否加密，0 不加密，1：DES 加密，
   * chargeNumber：可选参数，计费分机号，string
   * displayNumber：可选参数，显示号码，string
   * numberX：可选参数，中间号码，string
   * av：可选参数 1 音频, 2 视频, 3 视频
   * callBack：Function 参数，可选参数：回调事件 function(p){ } 内容：{'data':'0'}
   */
  application.oJVccBar.MakeCall(
    tel,
    0,
    "",
    "",
    "",
    "",
    0,
    "",
    "",
    "",
    1,
    () => {}
  );
};

const TelService = {
  /**
   * 呼出电话
   * @param {*} tel
   * @returns
   */
  callOut: (tel) => {
    callOut(tel);
    return TelService;
  },

  /**
   * 支持的事件类型
   */
  EventType,

  /**
   * 事件绑定，一个事件类型只能绑定一次，多次绑定失效
   * @param {EventType} eventType 事件类型
   * @param {function} func 事件处理函数
   * @returns
   */
  on: (eventType, func) => {
    eventBind(eventType, func);
    return TelService;
  },
};

export default TelService;
