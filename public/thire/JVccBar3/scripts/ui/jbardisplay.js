//  *****************************************************************************
//  文 件 名：	jbardisplay.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		 电话条的内联界面
//  说    明：
//		 电话条的内联界面，支持easyUI和普通html两种方式
//  修改说明：
// *****************************************************************************

///////////////////////////////////////
// vccbar cmd btn
///////////////////////////////////////
var cmdSetWrapUp         = 0;
var cmdSetBusy           =  cmdSetWrapUp+1;
var cmdSetIdle           =  cmdSetWrapUp+2;
var cmdMakeCall          =  cmdSetWrapUp+3;
var cmdHold              =  cmdSetWrapUp+4;
var cmdRetrieveHold      =  cmdSetWrapUp+5;
var cmdDisconnect        =  cmdSetWrapUp+6;
var cmdTransfer          =  cmdSetWrapUp+7;
var cmdConference        =  cmdSetWrapUp+8;
var cmdAnswer            =  cmdSetWrapUp+9;
var cmdTransferOut       =  cmdSetWrapUp+10;
var cmdConsult           =  cmdSetWrapUp+11;
var cmdSendDTMF          =  cmdSetWrapUp+12;
var cmdBridge            =  cmdSetWrapUp+13;
var cmdAlternate         =  cmdSetWrapUp+14;
var cmdConfigurate       =  cmdSetWrapUp+15;
var cmdForceReset        =  cmdSetWrapUp+16;
var cmdBeginRecord       =  cmdSetWrapUp+17;
var cmdStopRecord        =  cmdSetWrapUp+18;
var cmdListen            =  cmdSetWrapUp+19;
var cmdInsert            =  cmdSetWrapUp+20;
var cmdIntercept         =  cmdSetWrapUp+21;
var cmdForeReleaseCall   =  cmdSetWrapUp+22;
var cmdBeginPlay         =  cmdSetWrapUp+23;
var cmdStopPlay          =  cmdSetWrapUp+24;
var cmdLock              =  cmdSetWrapUp+25;
var cmdUnLock            =  cmdSetWrapUp+26;
var cmdMute              =  cmdSetWrapUp+27;
var cmdCallBack          =  cmdSetWrapUp+28;
var cmdReCall            =  cmdSetWrapUp+29;
var cmdHelp              =  cmdSetWrapUp+30;


var NotSurrport_Jquery = 0;
var Surrport_Jquery = NotSurrport_Jquery+1;

var language_zhcn    = "zh-cn";
var language_english = "en-us";

var  appVccBar   = null;

function BeginAgentStatusTimer(){
    if(application.oJBarDisplayer._timer == null)
        application.oJBarDisplayer._timer = setInterval( GlAgentStatusTimeSum ,1000);
}

function StopAgentStatusTimer(){
	if(application.oJBarDisplayer._timer != null)
	{
		clearInterval(application.oJBarDisplayer._timer);
		application.oJBarDisplayer._timer = null;
	}
}

function GlAgentStatusTimeSum(){
    application.oJBarDisplayer.AgentStatusTimeSum();
}

function GetLanguageItem(lg,zhcnValue,zhus){
	return (lg==lg_zhcn)?zhcnValue:zhus;
}

function JSMessageBox(str){
	$.messager.show({
		title:GetLanguageItem(getLocalLanguage(),"信息提示","information"),
		msg:str,
		showType:'fade',
		width:400,
		height:120,
		style:{
			right:'',
			bottom:''
		}
	});
   }

function isBrowserIE(){
	try
	{
		if (!!window.ActiveXObject || "ActiveXObject" in window)
			return true;
		else
			return false;
	}
	catch(e)
	{
		return false;
	}
}

function getBrowserLanguage(){
	var type = navigator.appName;
	var lang = "";
	if(type == "Netscape")
	{
		lang = navigator.language;
	}
	else{
		lang = navigator.userLanguage;
	}
	//zh-CN   zh-tw
	return lang.toLowerCase();
}

//得到相关两个数组的数值
function getRelatedStringArrayValue(arrSource,arrDest,sValue){
	for(var i=0;i<arrSource.length;i++)
	{
		if(arrSource[i] == sValue)
			return arrDest[i];
	}
	return "";
}


function applicationUILoad(left,top,width,height,relationPath,callback){
    if(appVccBar != null){
        return ;
    }
    if(typeof(relationPath) == "undefined"){
        relationPath = "";
    }
    if(typeof(callback) == "undefined"){
        callback = null;
    }

    var sleepTime = 50;

    setTimeout(function(){createVccBar(left,top,width,height,callback)},sleepTime);
}

function createVccBar(left,top,width,height,callback){
	if(appVccBar != null)
		return;
    //1、创建电话条对象
    appVccBar  = new JBarDisplay(left,top,width,height,window);

    if(callback)
    {
        callback();
    }
}

