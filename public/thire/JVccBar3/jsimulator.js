/**
 * Created by Administrator on 2018/9/29.
 */

var CALLTYPE_CALLIN  = 0;
var CALLTYPE_CALLOUT = 1;

var agentCommand_Null    = -1;
var agentCommand_Initial = 0;
var agentCommand_UnInitial  = 1;
var agentCommand_SignOut = 2;
var agentCommand_SetIdle = 3;
var agentCommand_SetBusy = 4;
var agentCommand_MakeCall = 5;
var agentCommand_ReleaseCall = 6;


var TIMER_AgentInterval   = 100;
var lTimerStackTimerID    = 10000;
var lTimerInitAgentTimerID    = lTimerStackTimerID+1;

var G_OSimulator = {
    Server:"192.168.2.136",
    Port: 5049,   //5049
    VccID : "100005",
    CtiXPath: "cti",  //"cti"
    DestNum: "19900000001",
    ProtocolType:1,//1:https 0:http
    BeginAgentID:"2000",
    Count:50,
    CallType: CALLTYPE_CALLOUT,//callType 1:call out 0:call in
    IntervalTime : 10,    //connect time
    IdleTime:     5,     //call sleep time
    ErrorStop:    0,
    InlineSip:    0,
    SipPassword:  "Q6v^!t@HS1Cd?qF", //00000000 |Q6v^!t@HS1Cd?qF
    MaxNum:       5,
    ObjSimulator:null,

    oSocketWS:null,
    SocketOpened:false,

    config:{
        LocalServer:"127.0.0.1",
        LocalServerPort: 4600,

        agentHeight:25,
        agentWidth:300,

        agentColor:["#868686","#ff6666","#18BD9C","#3D8AFB","#678A34"],
        agentStatus:["未登录","忙碌","空闲","通话","后处理"]
    },

    Init:function () {
        this.oSocketWS    = new  JACPWebSocket("SIM");
        this.oSocketWS.SetMsgCallBack(this.OnCallbackSimulator);
        this.oSocketWS.oParent = this;
    },
    SendMessage:function(msg){
        if(this.oSocketWS.WSIsConnect())
            this.oSocketWS.WSSendMsg(msg);
    },
    OnCallbackSimulator:function(msgType,msg){
        var oThis = this.oParent;
        if(msgType == WS_EVENT_ONOPEN){
            showLog("连接成功....");
            serverStarus.value = "连接成功";
            if(oThis.SocketOpened == false)
            {
                //oThis.SendMessage("GetAgentInfo\0");
            }
            oThis.SocketOpened = true;
        }
        else if(msgType == WS_EVENT_ONCLOSE){
            serverStarus.value = "连接关闭";
            if(oThis.SocketOpened == true)
                oThis.oSocketWS.WSConnect(oThis.config.LocalServer,oThis.config.LocalServerPort,0);
        }
        else if(msgType == WS_EVENT_ONERROR){
            if(oThis.SocketOpened == false)
                showLog("OnError");
        }
        else if(msgType == WS_EVENT_ONMESSAGE) {
        }
    },
    OnSimProtocol:function(msg) {
        if(this.oSocketWS.WSIsConnect()) {
            var sDirect = getSubString(msg,"",":");
            var sBody = getSubString(msg,":","");
            if(sDirect == "SenACP" || sDirect == "RecACP"){
                this.SendMessage(msg);
                showLog(msg+"\n");
            }
        }
        else{
            var sAgentID = getSubString(msg,"agentID=\"","\"");
            sAgentID = getSubString(sAgentID,"000010"+G_OSimulator.VccID,"");

            this.ObjSimulator.Log(sAgentID,msg);
        }
    },

    ConnectToSipServer:function(){
        if(this.SocketOpened)
            return;
        this.config.LocalServerPort = parseInt(serverPort.value);
        this.config.LocalServer = serverIP.value;
        this.oSocketWS.WSConnect(this.config.LocalServer,this.config.LocalServerPort,0);
    },

    GetAgentID:function(nOffSet){
        return parseInt(this.BeginAgentID)+nOffSet;
    },
    Close:function(){
        divError.style.display = "none";
    },
    DisplayError:function(agentID){
        var oAgentTD = this.ObjSimulator._GetAgentCtrlByID(agentID);
        if(oAgentTD != null){
            var spevent = window.event || arguments.callee.caller.arguments[0];
            divError.style.display = "block";
            divError.style.zIndex=100;
            divError.style.left = parseInt(spevent.clientX)+"px";
            divError.style.top = parseInt(spevent.clientY)+"px";
            TextareaInfo.value = oAgentTD.GetErrorCallString();
        }
    },
    DisplayDivSetting:function (nSelectIndex){
        if(nSelectIndex != 2){
            divCallIn.style.display = "none";
            divCallOut.style.display = "none";
            return;
        }
        if(this.CallType == CALLTYPE_CALLOUT) {
            divCallIn.style.display = "none";
            divCallOut.style.display = "block";
            IntervalTime.value = this.IntervalTime;
            outIdleTime.value = this.IdleTime;
            callOutCheck.checked = (this.ErrorStop==1) ?true:false;
            sipCheck.checked = (this.InlineSip==1) ?true:false;
            outMaxNum.value = this.MaxNum;
        }
        else{
            divCallIn.style.display = "block";
            divCallOut.style.display = "none";
            inIdleTime.value = this.IdleTime;
            callInCheck.checked = (this.ErrorStop==1) ?true:false;
            sipCheck.checked = (this.InlineSip==1) ?true:false;
            inMaxNum.value = this.MaxNum;
        }
    },

    OnCallTypeChange:function () {
        this.CallType = parseInt(oSIMType.options[oSIMType.options.selectedIndex].value);
        this.DisplayDivSetting(2);
    },
    OnSipCheck:function(){
        this.InlineSip = (sipCheck.checked)?1:0;
    },
    OnCallOutCheck:function(){
        this.ErrorStop = (divCallOut.checked)?1:0;
    },


    InitialAgentTable:function (){
        if(this.ObjSimulator != null){
            this.ObjSimulator.ReleaseTable();
            delete this.ObjSimulator;
            this.ObjSimulator = null;
        }
        if(this.ObjSimulator == null){
            this.ObjSimulator = new CAgentSimulator(1,60,1360,200);
        }
        this.Server = mainIP.value;
        this.VccID = vccID.value;
        this.BeginAgentID = agentID.value;
        this.Port = 5049;
        this.CtiXPath = "cti";
        this.Count = parseInt(count.value);
        if(this.CallType == CALLTYPE_CALLOUT){
            this.ErrorStop = (callOutCheck.checked)?1:0;
            this.InlineSip = (sipCheck.checked)?1:0;
            this.IntervalTime = parseInt(IntervalTime.value);
            this.IdleTime = parseInt(outIdleTime.value);
            this.MaxNum = parseInt(outMaxNum.value);
        }
        else{
            this.ErrorStop = (callInCheck.checked)?1:0;
            this.InlineSip = (sipCheck.checked)?1:0;
            this.IdleTime = parseInt(inIdleTime.value);
            this.MaxNum = parseInt(inMaxNum.value);
        }

        this.ObjSimulator.ReSetAgentTable();
    },
    AgentInitial:function (){
        if(this.ObjSimulator == null)
            return ;
        gLogType = VccBar_Log_Protocol;
        this.ObjSimulator.InitialAll();
    },
    AgentSetIdel:function (){
        if(this.ObjSimulator == null)
            return ;
        this.ObjSimulator.SetIdleAll();
    },
    AgentSetBusy:function (){
        if(this.ObjSimulator == null)
            return ;
        this.ObjSimulator.SetBusyAll();
    },
    AgentMakeCall:function (){
        if(this.ObjSimulator == null)
            return ;
        this.ObjSimulator.MakeCallAll(G_OSimulator.DestNum);
    },
    AgentUnitial:function (){
        if(this.ObjSimulator == null)
            return ;
        this.ObjSimulator.UnInitialAll();
    },
    AgentStop:function (){
        if(this.ObjSimulator == null)
            return ;
        this.ObjSimulator.StopAll();
    },

    SaveLog:function(agentID){
        if(this.ObjSimulator == null)
            return ;
        this.ObjSimulator.SaveLog(agentID);
    }

};

