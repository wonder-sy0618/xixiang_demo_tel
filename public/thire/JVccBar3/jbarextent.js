//  *****************************************************************************
//  文 件 名：  jbarextent.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		 调用电话条的辅助函数
//  说    明：
//		 调用电话条的辅助函数
//  修改说明：
// *****************************************************************************

var g_msgseq = -1;
///////////////////////////////////////////////////
// 辅助函数
///////////////////////////////////////////////////

window.onunload = window_onunload;
function window_onunload() {
    applicationUnLoad();
}
function setVccBarOnEvent(){
    application.oJVccBar.On({
        OnCallRing : onOnCallRing,
        AnswerCall : onOnAnswerCall,
        OnCallEnd : onOnCallEnd,
        //18
        OnPrompt : onOnPrompt,
        OnReportBtnStatus : onReportBtnStatus,
        OnInitalSuccess : onOnInitalSuccess,
        OnInitalFailure : onOnInitalFailure,
        OnEventPrompt : onOnEventPrompt,
        OnAgentWorkReport : onOnAgentWorkReport,
        OnCallDataChanged : onOnCallDataChanged,
        OnBarExit : onOnBarExit,
        OnCallQueueQuery : onOnCallQueueQuery,
        OnQueryGroupAgentStatus : onOnQueryGroupAgentStatus,
        OnSystemMessage  : onOnSystemMessage,
        OnRecvWeiboMsg : onOnRecvWeiboMsg,
        OnIMMessage : onOnIMMessage,
        OnWorkStaticInfoReport : onOnWorkStaticInfoReport,
        OnQuerySPGroupList : onOnQuerySPGroupList,
        OnUpdateVideoWindow : onOnUpdateVideoWindow,
        OnSessionMessage : onOnSessionMessage,
        OnRtpStatics : onOnRtpStatics,
        OnMethodResponseEvent: onOnMethodResponseEvent,

        //14
        OnAgentReport : onOnAgentReport,
        OnTelReport : onOnTelReport,
        OnServiceReport : onOnServiceReport,
        OnIvrReport : onOnIvrReport,
        OnTaskReport : onOnTaskReport,
        OnOutboundReport : onOnOutboundReport,
        OnCallReportInfo : onOnCallReportInfo,
        OnQueueReport : onOnQueueReport,
        OnQueryMonitorSumReport : onOnQueryMonitorSumReport,
        OnWallServiceReport : onOnWallServiceReport,
        OnWallQueueReport : onOnWallQueueReport,
        OnServiceStaticReport : onOnServiceStaticReport,
        OnAgentStaticReport : onOnAgentStaticReport,
        OnAgentBusyReason : onOnAgentBusyReason,
        OnAgentLogUpload  : onOnAgentLogUpload,
        OnAsrEventReport  : onOnAsrEventReport,
        OnStopSmSuccess   : onOnStopSmSuccess,
        OnUpdateMediaEvent   : onOnUpdateMediaEvent,
        OnStopCaptureSuccess   : onOnStopCaptureSuccess,
        OnCallCdrReport   : onOnCallCdrReport,

        OnAgentStatusTimeChange: function(status, text, timer){}
    });

    if(application.oJBarDisplayer != null)
        application.oJBarDisplayer.show(1);

    showLog(application.oBrowserSys.expression+"\r\nevent bindType:[on]\r\n\r\n");
    displayCtrl();
    application.OnDebug = onOnDebug;
    LoadDefaultParam();
}