function JBarDisplay(nLeft,nTop,nWidth,nHeight,oContentWindow,oWindow){
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	oWindow = (typeof(oWindow) == "undefined")?null:oWindow;
	this._window = (oWindow==null)?window:oWindow;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oBar_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
	this.language = getBrowserLanguage();
	
	this.displayType = NotSurrport_Jquery;
	
	//all btns
	this._arrBtnText = new Array(); 
    this._arrBtnId = new Array(); 
    this._arrBtnIcon = new Array(); 
    
    //show btns
    this._showBtns = new Array();
    this._btnIDs = "0,1,2,3,4,5,6,7,8,9,10,11,12,13,15,16";
    this._btnEnableIDs = "0|15";
    this._busySubStatus = "";
    this._busySubStatusSelectedItem = "";
    this._agentStatus = 0;//0：未登录 1：忙碌 2：空闲 3：通话中 4：后续态
	this._onRing      = 0;//0：不振铃 1:振铃

    
    this._timerCount = 0;
    this._timer = null;

		
	// 主图相关的HTML对象
	this.oBarDisplay		= null;	
	this.oBusyMenu   		= null;	
	this.oMouseEvent	    = null;
	//
	this.oInputDisplay		= null;	
	
	this.errDescription = "";		// 错误提示信息

	//########################//
	//			方法	　    //
	//########################//

	//内部方法
	this._serial = function(){
	    if(this._arrBtnId.length>0)
		    return ;
		var allCmd = "工作状态|示忙|示闲|呼出|保持|接回|挂断|转移|会议|应答|转出|咨询|再拨|桥接|切换|设置|强复位|录音|停录|监听|强插|拦截|强拆|放音|结束|加锁|解锁|静音|返回|重拨|辅助";
		if( this.language != language_zhcn )
		    allCmd = "Status|SetBusy|SetIdle|Callout|Hold|Retrieve|Disconnect|Transfer|Conference|Answer|TransferOut|Consult|SendDtmf|Bridge|AlterNate|Setting|ForceReset|Record|StopRecord|Listen|Insert|Intercept|ForeReleaseCall|Play|StopPlay|Lock|unLock|Mute|Callback|Recall|Help";
		var arrIndex = allCmd.split("|"); 	
    	var allIcon = "icon-Status|icon-SetBusy|icon-SetIdle|icon-Callout|icon-Hold|icon-Retrieve|icon-Disconnect|icon-Transfer|icon-Conference|icon-Answer|icon-TransferOut|icon-Consult|icon-SendDtmf|icon-Bridge|icon-AlterNate|icon-Setting|icon-ForceReset|icon-Record|icon-StopRecord|icon-Listen|icon-Insert|icon-Intercept|icon-ForeReleaseCall|icon-Play|icon-StopPlay|icon-Lock|icon-unLock|icon-Mute|icon-Callback|icon-Recall|icon-Help";
		var arrIcon = allIcon.split("|"); 		

		for( var i=0;i<arrIndex.length;i++){
    	    this._arrBtnText.push(arrIndex[i]);                       
    	    this._arrBtnId.push(i);
			this._arrBtnIcon.push(arrIcon[i]);
		}
	}
	this._getCmdTextByID = function (id){ 
	    return getRelatedStringArrayValue(this._arrBtnId,this._arrBtnText,id);
	}
	this._getCmdIconByID = function (id){ 
	    return getRelatedStringArrayValue(this._arrBtnId,this._arrBtnIcon,id);
	}
	this._getDisplayType = function(){
		var os = "";
		var version = "";
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf("msie")>0)
		{
			os = "msie";
			version = ua.match(/msie ([\d.]+)/)[1];
		}
		else if (ua.lastIndexOf("firefox")>0)
		{
			os = "firefox";
			version = ua.match(/firefox\/([\d.]+)/)[1];
		}
		else if (ua.lastIndexOf("chrome")>0)
		{
			os = "chrome";
			version = ua.match(/chrome\/([\d.]+)/)[1];
		}
		else
		{
			if(isBrowserIE())
			{
				os = "msie";
				version = "11.0";
				//loadHeadMeta();
			}
			else
			{
				os = ua;
				version = "";
			}
		}
		return (os == "msie" && stringToInt(version)<6.0)?NotSurrport_Jquery:Surrport_Jquery;
	}
	
	this._createObject = function _createObject() {
		this.displayType = this._getDisplayType();
	    this._serial();
	    if(this.displayType == NotSurrport_Jquery){
	        //this.oBarDisplay = this._contentWindow.document.createElement("DIV");
	        this.oBarDisplay = this._window.document.createElement("DIV");
	        this.oBarDisplay.style.cursor = "move";
	        this.oBarDisplay.style.position = "absolute";
	        this.oBarDisplay.style.border = "1px solid #FF0000";
	        this.oBarDisplay.style.left = this.left+"px";
	        this.oBarDisplay.style.top = this.top+"px";
	        this.oBarDisplay.id = this.name;
		    //this._contentWindow.document.body.appendChild(this.oBarDisplay);
		    this._contentWindow.appendChild(this.oBarDisplay);		    
		    this.oBarDisplay.innerHTML ="";
		}
		else
		{
	        this.oBarDisplay = this._window.document.createElement("DIV");
	        this.oBarDisplay.style.cursor = "move";
	        this.oBarDisplay.style.position = "absolute";
		    this.oBarDisplay.style.padding = "5px";
	        this.oBarDisplay.style.left = this.left+"px";
	        this.oBarDisplay.style.top = this.top+"px";
	        this.oBarDisplay.style.width = this.width + "px";
	        this.oBarDisplay.style.height = this.height + "px";
			this.oBarDisplay.style.background = "transparent"; //背景透明
			this.oBarDisplay.style.border = "0px";  //边框为空
	        this.oBarDisplay.className = "easyui-panel";
		    this.oBarDisplay.id = this.name;
		    //this._contentWindow.document.body.appendChild(this.oBarDisplay);
		    if(this._contentWindow == this._window){
		        this._contentWindow.document.body.appendChild(this.oBarDisplay);
		    }
		    else{
		        this._contentWindow.appendChild(this.oBarDisplay);
		    }
		    this.oBarDisplay.innerHTML ="";

		}
		// 创建电话条控件	
		this.SerialBtn(this._btnIDs);
        this.showAgentStatusTimer();
	}
	this._getShowIDs = function(showIDs,hideID){
	    if(typeof(hideID) == "undefined") 
	    {
	        hideID = "";
	    }
	    if(hideID == "")
	        return showIDs;
	    var allBtns = showIDs.split(","); 	
	    var hideBtns = hideID.split(","); 
	    var arrReturn = new Array();
	    for( var i=0;i<allBtns.length;i++){
	        var bFind = false;
	        for(var j=0;j<hideBtns.length;j++){
	            if(allBtns[i] == hideBtns[j] ){
	                bFind = true;
	                break;
	            }
	            
	        }
	        if(bFind == false)
	            arrReturn.push(allBtns[i]);
	    }
	    return arrReturn.join(",");
	}
	this._makeSubBusyMenuHtml = function(param){
	    var menuHtml = "";
        if(param == "")
            return menuHtml ;
        var  arrMenuItem = param.split("$"); 		
        for(var i=0;i<arrMenuItem.length;i++)
        {
            var item = arrMenuItem[i].split("|");
            if(item.length == 2)
            {
                menuHtml = menuHtml + "<div onclick=\"application.oJBarDisplayer.SetSubBusy("+item[0]+",'"+item[1]+"');\">"+item[1]+"</div>";
            }
        }
	    return menuHtml;
	}
	this._clearBtns = function(){
	    for( var i=0;i<this._showBtns.length;i++)
	    {
           var oBtn = this._contentWindow.document.getElementById("btn_"+this._showBtns[i]);
           if(oBtn == null)
                return ;
   		    this.oBarDisplay.removeChild(oBtn);	    
	    }
	}
	
	this._btnClick = function (id){
	    var param = ""; 
	    switch(parseInt(id))
	    {
	    case cmdSetBusy:
	        application.oJVccBar.SetBusy(0);
	        break;
	    case cmdSetIdle:
	        application.oJVccBar.SetIdle();
	        break;
	    case cmdMakeCall:
	        {
	            if(this.displayType == NotSurrport_Jquery)
	            {
                    var spevent = window.event || arguments.callee.caller.arguments[0];
	                this.oInputDisplay  = new divDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,180,1,0,null);
			        var shtml = GetLanguageItem(this.language,"<p>&nbsp;&nbsp;呼叫类型:","<p>&nbsp;&nbsp;callType:");
			        shtml = shtml + "<select id='selType' name='styles'>"
			        shtml = shtml + 	GetLanguageItem(this.language,"<option value=0 >内部号码","option value=0 selected>agentid");
			        shtml = shtml + 	GetLanguageItem(this.language,"<option value=1 selected>外呼号码","<option value=1 >outer number");
					shtml = shtml + 	GetLanguageItem(this.language,"<option value=2 selected>人工服务","<option value=1 >service number");
			        shtml = shtml + 	"</select></p>"
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"外呼","callout")+"' >";
			        shtml = shtml + 	"<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='"+GetLanguageItem(this.language,"取消","cancel")+"' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle( GetLanguageItem(this.language,"外呼","callout"));    
		            this.oInputDisplay.show(1);
		        }
		        else
		        {
				    if(this.oInputDisplay )
				    {  
					    this.oInputDisplay.close();
					    this.oInputDisplay  = null;
				    }
                    var spevent = window.event || arguments.callee.caller.arguments[0];
		            this.oInputDisplay  = new JBarDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,180,null);
			        var shtml = "<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"呼叫类型","callType")+":";
			        shtml = shtml + "<select id='selType' name='styles'>";
			        shtml = shtml + 	"<option value=0 >"+GetLanguageItem(this.language,"座席工号","agentID");
			        shtml = shtml + 	"<option value=1 selected>"+GetLanguageItem(this.language,"外部号码","outerNum");
					shtml = shtml + 	"<option value=2 >"+GetLanguageItem(this.language,"人工服务","serviceNum");
			        shtml = shtml + 	"</select></p>"
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        shtml = shtml + 	"<p align='center'><input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",1);' type='button' value='"+GetLanguageItem(this.language,"音频呼叫","audiocall")+"' >";
					shtml = shtml + 	"&nbsp;&nbsp;<input id='video_ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",2);' type='button' value='"+GetLanguageItem(this.language,"视频呼叫","videocall")+"' >";
					shtml = shtml + 	"&nbsp;&nbsp;<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='"+GetLanguageItem(this.language,"取消","cancel")+"' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"外呼","callout"));    
		            this.oInputDisplay.display();
		        }
	        }
	        break;
	    case cmdHold:
	        application.oJVccBar.Hold();
	        break;
	    case cmdRetrieveHold:
	        application.oJVccBar.RetrieveHold();
	        break;
	    case cmdDisconnect:
	        application.oJVccBar.Disconnect();
	        break;
	    case cmdTransfer:
	        application.oJVccBar.Transfer();
	        break;
	    case cmdConference:
	        application.oJVccBar.Conference();
	        break;
	    case cmdAnswer:
	        application.oJVccBar.Answer();
	        break;
	    case cmdTransferOut:
	        {
	            if(this.displayType == NotSurrport_Jquery)
	            {
                    var spevent = window.event || arguments.callee.caller.arguments[0];
	                this.oInputDisplay  = new divDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,180,1,0,null);
			        var shtml = "<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"转出类型","transferType")+":";
			        shtml = shtml + "<select id='selType' name='styles'>"
			        shtml = shtml + 	"<option value=0 selected>"+GetLanguageItem(this.language,"座席工号","agentID");
			        shtml = shtml + 	"<option value=1 >"+GetLanguageItem(this.language,"外呼号码","outerNum");
			        shtml = shtml + 	"<option value=2 >"+GetLanguageItem(this.language,"服务号码","serviceNum");
			        shtml = shtml + 	"</select></p>"
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"转出","transferout")+"' >";
			        shtml = shtml + 	"<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='"+GetLanguageItem(this.language,"取消","cancel")+"' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"转出","transferout"));    
		            this.oInputDisplay.show(1);
		        }
		        else
		        {
				    if(this.oInputDisplay )
				    {  
					    this.oInputDisplay.close();
					    this.oInputDisplay  = null;
				    }
                    var spevent = window.event || arguments.callee.caller.arguments[0];
		            this.oInputDisplay  = new JBarDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,180,null);
			        var shtml = "<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"转出类型","transferType")+":";
			        shtml = shtml + "<select id='selType' name='styles'>"
			        shtml = shtml + 	"<option value=0 selected>"+GetLanguageItem(this.language,"座席工号","agentID");
			        shtml = shtml + 	"<option value=1 >"+GetLanguageItem(this.language,"外呼号码","outerNum");
			        shtml = shtml + 	"<option value=2 >"+GetLanguageItem(this.language,"服务号码","serviceNum");
			        shtml = shtml + 	"</select></p>"
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"转出","transferout")+"' >";
			        shtml = shtml + 	"<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='"+GetLanguageItem(this.language,"取消","cancel")+"' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"转出","transferout"));    
		            this.oInputDisplay.display();
		        }
	        }
	        break;
	    case cmdConsult:
	        {
	            if(this.displayType == NotSurrport_Jquery)
	            {
                    var spevent = window.event || arguments.callee.caller.arguments[0];
	                this.oInputDisplay  = new divDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,180,1,0,null);
			        var shtml = "<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"咨询类型","consultTypeType"+":");
			        shtml = shtml + "<select id='selType' name='styles'>"
			        shtml = shtml + 	"<option value=0 selected>"+GetLanguageItem(this.language,"座席工号","agentID");
			        shtml = shtml + 	"<option value=1 >"+GetLanguageItem(this.language,"外呼号码","outerNum");
			        shtml = shtml + 	"<option value=2 >"+GetLanguageItem(this.language,"服务号码","serviceNum");
			        shtml = shtml + 	"</select></p>"
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"咨询","consult")+"' >";
			        shtml = shtml + 	"<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='"+GetLanguageItem(this.language,"取消","cancel")+"' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"咨询","consult"));    
		            this.oInputDisplay.show(1);
		        }
		        else
		        {
				    if(this.oInputDisplay )
				    {  
					    this.oInputDisplay.close();
					    this.oInputDisplay  = null;
				    }
                    var spevent = window.event || arguments.callee.caller.arguments[0];
		            this.oInputDisplay  = new JBarDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,180,null);
			        var shtml = "<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"咨询类型","consultTypeType")+":";
			        shtml = shtml + "<select id='selType' name='styles'>"
			        shtml = shtml + 	"<option value=0 selected>"+GetLanguageItem(this.language,"座席工号","agentID");
			        shtml = shtml + 	"<option value=1 >"+GetLanguageItem(this.language,"外呼号码","outerNum");
			        shtml = shtml + 	"<option value=2 >"+GetLanguageItem(this.language,"服务号码","serviceNum");
			        shtml = shtml + 	"</select></p>"
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"咨询","consult")+"' >";
			        shtml = shtml + 	"<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='"+GetLanguageItem(this.language,"取消","cancel")+"' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"咨询","consult"));  
		            this.oInputDisplay.display();
		        }
	        }
	        break;
	    case cmdSendDTMF:
    	    {
	            if(this.displayType == NotSurrport_Jquery)
	            {
                    var spevent = window.event || arguments.callee.caller.arguments[0];
	                this.oInputDisplay  = new divDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,220,1,0,null);
			        var shtml = "";
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        //1,2,3
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",1)' type='button' value='  1  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",2)' type='button' value='  2  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",3)' type='button' value='  3  ' ><br>";
			        //4,5,6
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",4)' type='button' value='  4  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",5)' type='button' value='  5  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",6)' type='button' value='  6  ' ><br>";
			        //7,8,9
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",7)' type='button' value='  7  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",8)' type='button' value='  8  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",9)' type='button' value='  9  ' ><br>";
			        //*,0,#
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",*)' type='button' value='  *  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",0)' type='button' value='  0  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",#)' type='button' value='  #  ' >";
			        
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"二次拨号","senddtmf")+"' >";
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='  "+GetLanguageItem(this.language,"取消","cancel")+"  ' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"二次拨号","senddtmf"));    
		            this.oInputDisplay.show(1);
		        }
		        else
		        {
				    if(this.oInputDisplay )
				    {  
					    this.oInputDisplay.close();
					    this.oInputDisplay  = null;
				    }
                    var spevent = window.event || arguments.callee.caller.arguments[0];
		            this.oInputDisplay  = new JBarDialog(parseInt(spevent.clientX),parseInt(spevent.clientY),260,240,null);
			        var shtml = "";
			        shtml = shtml + 	"<p>&nbsp;&nbsp;"+GetLanguageItem(this.language,"目标号码","destNum")+":<input type='text' id='txtDestNum' size=\29\ ></p>";	
			        //1,2,3
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",1)' type='button' value='  1  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",2)' type='button' value='  2  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",3)' type='button' value='  3  ' ><br>";
			        //4,5,6
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",4)' type='button' value='  4  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",5)' type='button' value='  5  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",6)' type='button' value='  6  ' ><br>";
			        //7,8,9
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",7)' type='button' value='  7  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",8)' type='button' value='  8  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",9)' type='button' value='  9  ' ><br>";
			        //*,0,#
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",*)' type='button' value='  *  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",0)' type='button' value='  0  ' >";
			        shtml = shtml + 	"&nbsp;<input  onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+",#)' type='button' value='  #  ' >";
			        
			        shtml = shtml + 	"<p align='center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='ok' onclick='application.oJBarDisplayer.MethodFromUI("+parseInt(id)+")' type='button' value='"+GetLanguageItem(this.language,"二次拨号","senddtmf")+"' >";
			        shtml = shtml + 	"&nbsp;&nbsp;&nbsp;<input id='cancel' onclick='application.oJBarDisplayer.CloseDlg();' type='button' value='  "+GetLanguageItem(this.language,"取消","cancel")+"  ' ></p>";
			        this.oInputDisplay.setSetContent(shtml);	
			        this.oInputDisplay.setTitle(GetLanguageItem(this.language,"二次拨号","senddtmf"));    
		            this.oInputDisplay.display();
		        }
	        }
	        break;
	    case cmdBridge:
	        break;
	    case cmdAlternate:
	        break;
	    case cmdConfigurate:
	        break;
	    case cmdForceReset:
	        application.oJVccBar.ForceReset();
	        break;
	    case cmdBeginRecord:
	        break;
	    case cmdStopRecord:
	        break;
	    case cmdListen:
	        break;
	    case cmdInsert:
	        break;
	    case cmdIntercept:
	        break;
	    case cmdForeReleaseCall:
	        break;
	    case cmdBeginPlay:
	        break;
	    case cmdStopPlay:
	        break;
	    case cmdLock:
	        break;
	    case cmdUnLock:
	        break;
	    case cmdMute:
	        break;
	    case cmdCallBack:
	        break;
	    case cmdReCall:
	        break;
	    case cmdHelp:
	        break;
	    }
	    
	}
	
	//########################//
	//界面回调方法
	//########################//
	this.MethodFromUI = function(nType,param){ 
	    switch(nType)
	    {
	        case cmdMakeCall:
	        {
	            var sDestNum = trimStr(this._contentWindow.document.getElementById("txtDestNum").value);
	            if(sDestNum == "")
	            { 
	                if(this.language==lg_zhcn)
	                    alert("对方号码不能为空!");
	                else
	                    alert("destNum can't be empty"); 
	                return;
	            }
	            var oSelType = this._contentWindow.document.getElementById("selType");
	            var callType = oSelType.options[oSelType.options.selectedIndex].value;
	            if(callType == 0){
	                application.oJVccBar.CallIn(sDestNum,5,"","",param);
	            }
	            else{
	                application.oJVccBar.MakeCall(sDestNum,3,"","","","",0,"","","",param);
	            }
	        }
	        break;
	        case cmdConsult:
	        {
	            var sDestNum = trimStr(this._contentWindow.document.getElementById("txtDestNum").value);
	            if(sDestNum == "")
	            { 
	                if(this.language==lg_zhcn)
	                    alert("对方号码不能为空!");
	                else
	                    alert("destNum can't be empty"); 
	                return;
	            }
	            var oSelType = this._contentWindow.document.getElementById("selType");
	            var callType = oSelType.options[oSelType.options.selectedIndex].value;
	            application.oJVccBar.Consult(callType,sDestNum);
	        }
	        break;
       	    case cmdSendDTMF:
	        {
	            if(typeof(param) != "undefined"){
	                this._contentWindow.document.getElementById("txtDestNum").value = this._contentWindow.document.getElementById("txtDestNum").value+param;
	                return ;
	            }
	            var sDestNum = trimStr(this._contentWindow.document.getElementById("txtDestNum").value);
	            if(sDestNum == "")
	            { 
	                if(this.language==lg_zhcn)
    	                alert("二次拨号键不能为空!"); 
	                else
	                    alert("key can't be empty"); 
	                return;
	            }
            
	            application.oJVccBar.SendDTMF(sDestNum);
	        }
	        break;
	        case cmdTransferOut:
	        {
	            var sDestNum = trimStr(this._contentWindow.document.getElementById("txtDestNum").value);
	            if(sDestNum == "")
	            { 
	                if(this.language==lg_zhcn)
	                    alert("对方号码不能为空!");
	                else
	                    alert("destNum can't be empty"); 
	                return;
	            }
	            var oSelType = this._contentWindow.document.getElementById("selType");
	            var callType = oSelType.options[oSelType.options.selectedIndex].value;
	            application.oJVccBar.TransferOut(callType,sDestNum);
	        }
	        break;
	    }	    
	}
	this.CloseDlg = function(){
		this.oInputDisplay.close();
		this.oInputDisplay  = null;
	}
	
	

	//########################//
	//外部方法
	//########################//
	//1）、初始化电话条
	this.SerialBtn = function (showIDs, hideID) {
	    this._clearBtns();
	    this.oBarDisplay.innerHTML = "";
	    showIDs = this._getShowIDs(showIDs, hideID);
	    this._showBtns = showIDs.split(",");
	    for (var i = 0; i < this._showBtns.length; i++) {
	        if (this.displayType == NotSurrport_Jquery) {
	            //var oBtn = this._contentWindow.document.createElement("<input type='button' value='"+this._getCmdTextByID(this._showBtns[i])+"' id='btn_"+this._showBtns[i]+"' onclick='application.oJBarDisplayer._btnClick("+this._showBtns[i]+");' />");
	            var oBtn = this._window.document.createElement("<input type='button' value='" + this._getCmdTextByID(this._showBtns[i]) + "' id='btn_" + this._showBtns[i] + "' onclick='application.oJBarDisplayer._btnClick(" + this._showBtns[i] + ");' />");
	            this.oBarDisplay.appendChild(oBtn);
	        }
	        else {
	            //var oBtn = this._contentWindow.document.createElement("a");
	            var oBtn = this._window.document.createElement("a");
	            oBtn.id = "btn_" + this._showBtns[i];
	            oBtn.btnType = "link";
	            oBtn.href = "#";
	            oBtn.setAttribute("class", "easyui-linkbutton");
	            oBtn.setAttribute("data-options", "plain:true,iconCls:'" + this._getCmdIconByID(this._showBtns[i]) + "'");
	            oBtn.innerHTML = this._getCmdTextByID(this._showBtns[i]);
	            oBtn.setAttribute("onclick", "application.oJBarDisplayer._btnClick('" + this._showBtns[i] + "')");
	            this.oBarDisplay.appendChild(oBtn);
	        }
	    }
	    if (this.displayType == Surrport_Jquery) {
	        // $.parser.parse();
	        $.parser.parse('#' + this.name);
	    }
        //var nWidth = 
	    //alert($('#' + this.name).width);
	    this.SetSubBusyStatus(this._busySubStatus);
	}
	//根据电话条事件改变按钮状态
	this.ChangeBtnStatus = function(btns){
	    this._btnEnableIDs = btns;
	    for( var i=0;i<this._showBtns.length;i++)
	    {	
	       if(this.displayType == NotSurrport_Jquery)
	       {    
              // var oBtn = this._contentWindow.document.getElementById("btn_"+this._showBtns[i]);
               var oBtn = this._window.document.getElementById("btn_"+this._showBtns[i]);
               oBtn.disabled = true;                   
           }
           else
           {
                $("#btn_"+this._showBtns[i]).linkbutton('disable');	
           }   
	    }	       
	    var arrbtn = btns.split("|"); 	
	    for(var j=0;j<arrbtn.length;j++)
	    {
	       if(this.displayType == NotSurrport_Jquery)
	       {    
	            //var oBtn = this._contentWindow.document.getElementById("btn_"+arrbtn[j]);
	            var oBtn = this._window.document.getElementById("btn_"+arrbtn[j]);
	            if(oBtn == null)
	                continue;
	            oBtn.disabled = false;
	        }
	        else
	        {
                $("#btn_"+arrbtn[j]).linkbutton('enable');	
	        }	        
	    }
	}
	//设置忙碌子状态
	this.SetSubBusyStatus = function(param){
	    this._busySubStatus = param;
	    var busyID = cmdSetBusy.toString();
        if(this.displayType == NotSurrport_Jquery)
        {    
           var oBtn = this._contentWindow.document.getElementById("btn_"+busyID);
           if(oBtn == null)
                return ;
           oBtn.disabled = true;                   
        }
        else
        {   
           //var oBtn = this._contentWindow.document.getElementById("btn_"+busyID);
           var oBtn = this._window.document.getElementById("btn_"+busyID);
           if(oBtn == null)
                return ;
            var  menuHtml = this._makeSubBusyMenuHtml(param);
		    if(this.oBusyMenu != null)
		    {
		        if(this._contentWindow == this._window){
    		        this._contentWindow.document.body.removeChild(this.oBusyMenu);
    		    }
    		    else{
    		        this._contentWindow.removeChild(this.oBusyMenu);
    		    }
    		    this.oBusyMenu = null;
		    }
		    if(this.oBusyMenu == null)
            {
                this.oBusyMenu = this._window.document.createElement("DIV");
                this.oBusyMenu.id = "busymenu";
                this.oBusyMenu.style.width ="150px";
                if(this._contentWindow == this._window){
		            this._contentWindow.document.body.appendChild(this.oBusyMenu);
		        }
		        else{
		            this._contentWindow.appendChild(this.oBusyMenu);
		        }		        
    		}
    		
	        this.oBusyMenu.innerHTML = menuHtml;
		    
		    if(menuHtml == "")
		    {
		        if(this._contentWindow == this._window){
    		        this._contentWindow.document.body.removeChild(this.oBusyMenu);
    		    }
    		    else{
    		        this._contentWindow.removeChild(this.oBusyMenu);
    		    }
    		    this.oBusyMenu = null;
  				oBtn.setAttribute("class", "easyui-linkbutton");			
				oBtn.setAttribute("data-options", "plain:true,iconCls:'"+this._getCmdIconByID(busyID)+"'");
                oBtn.innerHTML = this._getCmdTextByID(busyID);
            }
            else
            {
                oBtn.setAttribute("class", "easyui-menubutton");
                oBtn.setAttribute("data-options", "menu:'#busymenu',iconCls:'"+this._getCmdIconByID(busyID)+"'");
                oBtn.innerHTML = this._getCmdTextByID(busyID);
            }
        }   
        if(this.displayType == Surrport_Jquery)
		{
            if(this.oInputDisplay )
            {
                this.oInputDisplay.close();
                this.oInputDisplay  = null;
            }
		    $.parser.parse();
		}
        this.ChangeBtnStatus(this._btnEnableIDs);
	}
	//执行变化条忙碌子状态命令
	this.SetSubBusy = function (cmdId,cmdText){
	    this._busySubStatusSelectedItem = cmdText;
	    application.oJVccBar.SetBusy(cmdId);
	}
	this.SetRingFlag = function(bRing){
		this._onRing = bRing;
	}
	//设置座席子状态,从而实现座席
	this.SetAgentStatus = function(agentStatus){
	    //通话算一个状态
	    if(this._agentStatus == agentStatus &&  this._agentStatus != 3)
	        return;
	    this._agentStatus = agentStatus;
	    this._timerCount = 0;
	    if(this._agentStatus>0)
	    {
            BeginAgentStatusTimer();
	    }
	    else
	    { 
            StopAgentStatusTimer();
	    }
	}
	//统计电话条某个状态的时间
	this.AgentStatusTimeSum = function(){
	   this._timerCount = this._timerCount+1;
	   this.showAgentStatusTimer();
    }
    this.getTimerString = function  (len){  
        if(len == 0)
            return "";        
         var  hour = parseInt(len/3600);
	     hour =(hour<10 ? "0"+hour:hour);
	     if(hour == "00")
	        hour = "";
	     else
	        hour = hour+":"
	        
	     var  minute = parseInt((len%3600)/60);
	     minute =(minute<10 ? "0"+minute:minute);
	     var  second = len%60;
	     second =(second<10 ? "0"+second:second);
    	 
	    return (hour.toString()+minute.toString()+":"+second.toString());
    }
    this.getTextByStatus = function getTextByStatus(){
		if(this._agentStatus == 1){
	        if(this._busySubStatusSelectedItem != "")
			    return this._busySubStatusSelectedItem;
		    if(this.language == language_zhcn)
		        return "忙碌";
		    else
		        return "busy";
	    }
	    else if(this._agentStatus == 2){
		    if(this.language == language_zhcn)
    			return "就绪";
		    else
		        return "idle";
	    }
	    else if(this._agentStatus == 3){
	    	if(this._onRing == 1)
			{
				if(this.language == language_zhcn)
					return "振铃";
				else
					return "alerting";
			}
			else
			{
				if(this.language == language_zhcn)
					return "通话中";
				else
					return "calling";
			}
	    }
	    else if(this._agentStatus == 4){
		    if(this.language == language_zhcn)
    			return "后续态";
		    else
		        return "wrapup";
	    }
	    else{
		    if(this.language == language_zhcn)
    			return "未登录";
		    else
		        return "null";
	    }	
    }
    this.showAgentStatusTimer = function (){
	    var busyID = cmdSetWrapUp.toString();
        if(this.displayType == NotSurrport_Jquery)
        {    
           //var oBtn = this._contentWindow.document.getElementById("btn_"+busyID);
           var oBtn = this._window.document.getElementById("btn_"+busyID);
           if(oBtn == null)
                return ;
           oBtn.disabled = true;                   
        }
        else
        {   
           //var oBtn = this._contentWindow.document.getElementById("btn_"+busyID);
           var oBtn = this._window.document.getElementById("btn_"+busyID);
           if(oBtn == null)
                return ;
            if(this._timerCount == 0)
                oBtn.innerHTML = this.getTextByStatus();
            else
                oBtn.innerHTML = this.getTextByStatus()+"("+this.getTimerString(this._timerCount)+")";
        }   
    }
    this.ShowSelfPrompt = function(code,description){
       // JSMessageBox("&nbsp;&nbsp;<li>code:【"+code+"】</li> <li>&nbsp;&nbsp;description:【"+description+"】</li>");
		JSMessageBox("&nbsp;&nbsp;code:【"+code+"】<br>&nbsp;&nbsp;description:【"+description+"】");
    }
	


	//--------------------------------------------------------------------------------------------------
	// 调整显示区域的大小
	//--------------------------------------------------------------------------------------------------
	this.show = function show(border)	{
		if( this.oBarDisplay )
		{
			if(typeof(border) == "undefined" )
				border = 0;
			if(border>0)
				this.oBarDisplay.style.border =  "1px solid #008AC6";
			else
				this.oBarDisplay.style.border = "0px";
		}
		//this.resize(this.left,this.top,this.width,this.height);
	}
	this.resize=function resize(nLeft,nTop,nWidth,nHeight){
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>0)?nWidth:100;
		this.height	= (nHeight>0)?nHeight:100;
		with(this.oBarDisplay.style)
		{
			pixelWidth		= this.width;
			pixelHeight		= this.height;
			pixelLeft		= this.left;
			pixelTop		= this.top;
		}
	}

	this._createObject();
	
	return this;
}

