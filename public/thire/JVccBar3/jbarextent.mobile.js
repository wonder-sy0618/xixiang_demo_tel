///////////////////////////////////////////////////
//  文 件 名：  jbarextent.mobile.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		 调用电话条的辅助函数 FOR Mobile
//  说    明：
//		 调用电话条的辅助函数 FOR Mobile
//  修改说明：
///////////////////////////////////////////////////

var g_msgseq = -1;
///////////////////////////////////////////////////
// 辅助函数
///////////////////////////////////////////////////

window.onunload = window_onunload
function window_onunload(){
   // applicationUnLoad();
}
//创建对象成功，绑定电话条事件
function setVccBarMobileEvent(){
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
	application.oJVccBar.OnIMMessage = onOnIMMessage;
    application.oJVccBar.OnUpdateVideoWindow = onOnUpdateVideoWindow;

	application.oJVccBar.OnWorkStaticInfoReport = onOnWorkStaticInfoReport;
    application.oJVccBar.OnQuerySPGroupList = onOnQuerySPGroupList;

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

	application.oJVccBar.OnMethodResponseEvent = onOnMethodResponseEvent;
	application.oJVccBar.OnAgentStatus = onOnAgentStatus;
    application.OnDebug = onOnDebug;
    application.DislayLog(16|8|4|2|1,1);
	showLog("初始化就绪,版本号码:"+application.oJVccBar.GetVersion()+ "<br>");
    showLog(application.oBrowserSys.expression+"<br>");
}

////////////////////////--辅助函数---////////////////////////////
function showLog(Text){
    var oTextareaInfo= document.getElementById("logInfo");
    console.info(Text);
    if(oTextareaInfo != null)
	    oTextareaInfo.innerHTML = oTextareaInfo.innerHTML + Text;
}
function emptyLog(){
    var oTextareaInfo= document.getElementById("logInfo");
    if(oTextareaInfo != null)
        oTextareaInfo.value = "";
}
function onOnDebug(Text){
    showLog("<span>"+Text+"</span><br>");

}
function showWorkLog(Text){
  var oTextareaInfo= document.getElementById("workInfo");
  console.info(Text);
  if(oTextareaInfo != null)
    oTextareaInfo.innerHTML = oTextareaInfo.innerHTML + Text;
}
///////////////////////////////////////////////////
// 电话条重载事件函数
///////////////////////////////////////////////////

//呼叫事件
function onOnCallRing(CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,fileName,networkInfo,queueTime,opAgentID) {
    showLog("【OnCallRing】：<br>");
    showLog("         CallingNo：【"+CallingNo+"】<br>");
    showLog("         CalledNo：【"+CalledNo+"】<br>");
    showLog("         OrgCalledNo：【"+OrgCalledNo+"】<br>");
    showLog("         CallData：【"+CallData+"】<br>");
    showLog("         CallID ：【"+CallID+"】<br>");
    showLog("         SerialID ：【"+SerialID+"】<br>");
    showLog("         ServiceDirect ：【"+ServiceDirect+"】<br>");
    showLog("         UserParam ：【"+UserParam+"】<br>");
    showLog("         TaskID ：【"+TaskID+"】<br>");
    showLog("         UserDn ：【"+UserDn+"】<br>");
    showLog("         AgentDn ：【"+AgentDn+"】<br>");
    showLog("         AreaCode ：【"+AreaCode+"】<br>");
    showLog("         fileName ：【"+fileName+"】<br>");
    showLog("         networkInfo：【"+networkInfo+"】<br>");
    showLog("         queueTime ：【"+queueTime+"】<br>");
    showLog("         opAgenID ：【"+opAgentID+"】<br>");
    showLog(" ***********************<br>");
    showWorkLog("被叫:["+UserDn+"] callID:["+CallID+"]<br>");
}
function onOnAnswerCall(UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID) {
    showLog(" 【OnAnswerCall】:<br>");
    showLog("         AnswerTime ：【"+AnswerTime+"】<br>");
    showLog("        UserNo ：【"+UserNo+"】<br>");
    showLog("        CallID ：【"+CallID+"】<br>");
    showLog("        SerialID ：【"+SerialID+"】<br>");
    showLog("        ServiceDirect ：【"+ServiceDirect+"】<br>");
    showLog("        UserParam ：【"+UserParam+"】<br>");
    showLog("        TaskID ：【"+TaskID+"】<br>");
    showLog(" ***********************<br>");
}	
function onOnCallEnd(callID,serialID,serviceDirect,userNo,bgnTime,endTime,agentAlertTime,userAlertTime,fileName,directory,disconnectType,userParam,taskID,serverName,networkInfo) {
    showLog(" 【OnCallEnd】:<br>");
    showLog("         fileName   ：【"+fileName+"】<br>");
    showLog("         directory：【"+directory+"】<br>");
    showLog("         bgnTime  ：【"+bgnTime+"】<br>");
    showLog("         endTime  ：【"+endTime+"】<br>");
    showLog("         userNo ：【"+userNo+"】<br>");
    showLog("         CallID   ：【"+callID+"】<br>");
    showLog("         SerialID ：【"+serialID+"】<br>");
    showLog("         ServiceDirect  ：【"+serviceDirect+"】<br>");
    showLog("         userAlertTime  ：【"+userAlertTime+"】<br>");
    showLog("         agentAlertTime ：【"+agentAlertTime+"】<br>");
    showLog("         userParam      ：【"+userParam+"】<br>");
    showLog("         taskID         ：【"+taskID+"】<br>");
    showLog("         serverName         ：【"+serverName+"】<br>");
    showLog("         networkInfo         ：【"+networkInfo+"】<br>");
    showLog(" ***********************<br>");
}