//创建对象成功，绑定电话条事件
function setVccBarEvent(){
    //3
	application.oJVccBar.OnCallRing = onOnCallRing;
	application.oJVccBar.AnswerCall = onOnAnswerCall;
	application.oJVccBar.OnCallEnd = onOnCallEnd;
	//18
	application.oJVccBar.OnPrompt = onOnPrompt;
	application.oJVccBar.OnReportBtnStatus = onReportBtnStatus;
	application.oJVccBar.OnInitalSuccess = onOnInitalSuccess;
	application.oJVccBar.OnInitalFailure = onOnInitalFailure;
	application.oJVccBar.OnEventPrompt = onOnEventPrompt;
	application.oJVccBar.OnAgentWorkReport = onOnAgentWorkReport;
	application.oJVccBar.OnCallDataChanged = onOnCallDataChanged;
	application.oJVccBar.OnBarExit = onOnBarExit;
    application.oJVccBar.OnCallQueueQuery = onOnCallQueueQuery;
	application.oJVccBar.OnQueryGroupAgentStatus = onOnQueryGroupAgentStatus;
	application.oJVccBar.OnSystemMessage  = onOnSystemMessage;
	application.oJVccBar.OnRecvWeiboMsg = onOnRecvWeiboMsg;
	application.oJVccBar.OnIMMessage = onOnIMMessage
	application.oJVccBar.OnWorkStaticInfoReport = onOnWorkStaticInfoReport;
    application.oJVccBar.OnQuerySPGroupList = onOnQuerySPGroupList;
    application.oJVccBar.OnUpdateVideoWindow = onOnUpdateVideoWindow;
    application.oJVccBar.OnSessionMessage = onOnSessionMessage;
    application.oJVccBar.OnRtpStatics = onOnRtpStatics;

	//14	
	application.oJVccBar.OnAgentReport = onOnAgentReport;
	application.oJVccBar.OnTelReport = onOnTelReport;
	application.oJVccBar.OnServiceReport = onOnServiceReport;
	application.oJVccBar.OnIvrReport = onOnIvrReport;
	application.oJVccBar.OnTaskReport = onOnTaskReport;
	application.oJVccBar.OnOutboundReport = onOnOutboundReport;
	application.oJVccBar.OnCallReportInfo = onOnCallReportInfo;
	application.oJVccBar.OnQueueReport = onOnQueueReport;
	application.oJVccBar.OnQueryMonitorSumReport = onOnQueryMonitorSumReport;
	application.oJVccBar.OnWallServiceReport = onOnWallServiceReport;
	application.oJVccBar.OnWallQueueReport = onOnWallQueueReport;
	application.oJVccBar.OnServiceStaticReport = onOnServiceStaticReport;
	application.oJVccBar.OnAgentStaticReport = onOnAgentStaticReport;
    application.oJVccBar.OnAgentBusyReason = onOnAgentBusyReason;
    application.oJVccBar.OnAgentLogUpload  = onOnAgentLogUpload;
    application.oJVccBar.OnAsrEventReport  = onOnAsrEventReport;
    application.oJVccBar.OnStopSmSuccess   = onOnStopSmSuccess;
    application.oJVccBar.OnUpdateMediaEvent = onOnUpdateMediaEvent;
    application.oJVccBar.OnCallCdrReport   = onOnCallCdrReport;

    showLog(application.oBrowserSys.expression+"\r\n\r\n");
	
    application.oWechatManager.OnBeginSession = OnBeginSession;
    application.oWechatManager.OnEndSession = OnEndSession;
    application.oWechatManager.OnRecvMessage = OnRecvMessage;
    application.oWechatManager.OnSendMessageReport = OnSendMessageReport;
    application.oWechatManager.OnUploadFileStatus = OnUploadFileStatus;
    application.oWechatManager.OnDowndFileStatus = OnDowndFileStatus;
	
	application.oJVccBar.OnMethodResponseEvent = onOnMethodResponseEvent;
	if(application.oJBarDisplayer != null)
        application.oJBarDisplayer.show(1);

    displayCtrl();
    application.OnDebug = onOnDebug;
    //LoadDefaultParam();
}

function g(sname){
    return application.oJVccBar.GetAttribute(sname);
}
function setElementValue (id,sValue) {
    if(typeof(sValue) == "undefined") sValue = "";
    var oE = $$(id);
    if(oE)
        oE.value = sValue;
}
function setSelectSelected (id,nValue) {
    var oS = $$(id);
    if(oS){
        var options = oS.children;
        options[nValue].selected=true;
    }
}
function SaveDefaultParam(){
    var shortAgentID = getSubString(g("AgentID"),"000010"+g("MediaFlag"),"");
    var agentParam = stringFormat("{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|{10}|{11}|{12}",
        g("MainIP"),g("MediaFlag"),shortAgentID,g("SipServerPort"),g("SipPassWord"),g("SipXPath"),
        g("MainPortID"),g("MonitorPort"),g("AppType"),g("PhonType"),g("ProtocolType"),g("TransportType"),GetBase64FromGBK(g("PassWord")));
    setCookie("agentMonitorParam",agentParam,365);
}
function LoadDefaultParam(){
    if(!IsCookiesUsed()) return ;
    var agentParam = getCookie("agentMonitorParam");
    if(agentParam == "") return;
    showLog("LoadCFG:"+agentParam);
    var oParam = agentParam.split("|");
    setElementValue("mainIP",oParam[0]);
    setElementValue("vccID",oParam[1]);
    setElementValue("agentID",oParam[2]);
    setElementValue("sipPort",oParam[3]);
    setElementValue("sipPassword",oParam[4]);
    setElementValue("sipXPath",oParam[5]);
    setElementValue("ctiPort",oParam[6]);
    setElementValue("monitorPort",oParam[7]);
    setElementValue("mainPort",oParam[6]);

    setSelectSelected("oAppType",parseInt(oParam[8]));
    setSelectSelected("oPhoneType",parseInt(oParam[9])-1);
    setSelectSelected("oProtocolType",parseInt(oParam[10]));
    setSelectSelected("oTransportType",parseInt(oParam[11]));
    setElementValue("agnetPassword",GetGBKFromBase64(oParam[12]));
}