///////////////////////////////////////
///  支持不支持Jquer的对话框
///////////////////////////////////////
var oDialog  = null;
function divDialog(nLeft,nTop,nWidth,nHeight,isMove,isResize,oContentWindow){
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	this.ismove			= isMove;
	this.isresize	    = isResize;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	
	this.oPanel = null;
	oDialog = this;
	this.isIe = isBrowserIE()?1:0;
	this.showflag = 0;


	this._createObject = function () {
	    this.oPanel = this._contentWindow.document.createElement("div");
	    this.oPanel.id = "panelDiv";
	    this.oPanel.style.position = "absolute";
	    this.oPanel.style.backgroundColor = "#E5E5E5"
	    this.oPanel.style.padding = "2px 3px 3px 2px";
	    this.oPanel.style.overflow = "hidden";
	    //   this.oPanel.style.zIndex = 1;
	    this.oPanel.style.width = this.width;
	    this.oPanel.style.height = this.height;
	    this.oPanel.style.left = this.left;
	    this.oPanel.style.top = this.top;
	    this._contentWindow.document.body.appendChild(this.oPanel);
	    this._setChild("");
	}
	this._setChild = function (content){
          //底色
          var backDiv = this._contentWindow.document.createElement("div");
          backDiv.style.cssText = "left: 0px; top: 0px; width: 100%; height: 100%; background-color: #F5F5F5;";
          this.oPanel.appendChild(backDiv);
          this.oPanel.backDiv = backDiv;
          //标题
          var topDiv = document.createElement("div");
          topDiv.style.cssText = "left: 2px; top: 2px; width: 100%; height: 24px; position: absolute; background-color: #78ABFF; vertical-align: middle; z-index: 5";
          if (this.ismove)
          {
               topDiv.style.cursor = "move";
               if(this.isIe)
                   topDiv.setAttribute("onmousedown", function(){oDialog.setMove(this)});
               else
                   topDiv.setAttribute("onmousedown", "oDialog.setMove();");
          }
          else
          {
               topDiv.style.cursor = "default";
          }
          topDiv.innerHTML = "<span style='top: 5px; left:5px; font-size: 16px; font-weight: bold; color: #102548; position: relative;' onselectstart='return false'>标题栏</span>";
          this.oPanel.appendChild(topDiv);
          this.oPanel.topDiv = topDiv;
         
          //关闭按钮
          var closeDiv = this._contentWindow.document.createElement("div");
          closeDiv.style.cssText = "right: 8px; top : 5px; width: 24px; height: 18px; position: absolute; background-color: #E4EEFF; border: #2D66C4 1px solid; text-align: center; vertical-align: middle; cursor: pointer; z-index: 10";
          if(this.isIe){
              closeDiv.oParent = this;
              closeDiv.setAttribute("onclick", function() {oDialog.eCloseDiv();});
          }
          else{
              closeDiv.setAttribute("onclick", "oDialog.eCloseDiv();");
          }
          closeDiv.innerHTML = "<span style='font-size: 16px; font-weight: bold; color: #0E377A;' title='Esc快捷键'>×</span>";
          this.oPanel.appendChild(closeDiv);
          this.oPanel.closeDiv = closeDiv;
         
          //内容
          var contentDiv = this._contentWindow.document.createElement("div");
          contentDiv.style.cssText = "left: 2px; top: 35px; width: 100%; position: absolute; overflow: auto";
          contentDiv.style.height = (parseInt(this.oPanel.style.height) - 40) + "px";
          contentDiv.innerHTML = content;//"<table style='width: 100%; height: 100%; text-align: center; vertical-align: hidden'><tr><td><p>这里是内容区！</p><a href='javascript:saveDiv()'>保留这个位置和大小</a></td></tr></table>";
          this.oPanel.appendChild(contentDiv);
          this.oPanel.contentDiv = contentDiv;
         
          //调整大小
          var reDiv = this._contentWindow.document.createElement("div");
          reDiv.style.cssText = "right: 0px; bottom: 0px; width: 5px; height: 5px; position: absolute;";
          if (isResize)
          {
	           reDiv.style.cursor = "se-resize";
	           
               if(this.isIe){
    	           reDiv.setAttribute("onmousedown", function(){oDialog.setResize()});
    	       }
    	       else{
    	           reDiv.setAttribute("onmousedown", "oDialog.setResize();");
    	       }
          }
          else
          {
		        reDiv.style.cursor = "default";
          }
          this.oPanel.appendChild(reDiv);
	}
	
	///////////////////////////////////////////////////////////////
	/// 方法
	///////////////////////////////////////////////////////////////
	this.setTitle  = function(title){
	    this.oPanel.topDiv.innerHTML = "<span style='top: 5px; left:5px; font-size: 16px; font-weight: bold; color: #102548; position: relative;' onselectstart='return false'>"+title+"</span>";
	}
	this.setSetContent = function(str){
	    this.oPanel.contentDiv.innerHTML = str;
	}
	this.show = function(flag){
	    this.showflag = flag;
	    if(this.showflag){this.oPanel.style.display = "block";}
	    else {this.oPanel.style.display = "none";}
	}

	///////////////////////////////////////////////////////////////
	/// 事件
	///////////////////////////////////////////////////////////////


	this.setResize = function(){
	
	}

	this.oTime = null;
	this.divClone = null;
	this.oDiv = null;
	this.oX; 
	this.oY; 
	this.oLeft;
	this.oTop;
	this.oWidth; 
	this.oHeight;
	this.eventType;
	this.setMove = function(obj){ 
	      var btncode = (this.isIe)?1:0;
	      if (event.button == btncode)
          { 
               if (this.oTime)
               {
                    clearTimeout(this.oTime);
                    this.divClone.parentNode.removeChild(this.divClone);
               }
               if(typeof(obj) == "undefined"){
                    obj = this.oPanel.topDiv;
               }
               this.oDiv = obj.parentNode;
               this.divClone = this.oDiv.cloneNode(true);
               this.divClone.style.filter = "Alpha(opacity=50)";
               if(this.isIe){
                   this.divClone.childNodes[1].setAttribute("onmousemove", function(){oDialog.startMove(this)});
                   this.divClone.childNodes[1].setAttribute("onmouseup", function(){oDialog.endMove()});
               }
               else{
                   this.divClone.childNodes[1].setAttribute("onmousemove", "oDialog.startMove();");
                   this.divClone.childNodes[1].setAttribute("onmouseup", "oDialog.endMove();");
               }
               this.oX = parseInt(event.clientX);
               this.oY = parseInt(event.clientY);
               this.oLeft = parseInt(this.divClone.style.left);
               this.oTop = parseInt(this.divClone.style.top);
               this._contentWindow.document.body.appendChild(this.divClone);
               this.divClone.childNodes[1].setCapture();
               this.eventType = "move";
          }

	}
	//拖移
     this.startMove = function (obj)
     {  
          var btncode = (this.isIe)?1:0;
          if (oDialog.eventType == "move" && event.button == btncode)
          {
               if(typeof(obj) == "undefined"){
                    obj = oDialog.divClone.childNodes[1];
               }
               var moveDiv = obj.parentNode;
               moveDiv.style.left = (oDialog.oLeft + event.clientX - oDialog.oX) + "px";
               moveDiv.style.top = (oDialog.oTop + event.clientY - oDialog.oY) + "px";
          }
     }
     
     //拖移结束调用动画
     this.endMove = function ()
     {
          if (this.eventType == "move")
          {
                this.divClone.childNodes[1].releaseCapture();
                this.move(parseInt(this.divClone.style.left), parseInt(this.divClone.style.top));
                this.eventType = "";
          }
     }

     //移动的动画
     this.move = function (aimLeft, aimTop)
     {
          var nowLeft = parseInt(this.oDiv.style.left);
          var nowTop = parseInt(this.oDiv.style.top);
          var moveSize = 30;
          if (nowLeft > aimLeft + moveSize || nowLeft < aimLeft - moveSize || nowTop > aimTop + moveSize || nowTop < aimTop - moveSize)
          {
               this.oDiv.style.left = aimLeft > nowLeft + moveSize ? (nowLeft + moveSize) + "px" : aimLeft < nowLeft - moveSize ? (nowLeft - moveSize) + "px" : nowLeft + "px";
               this.oDiv.style.top = aimTop > nowTop + moveSize ? (nowTop + moveSize) + "px" : aimTop < nowTop - moveSize ? (nowTop - moveSize) + "px" : nowTop + "px";
               this.oTime = setTimeout("oDialog.move(" + aimLeft + ", " + aimTop + ")", 1);
          }
          else
          { 
               this.oDiv.style.left = this.divClone.style.left;
               this.oDiv.style.top = this.divClone.style.top;
               this.divClone.parentNode.removeChild(this.divClone);
               this.divClone == null;
          }
     }
 
	////////////////////////////////////////
	this.eCloseDiv = function(){
          if (this.oPanel)
          {
              this.oPanel.parentNode.removeChild(this.oPanel);
              this.oPanel = null;
          }
	
	}
	
	
	this._createObject();
	
	return this;
}