//提示事件
function onOnAgentStatus(agtStatus) {
    // 0：未登录;1：忙碌;2：空闲;3：通话中;4：后续态;
    switch(agtStatus) {
	  case 0: {
		   $("#idAgentStatus").html("座席状态：【未登录】" );
		break;
	  }
	  case 1: {
		   $("#idAgentStatus").html("座席状态：【忙碌】" );
		break;
	  }
	  case 2: {
		   $("#idAgentStatus").html("座席状态：【就绪】" );
		break;
	  }
	  case 3: {
		   $("#idAgentStatus").html("座席状态：【通话中】" );
		break;
	  }
	  case 4: {
		   $("#idAgentStatus").html("座席状态：【后续态】" );
		break;
	  }
	}
	
}
function onOnPrompt(code,description) {
    showLog("【OnPrompt】：<br>");
    showLog(" code:【"+code+"】 description:【"+description+"】<br>");
    showLog(" ***********************<br>");
}
function onReportBtnStatus(btnIDS) {
    showLog("【ReportBtnStatus】：【"+btnIDS+"】<br>");
    showLog(" ***********************<br>");
}
function onOnEventPrompt(code,description) {
    showLog("【OnEventPrompt】：");
    showLog(" code:【"+code+"】 description:【"+description+"】<br>");
    showLog(" ***********************<br>");
}  
function onOnInitalSuccess() {
    showLog("【OnInitalSuccess】<br> ");
    showLog(" ***********************<br>");
	
	$('#divPadLogin').css('display','none');
	$('#divPadParam').css('display','');
	$('#divPadCall').css('display','');
	$.parser.parse();

    if( getLocalLanguage() != lg_zhcn )
        showLog("        used phoneType:【"+application.oJVccBar.GetAttribute("PhonType")+"】\r\n        其中 1：inside sipphone 2：outer device；3：remote sipphone;4：soft switch pretransfer;5：yealink phone\r\n");
    else
        showLog("        当时使用phoneType:【"+application.oJVccBar.GetAttribute("PhonType")+"】\r\n        其中 1：内置Sip电话 2：外置其他终端；3：远程sip电话;4：软交换前传号码;5：yealink话机\r\n");
}
function onOnInitalFailure(code,description) {
    showLog("【OnInitalFailure】<br> 【"+code+"】 【"+description+"】<br>");
    showLog(" ***********************<br>");
    alert("【登录失败】:【"+code+":"+description+"】");
}
function onOnBarExit(code,description) {
    showLog("【OnBarExit】 <br>【"+code+"】 【"+description+"】<br>");
    showLog(" ***********************<br>");
    alert("【座席退出】:【"+code+":"+description+"】");
	$('#divPadLogin').css('display','');
	$('#divPadParam').css('display','none');
	$('#divPadCall').css('display','none');
	$.parser.parse();

}
function onOnAgentWorkReport(workStatus,description) {
     showLog("【OnAgentWorkReport】<br> 场景编号：【"+workStatus+"】<br> 场景描述：【"+description+"】<br>");
    showLog(" ***********************<br>");
}
function onOnCallDataChanged(callData) {
    showLog("【OnCallDataChanged】：<br>【"+callData+"】<br>");
    showLog(" ***********************<br>");
}

function onOnCallQueueQuery(QueueInfo) {
    showLog("【OnCallQueueQuery】：<br> param:【"+QueueInfo+"】<br>");
    showLog(" ***********************<br>");
}