////////////////////////--辅助函数---////////////////////////////
function IsCheckBoxSelected(id){
    var oCheckBox = document.getElementById(id);
    if(oCheckBox){
        if(oCheckBox.checked == true){
            return true;
        }
    }
    return false;
}
function SetLogType(){
    var TempLogFlag = 0;
    if(IsCheckBoxSelected("log_error"))
        TempLogFlag = TempLogFlag|1;
    if(IsCheckBoxSelected("log_warn"))
        TempLogFlag = TempLogFlag|2;
    if(IsCheckBoxSelected("log_info"))
        TempLogFlag = TempLogFlag|4;
    if(IsCheckBoxSelected("log_debug"))
        TempLogFlag = TempLogFlag|8;
    if(IsCheckBoxSelected("log_protocal"))
        TempLogFlag = TempLogFlag|16;
    var ConsoleLogFlag = 0;
    if(IsCheckBoxSelected("log_console"))
        ConsoleLogFlag = 1;
    application.DislayLog(TempLogFlag,ConsoleLogFlag);
}

function displayCtrl(){
  
    if( getLocalLanguage() != lg_zhcn )
    {
      showLog("the vccbar is 【PureJS】 version!\r\n");
      showLog("init success,Version:"+application.oJVccBar.GetVersion()+"\r\n");
    }
    else
    {
      showLog("当前使用【PureJS】版本电话条!\r\n");
      showLog("初始化就绪,版本号码:"+application.oJVccBar.GetVersion()+"\r\n");
    }
}

function showLog(Text) {
    var oTextareaInfo= document.getElementById("TextareaInfo");
    if(oTextareaInfo != null)
	    oTextareaInfo.value = oTextareaInfo.value + Text;
    //application.Info(Text);
}
function emptyLog() {
    var oTextareaInfo= document.getElementById("TextareaInfo");
    if(oTextareaInfo != null)
        oTextareaInfo.value = "";
}
function onOnDebug(Text){
    showLog(Text+"\r\n");
}

///////////////////////////////////////////////////
// 电话条重载事件函数
///////////////////////////////////////////////////

//呼叫事件
function onOnCallRing(CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,fileName,networkInfo,queueTime,opAgentID,ringTimer,projectID, accessArea,taskName,cityName) {
    showLog("【OnCallRing】：\r\n");
    showLog("         CallingNo：【"+CallingNo+"】\r\n");
    showLog("         CalledNo：【"+CalledNo+"】\r\n");
    showLog("         OrgCalledNo：【"+OrgCalledNo+"】\r\n");
    showLog("         CallData：【"+CallData+"】\r\n");
    showLog("         CallID ：【"+CallID+"】\r\n");
    showLog("         SerialID ：【"+SerialID+"】\r\n");
    showLog("         ServiceDirect ：【"+ServiceDirect+"】\r\n");
    showLog("         UserParam ：【"+UserParam+"】\r\n");
    showLog("         TaskID ：【"+TaskID+"】\r\n");
    showLog("         UserDn ：【"+UserDn+"】\r\n");
    showLog("         AgentDn ：【"+AgentDn+"】\r\n");
    showLog("         AreaCode ：【"+AreaCode+"】\r\n");
    showLog("         fileName ：【"+fileName+"】\r\n");
    showLog("         networkInfo：【"+networkInfo+"】\r\n");
    showLog("         queueTime ：【"+queueTime+"】\r\n");
    showLog("         opAgenID ：【"+opAgentID+"】\r\n");
    showLog("         ringTimer ：【"+ringTimer+"】\r\n");
    showLog("         projectID ：【"+projectID+"】\r\n");
	showLog("         accessArea ：【"+accessArea+"】\r\n");
    showLog("         taskName ：【"+taskName+"】\r\n");
    showLog("         cityName ：【"+cityName+"】\r\n");
    showLog(" *******************************************************************\r\n");
    if( application.oJBarDisplayer != null) {
        application.oJBarDisplayer.SetRingFlag(1);
    }
    if(application.oVccBarAssist.oBarAgentStatus != null) {
        application.oVccBarAssist.oBarAgentStatus.SetRingFlag(true);
    }
}
function onOnAnswerCall(UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID,AV,TC) {
    showLog(" 【OnAnswerCall】:\r\n");
    showLog("         AnswerTime ：【"+AnswerTime+"】\r\n");
    showLog("        UserNo ：【"+UserNo+"】\r\n");
    showLog("        CallID ：【"+CallID+"】\r\n");
    showLog("        SerialID ：【"+SerialID+"】\r\n");
    showLog("        ServiceDirect ：【"+ServiceDirect+"】\r\n");
    showLog("        UserParam ：【"+UserParam+"】\r\n");
    showLog("        TaskID ：【"+TaskID+"】\r\n");
    showLog("        AV ：【"+AV+"】\r\n");
    showLog("        TC ：【"+TC+"】\r\n");
    showLog(" *******************************************************************\r\n");
    if( application.oJBarDisplayer != null)
    {
        application.oJBarDisplayer.SetRingFlag(0);
    }
    if(application.oVccBarAssist.oBarAgentStatus != null) {
        application.oVccBarAssist.oBarAgentStatus.SetRingFlag(false);
    }
}