function CAgentTD(agentID,oParent){
    this.agentID = agentID;
    this.oJVccBar = null;
    this.oParent = oParent;
    this.agentTD = null;
    this.agentStatus = 0;
    this.oldagentStatus = 0;
    this.agentCommand = agentCommand_Null;
    this.agentCommandParam = "";
    this.tip = "";
    this.agentCommandInterval = 100;
    this.bContinue = true;
    this.callout = 0;
    this.errorcount = 0;
    this.currentcallID  = "";
    this._arrErrorCallID = new Array();
    this.oALog        = new CJVccLog();

    this._Create = function(){
        this.oJVccBar = new JVccBar(null);
        this.oJVccBar.oParent = this;
        this.oJVccBar.OnInitalSuccess = this.onOnInitalSuccess;
        this.oJVccBar.OnInitalFailure = this.onOnInitalFailure;
        this.oJVccBar.OnReportBtnStatus = this.onReportBtnStatus;
        this.oJVccBar.OnAgentWorkReport = this.onOnAgentWorkReport;
        this.oJVccBar.OnPrompt = this.onOnPrompt;
        this.oJVccBar.OnEventPrompt = this.onOnEventPrompt;
        this.oJVccBar.OnMethodResponseEvent = this.onOnMethodResponseEvent;
        this.oJVccBar.OnCallRing = this.onOnCallRing;
    }
    this._GetContinue = function(){
        var _bContinue = (G_OSimulator.MaxNum == 0) || (this.callout + this.errorcount < G_OSimulator.MaxNum-1);
        return (this.bContinue && _bContinue);
    }
    this.Initial = function() {
        this.oJVccBar.SetAttribute("MainIP", G_OSimulator.Server);  //MainIP
        this.oJVccBar.SetAttribute("MainPortID", G_OSimulator.Port);  //MainPort
        this.oJVccBar.SetAttribute("BackIP", G_OSimulator.Server);  //BackIP
        this.oJVccBar.SetAttribute("MonitorIP", G_OSimulator.Server);  //MonitorIP
        this.oJVccBar.SetAttribute("MonitorPort", G_OSimulator.Port);  //MainPort
        this.oJVccBar.SetAttribute("SipServerIP", G_OSimulator.Server);
        this.oJVccBar.SetAttribute("SipServerPort", G_OSimulator.Port);
        this.oJVccBar.SetAttribute("SipProtocol", "wss");
        this.oJVccBar.SetAttribute("PhonType", 2);  //0:内置坐席卡；1：内置Sip；2：外置其他终端 3：远程sip电话; 4：软交换前传号码; 5：yealink话机 6：agora
        this.oJVccBar.SetAttribute("AgentType", 1);
        this.oJVccBar.SetAttribute("SelfPrompt", 0);
        this.oJVccBar.SetAttribute("MediaFlag", G_OSimulator.VccID);
        this.oJVccBar.SetAttribute("AppType", 0);  //0:agent 1:monitor 2:agent+monitor
        this.oJVccBar.SetAttribute("PassWord", "111111");
        this.oJVccBar.SetAttribute("AgentID", "000010" + G_OSimulator.VccID + this.agentID);
        this.oJVccBar.SetAttribute("Dn", "000002" + G_OSimulator.VccID + this.agentID);
        this.oJVccBar.SetAttribute("SipXPath", "acd");
        this.oJVccBar.SetAttribute("CtiXPath", G_OSimulator.CtiXPath);
        this.oJVccBar.SetAttribute("SipPassWord", "00000000");
        this.oJVccBar.SetAttribute("ProtocolType", 1);

        if (G_OSimulator.Count == 1) {
            if (G_OSimulator.InlineSip == 1)
            {
                this.oJVccBar.SetAttribute("SipPassWord", G_OSimulator.SipPassword);
                this.oJVccBar.SetAttribute("PhonType", 1);
                g_consoleFlag = 1;
            }
        }
        this.oJVccBar.Initial();
    }
    this.UnInitial = function(){
        this.oJVccBar.UnInitial();
        if(this.agentStatus == 1){
            this.oParent.statics.busyNum--;
            this.oParent.DisplayStatics();
        }
        if(this.agentStatus == 2){
            this.oParent.statics.idleNum--;
            this.oParent.DisplayStatics();
        }
        this.UpdateAgentInfo("OnBarExit");
    }
    this.Release = function () {
        this.oJVccBar.UnInitial();
    }
    this.SetCmd = function(cmd,cmdParam,cmdTimerInterval){
        this.agentCommand = cmd;
        this.agentCommandParam = cmdParam;
        this.agentCommandInterval = cmdTimerInterval;
        console.info("cmd:"+cmd+" agentCommandInterval:"+cmdTimerInterval);
    }
    this.ExecuteCmd = function(){
        if(this.agentCommand == agentCommand_ReleaseCall){
            if(this.agentCommandInterval>0){
                this.agentCommandInterval = this.agentCommandInterval - TIMER_AgentInterval;
                if(this.agentCommandInterval<=0){
                    this.oJVccBar.Disconnect(0);
                }
            }
        }
        if(this.agentCommand == agentCommand_MakeCall){
            if(this.agentCommandInterval>0){
                this.agentCommandInterval = this.agentCommandInterval - TIMER_AgentInterval;
                if(this.agentCommandInterval<=0){
                    this.oJVccBar.MakeCall(this.agentCommandParam);
                }
            }
        }
        if(this.agentCommand == agentCommand_SetIdle){
            if(this.agentCommandInterval>0){
                this.agentCommandInterval = this.agentCommandInterval - TIMER_AgentInterval;
                if(this.agentCommandInterval<=0){
                    this.oJVccBar.SetIdle();
                }
            }
        }
    }

    this.GetTDInnerHtml = function(info){
        return stringFormat("<td id='TD_{0}' style='align:center;width:{1}px;background-color:{2}'><label style='font-size: x-small'>{3}【{4}】【{5}】</label></td>",
            this.agentID,G_OSimulator.config.agentWidth,G_OSimulator.config.agentColor[this.agentStatus],this.agentID,
            G_OSimulator.config.agentStatus[this.agentStatus],info);
    }
    this.onOnInitalFailure = function(code,description,descode){
        var oThis = this.oParent;
        oThis.UpdateAgentStatus();
        if(oThis.oldagentStatus != oThis.agentStatus){
            switch(oThis.oldagentStatus){
                case 0:
                    oThis.oParent.statics.nullNum--;
                    break;
                case 1:
                    oThis.oParent.statics.busyNum--;
                    break;
                case 2:
                    oThis.oParent.statics.idleNum--;
                    break;
                case 3:
                    oThis.oParent.statics.connectNum--;
                    break;
                case 4:
                    oThis.oParent.statics.workingAfterCallNum--;
                    break;
            }
            switch(oThis.agentStatus){
                case 0:
                    oThis.oParent.statics.nullNum++;
                    break;
                case 1:
                    oThis.oParent.statics.busyNum++;
                    break;
                case 2:
                    oThis.oParent.statics.idleNum++;
                    break;
                case 3:
                    oThis.oParent.statics.connectNum++;
                    break;
                case 4:
                    oThis.oParent.statics.workingAfterCallNum++;
                    break;
            }
            oThis.oldagentStatus = oThis.agentStatus;
            oThis.oParent.DisplayStatics();
        }

        oThis.UpdateAgentInfo("OnInitalFailure-"+descode);
    }
    this.onOnInitalSuccess = function () {
        var oThis = this.oParent;
        oThis.UpdateAgentStatus();
        if(oThis.oldagentStatus != oThis.agentStatus){
            switch(oThis.oldagentStatus){
                case 0:
                    oThis.oParent.statics.nullNum--;
                    break;
                case 1:
                    oThis.oParent.statics.busyNum--;
                    break;
                case 2:
                    oThis.oParent.statics.idleNum--;
                    break;
                case 3:
                    oThis.oParent.statics.connectNum--;
                    break;
                case 4:
                    oThis.oParent.statics.workingAfterCallNum--;
                    break;
            }
            switch(oThis.agentStatus){
                case 0:
                    oThis.oParent.statics.nullNum++;
                    break;
                case 1:
                    oThis.oParent.statics.busyNum++;
                    break;
                case 2:
                    oThis.oParent.statics.idleNum++;
                    break;
                case 3:
                    oThis.oParent.statics.connectNum++;
                    break;
                case 4:
                    oThis.oParent.statics.workingAfterCallNum++;
                    break;
            }
            oThis.oldagentStatus = oThis.agentStatus;
            oThis.oParent.DisplayStatics();
        }
        oThis.UpdateAgentInfo("OnInitalSuccess");
    }
    this.UpdateAgentInfo = function(tip){
        this.tip = tip;
        this.UpdateAgentStatus();
    }
    this.GetErrorCallString = function(){
        var sReturn = "";
        for(var i=0;i<this._arrErrorCallID.length;i++){
            if(i == 0)
                sReturn = this._arrErrorCallID[i];
            else
                sReturn = sReturn+" \n "+this._arrErrorCallID[i];
        }
        return sReturn;
    }
    this.GetErrorCallInfo = function(){
        if(this.errorcount == 0){
            return stringFormat("<label style='font-size: x-small'>{0}</label>",this.errorcount);
        }
        else {
            return stringFormat("<label style='font-size: x-small;cursor: pointer;text-decoration:underline' onclick=\"G_OSimulator.DisplayError('{0}');\">{1}</label>",this.agentID,this.errorcount);
        }
    }
    this.UpdateAgentStatus = function(){
        if(this.agentTD == null){
            this.agentTD = $$("TD_"+this.agentID);
        }
        this.agentStatus = this.oJVccBar.GetAgentStatus();
        if(this.agentStatus == -1) this.agentStatus = 0;
        this.agentTD.style.background = G_OSimulator.config.agentColor[this.agentStatus];
        this.agentTD.innerHTML = stringFormat("<label style='font-size: x-small;cursor: pointer;text-decoration:underline' onclick=\"G_OSimulator.SaveLog(\'{0}\')\">{0}({1}-{2}) 总({3})/通({4})/失({5})</label>",
                this.agentID,G_OSimulator.config.agentStatus[this.agentStatus],this.tip,G_OSimulator.MaxNum,this.callout,this.GetErrorCallInfo());
        this.agentTD.title = "最后消息时间:"+getAcpTimeString(true);
    }
    this.onReportBtnStatus = function(btnIDS){
        var oThis = this.oParent;
        oThis.UpdateAgentStatus();
        if(oThis.oldagentStatus != oThis.agentStatus){
            switch(oThis.oldagentStatus){
                case 0:
                    oThis.oParent.statics.nullNum--;
                    break;
                case 1:
                    oThis.oParent.statics.busyNum--;
                    break;
                case 2:
                    oThis.oParent.statics.idleNum--;
                    break;
                case 3:
                    oThis.oParent.statics.connectNum--;
                    break;
                case 4:
                    oThis.oParent.statics.workingAfterCallNum--;
                    break;
            }
            switch(oThis.agentStatus){
                case 0:
                    oThis.oParent.statics.nullNum++;
                    break;
                case 1:
                    oThis.oParent.statics.busyNum++;
                    break;
                case 2:
                    oThis.oParent.statics.idleNum++;
                    break;
                case 3:
                    oThis.oParent.statics.connectNum++;
                    break;
                case 4:
                    oThis.oParent.statics.workingAfterCallNum++;
                    break;
            }
            oThis.oldagentStatus = oThis.agentStatus;
            oThis.oParent.DisplayStatics();
        }
    }
    this.onOnAgentWorkReport=function(workStatus,description){
        var oThis = this.oParent;
        switch(parseInt(workStatus) ){
            case emPhoneAlerting:
                oThis.UpdateAgentInfo("座席振铃");
                break;
            case emPhoneOnCalloutMid:
                oThis.UpdateAgentInfo("对方振铃");
                break;
            case emPhoneOnLineCallout:
                oThis.UpdateAgentInfo("呼出接通");
                if(G_OSimulator.CallType == CALLTYPE_CALLOUT){
                    oThis.SetCmd(agentCommand_ReleaseCall,"",G_OSimulator.IntervalTime*1000);
                }
                break;
            case emPhoneOnLineOutBusy:
                var __bContinue = oThis._GetContinue();
                var sDes = "后处理状态";
                if(G_OSimulator.CallType == CALLTYPE_CALLOUT){
                    if(oThis.tip == "呼出接通"){
                        oThis.callout++;
                        oThis.oParent.statics.connectCount++;
                    }
                    else{
                        oThis.errorcount++;
                        oThis.oParent.statics.failureCount++;
                        oThis._arrErrorCallID.push(oThis.currentcallID);
                        __bContinue = __bContinue && (G_OSimulator.ErrorStop != 1);
                        if(__bContinue == false){
                            sDes="呼出错误";
                        }
                    }
                    oThis.oParent.DisplayStatics();
                    if(__bContinue){
                        sDes="呼出>>"+G_OSimulator.IdleTime;
                        oThis.SetCmd(agentCommand_MakeCall,G_OSimulator.DestNum,G_OSimulator.IdleTime*1000);
                    }
                }
                if(G_OSimulator.CallType == CALLTYPE_CALLIN){
                    if(oThis.tip == "呼入接通")
                    {
                        oThis.callout++;
                        oThis.oParent.statics.connectCount++;
                    }
                    else{
                        oThis.errorcount++;
                        oThis.oParent.statics.failureCount++;
                        oThis._arrErrorCallID.push(oThis.currentcallID);
                        __bContinue = __bContinue && (G_OSimulator.ErrorStop != 1);
                        if(__bContinue == false){
                            sDes="呼入错误";
                        }
                    }
                    oThis.oParent.DisplayStatics();
                    if(__bContinue) {
                        oThis.SetCmd(agentCommand_SetIdle, "", G_OSimulator.IdleTime * 1000);
                        sDes="呼入>>"+G_OSimulator.IdleTime;
                    }
                }
                oThis.UpdateAgentInfo(sDes);
                break;
            case emPhoneOnLineIVR:
                oThis.UpdateAgentInfo("呼入接通");
                break;
        }
    }
    this.onOnPrompt = function (code,description){
        //var oThis = this.oParent;
        //console.info("##"+getAcpTimeString(true)+":OnPrompt(code:"+code+" des:"+description+")");
    }
    this.onOnEventPrompt = function (code,description) {
        var oThis = this.oParent;
        //console.info("##"+getAcpTimeString(true)+":OnEventPrompt(code:"+code+" des:"+description+")");
        // code:30 des:408
        if(code == 30){
            //oThis.UpdateAgentInfo("AnswerFailure("+description+")");
        }
    }
    this.onOnMethodResponseEvent = function(cmdName,param){
        //console.info("OnMethodResponseEvent(cmdName:"+cmdName+" param:"+param+")");
        var oThis = this.oParent;
        var bUpdateStatics = false;
        if(cmdName == "SetIdle"){
            if(param == "0"){
                oThis.UpdateAgentInfo("SetIdleSucceed");
            }
            else
                oThis.UpdateAgentInfo("SetIdleFailure");
        }
        else if(cmdName == "SetBusy") {
            if(param == "0"){
                oThis.UpdateAgentInfo("SetBusySucceed");
            }
            else{
                oThis.UpdateAgentInfo("SetBusySucceed");
            }
        }
    }
    this.onOnCallRing = function(CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,fileName,networkInfo,queueTime,opAgentID,ringTimer,projectID) {
        this.oParent.currentcallID = CallID;
    }
    this.InsertLog = function(str){
        this.oALog.Insert(str);
    }
    this.GetLogText = function (bDel) {
        return this.oALog.GetLogText(bDel);
    }
    this.SaveLog = function(strFileName) {
        var strText = this.GetLogText(true);
        var blob = new Blob([strText], {type: "text/plain;charset=utf-8"});
        saveFileAs(blob, strFileName);
    }

    this._Create();
    return this;
}