function onOnQueryGroupAgentStatus(QueryInfo,type) {
    showLog("【OnQueryGroupAgentStatus】：<br> param:【"+QueryInfo+"】<br> type:【"+type+"】<br>");
    showLog(" ***********************<br>");
}
function onOnSystemMessage(code,description) {
    showLog("【OnSystemMessage】：<br>");
    showLog(" code:【"+code+"】 description:【"+description+"】<br>");
    showLog(" ***********************<br>");
}
function onOnRecvWeiboMsg(message) {
    showLog("【OnRecvWeiboMsg】 <br> msgtype:【"+msgtype+"】 <br> message:【"+message+"】<br>");
    showLog(" ***********************<br>");
}
function onOnIMMessage(msgtype,message) {
    showLog("【OnIMMessage】  <br> msgtype:【"+msgtype+"】 message:【"+message+"】<br>");
    showLog(" ***********************<br>");
}
function displayVideo(bshow) {
  var ntype = stringToInt(application.oJVccBar.GetAttribute("Av"));
  showLog("displayVideo:"+ntype+"<br>");
  //6:agora  2:webrtc video 1:audio
  if(ntype == 6 || ntype == 2){
    if(bshow){
      $('#divPadParam').css('display','none');
      $('#divPadCall').css('display','none');

      $('#agent_webcam').css('display','');

    }
    else{
      $('#divPadParam').css('display','');
      $('#divPadCall').css('display','');

      $('#agent_webcam').css('display','none');
    }
  }

}
function onOnUpdateVideoWindow(param) {
  console.info(param);
  if (param.key == "GetVideoViews") {
   // $('#dlgcall').dialog('open').dialog('center');
    displayVideo(true);
    param.param.SetVideoViews("agent_selfView2", "agent_remoteView2", "agent_selfView2");
  }
  else if (param.key == "OnJoinFailure") {

  }
  else if (param.key == "OnGetLocalView") {
    $$(param.param).style.display = "";
  }
  else if (param.key == "OnGetShareView") {
    $$(param.param).style.display = "";
  }
  else if (param.key == "OnGetRemoteView") {
  }
  else if (param.key == "OnRemoveRemoteView") {
    $$(param.param).innerHTML = "";
    $$("agent_selfView2").innerHTML = "";
  }
  else if (param.key == "OnLeaveSuccess") {
    //$('#dlgcall').dialog('close').dialog('center');
    displayVideo(false);
  }
}
function onOnRecvWeChatMessage(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp) {
    showLog("【OnRecvWeChatMessage】：<br>");
    showLog("         sessionId   ：【"+sessionId+"】<br>");
    showLog("         type        ：【"+type+"】<br>");
    showLog("         msgseq      ：【"+msgseq+"】<br>");
    showLog("         userId      ：【"+userId+"】<br>");
    showLog("         vccPublicId ：【"+vccPublicId+"】<br>");
    showLog("        msgType      ：【"+msgType+"】<br>");
    showLog("        content      ：【"+content+"】<br>");
    showLog("        sessionUrl   ：【"+sessionUrl+"】<br>");
    showLog("        recongnition ：【"+recongnition+"】<br>");
    showLog("        event        ：【"+msgevent+"】<br>");
    showLog("        eventKey     ：【"+eventKey+"】<br>");
    showLog("        title        ：【"+title+"】<br>");
    showLog("        data         ：【"+data+"】<br>");
    showLog("        timeStamp    ："+timeStamp+"\<br>");
    showLog(" ***********************<br>");
}
function onOnSendWeChatMsgReport(userId, sessionId, msgseq, code, des, timeStamp) {
    showLog("【OnSendWeChatMsgReport】：<br>");
    showLog("         userId   ：【"+userId+"】<br>");
    showLog("         sessionId：【"+sessionId+"】<br>");
    showLog("         msgseq   ：【"+msgseq+"】<br>");
    showLog("         code     ：【"+code+"】<br>");
    showLog("         des      ：【"+des+"】<br>");
    showLog("         timeStamp：【"+timeStamp+"】<br>");
    showLog(" ***********************<br>");
}
function onOnUploadFileToMMSReport(strFileName,status,strUrl) {
    showLog("【OnUploadFileToMMSReport】：<br>");
    showLog("         strFileName   ：【"+strFileName+"】<br>");
    showLog("         status        ：【"+status+"】<br>");
    showLog("         strUrl        ：【"+strUrl+"】<br>");
    showLog(" ***********************<br>");
}
function onOnDownloadFileToMMSReport(strUrl,status,strFileName) {
    showLog("【OnDownloadFileToMMSReport】：<br>");
    showLog("         strUrl        ：【"+strUrl+"】<br>");
    showLog("         status        ：【"+status+"】<br>");
    showLog("         strFileName   ：【"+strFileName+"】<br>");
    showLog(" ***********************<br>");
}