///////////////////////////////////////
////支持Jquery的对话框
///////////////////////////////////////
function JBarDialog(nLeft,nTop,nWidth,nHeight,oContentWindow){
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oDlg_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";

	// 主图相关的HTML对象
	this.oBarDisplay		= null;	
	
	this.errDescription = "";		// 错误提示信息

	//########################//
	//			方法	　    //
	//########################//
	//内部方法
	this._createObject = function _createObject()
	{
		//<div id="dlg" class="easyui-dialog" title="Basic Dialog" data-options="iconCls:'icon-save'" 
		//style="width:400px;height:200px;padding:10px">
	    this.oBarDisplay = this._contentWindow.document.createElement("div");
		this.oBarDisplay.id = "bardlg";
		this.oBarDisplay.style.padding = "0px";
		this.oBarDisplay.style.top = this.top+"px";
		this.oBarDisplay.style.left = this.left+"px";
		this.oBarDisplay.style.width = this.width+"px";
		this.oBarDisplay.style.height = this.height+"px";
		this.oBarDisplay.className  = "easyui-dialog";
		//this.oBarDisplay.setAttribute("onClose", "alert('eeeee');");
		
		this._contentWindow.document.body.appendChild(this.oBarDisplay);
		this.oBarDisplay.innerHTML ="";
	}

	//########################//
	//外部方法
    this.setTitle  = function(title){
	    this.oBarDisplay.title = title;
	}
	this.setSetContent = function(str){
	    this.oBarDisplay.innerHTML = str;
	}


    this.display = function(){
		$.parser.parse();
		//$.parser.parse('#'+this.name);
	}
	this.close = function(){
		$("#bardlg").dialog('close');
	    if(this.oBarDisplay){
			this.oBarDisplay.parentNode.removeChild(this.oBarDisplay);
		}
	}
	//--------------------------------------------------------------------------------------------------
	// 调整显示区域的大小
	//--------------------------------------------------------------------------------------------------
	this.resize=function resize(nLeft,nTop,nWidth,nHeight)
	{
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>0)?nWidth:100;
		this.height	= (nHeight>0)?nHeight:100;
		if( this.oBarDisplay )
		{
			this.oBarDisplay.style.left = this.left+"px";
			this.oBarDisplay.style.top = this.top+"px";
			this.oBarDisplay.style.width = this.width+"px";
			this.oBarDisplay.style.height = this.height+"px";
		}
	}

	this._createObject();
	
	return this;
}