function CAgentSimulator(nLeft,nTop,nWidth,nHeight){
    this.left			= nLeft;
    this.top			= nTop;
    this.width			= nWidth;
    this.height			= nHeight;
    this._window = window;
    this._oSimulatotShow = null;
    this._MainFrame = null;
    this._oStatics = null;

    this._arrAgent = new Array();
    this._arrTimeStack = new Array();
    this._initIndex = -1;
    this._oTimer = null;
    this.statics = {
        nullNum:0,
        idleNum:0,
        busyNum:0,
        connectNum:0,
        workingAfterCallNum:0,
        connectCount:0,
        failureCount:0
    };

    this._CreateTable = function(){
        this._oSimulatotShow = this._window.document.createElement("DIV");
        this._oSimulatotShow.style.cursor = "default";
        this._oSimulatotShow.style.position = "absolute";
        this._oSimulatotShow.style.border = "0px solid #97CBFF";
        this._oSimulatotShow.style.background =  "#ffffff";
        this._oSimulatotShow.style.left = this.left+"px";
        this._oSimulatotShow.style.top = this.top+"px";
        this._oSimulatotShow.style.width = this.width+"px";
        this._oSimulatotShow.style.height = this.height+"px";
        this._oSimulatotShow.style.textAlign = "center";
        this._oSimulatotShow.style.fontSize = "10px";
        this._oSimulatotShow.id = "idSimlator";
        this._window.document.body.appendChild(this._oSimulatotShow);

        this._oTimer   = new JcmTimerEx(50);
        this._oTimer.Start();
    }
    this.ReleaseTable = function(){
        this._window.document.body.removeChild(this._oSimulatotShow);
        this._oTimer.KillAllTimer();
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrAgent[i].Release();
        }
        arrayEmpty(this._arrAgent);
    }
    this._getMSLHtml = function(){
        var sText = "";
        sText = "<TABLE style='BORDER-COLLAPSE: collapse;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0' >";
        sText = sText + "<tr height='30' ><td align='left'><label style='font-size: x-small'>大呼测试【"+((G_OSimulator.CallType==1)?"呼出":"呼入")+"】:</label><label id='idLabelStatics' style='font-size: x-small'></label></td></tr>";
        sText = sText + "<tr ><td >";
        sText += "<div id='idMainFrame' style='width:100%;height:"+(this.height-34)+"px;word-wrap:break-word;word-break:break-all;top:0px; '></div>";
        sText = sText + "</TABLE>";
        return 	sText;
    }
    this._GetAgentCtrlByID = function(id){
        for(var i=0;i<this._arrAgent.length;i++){
            if(this._arrAgent[i].agentID == id)
                return this._arrAgent[i];
        }
        return null;
    }
    this._ReNewAgentInfo = function(){
        this._oTimer.KillAllTimer();
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrAgent[i].Release();
        }
        arrayEmpty(this._arrAgent);
        for (var i=0;i<G_OSimulator.Count;i++){
            var oAgenCtrl = new CAgentTD(G_OSimulator.GetAgentID(i),this);
            this._arrAgent.push(oAgenCtrl);
        }
        this._oTimer.SetTimer(lTimerInitAgentTimerID,TIMER_AgentInterval/50,this._OnMonitorTimerEvent,this);
        this._oTimer.SetTimer(lTimerStackTimerID,TIMER_AgentInterval,this._OnMonitorTimerEvent,this);
    }
    this._GetTableItem = function(index){
        var oAgenCtrl = this._arrAgent[index];
        if(oAgenCtrl != null)
            return oAgenCtrl.GetTDInnerHtml("");
    }
    this._InitAgentTable = function(){
        this._ReNewAgentInfo();
        var sText = "";
        var nCol = parseInt(this.width/G_OSimulator.config.agentWidth);
        sText = "<TABLE style='BORDER-COLLAPSE: collapse;' cellSpacing='0' cellPadding='2' width='100%' border='2' ID='MainTable'>";
        for(var i= 0;i<G_OSimulator.Count;i++){
            if(i==0 || i%nCol == 0){
                sText = sText + "<tr height='"+G_OSimulator.config.agentHeight+"' >";
                sText = sText + this._GetTableItem(i);
            }
            else if( (i+1)%nCol == 0){
                sText = sText + this._GetTableItem(i);
                sText = sText + "</tr>";
            }
            else{
                sText = sText + this._GetTableItem(i);
            }
        }
        sText = sText + "</TABLE>";
        return 	sText;
    }
    this._OnMonitorTimerEvent = function(id,oThis) {
        if(id == lTimerStackTimerID){
            if(oThis._arrTimeStack.length>0){
                var sParam =  oThis._arrTimeStack[0];
                oThis._arrTimeStack.splice(0,1);
                arrParam = sParam.split("|");
                var index = parseInt(arrParam[1]);
                var cmdIndex = parseInt(arrParam[0]);

                if(cmdIndex == agentCommand_Initial){
                    oThis._arrAgent[index].Initial()
                }
                else if(cmdIndex == agentCommand_UnInitial){
                    oThis._arrAgent[index].UnInitial();
                }
                else if(cmdIndex == agentCommand_SetIdle){
                    oThis._arrAgent[index].oJVccBar.SetIdle();
                }
                else if(cmdIndex == agentCommand_SetBusy){
                    oThis._arrAgent[index].oJVccBar.SetBusy(0);
                }
                else if(cmdIndex == agentCommand_MakeCall){
                    oThis._arrAgent[index].oJVccBar.MakeCall(arrParam[2]);
                }
            }
        }
        if(id == lTimerInitAgentTimerID){
            oThis._initIndex++;
            if(oThis._initIndex>=0 && oThis._initIndex<oThis._arrAgent.length){
                oThis._oTimer.SetTimer(oThis._initIndex,TIMER_AgentInterval,oThis._OnMonitorTimerEvent,oThis._arrAgent[oThis._initIndex]);
                oThis._arrAgent[oThis._initIndex].UpdateAgentInfo("就绪");
            }
            else{
                oThis._oTimer.KillTimer(id);
            }
        }
        if(id>=0 && id< G_OSimulator.Count){
            oThis.ExecuteCmd();
        }
    }

    this.ReSetAgentTable = function(){
        this._oSimulatotShow.innerHTML = this._getMSLHtml();
        this._MainFrame = $$("idMainFrame");
        this._oStatics = $$("idLabelStatics");
        this._MainFrame.innerHTML = this._InitAgentTable();
        this.statics.nullNum = G_OSimulator.Count;
        this.DisplayStatics();
    }
    this.InitialAll = function(){
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrTimeStack.push(stringFormat("{0}|{1}|{2}",agentCommand_Initial,i,""));
        }
    }
    this.SetIdleAll = function(){
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrTimeStack.push(stringFormat("{0}|{1}|{2}",agentCommand_SetIdle,i,""));
        }
    }
    this.SetBusyAll = function(){
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrTimeStack.push(stringFormat("{0}|{1}|{2}",agentCommand_SetBusy,i,""));
        }
    }
    this.MakeCallAll = function(destNum){
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrTimeStack.push(stringFormat("{0}|{1}|{2}",agentCommand_MakeCall,i,destNum));
        }
    }
    this.UnInitialAll = function(){
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrTimeStack.push(stringFormat("{0}|{1}|{2}",agentCommand_UnInitial,i,""));
        }
    }
    this.StopAll = function(){
        for(var i=0;i<this._arrAgent.length;i++){
            this._arrAgent[i].bContinue = false;
        }
    }
    this.Log = function(agentID,strMsg){
        var oAgentTD = this._GetAgentCtrlByID(agentID);
        if(oAgentTD != null) {
            oAgentTD.InsertLog(strMsg);
        }
    }
    this.SaveLog = function(agentID){
        var oAgentTD = this._GetAgentCtrlByID(agentID);
        if(oAgentTD != null) {
            oAgentTD.SaveLog("simulator_pure_"+agentID+".txt");
        }
    }

    this.DisplayStatics = function(){
        this._oStatics.innerHTML = stringFormat("座席总数:【{0}】 呼叫数:{1} 未登录数:{2} 空闲数:{3} 忙碌数:{4} 后处理数:{5} 呼叫总数:{6} 失败总数:{7}",
            this._arrAgent.length,this.statics.connectNum,this.statics.nullNum,this.statics.idleNum,
            this.statics.busyNum,this.statics.workingAfterCallNum,this.statics.connectCount,this.statics.failureCount);
    }

    this._CreateTable();
    return this;
}