//监控事件
function onOnAgentReport(AgentReportInfo) {
    showLog("【OnAgentReport】：<br> param：【"+AgentReportInfo+"】<br>");
    showLog(" ***********************<br>");
}
function onOnIvrReport(IvrReportInfo) {
    showLog("【OnIvrReport】：<br>"+IvrReportInfo+")\<br>");
    showLog(" ***********************<br>");
}
function onOnTelReport(TelReportInfo) {
    showLog("【OnTelReport】：<br>"+TelReportInfo+")\<br>");
    showLog(" ***********************<br>");
}
function onOnServiceReport(ServiceReportInfo) {
    showLog("【OnServiceReport】(\<br>"+ServiceReportInfo+")\<br>");
    showLog(" ***********************<br>");
}
function onOnTaskReport(TaskReportInfo) {
    showLog("【OnTaskReport】<br>"+TaskReportInfo+")\<br>");
    showLog(" ***********************<br>");
}

function onOnOutboundReport(TaskInfo) {
    showLog("【OnOutboundReport】<br> param：【"+TaskInfo+"】<br>");
    showLog(" ***********************<br>");
}
function onOnCallReportInfo(CallInfo) {
    showLog("【OnCallReportInfo】<br> param：【"+CallInfo+"】<br>");
    showLog(" ***********************<br>");
}
function onOnQueueReport(QueueInfo) {
    showLog("【OnQueueReport】：<br>"+QueueInfo+"\<br>");
    showLog(" ***********************<br>");
}
function onOnQueryMonitorSumReport(cmdName,reportInfo) {
    showLog("【OnQueryMonitorSumReport】<br> name:【"+cmdName+"】<br> reportInfo:【"+reportInfo+"】<br>");
    showLog(" ***********************<br>");
}
function onOnWallServiceReport(message) {
    showLog("【OnWallServiceReport】<br>  【"+message+"】<br>");
    showLog(" ***********************<br>");
}
function onOnWallQueueReport(message) {
    showLog("【OnWallQueueReport】<br> 【"+message+"】<br>");
    showLog(" ***********************<br>");
}
function onOnWorkStaticInfoReport(message) {
    showLog("【OnWorkStaticInfoReport】 <br> 【"+message+"】<br>");
    showLog(" ***********************<br>");
}
function onOnQuerySPGroupList(type,ctiInfo){
    showLog("【onOnQuerySPGroupList】 <br> type:【"+type+"】<br>");
    showLog(" ctiInfo:【"+ctiInfo+"】<br>");
    showLog(" ***********************<br>");
}
function onOnServiceStaticReport(StaticInfo) {
    showLog("【OnServiceStaticReport】 <br> 【"+StaticInfo+"】<br>");
    showLog(" ***********************<br>");
}
function onOnAgentStaticReport(StaticInfo) {
    showLog("【OnAgentStaticReport】 <br> 【"+StaticInfo+"】<br>");
    showLog(" ***********************<br>");
}

//命令异步返回事件
function onOnMethodResponseEvent(cmdName,param) {
    showLog("【OnMethodResponseEvent】：<br>");
    showLog(" cmdName:【"+cmdName+"】<br>");
    showLog(" return param:【"+param+"】<br>");
    showLog(" ***********************<br>");
}

function OnBeginSession(sessionId) {
    showLog("开始微信会话：【OnBeginSession】：<br>");
    showLog(" sessionId:【"+sessionId+"】<br>");
    showLog(" ***********************<br>");
}
function OnEndSession(sessionId) {
    showLog("结束微信会话：【OnEndSession】：<br>");
    showLog(" ***********************<br>");
}
function OnRecvMessage(sessionId,msgseq) {
    showLog("接收对方消息：【OnRecvMessage("+sessionId+","+msgseq+")】：<br>");
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
        showLog("接收对方内容：【"+strValue+"】<br>");
    }
    showLog(" ***********************<br>");
}
function OnSendMessageReport(sessionId,msgseq) {
    showLog("发送消息：【OnSendMessageReport("+sessionId+","+msgseq+")】：<br>");
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
        showLog("发送内容：【"+strValue+"】<br>");
    }
    showLog(" ***********************<br>");
}
function OnUploadFileStatus(sessionID,status,strUrl){
    showLog("上传文件状态事件：【OnUploadFileStatus("+sessionID+","+status+","+strUrl+")】：<br>");
    showLog(" ***********************<br>");
}
function OnDowndFileStatus(sessionID,msgseq,status,strUrl)
{
    showLog("下载文件状态事件：【OnDowndFileStatus("+sessionID+","+msgseq+","+status+","+strUrl+")】：<br>");
    showLog(" ***********************<br>");
}