function onOnCallEnd(callID,serialID,serviceDirect,userNo,bgnTime,endTime,agentAlertTime,userAlertTime,fileName,directory,disconnectType,userParam,taskID,serverName,networkInfo) {
    showLog(" 【OnCallEnd】:\r\n");
    showLog("         fileName   ：【"+fileName+"】\r\n");
    showLog("         directory：【"+directory+"】\r\n");
    showLog("         bgnTime  ：【"+bgnTime+"】\r\n");
    showLog("         endTime  ：【"+endTime+"】\r\n");
    showLog("         userNo ：【"+userNo+"】\r\n");
    showLog("         CallID   ：【"+callID+"】\r\n");
    showLog("         SerialID ：【"+serialID+"】\r\n");
    showLog("         ServiceDirect  ：【"+serviceDirect+"】\r\n");
    showLog("         userAlertTime  ：【"+userAlertTime+"】\r\n");
    showLog("         agentAlertTime ：【"+agentAlertTime+"】\r\n");
    showLog("         fileName      ：【"+fileName+"】\r\n");
    showLog("         directory      ：【"+directory+"】\r\n");
    showLog("         disconnectType      ：【"+disconnectType+"】\r\n");
    showLog("         userParam      ：【"+userParam+"】\r\n");
    showLog("         taskID         ：【"+taskID+"】\r\n");
    showLog("         serverName         ：【"+serverName+"】\r\n");
    showLog("         networkInfo         ：【"+networkInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
    if( application.oJBarDisplayer != null)
    {
        application.oJBarDisplayer.SetRingFlag(0);
    }
    if(application.oVccBarAssist.oBarAgentStatus != null) {
        application.oVccBarAssist.oBarAgentStatus.SetRingFlag(false);
    }
    $('ul li').css('background','LightSlateGray');
    if(Tdelay != null)
        Tdelay.innerHTML  = "延时:0ms";
}

//提示事件	
function onOnPrompt(code,description) {
    if(application.oJVccBar.GetAttribute("SelfPrompt") == 1 &&  application.oJBarDisplayer != null)
    {
        application.oJBarDisplayer.ShowSelfPrompt(code,description);
    }
    showLog("【OnPrompt】：\r\n");
    showLog(" code:【"+code+"】 description:【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onReportBtnStatus(btnIDS) {
    if(application.oVccBarAssist.oBarBtnControl != null){
        application.oVccBarAssist.oBarBtnControl.UpdateUI(btnIDS);
    }
    if(application.oVccBarAssist.oBarAgentStatus != null) {
       application.oVccBarAssist.oBarAgentStatus.SetAgentStatus(application.oJVccBar.GetAgentStatus());
    }
    if( application.oJBarDisplayer != null){
        application.oJBarDisplayer.ChangeBtnStatus(btnIDS);
        application.oJBarDisplayer.SetAgentStatus(application.oJVccBar.GetAgentStatus());
    }

    showLog("【ReportBtnStatus】：\r\n");
    var agentStatus = application.oJVccBar.GetAgentStatus();
    if(agentStatus == 1){
        if( getLocalLanguage() != lg_zhcn )
            agentStatus = agentStatus + " agent subStatus:【"+application.oJVccBar.GetAgentSubBusyStatus()+"】";
        else
            agentStatus = agentStatus + " 子状态:【"+application.oJVccBar.GetAgentSubBusyStatus()+"】";
    }
    if( getLocalLanguage() != lg_zhcn )
        showLog("         usefull ids  ：【"+btnIDS+"】\r\n agent status：【"+agentStatus+"】\r\n");
    else
        showLog("         可现状态值   ：【"+btnIDS+"】\r\n 当前座席状态：【"+agentStatus+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnEventPrompt(code,description) {
    showLog("【OnEventPrompt】：");
    showLog(" code:【"+code+"】 description:【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}  
function onOnInitalSuccess() {
    if(application.oVccBarAssist.oBarAgentStatus != null) {
        application.oVccBarAssist.oBarAgentStatus.SetSubBusyStatus(application.oJVccBar.GetBusySubStatus());
    }
    if( application.oJBarDisplayer != null)
        application.oJBarDisplayer.SetSubBusyStatus(application.oJVccBar.GetBusySubStatus());
    showLog("【OnInitalSuccess】\r\n ");
    if( getLocalLanguage() != lg_zhcn )
        showLog("        used phoneType:【"+application.oJVccBar.GetAttribute("PhonType")+"】\r\n        PhonType : 1：inside sipphone 2：outer device；3：remote sipphone;4：soft switch pretransfer;5：yealink phone\r\n");
    else
        showLog("        当时使用phoneType:【"+application.oJVccBar.GetAttribute("PhonType")+"】\r\n      PhonType : 1：内置Sip电话 2：外置其他终端；3：远程sip电话;4：软交换前传号码;5：yealink话机\r\n");
    showLog(" exitCause:" + application.oJVccBar.GetExitCause() + "\r\n ");
    showLog(" AgentName:" + application.oJVccBar.GetAttribute("AgentName") + "\r\n ");
    showLog(" Av:" + application.oJVccBar.GetAttribute("Av") + "\r\n ");
	    if(application.oJVccBar.GetAttribute("CurUseServer") == 1)
        showLog(" current server:主服务器\r\n ");
    else
        showLog(" current server:备服务器\r\n ");
    showLog(" *******************************************************************\r\n");
    SaveDefaultParam();
}

function InitMonitorData(){
    if (application.oJMonitorData != null) {
        setTimeout(function(){application.oJMonitorData.Initial();showLog("【初始化监控】\r\n");}, 3*1000);
    }
}
function onOnInitalFailure(code,description,descode) {
    showLog("【OnInitalFailure】\r\n 【"+code+"】 【"+description+"】【"+descode+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnBarExit(code,description) {
    showLog("【OnBarExit】 \r\n【"+code+"】 【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentWorkReport(workStatus,description) {
    if(workStatus == "-1") {
        if( application.oJBarDisplayer != null)
            application.oJBarDisplayer.SetSubBusyStatus("");
    }

    if( getLocalLanguage() != lg_zhcn )
        showLog("【OnAgentWorkReport】 sceneid：【"+workStatus+"】 scene description：【"+description+"】\r\n");
    else
        showLog("【OnAgentWorkReport】 场景编号：【"+workStatus+"】 场景描述：【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnCallDataChanged(callData) {
    showLog("【OnCallDataChanged】：\r\n【"+callData+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnCallQueueQuery(QueueInfo) {
    showLog("【OnCallQueueQuery】：\r\n param:【"+QueueInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQueryGroupAgentStatus(QueryInfo,type) {
    showLog("【OnQueryGroupAgentStatus】：\r\n param:【"+QueryInfo+"】\r\n type:【"+type+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnSystemMessage(code,description) {
    showLog("【OnSystemMessage】：\r\n");
    showLog(" code:【"+code+"】 description:【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}

//监控事件
function onOnAgentReport(AgentReportInfo) {
    showLog("【OnAgentReport】：\r\n param：【"+AgentReportInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnIvrReport(IvrReportInfo) {
    showLog("【OnIvrReport】：\r\n"+IvrReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnTelReport(TelReportInfo) {
    showLog("【OnTelReport】：\r\n"+TelReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnServiceReport(ServiceReportInfo) {
    showLog("【OnServiceReport】(\r\n"+ServiceReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnTaskReport(TaskReportInfo) {
    showLog("【OnTaskReport】\r\n"+TaskReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnOutboundReport(TaskInfo) {
    showLog("【OnOutboundReport】\r\n param：【"+TaskInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");

}
function onOnCallReportInfo(CallInfo) {
    showLog("【OnCallReportInfo】\r\n param：【"+CallInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQueueReport(QueueInfo) {
    showLog("【OnQueueReport】：\r\n"+QueueInfo+"\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQueryMonitorSumReport(cmdName,reportInfo) {
    showLog("【OnQueryMonitorSumReport】\r\n name:【"+cmdName+"】\r\n reportInfo:【"+reportInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnWallServiceReport(message) {
    showLog("【OnWallServiceReport】\r\n  【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnWallQueueReport(message){
    showLog("【OnWallQueueReport】\r\n 【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnWorkStaticInfoReport(message) {
    return;
    showLog("【OnWorkStaticInfoReport】 \r\n 【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQuerySPGroupList(type,ctiInfo) {
    showLog("【onOnQuerySPGroupList】 \r\n type:【"+type+"】\r\n");
    showLog(" ctiInfo:【"+ctiInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnServiceStaticReport(StaticInfo) {
    showLog("【OnServiceStaticReport】 \r\n 【"+StaticInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentStaticReport(StaticInfo) {
    showLog("【OnAgentStaticReport】 \r\n 【"+StaticInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentBusyReason(type,des){
    showLog("【onOnAgentBusyReason】 \r\n type:【"+type+"】\r\n");
    showLog(" des:【"+des+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentLogUpload(destAgent,urlType,uploadServer,fileName,code,des){
    showLog("【OnAgentLogUpload】 \r\n urlType:【"+urlType+"】\r\n");
    showLog(" uploadServer:【"+uploadServer+"】\r\n");
    showLog(" fileName:【"+fileName+"】\r\n");

    var bUpload = false;
    if(urlType == 1 && code == "1" && des == "success")
        bUpload = true;
    if(urlType == 0 && parseInt(code)>0 && des == "201 Created")
        bUpload = true;

    if(bUpload)
    {
        var serverIP = getSubString(uploadServer,"",":");
        var vccid = getSubString(fileName,"000010","");
        vccid = vccid.substr(0,6);
        var fullFilePath = stringFormat("http://{0}:9999/media/log/{1}/{2}",serverIP,vccid,fileName);
        if(urlType == 0)
            fullFilePath = stringFormat("http://{0}:9999/media/000000/{1}",serverIP,fileName);
      if( getLocalLanguage() != lg_zhcn )
        showLog(" upload file success,directory:["+fullFilePath+"]\r\n");
      else
        showLog(" 上传成功,文件目录:【"+fullFilePath+"】\r\n");
    }
    else
    {
      if( getLocalLanguage() != lg_zhcn )
        showLog(" upload file failure:code:["+code+"] des:["+des+"]\r\n");
      else
        showLog(" 上传失败错误信息:code:【"+code+"】 des:【"+des+"】\r\n");
    }
    showLog(" *******************************************************************\r\n");
}
function onOnAsrEventReport(seq,timeStamp,lineNum,text){
    showLog("【OnAsrEventReport】 \r\n seq:【"+seq+"】 ");
    showLog(" timeStamp:【"+timeStamp+"】  ");
    showLog(" lineNum:【"+lineNum+"】  ");
    showLog(" text:【"+text+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnStopSmSuccess(smRescode){
    showLog("【OnStopSmSuccess】 \r\n smRescode:【"+smRescode+"】 \r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnUpdateMediaEvent(cause,number,av) {
    showLog("【OnUpdateMediaEvent】 \r\n cause:【"+cause+"】 ");
    showLog(" number:【"+number+"】  ");
    showLog(" av:【"+av+"】  ");
    showLog(" *******************************************************************\r\n");
}
function onOnStopCaptureSuccess(serverName,fileName){
    showLog("【OnStopCaptureSuccess】：\r\n");
    showLog(" serverName:【"+serverName+"】 fileName:【"+fileName+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnCallCdrReport(callid,sid,usernumber,direction,serviceid,detail,starttime,ringtime,answertime,endtime,ringseconds,answerseconds,answerflag,srfmsgid,msserver,callrescode) {
    showLog(" 【OnCallCdrReport】:\r\n");
    showLog("         callid   ：【"+callid+"】\r\n");
    showLog("         sid：【"+sid+"】\r\n");
    showLog("         usernumber  ：【"+usernumber+"】\r\n");
    showLog("         direction  ：【"+direction+"】\r\n");
    showLog("         serviceid ：【"+serviceid+"】\r\n");
    showLog("         detail  ：【"+detail+"】\r\n");
    showLog("         starttime ：【"+starttime+"】\r\n");
    showLog("         ringtime  ：【"+ringtime+"】\r\n");
    showLog("         answertime  ：【"+answertime+"】\r\n");
    showLog("         endtime ：【"+endtime+"】\r\n");
    showLog("         ringseconds      ：【"+ringseconds+"】\r\n");
    showLog("         answerseconds      ：【"+answerseconds+"】\r\n");
    showLog("         answerflag      ：【"+answerflag+"】\r\n");
    showLog("         srfmsgid      ：【"+srfmsgid+"】\r\n");
    showLog("         msserver         ：【"+msserver+"】\r\n");
    showLog("         callrescode         ：【"+callrescode+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnUpdateVideoWindow(param){
  //console.info("【OnUpdateVideoWindow】： \r\n");
  //console.info(param);
  if(param.key_word == "GetVideoViews"){
    DisplayDiv("divVedioDlg",true);
    param.param.SetVideoViews("agent_selfView","agent_remoteView","agent_shareView");
  }
  else if(param.key_word == "OnGetLocalView"){
    $$(param.param).style.display = "";
    showLog(JSON.stringify(param)+"\r\n");
  }
  else if(param.key_word == "OnGetRemoteView"){
    $$(param.param).style.display = "";
    showLog(JSON.stringify(param)+"\r\n");
  }
  else if(param.key_word == "OnLeaveSuccess"){
    DisplayDiv("divVedioDlg",false);
  }
}
function onOnRtpStatics(stat) {
    if(stat.key_word == "RTPStatics"){
        showLog(JSON.stringify(stat.param)+"\r\n");
        if(stat.param.video){
            if(Tdelay != null)
                Tdelay.innerHTML  = "延时:" +stat.param.video.rtt+"ms";
            var n = stat.param.video.quality;
            if(n<4){
                $('ul li:lt('+n+')').css('background','limegreen');
            }
            else
                $('ul li').css('background','limegreen');
        }
        else{
            if(Tdelay != null)
                Tdelay.innerHTML  = "延时:" +stat.param.audio.rtt+"ms";
            var n = stat.param.audio.quality;
            if(n<4){
                $('ul li:lt('+n+')').css('background','limegreen');
            }
            else
                $('ul li').css('background','limegreen');
        }
    }
}
function onOnSessionMessage(msg){
  showLog("【OnSessinMessage】 \r\n msg:【"+msg+"】 \r\n");
  showLog(" *******************************************************************\r\n");
}
//命令异步返回事件
function onOnMethodResponseEvent(cmdName,param){
    showLog("【OnMethodResponseEvent】：\r\n");
    showLog(" cmdName:【"+cmdName+"】\r\n");
    showLog(" return param:【"+param+"】\r\n");
    showLog(" *******************************************************************\r\n");

    if (!(typeof (oMakeCallDlg) == "undefined" || oMakeCallDlg == null))
        oMakeCallDlg.Display(param);
}

//微信事件
function onOnRecvWeiboMsg(message) {
    showLog("【OnRecvWeiboMsg】 \r\n msgtype:【"+msgtype+"】 \r\n message:【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnIMMessage(msgtype,message) {
    showLog("【OnIMMessage】  \r\n msgtype:【"+msgtype+"】 message:【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnRecvWeChatMessage(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp) {
    showLog("【OnRecvWeChatMessage】：\r\n");
    showLog("         sessionId   ：【"+sessionId+"】\r\n");
    showLog("         type        ：【"+type+"】\r\n");
    showLog("         msgseq      ：【"+msgseq+"】\r\n");
    showLog("         userId      ：【"+userId+"】\r\n");
    showLog("         vccPublicId ：【"+vccPublicId+"】\r\n");
    showLog("        msgType      ：【"+msgType+"】\r\n");
    showLog("        content      ：【"+content+"】\r\n");
    showLog("        sessionUrl   ：【"+sessionUrl+"】\r\n");
    showLog("        recongnition ：【"+recongnition+"】\r\n");
    showLog("        event        ：【"+msgevent+"】\r\n");
    showLog("        eventKey     ：【"+eventKey+"】\r\n");
    showLog("        title        ：【"+title+"】\r\n");
    showLog("        data         ：【"+data+"】\r\n");
    showLog("        timeStamp    ："+timeStamp+"\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnSendWeChatMsgReport(userId, sessionId, msgseq, code, des, timeStamp) {
    showLog("【OnSendWeChatMsgReport】：\r\n");
    showLog("         userId   ：【"+userId+"】\r\n");
    showLog("         sessionId：【"+sessionId+"】\r\n");
    showLog("         msgseq   ：【"+msgseq+"】\r\n");
    showLog("         code     ：【"+code+"】\r\n");
    showLog("         des      ：【"+des+"】\r\n");
    showLog("         timeStamp：【"+timeStamp+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnUploadFileToMMSReport(strFileName,status,strUrl) {
    showLog("【OnUploadFileToMMSReport】：\r\n");
    showLog("         strFileName   ：【"+strFileName+"】\r\n");
    showLog("         status        ：【"+status+"】\r\n");
    showLog("         strUrl        ：【"+strUrl+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnDownloadFileToMMSReport(strUrl,status,strFileName) {
    showLog("【OnDownloadFileToMMSReport】：\r\n");
    showLog("         strUrl        ：【"+strUrl+"】\r\n");
    showLog("         status        ：【"+status+"】\r\n");
    showLog("         strFileName   ：【"+strFileName+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function OnBeginSession(sessionId){
    showLog("开始微信会话：【OnBeginSession】：\r\n");
    showLog(" sessionId:【"+sessionId+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function OnEndSession(sessionId){
    showLog("结束微信会话：【OnEndSession】：\r\n");
    showLog(" *******************************************************************\r\n");
}
function OnRecvMessage(sessionId,msgseq){
    showLog("接收对方消息：【OnRecvMessage("+sessionId+","+msgseq+")】：\r\n");
    g_msgseq = msgseq;
    var oSession = application.oWechatManager.GetSessionItem(sessionId,msgseq);
    if(oSession != null){
        var strValue = "";
        if(oSession.msgType == "text"){
            strValue = oSession.content;
        }
        else{
            strValue = oSession.sessionUrl;
        }
        showLog("接收对方内容：【"+strValue+"】\r\n");
    }
    showLog(" *******************************************************************\r\n");
}
function OnSendMessageReport(sessionId,msgseq){
    showLog("发送消息：【OnSendMessageReport("+sessionId+","+msgseq+")】：\r\n");
    g_msgseq = msgseq;
    var oSession = application.oWechatManager.GetSessionItem(sessionId,msgseq);
    if(oSession != null){
        var strValue = "";
        if(oSession.msgType == "text"){
            strValue = oSession.content;
        }
        else{
            strValue = oSession.sessionUrl;
        }
        showLog("发送内容：【"+strValue+"】\r\n");
    }
    showLog(" *******************************************************************\r\n");
}
function OnUploadFileStatus(sessionID,status,strUrl){
    showLog("上传文件状态事件：【OnUploadFileStatus("+sessionID+","+status+","+strUrl+")】：\r\n");
    showLog(" *******************************************************************\r\n");
}
function OnDowndFileStatus(sessionID,msgseq,status,strUrl){
    showLog("下载文件状态事件：【OnDowndFileStatus("+sessionID+","+msgseq+","+status+","+strUrl+")】：\r\n");
    showLog(" *******************************************************************\r\n");

}
///////////////////////////////////////////////////
// 命令函数
///////////////////////////////////////////////////
function CanvasDraw_gradual(canvas){
    var ctx = canvas.getContext("2d");
    var grad = ctx.createLinearGradient(200,200,0,200,200,200);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.5,"yellow");
    grad.addColorStop(1,"blue");
    //绘制一个带描边的矩形 参数：（x,y,width,height）
    //ctx.strokeRect(10,10,260,260);
    //绘制一个颜色实心的矩形
    setInterval(function() {
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,300,200);
    }, 50);
}

function checkhttpsUrl(server,port) {
    var  server = document.getElementById("mainIP").value;
    var  port    = document.getElementById("ctiPort").value;
    var URL = "https://"+server+":"+port+"/JVccBar3/simple-all.html";
    window.open (URL);
}
function DisplayDiv(id,flag){
    var oDiv = document.getElementById(id);
    if(oDiv == null)
        return;
    if(flag == 0)
        oDiv.style.display = "none";
    else
        oDiv.style.display = "block";
}
function shareSreen(srcType,plType){
    var options = {};
    options.videosource = "";
    options.width = parseInt(resolutionWidth.value);
    options.height = parseInt(resolutionHeight.value);
    if(srcType == "background") {
        options.source = LocalVideoSrc.BackGround;
        options.videosource = "scripts/ui/images/backgroup.png";
        options.force = true;
        if(plType == 2)
            options.videosource = "scripts/ui/images/test.png";
    }
    else if(srcType == "videoFile"){
        options.source = LocalVideoSrc.VideoFile;
        options.videosource = "scripts/sip/videos/cat.mp4";
        options.mic = 1;
    }
    else if(srcType == "screen"){
        options.source = LocalVideoSrc.Screen;
        options.mic = 1;
    }
    else if(srcType == "camera"){
        options.source = LocalVideoSrc.Camera;
        if(oCameraDevices.options.length>0){
            options.videosource = oCameraDevices.options[oCameraDevices.options.selectedIndex].value;
        }
    }
    else if(srcType == "stream"){
        options.source = LocalVideoSrc.Stream;
        var mycanvas = document.getElementById("canvas");
        CanvasDraw_gradual(mycanvas);
        options.mediaStream = mycanvas.captureStream();
        options.mic = 1;
    }
    else if(srcType == "watermark"){
        options.source = LocalVideoSrc.Camera;
        if(oCameraDevices.options.length>0){
            options.videosource = oCameraDevices.options[oCameraDevices.options.selectedIndex].value;
        }
        options.videotext = {
            text:{
                content:"座席标题",
                x:options.width-20,
                y:100,
                color:"#000000"
            },
            timer:
                {
                    flag:true,
                    x:options.width-20,
                    y:options.height-40
                },
            image:{
                url:"scripts/ui/images/agent.png",
                x:options.width-80,
                y:10
            }
        };
    }
    else
        return;
    application.oJVccBar.SwitchVideoSource(options);
}
function Sharefile(){
    var oSelfView = document.getElementById("local_file");
    oSelfView.play();
    var stream =null;
    const fps = 0;
    if (oSelfView.captureStream) {
        stream = oSelfView.captureStream(fps);
    } else if (oSelfView.mozCaptureStream) {
        stream = oSelfView.mozCaptureStream(fps);
    } else {
        console.error('Stream capture is not supported');
    }
    application.oJVccBar.SwitchVideoSource({mediaStream:stream});
}

function SnapShot() {
    var image = application.oJVccBar.GetRemoteSnapShot();
    if(image != null){
        recvPic.src = image;
        DisplayDiv("divPicDlg",1);
    }
}
var g_videochanged = false;
function videoExchange(){
    var oRemote= document.getElementById("agent_remoteView");
    var oSelf= document.getElementById("agent_selfView");
    g_videochanged = !g_videochanged;
    if(g_videochanged)
    {
        oRemote.className ="selfView";
        oSelf.className ="remoteView";
    }
    else
    {
        oSelf.className ="selfView";
        oRemote.className ="remoteView";
    }
}
