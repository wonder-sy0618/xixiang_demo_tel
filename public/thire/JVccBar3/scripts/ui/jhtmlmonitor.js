//  *****************************************************************************
//  文 件 名：	jhtmlmonitor.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2016-11-09
//  文件描述：
// 		   监控控件
//  说    明：
//		   支持html5下带界面的质检和监控，同时支持非界面的监控数据接口
//  修改说明：
// *****************************************************************************


var G_oMonitorCtrl = null;

var G_MonitorConst = {
    Version:"3.0.0.3",
	UpdateDay:"2021.04.13",
	UI:{
		Color:{
			lineColor:"#fafafc",//"#46A3FF",
			bordColor:"#97CBFF",
			defaultGroupColor:"#ffffff",//"#f5f9ff",
			groupBackColor:"#ffffff", //#fafafc,
            agentBorderColor:"black"
		},
        line:{
		  mainBorder:0,
          tableBorder:0,
          agentBorder:1
        },
        AgentConst:[
            {"color":"#868686","name":"签出","eng_name":"Signout","index":"0"},
            {"color":"#ff6666","name":"忙碌","eng_name":"NotReady","index":"1"},
            {"color":"#18BD9C","name":"空闲","eng_name":"Ready","index":"2"},
            {"color":"#3D8AFB","name":"通话中","eng_name":"calling","index":"3"},
            {"color":"#678A34","name":"后处理","eng_name":"WorkingAfterCall","index":"4"},
            {"color":"#fafd65","name":"查询","eng_name":"Query","index":"5"},
            {"color":"#E6E8FC","name":"告警","eng_name":"Alarm","index":"6"}
        ],
		AgentSize:{
        	height:80,
			width:62,
		},
        uve:{
		    useul:0
        },
        AgentSubBusy:{
		    ids:[],
            texts:[]
        },

		HeadTabs:[
			{"id":"idlableAgent","name":"座席监控","eng_name":"Agent","index":"0"},
			{"id":"idlableTask","name":"外呼任务","eng_name":"Task","index":"1"},
			{"id":"idlableService","name":"服务监控","eng_name":"Service","index":"2"},
			{"id":"idlableIvr","name":"Ivr监控","eng_name":"Ivr","index":"3"},
            {"id":"idlableTrunk","name":"中继监控","eng_name":"trunk","index":"4"},
            {"id":"idlableWallReport","name":"大屏展示","eng_name":"WallBroad","index":"5"},
			{"id":"idlableDebug","name":"调试日志","eng_name":"Debug","index":"6"}
		],
		HeadSetting:[
			{"id":"idlableSetting","name":"设置","showFlag":"0"},
			{"id":"idlableStatus","name":"坐席状态","showFlag":"1"}
		],
		ConStatus:['尚未连接服务器,无法监控！','连接服务器成功，正在监控中!','连接服务器成功，可以质检!'],
        eng_ConStatus:['not login,can not monitor!','logined，monitoring!','logined, can monitor!']
	},
    vccid:"",
    timeOffSet:0,
	wallbordConfig:{
		ip:"",
		port:14502
	},

	mainSetting:{
		logFlag:{id:"MS_CHeck_LogFlag",value:1,des:"缓存日志",eng_des:"Cache Logs"},
		tabGroupDataClose:{id:"MS_CHeck_TabClose",value:0,des:"页面切换时，停止对原监控页面数据监控",eng_des:"When the page is switched, the original monitoring page data is stopped."},
		agentMenuCmd:{id:"MS_CHeck_AgentNemuCmd",value:1,des:"座席右键支持监听功能",eng_des:"Surpport the monitor function by right mouse-click in agent page"},
		agentStatics:{id:"MS_CHeck_AgentStatics",value:1,des:"座席提示中支持查看座席工作信息",eng_des:"Surpport display agent work info in agent tips"},
	},

	agentSTTable:[
		{"name":"shortagentid","alias":"座席工号", "showFlag":"1"},
		{"name":"name","alias":"座席姓名", "showFlag":"1"},
		{"name":"astate","alias":"当前状态", "showFlag":"1"},
		{"name":"lastLoginTime","alias":"最后登入时间", "showFlag":"1"},
		{"name":"lastLogoutTime","alias":"最后登出时间", "showFlag":"1"},
		{"name":"loginTime","alias":"登入总时间", "showFlag":"1"},
		{"name":"notReadyTime","alias":"未就绪总时间", "showFlag":"1"},
	],

    ServiceTable:[
		{"name":"shortServiceId","alias":"服务号","eng_alias":"Service Id", "showFlag":"1"},
		{"name":"serviceName","alias":"服务名称","eng_alias":"Service Name", "showFlag":"1"},
		{"name":"hsNotQueueCnt","alias":"未进入队列|电话总数","eng_alias":"The Total Nums of Not Queue", "showFlag":"0"},
		{"name":"sum_hsQueueCnt","alias":"当日排|队总数","eng_alias":"The Total Nums of Queuing This Day", "showFlag":"1"},
		{"name":"hsInCnt","alias":"呼入电|话总数","eng_alias":"The Callin Total Nums", "showFlag":"1"},
		{"name":"hsAnswerCnt","alias":"接听电|话总数","eng_alias":"The Connected Total Nums", "showFlag":"1"},
		{"name":"hsOverflowCnt","alias":"溢出电|话总数","eng_alias":"The runoff Total Nums", "showFlag":"1"},
		{"name":"hsTransferCnt","alias":"转接电|话总数","eng_alias":"The Transfer Total Nums", "showFlag":"1"},
		{"name":"hsQueueAbandonCnt","alias":"排队时|挂机数","eng_alias":"The Disconnect Total Nums in Queuing", "showFlag":"1"},
		{"name":"hsRingAbandonCnt","alias":"振铃时|挂机数","eng_alias":"The Disconnect Total Nums in Ring", "showFlag":"1"},
		{"name":"slSLTSet","alias":"服务水|平秒数","eng_alias":"The Average Service Seconds", "showFlag":"1"},
		{"name":"slAnswerCntInSLT","alias":"服务水平|内总数","eng_alias":"The Total of Service", "showFlag":"1"},
		{"name":"slValue","alias":"服务水平(%)","eng_alias":"The Service Rate", "showFlag":"1"},
		{"name":"slWaitTimeInSLT","alias":"等待时间未超过服|务水平电话数","eng_alias":"No waiting time exceeded the level of service", "showFlag":"0"},
		{"name":"hsPerAnswerWaitTime","alias":"接通平均|等待时间(秒)","eng_alias":"Connect Average waiting time(S)", "showFlag":"1"},
		{"name":"hsPerAbandonWaitTime","alias":"放弃平均|等待时间(秒)","eng_alias":"Cancel Average waiting time(S)", "showFlag":"1"},
		{"name":"hsPerAnswerTime","alias":"平均通话|时间(秒)","eng_alias":"Average connect time(S)", "showFlag":"1"},
		{"name":"hsMaxQueueLen","alias":"当日排队|最大数","eng_alias":"Maximum queuing days", "showFlag":"1"},
		{"name":"hsMaxQueueWaitTime","alias":"当日排队|最长等待|时间（秒）","eng_alias":"Maximum queue waiting time(S)", "showFlag":"0"},
		{"name":"hsOutAnswerCnt","alias":"外拨通|话总数","eng_alias":"Callout Call Nums", "showFlag":"1"},
		{"name":"hsOutPerAnswerTime","alias":"外拨平均|通话时间","eng_alias":"Outgoing Average Call time", "showFlag":"1"},
	],
    SingleServiceTable:[
        {"name":"shortServiceId","alias":"服务号","eng_alias":"Service Id", "showFlag":"1"},
        {"name":"serviceName","alias":"服务名称","eng_alias":"Service Name", "showFlag":"1"},
        {"name":"serviceType","alias":"分配策略","eng_alias":"Allocation Strategy", "showFlag":"1"},
        {"name":"curTime","alias":"当前时间","eng_alias":"Current Time", "showFlag":"1"},
        {"name":"hsQueueCnt","alias":"当前排队数","eng_alias":"Current Queue Number", "showFlag":"1"},
        {"name":"hsMaxWaitTime","alias":"最长等待时间(秒)","eng_alias":"Maximum Waiting Time(S)", "showFlag":"1"},
        {"name":"hsAllAgentCnt","alias":"所有座席数","eng_alias":"Total Agent Nums", "showFlag":"1"},
        {"name":"hsLoginCnt","alias":"登入座席数","eng_alias":"Login Agent Nums", "showFlag":"1"},
        {"name":"hsReadyCnt","alias":"空闲座席数","eng_alias":"Ready Agent Nums", "showFlag":"1"},
        {"name":"hsDelayCnt","alias":"后处理座席","eng_alias":"WorkingAfterCall Agent Nums", "showFlag":"1"},
        {"name":"hsLineBusyCnt","alias":"通话中座席数","eng_alias":"Calling Agent Nums", "showFlag":"1"},
        {"name":"NumCallInQExceedSLT","alias":"等待时间超过SLT","eng_alias":"Waiting Time Exceeds SLT", "showFlag":"1"},
        {"name":"hsLogoutCnt","alias":"登出座席数","eng_alias":"Logout Agent Nums", "showFlag":"1"},
        {"name":"hsNotReadyCnt","alias":"未就绪座席数","eng_alias":"NotReady Agent Nums", "showFlag":"1"},
        {"name":"hsDNDFWD","alias":"勿干扰座席数","eng_alias":"NoDisturb Agent Nums", "showFlag":"0"},
        {"name":"hsWrongCnt","alias":"出错座席数量","eng_alias":"Wrong Agent Nums", "showFlag":"0"},
    ],
    SingleServiceQueueColineTable:[
        {"name":"index","alias":"编号","eng_alias":"ID", "showFlag":"1"},
        {"name":"callSession","alias":"识别号码","eng_alias":"Identification", "showFlag":"1"},
        {"name":"callTimeStamp","alias":"进入队列时间","eng_alias":"Line Enter Time", "showFlag":"1"},
        {"name":"hsCallerId","alias":"来电号码","eng_alias":"Call Number", "showFlag":"1"},
        {"name":"hsCallerName","alias":"来电名称","eng_alias":"Call Name", "showFlag":"1"},
        {"name":"hsCallerPri","alias":"优先权(0-999)","eng_alias":"The Priority(0-999)", "showFlag":"1"},
        {"name":"callType","alias":"呼叫类型(0: 呼入 1: 呼出)","eng_alias":"CallType(0:Callin 1:Callout)", "showFlag":"1"},
    ],

	Task4Table:[
        {"name":"taskID","alias":"外呼标识","eng_alias":"Out-call task ID", "showFlag":"1"},
        {"name":"taskName","alias":"外呼名称","eng_alias":"Out-call task name", "showFlag":"1"},
        {"name":"vccID","alias":"企业号","eng_alias":"Company Id", "showFlag":"0"},
        {"name":"monitorID","alias":"监控组号","eng_alias":"Group ID", "showFlag":"0"},
        {"name":"count","alias":"外呼任务数目","eng_alias":"Out-call task times", "showFlag":"0"},
        {"name":"taskType","alias":"外呼类型","eng_alias":"Out-call type", "showFlag":"0"},
        {"name":"startTime","alias":"开始时间","eng_alias":"Starting time", "showFlag":"0"},
        {"name":"time","alias":"更新时间","eng_alias":"Update Time", "showFlag":"0"},
        {"name":"AgentNum","alias":"登录座席数","eng_alias":"Login agent number", "showFlag":"0"},
        {"name":"QueueNum","alias":"排队数","eng_alias":"Numbers in queue", "showFlag":"0"},
        {"name":"MaxCallTime","alias":"最大外呼遍数","eng_alias":"Maximum number of out-call", "showFlag":"0"},
        {"name":"MaxPhoneId","alias":"号码总数","eng_alias":"Total number of calls", "showFlag":"1"},
        {"name":"ConnectRecNum","alias":"当前接通数量","eng_alias":"Connected call number", "showFlag":"1"},
        {"name":"ConnectRate","alias":"接通率(%)","eng_alias":"Pick up rate", "showFlag":"1"},
        {"name":"IdleAgentNum","alias":"当前空闲座席数","eng_alias":"Current idle agent number", "showFlag":"1"},
        {"name":"Progress","alias":"第一遍当前号码序号","eng_alias":"The first current serial number", "showFlag":"1"},
        {"name":"Progress2","alias":"第二遍当前号码序号","eng_alias":"The second current serial number", "showFlag":"0"},
        {"name":"Progress3","alias":"第三遍当前号码序号","eng_alias":"The third current serial number", "showFlag":"0"},
        {"name":"SecNumFromUrl","alias":"第三方本秒给号数","eng_alias":"Get number from the 3rd party in this second", "showFlag":"0"},
        {"name":"TotalNumFromUrl","alias":"第三方总给号数","eng_alias":"Total number given by third party", "showFlag":"0"},
        {"name":"CallNumPerMin","alias":"外呼速度(次/分)","eng_alias":"Out-call speed", "showFlag":"0"},
        {"name":"AvgServSec","alias":"平均服务时长(秒)","eng_alias":"Average service time", "showFlag":"1"},
        {"name":"AvgIdelSec","alias":"平均空闲时长(秒)","eng_alias":"Average available time", "showFlag":"1"},
        {"name":"SpeedAdjustFactor","alias":"外呼速度调整系数","eng_alias":"Out-call speed adjustment ratio", "showFlag":"1"},
        {"name":"RecentConnectRate","alias":"近期接通率(%)","eng_alias":"Recent connection rate", "showFlag":"0"},
        {"name":"RecentLossRate","alias":"近期呼损率(%)","eng_alias":"Recent unanswered rate", "showFlag":"0"},
        {"name":"AvgLossRate","alias":"平均呼损率(%)","eng_alias":"Average unanswered rate", "showFlag":"0"},
        {"name":"CurrentRingNum","alias":"当前振铃数","eng_alias":"Current ring number", "showFlag":"0"},
        {"name":"ConnectAgentNum","alias":"当前通话数","eng_alias":"Current call number", "showFlag":"0"},
        {"name":"TidyAgentNum","alias":"当前后处理数","eng_alias":"Current workingAfterCall number", "showFlag":"0"},
        {"name":"UnConnRecNum","alias":"当前未接通数量","eng_alias":"Current not connected amount", "showFlag":"0"},
        {"name":"LossRecNum","alias":"呼损数量","eng_alias":"Loss amount", "showFlag":"1"},
        {"name":"SecCallNumInfact","alias":"本秒实际外呼次数","eng_alias":"Actual out-call amount in the second", "showFlag":"0"},
        {"name":"SecCallNumShould","alias":"本秒计划外次数","eng_alias":"Out-call amount out of plan in the Second", "showFlag":"0"},
        {"name":"RecZ","alias":"话单Z值","eng_alias":"The Bill Z value", "showFlag":"0"},
        {"name":"Url","alias":"第三方取号URL","eng_alias":"The URL of The 3rd Party", "showFlag":"0"},
        {"name":"MinServSec","alias":"最小服务时长","eng_alias":"The Min Time of Service", "showFlag":"0"},
        {"name":"MaxServSec","alias":"最大服务时长","eng_alias":"The Max Time of Service", "showFlag":"0"},
        {"name":"MinIdelSec","alias":"最小空闲时长","eng_alias":"The Min Idle Time", "showFlag":"0"},
        {"name":"MaxIdelSec","alias":"最大空闲时长","eng_alias":"The Max Idle Time", "showFlag":"0"},
        {"name":"Serv_0_10","alias":"10秒内电话次数","eng_alias":"Number of calls in 10s", "showFlag":"0"},
        {"name":"Serv_10_30","alias":"10~30秒电话次数","eng_alias":"Number of calls between 10-30s", "showFlag":"0"},
        {"name":"Serv_30_60","alias":"30~60秒电话次数","eng_alias":"Number of calls between 30-60s", "showFlag":"0"},
        {"name":"Serv_60_120","alias":"60~120秒电话次数","eng_alias":"Number of calls between 60-120s", "showFlag":"0"},
        {"name":"Serv_120_300","alias":"120~300秒电话次数","eng_alias":"Number of calls between 120-300s", "showFlag":"0"},
        {"name":"Serv_300_600","alias":"300~600秒电话次数","eng_alias":"Number of calls between 300-600s", "showFlag":"0"},
        {"name":"Serv_600_inf","alias":"600秒以上电话次数","eng_alias":"Number of calls above 600s", "showFlag":"0"},
        {"name":"Idle_0_10","alias":"等待10秒内电话次数","eng_alias":"Number of wait in 10s", "showFlag":"0"},
        {"name":"Idle_10_20","alias":"等待10~20秒电话次数","eng_alias":"Number of wait between 10-20s", "showFlag":"0"},
        {"name":"Idle_20_30","alias":"等待20~30秒电话次数","eng_alias":"Number of wait between 20-30s", "showFlag":"0"},
        {"name":"Idle_30_45","alias":"等待30~45秒电话次数","eng_alias":"Number of wait between 30-45s", "showFlag":"0"},
        {"name":"Idle_45_60","alias":"等待45~60秒电话次数","eng_alias":"Number of wait between 45-60s", "showFlag":"0"},
        {"name":"Idle_60_120","alias":"等待60~120秒电话次数","eng_alias":"Number of wait between 60-120s", "showFlag":"0"},
        {"name":"Idle_120_180","alias":"等待120~180秒电话次数","eng_alias":"Number of wait between 120-180s", "showFlag":"0"},
        {"name":"Idle_180_300","alias":"等待180~300秒电话次数","eng_alias":"Number of wait between 180-300s", "showFlag":"0"},
        {"name":"Idle_300_inf","alias":"等待300秒以上电|话次数","eng_alias":"Number of wait above 300s", "showFlag":"0"},
    ],
    Task4DetailTable:[
        {"name":"taskID","alias":"外呼标识","eng_alias":"Callout Id", "showFlag":"1"},
        {"name":"taskName","alias":"外呼名称","eng_alias":"Callout Name", "showFlag":"1"},
        {"name":"vccID","alias":"企业号","eng_alias":"Depart Id", "showFlag":"0"},
        {"name":"monitorID","alias":"监控组号","eng_alias":"Group Id", "showFlag":"0"},
        {"name":"count","alias":"外呼任务数目","eng_alias":"Callout Task Count", "showFlag":"0"},
        {"name":"taskType","alias":"外呼类型","eng_alias":"Callout Type", "showFlag":"1"},
        {"name":"startTime","alias":"开始时间","eng_alias":"Start Time", "showFlag":"1"},
        {"name":"time","alias":"更新时间","eng_alias":"Update Time", "showFlag":"1"},
        {"name":"AgentNum","alias":"包含座席数","eng_alias":"Include Agent Counts", "showFlag":"1"},
        {"name":"QueueNum","alias":"排队数","eng_alias":"Query Num", "showFlag":"1"},
        {"name":"MaxCallTime","alias":"最大外呼遍数","eng_alias":"Max Callout Times", "showFlag":"1"},
        {"name":"MaxPhoneId","alias":"号码总数","eng_alias":"Total Numbers", "showFlag":"1"},
        {"name":"Progress","alias":"第一遍当前号码序号","eng_alias":"The 1st Index", "showFlag":"1"},
        {"name":"Progress2","alias":"第二遍当前号码序号","eng_alias":"The 2nd Index", "showFlag":"1"},
        {"name":"Progress3","alias":"第三遍当前号码序号","eng_alias":"The 3rd Index", "showFlag":"1"},
        {"name":"SecNumFromUrl","alias":"第三方本秒给号数","eng_alias":"Get Num from The 3rd Party the second", "showFlag":"1"},
        {"name":"TotalNumFromUrl","alias":"第三方总给号数","eng_alias":"Get Total Nums from The 3rd Party", "showFlag":"1"},
        {"name":"CallNumPerMin","alias":"外呼速度(次/分)","eng_alias":"Callout Speed", "showFlag":"1"},
        {"name":"AvgServSec","alias":"平均服务时长(秒)","eng_alias":"The Average Service Time", "showFlag":"1"},
        {"name":"AvgIdelSec","alias":"平均空闲时长(秒)","eng_alias":"The Average Ready Time", "showFlag":"1"},
        {"name":"SpeedAdjustFactor","alias":"外呼速度调整系数","eng_alias":"The ratio of Adjust Speed", "showFlag":"1"},
        {"name":"RecentConnectRate","alias":"近期接通率(%)","eng_alias":"The Recent Called Rate", "showFlag":"1"},
        {"name":"RecentLossRate","alias":"近期呼损率(%)","eng_alias":"The Recent Loss Rate", "showFlag":"1"},
        {"name":"AvgLossRate","alias":"平均呼损率(%)","eng_alias":"The Average Loss Rate", "showFlag":"1"},
        {"name":"CurrentRingNum","alias":"当前振铃数","eng_alias":"Ring Nums", "showFlag":"1"},
        {"name":"IdleAgentNum","alias":"当前空闲数","eng_alias":"Idle Nums", "showFlag":"1"},
        {"name":"ConnectAgentNum","alias":"当前通话数","eng_alias":"Calling Nums", "showFlag":"1"},
        {"name":"TidyAgentNum","alias":"当前后处理数","eng_alias":"WorkingAfterCall Nums", "showFlag":"1"},
        {"name":"ConnectRecNum","alias":"当前接通总数","eng_alias":"connect Total Nums", "showFlag":"1"},
        {"name":"UnConnRecNum","alias":"当前未接通数量","eng_alias":"Not Connect Nums", "showFlag":"1"},
        {"name":"LossRecNum","alias":"呼损数量","eng_alias":"Loss Nums", "showFlag":"1"},
        {"name":"ConnectRate","alias":"接通率(%)","eng_alias":"Connect Rate", "showFlag":"1"},
        {"name":"SecCallNumInfact","alias":"本秒实际外呼次数","eng_alias":"Callout Times in the Second", "showFlag":"1"},
        {"name":"SecCallNumShould","alias":"本秒计划外|次数","eng_alias":"Plan Times in the Second", "showFlag":"1"},
        {"name":"RecZ","alias":"话单Z值","eng_alias":"The Bill Z value", "showFlag":"0"},
        {"name":"Url","alias":"第三方取号URL","eng_alias":"The URL of The 3rd Party", "showFlag":"0"},
        {"name":"MinServSec","alias":"最小服务时长","eng_alias":"The Min Time of Service", "showFlag":"0"},
        {"name":"MaxServSec","alias":"最大服务时长","eng_alias":"The Max Time of Service", "showFlag":"0"},
        {"name":"MinIdelSec","alias":"最小空闲时长","eng_alias":"The Min Idle Time", "showFlag":"0"},
        {"name":"MaxIdelSec","alias":"最大空闲时长","eng_alias":"The Max Idle Time", "showFlag":"0"},
        {"name":"Serv_0_10","alias":"10秒内电话次数","eng_alias":"Number of calls in 10 seconds", "showFlag":"0"},
        {"name":"Serv_10_30","alias":"10~30秒电话次数","eng_alias":"Number of calls in 10~30 seconds", "showFlag":"0"},
        {"name":"Serv_30_60","alias":"30~60秒电话次数","eng_alias":"Number of calls in 30~60 seconds", "showFlag":"0"},
        {"name":"Serv_60_120","alias":"60~120秒电话次数","eng_alias":"Number of calls in 60~120 seconds", "showFlag":"0"},
        {"name":"Serv_120_300","alias":"120~300秒电话次数","eng_alias":"Number of calls in 120~300 seconds", "showFlag":"0"},
        {"name":"Serv_300_600","alias":"300~600秒电话次数","eng_alias":"Number of calls in 300~600 seconds", "showFlag":"0"},
        {"name":"Serv_600_inf","alias":"600秒以上电话次数","eng_alias":"Number of calls more 600 seconds", "showFlag":"0"},
        {"name":"Idle_0_10","alias":"等待10秒内电话次数","eng_alias":"Waiting Calls of calls in 10 seconds", "showFlag":"0"},
        {"name":"Idle_10_20","alias":"等待10~20秒电话次数","eng_alias":"Waiting Calls of calls in 10~20 seconds", "showFlag":"0"},
        {"name":"Idle_20_30","alias":"等待20~30秒电话次数","eng_alias":"Waiting Calls of calls in 20~30 seconds", "showFlag":"0"},
        {"name":"Idle_30_45","alias":"等待30~45秒电话次数","eng_alias":"Waiting Calls of calls in 30~45 seconds", "showFlag":"0"},
        {"name":"Idle_45_60","alias":"等待45~60秒电话次数","eng_alias":"Waiting Calls of calls in 45~60 seconds", "showFlag":"0"},
        {"name":"Idle_60_120","alias":"等待60~120秒电话次数","eng_alias":"Waiting Calls of calls in 60~120 seconds", "showFlag":"0"},
        {"name":"Idle_120_180","alias":"等待120~180秒电话次数","eng_alias":"Waiting Calls of calls in 120~180 seconds", "showFlag":"0"},
        {"name":"Idle_180_300","alias":"等待180~300秒电话次数","eng_alias":"Waiting Calls of calls in 180~300 seconds", "showFlag":"0"},
        {"name":"Idle_300_inf","alias":"等待300秒以上电|话次数","eng_alias":"Waiting Calls of calls more 300 seconds", "showFlag":"0"},
    ],

    IvrTable:[
	    {"name":"monitorid","alias":"监控组号","eng_alias":"Group Id", "showFlag":"1"},
        {"name":"shortServiceId","alias":"服务ID","eng_alias":"Ivr ID", "showFlag":"1"},
        {"name":"serviceName","alias":"服务名称","eng_alias":"Ivr Name", "showFlag":"1"},
        {"name":"ivrAllCnt","alias":"总话路数","eng_alias":"The Total lines", "showFlag":"1"},
        {"name":"ivrUseCnt","alias":"使用话路数","eng_alias":"The Used lines", "showFlag":"1"},
    ],

    TrunkTable:[
        {"name":"trunkName","alias":"中继名称","eng_alias":"trunk name", "showFlag":"1"},
        {"name":"maxNum","alias":"最大呼叫数","eng_alias":"Maximum number of calls", "showFlag":"1"},
        {"name":"callNum","alias":"呼叫个数","eng_alias":"call Number", "showFlag":"1"},
        {"name":"callInNum","alias":"呼入个数","eng_alias":"callin Number", "showFlag":"1"},
        {"name":"callOutNum","alias":"呼出个数","eng_alias":"callout Number", "showFlag":"1"},
    ],

    WallBroadIP:"",
    WallBroadPort:0,
	WallReportTableName:{
		names:['wallBoard_FromZero_callin','wallBoard_FromZero_agent','wallBoard_FromZero_human_service'],
		keys:['vccid','agentid','humanserviceid']
	},
	WallReportCallInReportTable:[
		{"name":"vccid","alias":"企业标识", "showFlag":"1"},
		{"name":"vccname","alias":"企业名称", "showFlag":"1"},
		{"name":"reportdate","alias":"统计日期", "showFlag":"1"},
		{"name":"updatetime","alias":"最后更新时间", "showFlag":"1"},
		{"name":"reportTime","alias":"统计截止时间", "showFlag":"0"},
		{"name":"agentCnt","alias":"坐|席|个|数", "showFlag":"1"},
		{"name":"inCnt","alias":"呼|入|总|量", "showFlag":"1"},
		{"name":"ivrServiceInCnt","alias":"IVR|呼|入|总|量", "showFlag":"1"},
		{"name":"humanServiceInCnt","alias":"人|工|服|务|次|数", "showFlag":"1"},
		{"name":"humanServiceCallOkCnt","alias":"接|通|次|数", "showFlag":"1"},
		{"name":"humanServiceCallBadCnt","alias":"未|接|通|次|数", "showFlag":"1"},
		{"name":"userAbandonCnt","alias":"用|户|放|弃", "showFlag":"1"},
		{"name":"finalLongRingNoAnswerCnt","alias":"座|席|久|无|应|答", "showFlag":"1"},
		{"name":"ringDuration","alias":"振|铃|时|长", "showFlag":"1"},
		{"name":"perRingDuration","alias":"平|均|振|铃|时|长", "showFlag":"1"},
		{"name":"callDuration","alias":"总|通|话|时|长", "showFlag":"1"},
		{"name":"perCallDuration","alias":"平|均|通|话|时|长", "showFlag":"1"},
		{"name":"queueDuration","alias":"排|队|时|长", "showFlag":"1"},
		{"name":"perQueueDuration","alias":"平|均|排|队|时|长", "showFlag":"1"},
		{"name":"waitDuration_5","alias":"5|秒|内|接|通|量", "showFlag":"1"},
		{"name":"waitDuration_10","alias":"10|秒|内|接|通|量", "showFlag":"1"},
		{"name":"waitDuration_15","alias":"15|秒|内|接|通|量", "showFlag":"1"},
	],
	WallReportAgentReportTable:[
		{"name":"agentid","alias":"座席工号", "showFlag":"1"},
		{"name":"reportdate","alias":"统计日期", "showFlag":"1"},
		{"name":"updatetime","alias":"最后更新时间", "showFlag":"1"},
		{"name":"reportTime","alias":"统计截止时间", "showFlag":"0"},
		{"name":"agentname","alias":"座席名称", "showFlag":"1"},
		{"name":"department","alias":"部门/班组号", "showFlag":"0"},
		{"name":"vccid","alias":"企业标识", "showFlag":"1"},
		{"name":"logincnt","alias":"登|陆|次|数", "showFlag":"1"},
		{"name":"loginduration","alias":"登|陆|时|长", "showFlag":"1"},
		{"name":"readycnt","alias":"置|闲|次|数", "showFlag":"0"},
		{"name":"readyduration","alias":"置|闲|时|长", "showFlag":"0"},
		{"name":"busycnt","alias":"置|忙|次|数", "showFlag":"0"},
		{"name":"busyduration","alias":"置|忙|时|长", "showFlag":"0"},
		{"name":"handlecnt","alias":"后|处|理|次|数", "showFlag":"0"},
		{"name":"handleduration","alias":"后|处|理|时|长", "showFlag":"0"},
		{"name":"holdcnt","alias":"保|持|次|数", "showFlag":"0"},
		{"name":"holdduration","alias":"保|持|时|长", "showFlag":"0"},
		{"name":"consultcnt","alias":"咨|询|次|数", "showFlag":"0"},
		{"name":"consultduration","alias":"咨|询|时|长", "showFlag":"0"},
		{"name":"transfercnt","alias":"转|移|次|数", "showFlag":"0"},
		{"name":"answercnt","alias":"摘|机|次|数", "showFlag":"0"},
		{"name":"answerfailcnt","alias":"摘|机|失|败|次|数", "showFlag":"0"},
		{"name":"releasecnt","alias":"挂|机|次|数", "showFlag":"0"},
		{"name":"bridgecnt","alias":"桥|接|次|数", "showFlag":"0"},
		{"name":"bridgefailcnt","alias":"桥|接|失|败|次|数", "showFlag":"0"},
		{"name":"listencnt","alias":"监|听|次|数", "showFlag":"0"},
		{"name":"listenfailcnt","alias":"监|听|失|败|次|数", "showFlag":"0"},
		{"name":"interceptcnt","alias":"拦|截|次|数", "showFlag":"0"},
		{"name":"interceptfailcnt","alias":"拦|截|失|败|次|数", "showFlag":"0"},
		{"name":"insertcnt","alias":"强|插|次|数", "showFlag":"0"},
		{"name":"insertfailcnt","alias":"强|插|失|败|次|数", "showFlag":"0"},
		{"name":"conferencecnt","alias":"会|议|次|数", "showFlag":"0"},
		{"name":"first_login","alias":"首次签入时间", "showFlag":"1"},
		{"name":"last_logout","alias":"最后签出时间", "showFlag":"1"},
		{"name":"allcnt","alias":"总|呼|叫|次|数", "showFlag":"1"},
		{"name":"allokcnt","alias":"总|通|话|次|数", "showFlag":"1"},
		{"name":"allduration","alias":"总|通|话|时|长", "showFlag":"1"},
		{"name":"allmaxduration","alias":"最|长|通|话|时|长", "showFlag":"0"},
		{"name":"allagenthangupcnt","alias":"坐|席|挂|机|次|数", "showFlag":"0"},
		{"name":"alluserhangupcnt","alias":"用|户|挂|机|次|数", "showFlag":"0"},
		{"name":"allringcnt","alias":"振|铃|次|数", "showFlag":"0"},
		{"name":"allringduration","alias":"振|铃|时|长", "showFlag":"0"},
		{"name":"incnt","alias":"呼|入|总|次|数", "showFlag":"1"},
		{"name":"inokcnt","alias":"呼|入|接|通|次|数", "showFlag":"1"},
		{"name":"inbadcnt","alias":"呼入|未|接|通|次|数", "showFlag":"1"},
		{"name":"induration","alias":"呼|入|总|通|话|时|长", "showFlag":"1"},
		{"name":"inringcnt","alias":"呼|入|振|铃|次|数", "showFlag":"0"},
		{"name":"inringduration","alias":"呼|入|振|铃|时|长", "showFlag":"0"},
		{"name":"inagentnoanswercnt","alias":"呼|入|座|席|无|应|答|次|数", "showFlag":"0"},
		{"name":"inmaxduration","alias":"呼|入|最|长|通|话|时|长", "showFlag":"0"},
		{"name":"inagenthangupcnt","alias":"呼|入|坐|席|挂|机|次|数", "showFlag":"0"},
		{"name":"inuserhangupcnt","alias":"呼|入|用|户|挂|机|次|数", "showFlag":"0"},
		{"name":"inhandlecnt","alias":"呼|入|后|处|理|次|数", "showFlag":"0"},
		{"name":"inhandleduration","alias":"呼|入|后|处|理|总|时|长", "showFlag":"1"},
		{"name":"inholdcnt","alias":"呼|入|保|持|次|数", "showFlag":"0"},
		{"name":"inholdduration","alias":"呼|入|保|持|时|长", "showFlag":"0"},
		{"name":"outcnt","alias":"呼|出|次|数", "showFlag":"1"},
		{"name":"outokcnt","alias":"呼|出|接|起|次|数", "showFlag":"0"},
		{"name":"outbadcnt","alias":"呼|出|未|接|起|次|数", "showFlag":"0"},
		{"name":"outfullduration","alias":"呼|出|总|时|长", "showFlag":"1"},
		{"name":"outduration","alias":"呼|出|通|话|时|长", "showFlag":"1"},
		{"name":"outringcnt","alias":"呼|出|振|铃|次|数", "showFlag":"0"},
		{"name":"outringduration","alias":"呼|出|振|铃|时|长", "showFlag":"0"},
		{"name":"outnoanswercnt","alias":"呼|出|用|户|久|无|应|答|次|数", "showFlag":"0"},
		{"name":"outagentabandoncnt","alias":"呼|出|座|席|放|弃|次|数", "showFlag":"0"},
		{"name":"outagenthangupcnt","alias":"呼|出|座|席|挂|机|次|数", "showFlag":"0"},
		{"name":"outuserhangupcnt","alias":"呼|出|用|户|挂|机|次|数", "showFlag":"0"},
		{"name":"outminringduration","alias":"呼|出|最|短|振|铃|时|长", "showFlag":"0"},
		{"name":"outmaxringduration","alias":"呼|出|最|长|振|铃|时|长", "showFlag":"0"},
		{"name":"outminduration","alias":"呼|出|最|短|通|话|时|长", "showFlag":"0"},
		{"name":"outmaxduration","alias":"呼|出|最|长|通|话|时|长", "showFlag":"0"},
		{"name":"outhandlecnt","alias":"呼|出|后|处|理|次|数", "showFlag":"0"},
		{"name":"outhandleduration","alias":"呼|出|后|处|理|总|时|长", "showFlag":"1"},
		{"name":"outholdcnt","alias":"呼|出|保|持|次|数", "showFlag":"0"},
		{"name":"outholdduration","alias":"呼|出|保|持|时|长", "showFlag":"0"},
		{"name":"insidecallcnt","alias":"内|部|呼|叫|次|数", "showFlag":"0"},
		{"name":"insidecallokcnt","alias":"内|部|通|话|次|数", "showFlag":"0"},
		{"name":"insidecallbadCnt","alias":"内|部|未|接|起|次|数", "showFlag":"0"},
		{"name":"waitDuration_15","alias":"15|秒|内|接|通|量", "showFlag":"1"},
		{"name":"answerSeconds_over60","alias":"大|于|60|秒|的|接|通|量", "showFlag":"1"},
	],
	WallReportHumanServiceReportTable:[
		{"name":"humanserviceid","alias":"人工服务号", "showFlag":"1"},
		{"name":"reportdate","alias":"统计日期", "showFlag":"1"},
		{"name":"updatetime","alias":"最后更新时间", "showFlag":"1"},
		{"name":"reportTime","alias":"统计截止时间", "showFlag":"0"},
		{"name":"humanservicename","alias":"人工服务名称", "showFlag":"1"},
		{"name":"vccid","alias":"企业标识", "showFlag":"1"},
		{"name":"vccname","alias":"企业名称", "showFlag":"1"},
		{"name":"totalcnt","alias":"呼|入|次|数", "showFlag":"1"},
		{"name":"callOkCnt","alias":"接|通|次|数", "showFlag":"1"},
		{"name":"callBadCnt","alias":"未|接|通|次|数", "showFlag":"1"},
		{"name":"callDuration","alias":"通|话|时|长", "showFlag":"1"},
		{"name":"ringCnt","alias":"振|铃|次|数", "showFlag":"0"},
        {"name":"ringNoAnswerCnt","alias":"振|铃|未|接|次|数", "showFlag":"0"},
        {"name":"ringDuration","alias":"振|铃|时|长", "showFlag":"0"},
        {"name":"maxcallduration","alias":"最|长|通|话|时|长", "showFlag":"0"},
        {"name":"longRingNoAnswerCnt","alias":"座|席|久|无|应|答", "showFlag":"0"},
        {"name":"routedenycnt","alias":"路|由|拒|绝", "showFlag":"0"},
        {"name":"queuecnt","alias":"排|队|次|数", "showFlag":"1"},
        {"name":"queuetimeoutcnt","alias":"排|队|超|时|次|数", "showFlag":"1"},
        {"name":"queueovercnt","alias":"排|队|溢|出|次|数", "showFlag":"1"},
        {"name":"queueduration","alias":"排|队|时|长", "showFlag":"0"},
        {"name":"maxqueueduration","alias":"最|长|排|队|时|长", "showFlag":"0"},
        {"name":"agtEndCnt","alias":"座|席|挂|机|次|数", "showFlag":"0"},
        {"name":"callingendcnt","alias":"用|户|挂|机|次|数", "showFlag":"0"},
        {"name":"readycnt","alias":"坐|席|总|置|闲|次|数", "showFlag":"0"},
        {"name":"readyduration","alias":"坐|席|总|置|闲|时|长", "showFlag":"0"},
        {"name":"handlecnt","alias":"坐|席|总|后|处|理|次|数", "showFlag":"0"},
        {"name":"handleduration","alias":"坐|席|总|后|处|理|时|长", "showFlag":"0"},
        {"name":"holdcnt","alias":"坐|席|总|保|持|次|数", "showFlag":"0"},
        {"name":"holdduration","alias":"坐|席|总|保|持|时|长", "showFlag":"0"},
        {"name":"maxreadyduration","alias":"坐|席|最|长|置|闲|时|长", "showFlag":"0"},
        {"name":"agtoutcnt","alias":"坐|席|总|呼|出|次|数", "showFlag":"1"},
        {"name":"outCallCnt","alias":"呼|出|次|数", "showFlag":"1"},
        {"name":"outCallDuration","alias":"呼|出|通|话|时|长", "showFlag":"1"},
        {"name":"queueallocagentcnt","alias":"排|队|成|功|分|配|坐|席|次|数", "showFlag":"0"},
        {"name":"queueallocagentduration","alias":"排|队|成|功|分|配|坐|席|总|排|队|时|长", "showFlag":"0"},
        {"name":"queueallocagentmaxduration","alias":"排|队|成|功|分|配|坐|席|最|大|排|队|时|长", "showFlag":"0"},
        {"name":"queuenotallocagentcnt","alias":"排|队|未|分|配|坐|席|次|数", "showFlag":"0"},
        {"name":"queuenotallocagentduration","alias":"排|队|未|分|配|坐|席|排|队|时|长", "showFlag":"0"},
        {"name":"queuenotallocagentmaxduration","alias":"排|队|未|分|配|坐|席|最|大|排|队|时|长", "showFlag":"0"},
        {"name":"ringDuration_15","alias":"振|铃|15|秒|内|接|通|量", "showFlag":"0"},
        {"name":"ringDuration_30","alias":"振|铃|30|秒|内|接|通|量", "showFlag":"0"},
        {"name":"ringDuration_over15","alias":"振|铃|15|秒|以|上|接|通|量", "showFlag":"0"},
        {"name":"ringDuration_over30","alias":"振|铃|30|秒|以|上|接|通|量", "showFlag":"0"},
        {"name":"waitDuration_5","alias":"5|秒|内|接|通|量", "showFlag":"1"},
        {"name":"waitDuration_10","alias":"10|秒|内|接|通|量", "showFlag":"1"},
        {"name":"waitDuration_15","alias":"15|秒|内|接|通|量", "showFlag":"1"},
        {"name":"waitDuration_20","alias":"20|秒|内|接|通|量", "showFlag":"1"},
        {"name":"waitDuration_30","alias":"30|秒|内|接|通|量", "showFlag":"1"},
        {"name":"waitDuration_60","alias":"60|秒|内|接|通|量", "showFlag":"0"},
        {"name":"waitDuration_90","alias":"90|秒|内|接|通|量", "showFlag":"0"},
        {"name":"waitDuration_120","alias":"120|秒|内|接|通|量", "showFlag":"0"},
        {"name":"waitDuration_180","alias":"180|秒|内|接|通|量", "showFlag":"0"},
        {"name":"waitDuration_over180","alias":"180|秒|以|上|接|通|量", "showFlag":"0"},
        {"name":"notInServiceTimeCnt","alias":"不|在|服|务|时|间|内|量", "showFlag":"0"},
        {"name":"userAbandonCnt","alias":"用|户|放|弃|次|数", "showFlag":"1"},
        {"name":"callTransferCnt","alias":"排|队|中|转|出|量", "showFlag":"1"},
        {"name":"phoneLostCnt","alias":"话|机|失|联", "showFlag":"1"},
        {"name":"totalExceptRequeueCnt","alias":"呼|入|总|数", "showFlag":"1"},
        {"name":"finalLongRingNoAnswerCnt","alias":"最|终|座|席|久|无|应|答", "showFlag":"0"},
        {"name":"conSultTotalCnt","alias":"咨|询|或|忙|转|总|数", "showFlag":"0"},
        {"name":"conSultCallOkCnt","alias":"咨|询|或|忙|转|接|通|数", "showFlag":"0"},
        {"name":"conSultUserAbandonCnt","alias":"咨|询|或|忙|转|用|户|放|弃|数", "showFlag":"0"},
        {"name":"conSultLongRingNoAnswerCnt","alias":"咨|询|或|忙|转|坐|席|久|无|应|答|数", "showFlag":"0"},
        {"name":"conSultNotRouteAgentCnt","alias":"咨|询|或|忙|转|未|路|由|到|坐|席|数", "showFlag":"0"},
        {"name":"userAbandonCnt_InQueueDuration_5","alias":"5秒|内|queue|中用|户|挂|线", "showFlag":"0"},
        {"name":"conSult_waitDuration_5","alias":"咨询|转入|5秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_10","alias":"咨询|转入|10秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_15","alias":"咨询|转入|15秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_20","alias":"咨询|转入|20秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_30","alias":"咨询|转入|30秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_60","alias":"咨询|转入|60秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_90","alias":"咨询|转入|90秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_120","alias":"咨询|转入|120秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_180","alias":"咨询|转入|180秒|内接|通量", "showFlag":"0"},
        {"name":"conSult_waitDuration_over180","alias":"咨询|转入|超过|180秒|内接|通量", "showFlag":"0"},
	],

    GetShortAgentID:function(agentID){
        var len = G_MonitorConst.vccid.length+6;
        if(agentID.length<=len){
            return agentID;
        }
        return agentID.substring(len);
    },
    GetLongAgentID:function(agentID){
        if(agentID.length>G_MonitorConst.vccid+6)
            return agentID;
        return "000010"+G_MonitorConst.vccid+agentID;
    },
	GetShortTaskID:function(taskID){
		var len = G_MonitorConst.vccid.length+8;
		if(taskID.length<=len){
			return taskID;
		}
		return taskID.substring(len);
	},
    GetShortHumenService:function(serviceID){
        var len = G_MonitorConst.vccid.length+8;
        if(serviceID.length<=len){
            return serviceID;
        }
        return serviceID.substring(len);
    },
    GetShortIvrService:function(serviceID){
        var len = G_MonitorConst.vccid.length+6;
        if(serviceID.length<=len){
            return serviceID;
        }
        return serviceID.substring(len);
    },

    GetDislayArrayItem:function(oJson,itemName){
		var arrReturn = [];
		for(var i=0;i<oJson.length;i++){
		    if(oJson[i] == null || typeof(oJson[i]) =="undefined" )
		        continue;
			if(oJson[i]["showFlag"] == "1")
				arrReturn.push(oJson[i][itemName]);
		}
		return arrReturn;
	},
	GetArrayItem:function(oJson,itemName){
		var arrReturn = [];
		for(var i=0;i<oJson.length;i++){
            if(oJson[i] == null || typeof(oJson[i]) =="undefined" )
                continue;
			arrReturn.push(oJson[i][itemName]);
		}
		return arrReturn;
	},

    GetIntCookieValue:function(strName,defaultValue){
        var strValue = getCookie(strName);
        if(strValue == "")
            return defaultValue;
        return parseInt(strValue);
    },
    GetStrCookieValue:function(strName,defaultValue){
        var strValue = getCookie(strName);
        if(strValue == "")
            return defaultValue;
        return strValue;
    },

    GetTaskTypeName :function(type){
            if(type == "JQ") return "精确外拨";
            if(type == "JJ") return "渐进预测外拨";
            if(type == "YC") return "预测外拨";
            if(type == "JQ-YL") return "精确预览外拨";
            if(type == "IVR") return "IVR外拨";
        return "";
    },
    GetTimeDisplay:function(strTime){
        if(strTime == null) return "";
        if(strTime == "" || typeof(strTime) == "undefined" || strTime.length != 14 )
            return strTime;
        return stringFormat("{0}-{1}-{2} {3}:{4}:{5}",strTime.substr(0,4),strTime.substr(4,2),strTime.substr(6,2),
            strTime.substr(8,2),strTime.substr(10,2),strTime.substr(12,2));
    },
    GetAgentStatusDes:function(agentStatus,slanguage){
        if(slanguage ==  lg_zhcn){
            if(agentStatus<0 || agentStatus>4)
                return G_MonitorConst.UI.AgentConst[0]["name"];
            return G_MonitorConst.UI.AgentConst[agentStatus]["name"];
        }
        if(agentStatus<0 || agentStatus>4)
            return G_MonitorConst.UI.AgentConst[0]["eng_name"];
        return G_MonitorConst.UI.AgentConst[agentStatus]["eng_name"];
    },
    GetAgentSubBusyStatusDes:function(agentStatus,substatus,slanguage){
        for(var i=0;i< G_MonitorConst.UI.AgentSubBusy.ids.length;i++){
            if(G_MonitorConst.UI.AgentSubBusy.ids[i] == substatus){
                return G_MonitorConst.UI.AgentSubBusy.texts[i];
            }
        }
        return  G_MonitorConst.GetAgentStatusDes(agentStatus,slanguage);
    },
    GetAgentStatusColor:function(agentStatus){
        if(agentStatus<0 || agentStatus>4)
            return G_MonitorConst.UI.AgentConst[0]["color"];
        return G_MonitorConst.UI.AgentConst[agentStatus]["color"];
    },

    HttpAjaxSubmit:function(url,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send("");
        xhr.onload = function (e) {
            if (this.status == 200) {
                callback(this.responseText);
            }
            else{
                alert("错误码:"+this.status);
            }
        };
	},
	Log:function (sText) {
        if(G_oMonitorCtrl !== null)
		    G_oMonitorCtrl.AddLog(sText);
	},
	SaveConfig:function(type){
		var oSettingItem = null;
		if(type == 0){
			setCookie(G_MonitorConst.mainSetting.logFlag.id,G_MonitorConst.mainSetting.logFlag.value,365);
			setCookie(G_MonitorConst.mainSetting.tabGroupDataClose.id,G_MonitorConst.mainSetting.tabGroupDataClose.value,365);
			setCookie(G_MonitorConst.mainSetting.agentMenuCmd.id,G_MonitorConst.mainSetting.agentMenuCmd.value,365);
			setCookie(G_MonitorConst.mainSetting.agentStatics.id,G_MonitorConst.mainSetting.agentStatics.value,365);
		}
		else if(type == 1){
			oSettingItem = G_MonitorConst.Task4Table;
		}
		else if(type == 2){
			oSettingItem = G_MonitorConst.ServiceTable;
		}
		else if(type == 3){
			oSettingItem = G_MonitorConst.WallReportCallInReportTable;
		}
		else if(type == 4){
			oSettingItem = G_MonitorConst.WallReportAgentReportTable;
		}
		else if(type == 5){
			oSettingItem = G_MonitorConst.WallReportHumanServiceReportTable;
		}
		if(oSettingItem == null)
			return

		for(var i=0;i<oSettingItem.length;i++){
			var oItem = oSettingItem[i];
			setCookie(stringFormat("{0}_{1}",type,oItem["name"]),oItem["showFlag"],365);
		}
	},
	LoadConfig:function(type){
		var oSettingItem = null;
		if(type == 0){
			G_MonitorConst.mainSetting.logFlag.value = G_MonitorConst.GetIntCookieValue(G_MonitorConst.mainSetting.logFlag.id,1);
			G_MonitorConst.mainSetting.tabGroupDataClose.value = G_MonitorConst.GetIntCookieValue(G_MonitorConst.mainSetting.tabGroupDataClose.id,0);
			G_MonitorConst.mainSetting.agentMenuCmd.value = G_MonitorConst.GetIntCookieValue(G_MonitorConst.mainSetting.agentMenuCmd.id,1);
			G_MonitorConst.mainSetting.agentStatics.value = G_MonitorConst.GetIntCookieValue(G_MonitorConst.mainSetting.agentStatics.id,1);
		}
		else if(type == 1){
			oSettingItem = G_MonitorConst.Task4Table;
		}
		else if(type == 2){
			oSettingItem = G_MonitorConst.ServiceTable;
		}
		else if(type == 3){
			oSettingItem = G_MonitorConst.WallReportCallInReportTable;
		}
		else if(type == 4){
			oSettingItem = G_MonitorConst.WallReportAgentReportTable;
		}
		else if(type == 5){
			oSettingItem = G_MonitorConst.WallReportHumanServiceReportTable;
		}
		if(oSettingItem == null)
			return
		for(var i=0;i<oSettingItem.length;i++){
			var oItem = oSettingItem[i];
            if(oItem == null || typeof(oItem) == 'undefined')
                continue;
			oItem["showFlag"] = G_MonitorConst.GetIntCookieValue(stringFormat("{0}_{1}",type,oItem["name"]),oItem["showFlag"]);
		}
	},
    SetAgentSubBusy:function(str){
        console.info(str);
        G_MonitorConst.UI.AgentSubBusy = {
            ids:[],
            texts:[]
        };
        var  arrMenuItem = str.split("$");
        for(var i=0;i<arrMenuItem.length;i++)
        {
            var item = arrMenuItem[i].split("|");
            if(item.length == 2)
            {
                G_MonitorConst.UI.AgentSubBusy.texts.push(item[1]);
                G_MonitorConst.UI.AgentSubBusy.ids.push(item[0]);
            }
        }
        console.info(G_MonitorConst.UI.AgentSubBusy);
    }

};

var G_MonitorExtension = {
    extension:{
        agentDisplay:['shortagentid','hsOutAnswerCnt','hsOutAnswerTime','svcc','svct','agentId','name','astate','lastLoginTime','lastLogoutTime','loginTime','sbt','sact','ict','icc','oct','occ','sct','scc','atime','maxmm','curmm','mmcusts'],
        serviceQueueDisplay:['index','callSession','callTimeStamp','hsCallerId','hsCallerName','callType'],
        serviceDisplay:["shortServiceId","serviceName","hsNotQueueCnt","sum_hsQueueCnt","hsInCnt","hsAnswerCnt","hsOverflowCnt","hsTransferCnt","hsQueueAbandonCnt","hsRingAbandonCnt","slSLTSet","slAnswerCntInSLT","slValue","slWaitTimeInSLT","hsPerAnswerWaitTime","hsPerAbandonWaitTime","hsPerAnswerTime","hsMaxQueueLen","hsMaxQueueWaitTime","hsOutAnswerCnt","hsOutPerAnswerTime","hsQueueCnt","hsLoginCnt","hsLogoutCnt","hsReadyCnt","hsNotReadyCnt","hsLineBusyCnt"],
        ivrDisplay:['monitorid','shortServiceId','serviceName','ivrAllCnt','ivrUseCnt'],
        trunkDisplay:['trunkName','maxNum','callNum','callInNum','callOutNum'],
        taskDisplay:['vccID','monitorID','shortTaskID','taskID', 'taskName', 'count','taskType','startTime','time','AgentNum','QueueNum','MaxCallTime','MaxPhoneId','Progress','Progress2','Progress3','SecNumFromUrl','TotalNumFromUrl','CallNumPerMin','AvgServSec','AvgIdelSec','SpeedAdjustFactor','RecentConnectRate','RecentLossRate','AvgLossRate','CurrentRingNum','IdleAgentNum','ConnectAgentNum','TidyAgentNum','ConnectRecNum','UnConnRecNum','LossRecNum','ConnectRate','SecCallNumInfact','SecCallNumShould','RecZ','Url','MinServSec','MaxServSec','MinIdelSec','MaxIdelSec','Serv_0_10','Serv_10_30','Serv_30_60','Serv_60_120','Serv_120_300','Serv_300_600','Serv_600_inf','Idle_0_10','Idle_10_20','Idle_20_30','Idle_30_45','Idle_45_60','Idle_60_120','Idle_120_180','Idle_180_300','Idle_300_inf'],
        mmserviceDisplay:["shortServiceId",'serviceId','serviceName','curLoginCnt','curUserAnswerCnt','curQueueCnt','curMaxQueueDur','curMinQueueDur','sumAnswerCnt','sumMaxQueueDur','sumMinQueueDur','sumAvgQueueDur','sumMaxAnswerDur','sumMinAnswerDur','sumAvgAnswerDur']
    },
    GetMonitorDataJson:function(oData,arrKey){
        var oReturn = {};
        for(var i=0; i<arrKey.length;i++) {
            oReturn[arrKey[i]] = oData.GetItemValue(arrKey[i]);
        }
        return oReturn;
    },
    GetAgentGroupTableJSonData :function(oGroup,formIndex,toIndex){
        if(oGroup == null || oGroup._ampGroupType != CM_AmpAgent){
            return null;
        }
        var oGroupAgentlist = oGroup._monitordata._listAgentItem;
        if(formIndex <0 || formIndex>=oGroupAgentlist.length){
            return null;
        }
        var oRet = [];
        if(toIndex == -1 || toIndex>=oGroupAgentlist.length)
            toIndex = oGroupAgentlist.length;
        for(var j=formIndex;j<toIndex;j++){
            var oAgent = oGroupAgentlist[j];
            var oJson = oAgent.GetAgentJson(this.extension.agentDisplay);
            oRet.push(oJson);
        }
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetAllAgentGroupTabeJSonData:function(oGroups){
        var oAgentList = [];
        for(var i=0;i<oGroups.length;i++){
            var oGroup = oGroups[i];
            if(oGroup._ampGroupType != CM_AmpAgent)
                continue;
            var oGroupAgentlist = oGroup._monitordata._listAgentItem;
            for(var j=0;j<oGroupAgentlist.length;j++) {
                var oAgent = oGroupAgentlist[j];
                var bFind = false;
                for(var k=0;k<oAgentList.length;k++){
                    if(oAgentList[k]._data.GetItemValue("agentid") == oAgent._data.GetItemValue("agentid"))
                    {
                        bFind = true;
                        break;
                    }
                }
                if(!bFind)
                    oAgentList.push(oAgent);
            }
        }
        var oRet = [];
        for(var i=0;i<oAgentList.length;i++){
            var oAgent = oAgentList[i];
            var oJson = oAgent.GetAgentJson(this.extension.agentDisplay);
            oRet.push(oJson);
        }
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetSericeGroupQueueTableJSonData :function(oGroup){
        if(oGroup == null || oGroup._ampGroupType != CM_AmpService){
            return null;
        }
        var oQueueInfo = oGroup._monitordata._arrColine;

        var oRet = [];
        for(var j=0;j<oQueueInfo.length;j++){
            var oColine = oQueueInfo[j];
            var oJson = this.GetMonitorDataJson(oColine._data,this.extension.serviceQueueDisplay);
            oRet.push(oJson);
        }
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);

    },
    GetSericeGroupTableJSonData :function(oGroup){
        if(oGroup == null || oGroup._ampGroupType != CM_AmpService){
            return null;
        }

        var oRet = [];
        var oGroupInfo = oGroup._monitordata._data;
        var oJson = this.GetMonitorDataJson(oGroupInfo,this.extension.serviceDisplay);
        oRet.push(oJson);
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetAllIVRGroupTableJSonData:function(oGroups){
        var oRet = [];
        for(var i=0;i<oGroups.length;i++){
            var oGroup = oGroups[i];
            if(oGroup._ampGroupType != CM_AmpIVRService)
                continue;
            var oJson = this.GetMonitorDataJson(oGroup._monitordata._data,this.extension.ivrDisplay);
            oRet.push(oJson);
        }
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetIVRGroupTableJSonData :function(oGroup){
        if(oGroup == null || oGroup._ampGroupType != CM_AmpIVRService){
            return null;
        }
        var oRet = [];
        var oGroupInfo = oGroup._monitordata._data;
        var oJson = this.GetMonitorDataJson(oGroupInfo,this.extension.ivrDisplay);
        oRet.push(oJson);
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetTrunkGroupTableJSonData :function(oGroup){
        if(oGroup == null || oGroup._ampGroupType != CM_AmpTrunk){
            return null;
        }
        var oRet = [];
        var arrTrunk = oGroup._monitordata._arrTrunk;
        for(var i=0;i<arrTrunk.length;i++){
            var oJson = this.GetMonitorDataJson(arrTrunk[i]._data,this.extension.trunkDisplay);
            oRet.push(oJson);
        }
        if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetTaskGroupTableJSonData: function (oGroup) {
      if (oGroup == null || oGroup._ampGroupType != CM_AmpTask) {
        return null;
      }
      var oRet = [];
      var arrTask = oGroup._monitordata._arrTask;
      for(var i = 0; i < arrTask.length; i++) {
          var oJson = this.GetMonitorDataJson(arrTask[i]._data,this.extension.taskDisplay);
          oRet.push(oJson)
      }
      if(oRet.length == 0)
            return null;
        return JSON.stringify(oRet);
    },
    GetVccId: function () {
        return G_MonitorConst.vccid;
    }
};

//-------------------------------------
// monitor data class
//-------------------------------------
var CM_AmpNull         = -1;          //没有定义
var CM_AmpAgent        = 0;           // 座席
var CM_AmpIVR          = 1;           // IVR
var CM_AmpPhone        = 2;           //分机
var CM_AmpService      = 3;           //人工服务
var CM_AmpTask         = 4;           //人工外呼
var CM_AmpIVRService   = 5;           //IVR服务
var CM_AmpIVRTask      = 6;           //IVR外呼
var CM_AmpGroup        = 7;           //班组
var CM_AmpTrunk        = 8;           //中继

var g_monitorDebug = 0;

function JcmItem(name,type,value){
    this._name = name;
    this._pname1 = "";
    this._pname2 = "";
    this._pname3 = "";
    this._value = value;
    this._type = type;  //0:字符串类型 1:数据型

    return this;
}
function JcmItemData() {
    this._listItemData = new Array();

    this.Init = function(agentInfo){
        for (var i =0 ; i <agentInfo.length; i++){
            this.AddItem(agentInfo[i],0,"");
        }
    }
    this.GetItemData = function (name) {
        for(var i=0;i<this._listItemData.length;i++){
            var ci = this._listItemData[i];
            if (ci._name == name || ci._pname1 == name || ci._pname2 == name)
                return ci;
        }
        return null;
    }
    this.AddItem = function(name,type,value){
        var item = this.GetItemData(name);
        if(item == null){
            this._listItemData.push(new JcmItem(name,type,value));
        }
    }
    this.SetItemPName = function(name,pName2,pName3){
        var item = this.GetItemData(name);
        if(typeof(pName2) == "undefined") pName2 = "";
        if(typeof(pName3) == "undefined") pName3 = "";
        if(item != null){
            item._pname2 = pName2;
            item._pname3 = pName3;
        }
    }
    this.SetItemValue = function(name,value){
        var item = this.GetItemData(name);
        if(item != null){
            item._value = value;
        }
    }
    this.SetItemType = function(name,type){
        var item = this.GetItemData(name);
        if(item != null){
            item._type = type;
        }
    }
    this.GetItemValue = function(name){
        var item = this.GetItemData(name);
        if(item != null){
            return item._value;
        }
        return "";
    }
    this.GetItemType = function(name){
        var item = this.GetItemData(name);
        if(item != null){
            return item._type ;
        }
        return -1;
    }

    return this;
}
function JcmAgentItem() {
    this._monitorid = "";     //监控组Id
    this._serviceid = "";     //服务Id    没有呼叫时为"0"
    this._agentid = "";       //坐席工号
    this._shortagentid = "";  //坐席工号
    this._astate = -1;           //座席状态 0：签出 1：忙  2：空闲  3：通话   4：后处理
    this._aestate = -1;          //附加状态
    this._atime = "";         //座席状态时间
    this._serverCurrentTime = "";  //服务器当前时间

    this._sct = 0; 	        //sumcalltime总呼叫时长
    this._scc = 0; 	        //sumcallcount总呼叫次数
    this._svct = 0; 	    //sumvalidcalltime有效通话时长
    this._svcc = 0; 	    //sumvalidcallcount有效通话次数
    this._srt = 0; 	        //sumringtime总振铃时长
    this._sqt = 0; 	        //sumqueuetime总排队时长
    this._sact = 0; 	    //sumaftercalltime总后处理时长
    this._sit = 0; 	        //sumidletime总置闲时长
    this._slt = 0;          //sumlogintime总置闲时长
    this._sbt = 0; 	        //sumbusytime总置忙时长
    this._ssc = 0; 	        //sumsignincount签入次数
    this._sst = 0; 	        //sumsignintime总签入时长
    this._lst = ""; 	    //lastsignintime当前签入时间
    this._icc = 0; 	        //incallcount呼入次数
    this._ict = 0; 	        //incalltime呼入总时长
    this._occ = 0; 	        //outcallcount呼出次数
    this._oct = 0; 	        //outcalltime呼出总时长
    this._icfc = 0; 	    //incallfailcount呼入失败次数
    this._ocfc = 0; 	    //outcallfailcount呼出失败次数
    this._scht = 0; 	    //sumcallholdtime总保留时长
    this._schc = 0; 	    //sumcallholdcount总保留次数

    this._data = new JcmItemData();
    this.Init = function(agentInfo){
        this._data.Init(agentInfo);
    }
    this.ResetCommon = function (bAll) {
        this._astate = stringToInt(this._data.GetItemValue("astate"),-1);   //座席状态 0：签出 1：忙  2：空闲  3：通话   4：后处理
        this._aestate = stringToInt(this._data.GetItemValue("aestate"),-1);         //附加状态
        this._atime = this._data.GetItemValue("atime");        //座席状态时间

        if(!bAll) return;

        this._sct = stringToInt(this._data.GetItemValue("sct"),0); 	        //sumcalltime总呼叫时长
        this._scc = stringToInt(this._data.GetItemValue("scc"),0); 	        //sumcallcount总呼叫次数
        this._svct = stringToInt(this._data.GetItemValue("svct"),0); 	    //sumvalidcalltime有效通话时长
        this._svcc = stringToInt(this._data.GetItemValue("svcc"),0); 	    //sumvalidcallcount有效通话次数
        this._srt = stringToInt(this._data.GetItemValue("srt"),0); 	        //sumringtime总振铃时长
        this._sqt = stringToInt(this._data.GetItemValue("sqt"),0); 	        //sumqueuetime总排队时长
        this._sact = stringToInt(this._data.GetItemValue("sact"),0); 	    //sumaftercalltime总后处理时长
        this._sit = stringToInt(this._data.GetItemValue("sit"),0); 	        //sumidletime总置闲时长
        this._sbt = stringToInt(this._data.GetItemValue("sbt"),0); 	        //sumbusytime总置忙时长
        this._ssc = stringToInt(this._data.GetItemValue("ssc"),0); 	        //sumsignincount签入次数
        this._sst = stringToInt(this._data.GetItemValue("sst"),0); 	        //sumsignintime总签入时长
        this._lst = this._data.GetItemValue("lastLoginTime"); 	            //lastsignintime当前签入时间
        this._icc = stringToInt(this._data.GetItemValue("icc"),0); 	        //incallcount呼入次数
        this._ict = stringToInt(this._data.GetItemValue("ict"),0); 	        //incalltime呼入总时长
        this._occ = stringToInt(this._data.GetItemValue("occ"),0); 	        //outcallcount呼出次数
        this._oct = stringToInt(this._data.GetItemValue("oct"),0); 	        //outcalltime呼出总时长
        this._icfc = stringToInt(this._data.GetItemValue("icfc"),0); 	    //incallfailcount呼入失败次数
        this._ocfc = stringToInt(this._data.GetItemValue("ocfc"),0); 	    //outcallfailcount呼出失败次数
        this._mit = stringToInt(this._data.GetItemValue("mit"),0); 	        //maxidletime最大空闲时长
    }
    this.getSpValue = function (name){
        if(name == "sbt") return this._sbt;
        else if(name == "sact") return this._sact;
        else if(name == "ict") return this._ict;
        else if(name == "icc") return this._icc;
        else if(name == "oct") return this._oct;
        else if(name == "occ") return this._occ;
        else if(name == "sct") return this._sct;
        else if(name == "scc") return this._scc;
        else if(name == "svcc") return this._svcc;
        else if(name == "svct") return this._svct;
        else if(name == "shortagentid") return this._shortagentid;
        else if(name == "lastLoginTime") return G_MonitorConst.GetTimeDisplay(this._data.GetItemValue(name));
        else if(name == "lastLogoutTime") return G_MonitorConst.GetTimeDisplay(this._data.GetItemValue(name));
        else
            return this._data.GetItemValue(name);
    }
    this.GetAgentJson = function (arrKey){
        var oReturn = {};
        for(var i=0; i<arrKey.length;i++) {
            oReturn[arrKey[i]] = this.getSpValue(arrKey[i]);
        }
        return oReturn;
    }

    return this;
}
function JcmMonitorAgentGroup() {
    this._listAgentItem = new Array();

    this._agentItems = {};
    this._agentSTItems = {};
    this._agentST30Items = {};

    this._totalAgents  = 0;   //监控组坐席数
    this._agentNotReadyAgents  = 0;   //休息坐席数
    this._agentReadyAgents  = 0;   //空闲坐席数
    this._agentBusyAgents  = 0; //工作坐席数(呼叫中)
    this._agentNullAgents  = 0;  //签出坐席数
    this._workingAfterCallAgents  = 0; //后处理坐席数


    this.Init = function(agentInfo,agentInfoST,agentInfoST30){
        this._agentItems = agentInfo;
        this._agentSTItems = agentInfoST;
        this._agentST30Items = agentInfoST30;
    }
    this.GetAgentItem = function(monitorid,agentid,serviceid){
        var cmAI = this.GetAgentByid(agentid);
        if(cmAI == null){
            cmAI = new JcmAgentItem();
            cmAI._monitorid = monitorid;
            cmAI._agentid = agentid;
            cmAI._shortagentid = G_MonitorConst.GetShortAgentID(agentid);//agentid.substring(12);//cmGlobal.GetShortAgent(agentid);
            cmAI._serviceid = serviceid;
            cmAI.Init(this._agentItems);
            cmAI.Init(this._agentSTItems);
            cmAI.Init(this._agentST30Items);
            this._listAgentItem.push(cmAI);
        }
        return cmAI;
    }
    this.GetAgentByid = function (id) {
        for(var i=0;i<this._listAgentItem.length;i++){
            if (this._listAgentItem[i]._agentid == id)
                return this._listAgentItem[i];
        }
        return null;
    }

    this.Staticstics = function(){
        this._totalAgents = this._agentNotReadyAgents = this._agentReadyAgents = this._agentBusyAgents = this._agentNullAgents = this._workingAfterCallAgents = 0;
        this._totalAgents = this._listAgentItem.length;
        for (var i = 0; i < this._listAgentItem.length; i++)
        {
            var cmAI = this._listAgentItem[i];
            if (cmAI == null)
                continue;
            switch (cmAI._astate)
            {
                case 1: this._agentNotReadyAgents++;
                    break;
                case 0: this._agentNullAgents++;
                    break;
                case 2: this._agentReadyAgents++;
                    break;
                case 4: this._workingAfterCallAgents++;
                    break;
                case 3: this._agentBusyAgents++;
                    break;
                default: break;
            }
        }
    }

    return this;
}

function JcmServiceCoLine(serviceInfo) {
    this._data = new JcmItemData();
    this._Create = function(){
        this._data.Init(serviceInfo);
    }
    this._Create();
    return this;
}
function JcmMonitorServiceGroup(){
    this._arrColine = [];
    this._data = new JcmItemData();
    this.Init = function(serviceInfo){
        this._data.Init(serviceInfo);
    }
    this.SetServiceCommon = function(){
        this._data.SetItemValue("shortServiceId",
            G_MonitorConst.GetShortHumenService(this._data.GetItemValue("serviceId")));
    }
    return this;
}

function JcmMonitorTask(taskInfo) {
    this._data = new JcmItemData();
    this._Create = function(){
        this._data.Init(taskInfo);
    }
    this.SetTaskCommon = function () {
        //this._data.SetItemValue("shortTaskID",G_MonitorConst.GetShortTaskID(this._data.GetItemValue("taskID")));
    }
    this._Create();
    return this;
}
function JcmMonitorTaskGroup(){
    this._arrTask = [];
    this._data = new JcmItemData();
    this.Init = function(serviceInfo){
        this._data.Init(serviceInfo);
    }
    this.SetTaskCommon = function(){
        this._data.SetItemValue("shortServiceId",
            G_MonitorConst.GetShortHumenService(this._data.GetItemValue("serviceId")));
    }
    this.Clear = function(){
        arrayEmpty(this._data);
        arrayEmpty(this._arrTask);
    }

    return this;
}

function JcmMonitorIvrServiceGroup(){
    this._data = new JcmItemData();
    this.Init = function(IvrInfo){
        this._data.Init(IvrInfo);
    }
    this.SetIvrServiceCommon = function(){
        this._data.SetItemValue("shortServiceId",
            G_MonitorConst.GetShortIvrService(this._data.GetItemValue("serviceId")));
    }

    return this;
}

function JcmTrunkCoLine(colineInfo) {
    this._data = new JcmItemData();
    this._Create = function(){
        this._data.Init(colineInfo);
    }
    this.SetTrunkColineCommon = function(){

    }
    this._Create();
    return this;
}
function JcmMonitorTrunk(trunkSumInfo) {
    this._data = new JcmItemData();
    this._arrColine = [];
    this._Create = function(){
        this._data.Init(trunkSumInfo);
    }
    this.Clear = function(){
        arrayEmpty(this._arrColine);
    }
    this.SetTrunkCommon = function () {
        //this._data.SetItemValue("shortTaskID",G_MonitorConst.GetShortTaskID(this._data.GetItemValue("taskID")));
    }
    this._Create();
    return this;
}

function CheckVccBarXPath(){
  var ctiPort = application.oJVccBar.GetAttribute("MainPortID");
  var monitorPort = application.oJVccBar.GetAttribute("MainPortID");

  if(ctiPort == 5049 || ctiPort == 14900)
    application.oJVccBar.SetAttribute("CtiXPath", "cti");
  else
    application.oJVccBar.SetAttribute("CtiXPath", "");
  if(monitorPort == 5049 || monitorPort == 14900)
    application.oJVccBar.SetAttribute("MonitorXPath", "monitor");
  else
    application.oJVccBar.SetAttribute("MonitorXPath", "");
}

function JcmMonitorTrunkGroup(){
    this._arrTrunk = [];
    this._data = new JcmItemData();
    this.Init = function(trunkInfo){
        this._data.Init(trunkInfo);
    }
    this.GetTrunkItem = function(trunkName){
        var oTrunk = null;
        for(var i=0;i<this._arrTrunk.length;i++){
            oTrunk = this._arrTrunk[i]._data;
            if(oTrunk.GetItemValue("trunkName") == trunkName){
                return this._arrTrunk[i];
            }
        }
        return null;
    }
    this.SetTrunkCommon = function(){
        this._data.SetItemValue("shortServiceId",
            G_MonitorConst.GetShortHumenService(this._data.GetItemValue("serviceId")));
    }
    this.Clear = function(){
        arrayEmpty(this._data);
        arrayEmpty(this._arrTask);
    }

    return this;
}

function JcmMonitorGroup(ampGroupType, name, monitorid, serviceid, valid){
    this._ampGroupType = ampGroupType;
    this._name = name;
    this._monitorid = monitorid;
    this._serviceid = serviceid;
    this._valid = valid;
    this._bMonitored = false;

    this._monitordata = null;
    this._Create = function(){
        switch(this._ampGroupType){
            case CM_AmpAgent:
                this._monitordata = new JcmMonitorAgentGroup();
                break;
            case CM_AmpService:
                this._monitordata = new JcmMonitorServiceGroup();
                break;
            case CM_AmpTask:
                this._monitordata = new JcmMonitorTaskGroup();
                break;
            case CM_AmpIVRService:
                this._monitordata = new JcmMonitorIvrServiceGroup();
                break;
            case CM_AmpTrunk:
                this._monitordata = new JcmMonitorTrunkGroup();
                break;
            default:
                break;
        }
    }

    this.SetMonitored = function(bFlag){
        this._bMonitored = bFlag;
    }
    this.GetMonitored = function(){
        return this._bMonitored;
    }
    this.GetMessageFlag = function(){
        if(this._ampGroupType == CM_AmpTrunk)
            return "010";
        return "";
    }

    this._Create();
    return this;
}
function JcmQueryGroupManager(){
    this._listQueryGroup = new Array();

    this.GetQueryGroupById = function (monitorid) {
        for(var i=0;i<this._listQueryGroup.length;i++){
            if(this._listQueryGroup[i].id == monitorid)
                return i;
        }
        return -1;
    }
    this.AddQueryGroup = function(monitorid,agentAll) {
        var nIndex = this.GetQueryGroupById(monitorid);
        if(nIndex == -1){
            var oQGroup = new Object();
            oQGroup.id = monitorid;
            oQGroup.bQuery = false;
            oQGroup.pos = 0;
            oQGroup.all = typeof(agentAll) == "undefined"?false:agentAll;
            this._listQueryGroup.push(oQGroup);
        }
    }
    this.DelQueryGroup = function(monitorid) {
        var nIndex = this.GetQueryGroupById(monitorid);
        if(nIndex != -1){
            this._listQueryGroup.splice(nIndex,1);
        }
    }
    this.SetGroupQuerying = function(monitorid){
        var nIndex = this.GetQueryGroupById(monitorid);
        if(nIndex == -1)
            return ;
        var oQGroup = this._listQueryGroup[nIndex];
        oQGroup.bQuery = true;
    }
    this.SetQueryGroupPos = function(monitorid,pos,plus){
        var nIndex = this.GetQueryGroupById(monitorid);
        if(nIndex == -1)
            return ;
        var oQGroup = this._listQueryGroup[nIndex];
        if(plus == true)
            oQGroup.pos = oQGroup.pos+pos;
        else
            oQGroup.pos = pos;
        return oQGroup.pos;
    }
    this.IsQueryGroupAll = function(monitorid){
      var nIndex = this.GetQueryGroupById(monitorid);
      if(nIndex == -1)
        return ;
      var oQGroup = this._listQueryGroup[nIndex];
      return oQGroup.all;
    }
    this.GetQueryingGroupId = function(){
        if(this._listQueryGroup.length>0){
            return this._listQueryGroup[0].id;
        }
        return "";
    }
    this.GetGroupQuerying = function(monitorid) {
        var nIndex = this.GetQueryGroupById(monitorid);
        if(nIndex == -1)
            return ;
        return this._listQueryGroup[nIndex].bQuery;
    }
    this.Clear = function(){
        this._listQueryGroup.splice(0,this._listQueryGroup.length);
    }

    return this;
}
function JcmMonitorManager(oVccBar){
    this._oVccBar = oVccBar;
    this._listGroup = new Array();
    this._oXml = new CXmlParse();
    this._oQueryGroup= new JcmQueryGroupManager();
    this.GetNumber = 10;
    this.AgentEventCount = 50;
    this._IsUnderIe8 = isUnderIe8();
    this._groupItems = {
        agentgroup:['agentid','deviceid','name','servicelist','type','valid','lock','login','asign','astate','aestate','atime','dsign','dstate','dtime','fstate','forward','callid','sid','rec','ip','macaddres','departmentid','departmentname','answerTime','callerNumber','calledNumber','callerName','loginOutTime','logoutReason','curServiceId','maxmm','curmm','mmcusts'],
        agentgroup30:['agentid','sct','scc','svct','svcc','srt','sqt','sact','sit','sbt','ssc','sst','lst','icc','ict','occ','oct','icfc','ocfc','taskid','mit'],
        agentgroupST:['agentId','agentName','phoneNumber','firstLoginTime','lastLoginTime','lastLogoutTime','loginTime','notReadyTime','DNDTransferTime','hsInAnswerCnt',' hsInAnswerTime','hsOutAnswerCnt','hsOutAnswerTime','hsDelayCnt','hsDelayTime','hsHoldCnt','hsHoldTime','phoneInAnswerCnt','phoneInAnswerTime',' phoneOutAnswerCnt','phoneOutAnswerTime','phoneHoldCnt','phoneHoldTime'],
        servicegroup:['monitorid','serviceId','shortServiceId','serviceName','hsNotQueueCnt','sum_hsQueueCnt','hsInCnt','hsAnswerCnt',
            'hsOverflowCnt','hsTransferCnt','hsQueueAbandonCnt','hsRingAbandonCnt','hsVMailAbandonCnt','hsVMsgAbandonCnt','hsNotVMsgAbandonCnt',
            'hsOtherAandonCnt','slSLTSet','slAnswerCntInSLT','slValue','slWaitTimeInSLT','hsPerAnswerWaitTime','hsPerAbandonWaitTime',
            'hsPerAnswerTime','hsMaxQueueLen','hsMaxQueueWaitTime','hsOutAnswerCnt','hsOutPerAnswerTime','serviceType','queueAllowed',
            'QTimeThreshold','QLengthThreshold','hsQueueCnt','curTime','coLineCount',
			'hsMaxWaitTime','hsAllAgentCnt','hsLoginCnt','hsReadyCnt','hsDelayCnt','hsLineBusyCnt','NumCallInQExceedSLT','hsLogoutCnt','hsNotReadyCnt','hsDNDFWD','hsWrongCnt','coInCnt','coAnswerCnt','coAbandonCnt','SLA','notAssignCnt'],
        serviceColine:['index','callSession','callTimeStamp','hsCallerId','hsCallerName','hsCallerPri','callType','hsCallerOrderId'],
        taskgroup:['vccID','monitorID','shortTaskID','taskID','count','taskType','startTime','time','AgentNum','QueueNum','MaxCallTime','MaxPhoneId','Progress','Progress2','Progress3','SecNumFromUrl','TotalNumFromUrl','CallNumPerMin','AvgServSec','AvgIdelSec','SpeedAdjustFactor','RecentConnectRate','RecentLossRate','AvgLossRate','CurrentRingNum','IdleAgentNum','ConnectAgentNum','TidyAgentNum','ConnectRecNum','UnConnRecNum','LossRecNum','ConnectRate','SecCallNumInfact','SecCallNumShould','RecZ','Url','MinServSec','MaxServSec','MinIdelSec','MaxIdelSec','Serv_0_10','Serv_10_30','Serv_30_60','Serv_60_120','Serv_120_300','Serv_300_600','Serv_600_inf','Idle_0_10','Idle_10_20','Idle_20_30','Idle_30_45','Idle_45_60','Idle_60_120','Idle_120_180','Idle_180_300','Idle_300_inf'],
        ivrservicegroup:['vccid','monitorid','shortServiceId','serviceId','serviceName','ivrAllCnt','ivrUseCnt'],
        trunkgroup:['vccid','monitorid','curTime','sumCount','currentCount'],
        trunksimplegroup:['trunkName','maxNum','callNum','callInNum','callOutNum','curTime','sumCount','currentCount'],
        trunkcoline:['type','urlNum','fromNum','beginTime'],
    };
    this._initial = false;

    //Method
    this.Initial = function (){
        this.UnInitial();
        G_MonitorConst.vccid = this._oVccBar.GetAttribute("MediaFlag");
        this._oVccBar.SetAttribute("MinotorVersion","4.0");
        this._oVccBar.InitialState();
    }
    this.UnInitial = function(){
        this._listGroup.splice(0,this._listGroup.length);
        this._oQueryGroup.Clear();
        this._initial = false;
    }

    this.IsInitial = function(){
        return this._initial;
    }
    this.GetAllGroup = function(){
        return this._listGroup;
    }
    this.GetGroupByid = function(monitorid){
        for(var i=0;i<this._listGroup.length;i++){
            var oGroup = this._listGroup[i];
            if(oGroup._monitorid == monitorid)
                return oGroup;
        }
        return null;
    }
    this.GetTaskByid = function(monitorid,taskId){
        var oGroup = this.GetGroupByid(monitorid);
        if(oGroup != null){
            if(oGroup._ampGroupType != CM_AmpTask)
                return null;
            for(var i= 0;i<oGroup._monitordata._arrTask.length;i++){
                if(oGroup._monitordata._arrTask[i]._data.GetItemValue("taskID") == taskId){
                    return oGroup._monitordata._arrTask[i];
                }
            }
        }
        return null;
    }

    this.loadAgentGroupData = function(monitorid,all) {
        this._oQueryGroup.AddQueryGroup(monitorid,all);
        this._loadAgentGroupData();
    }
    this.loadServiceGroupData = function () {
        var oGroups = this._listGroup;
        for(var i=0;i<oGroups.length;i++){
            var oGroup = oGroups[i];
            if(oGroup._ampGroupType != CM_AmpService)
                continue;
            if(oGroup.GetMonitored() == true)
                this._OnCallBack("OnServiceGroupReport",oGroup);
            else
                this._oVccBar.ServiceQuery(oGroup._monitorid,0);
        }
    }
    this.loadIvrGroupData = function () {
        var oGroups = this._listGroup;
        for(var i=0;i<oGroups.length;i++){
            var oGroup = oGroups[i];
            if(oGroup._ampGroupType != CM_AmpIVRService)
                continue;
            if(oGroup.GetMonitored() == true)
                this._OnCallBack("OnIvrGroupReport",oGroup);
            else
                this._oVccBar.IvrQuery(oGroup._monitorid,0);
        }
    }
    this.loadTrunkGroupData = function () {
        var oGroups = this._listGroup;
        for(var i=0;i<oGroups.length;i++){
            var oGroup = oGroups[i];
            if(oGroup._ampGroupType != CM_AmpTrunk)
                continue;
            if(oGroup.GetMonitored() == true)
                this._OnCallBack("OnTrunkGroupReport",oGroup);
            else
                this._oVccBar.TrunkQuery(oGroup._monitorid,0);
        }
    }
    this.loadTaskGroupData = function () {
        var oGroups = this._listGroup;
        for(var i=0;i<oGroups.length;i++){
            var oGroup = oGroups[i];
            if(oGroup._ampGroupType != CM_AmpTask)
                continue;
            if(oGroup.GetMonitored() == true)
                this._OnCallBack("OnTaskGroupReport",oGroup);
            else
                this._oVccBar.GetTaskSummary(oGroup._monitorid,"");
        }
    }
    this.EndNotificationGroups = function(groupType){
		for(var i=0;i<this._listGroup.length;i++){
			var oGroup = this._listGroup[i];
			if(oGroup._ampGroupType == groupType && oGroup.GetMonitored())
				this._EndNotificationGroup(oGroup);
		}
	}
	this.EndNotificationGroup = function(monitorid){
		var oGroup = this.GetGroupByid(monitorid);
		if(oGroup != null)
			this._EndNotificationGroup(oGroup);
	}
    this.GetNewMonitorTimeOffSet = function (agent) {
    let newOffSet = getStringTimerInterval(agent.atime,getAcpTimeString(false)) - this._oVccBar.GetMonitorTimeOffSet()
    return newOffSet
  }

	//private
    this._OnCallBack = function(cmd,oParam){
        if(cmd == "OnInitialState"){
            this.OnInitialState(oParam);
        }
        else if(cmd == "OnAgentGroupQuery"){
            this.OnAgentGroupQuery(oParam);
        }
        else if(cmd == "OnAgentGroupQueryPage"){
          this.OnAgentGroupQueryPage(oParam);
        }
        else if(cmd == "OnAgentReport"){
            this.OnAgentReport(oParam);
        }
        else if(cmd == "OnAgentCallReportInfo"){
            this.OnAgentCallReportInfo(oParam);
        }
        else if(cmd == "OnAgentStaticsReport"){
            this.OnAgentStaticReport(oParam);
        }
        else if(cmd == "OnTaskGroupReport"){
            this.OnTaskReport(oParam);
        }
        else if(cmd == "OnServiceGroupReport"){
            this.OnWallServiceReport(oParam);
        }
        else if(cmd == "OnIvrGroupReport"){
            this.OnIvrReport(oParam);
        }
        else if(cmd == "OnServiceGroupQueueReport"){
            this.OnWallQueueReport(oParam);
        }
        else if(cmd == "OnTrunkGroupReport"){
            this.OnTrunkSumReport(oParam);
        }
        else if(cmd == "OnTrunkColineReport"){
            this.OnTrunkReport(oParam);
        }
        else if(cmd == "ConStatusChange"){
            this.ConStatusChange(oParam);
        }

    }
    this._loadAgentGroupData = function(){
        var nextQueryMonitorId = this._oQueryGroup.GetQueryingGroupId();
        if(nextQueryMonitorId != "" && this._oQueryGroup.GetGroupQuerying(nextQueryMonitorId) == false){
            this._oQueryGroup.SetQueryGroupPos(nextQueryMonitorId,0,false);
            this._oQueryGroup.SetGroupQuerying(nextQueryMonitorId);
            this._oVccBar.AgentQuery(nextQueryMonitorId,0);
        }
    }
    this._loadAgentGroupSummary = function(monitorid) {
        this._oVccBar.CallReportQuery(monitorid,0);
        this._oQueryGroup.SetQueryGroupPos(monitorid,0,false);
    }
    this._loadAgentGroupSummary30 = function(monitorid) {
      this._oVccBar.CallReportQuery(monitorid,0,"3.0");
      this._oQueryGroup.SetQueryGroupPos(monitorid,0,false);
    }
    this._LoadInitialStateResponse = function(strParam){
        if(!this._oXml.loadXml(strParam))
            return -1;
        var groupNodes = (this._IsUnderIe8)?this._oXml.queryNodes("monitorInfo/monitor"):this._oXml.queryNodes("monitor");
        if(groupNodes == null)
            return -1;
        for(var i=0;i<groupNodes.length;i++){
            var mNode = groupNodes[i];
            var monitorid = this._oXml.queryNodeAttribute(mNode,"id");
            var oGroup = this.GetGroupByid(monitorid);
            if(oGroup != null)
                continue;
            oGroup = new JcmMonitorGroup(stringToInt(this._oXml.queryNodeAttribute(mNode,"type"),-1),
                this._oXml.queryNodeAttribute(mNode,"name"),this._oXml.queryNodeAttribute(mNode,"id"),
                this._oXml.queryNodeAttribute(mNode,"serviceid"),this._oXml.queryNodeAttribute(mNode,"valid"))
            if(oGroup._ampGroupType == CM_AmpAgent){
                oGroup._monitordata.Init(this._groupItems.agentgroup,
                    this._groupItems.agentgroupST,
                    this._groupItems.agentgroup30);
            }
            else if(oGroup._ampGroupType == CM_AmpService){
                oGroup._monitordata.Init(this._groupItems.servicegroup);
            }
            else if(oGroup._ampGroupType == CM_AmpTask){
                oGroup._monitordata.Init(this._groupItems.taskgroup);
            }
            else if(oGroup._ampGroupType == CM_AmpIVRService){
                oGroup._monitordata.Init(this._groupItems.ivrservicegroup);
            }
            else if(oGroup._ampGroupType == CM_AmpTrunk){
                oGroup._monitordata.Init(this._groupItems.trunkgroup);
            }
            this._listGroup.push(oGroup);
        }

        return groupNodes.length;
    }
    this._LoadAgentQueryResponse = function(strParam){
        if(!this._oXml.loadXml(strParam))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("agentInfo","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var agentrNodes = (this._IsUnderIe8)?this._oXml.queryNodes("agentInfo/agent"):this._oXml.queryNodes("agent");
        if(agentrNodes == null)
            return ;
        for(var i=0;i<agentrNodes.length;i++){
            var oAgent = agentrNodes[i];
            var cmAI = oGroup._monitordata.GetAgentItem(monitorId,this._oXml.queryNodeAttribute(oAgent,"agentid"),"");
            for (var j =0 ; j <this._groupItems.agentgroup.length; j++){
                cmAI._data.SetItemValue(this._groupItems.agentgroup[j],this._oXml.queryNodeAttribute(oAgent,this._groupItems.agentgroup[j]));
            }
            cmAI.ResetCommon(false);
        }
        if(agentrNodes.length < this.GetNumber){
            oGroup._monitordata.Staticstics();
            //if(g_monitorDebug == 1) return;
            if(this._oQueryGroup.IsQueryGroupAll(monitorId))
              this._loadAgentGroupSummary30(monitorId);
            else
              this._loadAgentGroupSummary(monitorId);
        }
        else{
            var newPos = this._oQueryGroup.SetQueryGroupPos(monitorId,agentrNodes.length,true);
            this._oVccBar.AgentQuery(monitorId,newPos);
        }
        if(oGroup._monitordata._listAgentItem.length>=this.AgentEventCount && oGroup._monitordata._listAgentItem.length<this.AgentEventCount+10)
          this._OnCallBack("OnAgentGroupQueryPage",oGroup);
    }
    this._LoadCallReportQueryResponse30 =function(strParam){
      if(!this._oXml.loadXml(strParam))
        return ;
      var monitorId = this._oXml.queryNodeAttributeByPath("callReport","monitorid");
      var oGroup = this.GetGroupByid(monitorId);
      if(oGroup == null)
        return;
      var agentrNodes = (this._IsUnderIe8)?this._oXml.queryNodes("callReport/agent"):this._oXml.queryNodes("agent");
      if(agentrNodes == null)
        return ;

      for(var i=0;i<agentrNodes.length;i++){
        var oAgent = agentrNodes[i];
        var cmAI = oGroup._monitordata.GetAgentItem(monitorId,this._oXml.queryNodeAttribute(oAgent,"agentid"),"");
        for (var j =0 ; j <this._groupItems.agentgroup30.length; j++){
          cmAI._data.SetItemValue(this._groupItems.agentgroup30[j],this._oXml.queryNodeAttribute(oAgent,this._groupItems.agentgroup30[j]));
        }
        cmAI.ResetCommon(true);
      }
      if(agentrNodes.length < this.GetNumber) {
        oGroup._monitordata.Staticstics();
        //this._oQueryGroup.DelQueryGroup(monitorId);
        //if(g_monitorDebug == 1) return;
        this._loadAgentGroupSummary(monitorId);
      }
      else{
        var newPos = this._oQueryGroup.SetQueryGroupPos(monitorId,agentrNodes.length,true);
        this._oVccBar.CallReportQuery(monitorId,newPos,"3.0");
      }
    }
    this._LoadCallReportQueryResponse =function(strParam){
        if(!this._oXml.loadXml(strParam))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("agentSumInfo","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var agentrNodes = (this._IsUnderIe8)?this._oXml.queryNodes("agentInfo/agent"):this._oXml.queryNodes("agent");
        if(agentrNodes == null)
            return ;
        for(var i=0;i<agentrNodes.length;i++){
            var oAgent = agentrNodes[i];
            var cmAI = oGroup._monitordata.GetAgentItem(monitorId,this._oXml.queryNodeAttribute(oAgent,"agentId"),"");
            for (var j =0 ; j <this._groupItems.agentgroupST.length; j++){
                cmAI._data.SetItemValue(this._groupItems.agentgroupST[j],this._oXml.queryNodeAttribute(oAgent,this._groupItems.agentgroupST[j]));
            }
            cmAI.ResetCommon(true);
        }
        if(agentrNodes.length < this.GetNumber) {
            this._oQueryGroup.DelQueryGroup(monitorId);
            this._OnCallBack("OnAgentGroupQuery",oGroup);
            this._StartNotificationGroup(oGroup);
        }
        else{
            var newPos = this._oQueryGroup.SetQueryGroupPos(monitorId,agentrNodes.length,true);
            this._oVccBar.CallReportQuery(monitorId,newPos);
        }
    }
    this._LoadServiceQueryResponse = function (strParam) {
        if(!this._oXml.loadXml(strParam))
            return null;
        var vccId = this._oXml.queryNodeAttributeByPath("serviceSumInfo","vccid");
        var monitorId = this._oXml.queryNodeAttributeByPath("serviceSumInfo","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return null;
        var oServiceNode = (this._IsUnderIe8)?this._oXml.queryNode("serviceSumInfo/service"):this._oXml.queryNode("service");
        if(oServiceNode == null)
            return oGroup;

        for (var j =0 ; j <oServiceNode.attributes.length; j++){
            if (oServiceNode.attributes[j].name == "hsQueueCnt")
                oGroup._monitordata._data.SetItemValue("sum_hsQueueCnt",oServiceNode.attributes[j].value);
            else
                oGroup._monitordata._data.SetItemValue(oServiceNode.attributes[j].name,oServiceNode.attributes[j].value);
        }
        oGroup._monitordata.SetServiceCommon();
        return oGroup;
    }
    this._LoadTaskQuerySummaryResponse = function(strParam){
        if(!this._oXml.loadXml(strParam))
            return null;
        var vccId = this._oXml.queryNodeAttributeByPath("taskInfo","vccID");
        var monitorId = this._oXml.queryNodeAttributeByPath("taskInfo","monitorID");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return null;
        arrayEmpty(oGroup._monitordata._arrTask);
        var taskNodes = (this._IsUnderIe8)?this._oXml.queryNodes("taskInfo/task"):this._oXml.queryNodes("task");
        if(taskNodes == null)
            return ;
        for(var i=0;i<taskNodes.length;i++){
            var oTaskNode = taskNodes[i];
            var oTask = new JcmMonitorTask(G_MonitorConst.GetArrayItem(G_MonitorConst.Task4Table,"name"));
            oGroup._monitordata._arrTask.push(oTask);
			oTask._data.SetItemValue("vccID",vccId);
			oTask._data.SetItemValue("monitorID",monitorId);
            for (var j =0 ; j <oTaskNode.attributes.length; j++){
                oTask._data.SetItemValue(oTaskNode.attributes[j].name,oTaskNode.attributes[j].value);
            }
            for (k =0 ; k <oTaskNode.childElementCount; k++){
                var childNode = oTaskNode.children[k];
                for (var j =0 ; j <childNode.attributes.length; j++){
                    oTask._data.SetItemValue(childNode.attributes[j].name,childNode.attributes[j].value);
                }
            }
            oTask.SetTaskCommon();
        }
        return oGroup;
    }
    this._LoadIvrQueryResponse = function(strParam){
        if(!this._oXml.loadXml(strParam))
            return null;
        var vccId = this._oXml.queryNodeAttributeByPath("service","vccid");
        var monitorId = this._oXml.queryNodeAttributeByPath("service","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return null;
        oGroup._monitordata._data.SetItemValue("vccid",vccId);
        oGroup._monitordata._data.SetItemValue("monitorid",monitorId);
        oGroup._monitordata._data.SetItemValue("serviceId",this._oXml.queryNodeAttributeByPath("service","serviceId"));
        oGroup._monitordata._data.SetItemValue("serviceName",this._oXml.queryNodeAttributeByPath("service","serviceName"));
        oGroup._monitordata._data.SetItemValue("ivrAllCnt",this._oXml.queryNodeAttributeByPath("service","ivrAllCnt"));
        oGroup._monitordata._data.SetItemValue("ivrUseCnt",this._oXml.queryNodeAttributeByPath("service","ivrUseCnt"));
        oGroup._monitordata.SetIvrServiceCommon();
        return oGroup;
    }
    this._LoadTrunkQueryResponse = function(strParam) {
        /*
        <trunkSumInfo vccid="" monitorid="" curTime ="" sumCount ="" currentCount ="">
        <trunk trunkName="" maxNum="" callNum="" callInNum="" callOutNum=""/>
        </trunkSumInfo>
         strParam = "<trunkSumInfo vccid='958888' monitorid='000011958888089903' curTime ='20170712140213' sumCount ='120' currentCount ='120'> ";
         strParam = strParam + "<trunk trunkName='trunk12' maxNum='50' callNum='15' callInNum='2' callOutNum='13'/>";
         strParam = strParam + "<trunk trunkName='trunk34' maxNum='30' callNum='16' callInNum='6' callOutNum='10'/>";
         strParam = strParam + "<trunk trunkName='trunk56' maxNum='40' callNum='20' callInNum='9' callOutNum='11'/>";
         strParam = strParam + "</trunkSumInfo>";
        */
        if(!this._oXml.loadXml(strParam))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("trunkSumInfo","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var trunkNodes = (this._IsUnderIe8)?this._oXml.queryNodes("trunkSumInfo/trunk"):this._oXml.queryNodes("trunk");
        if(trunkNodes == null)
            return ;
        var sumCount = parseInt(this._oXml.queryNodeAttributeByPath("trunkSumInfo","sumCount"));
        var currentCount = parseInt(this._oXml.queryNodeAttributeByPath("trunkSumInfo","currentCount"));
        for(var i=0;i<trunkNodes.length;i++){
            var oTrunk = trunkNodes[i];
            var cmTI = oGroup._monitordata.GetTrunkItem(this._oXml.queryNodeAttribute(oTrunk,"trunkName"));
            if(cmTI == null){
                cmTI = new JcmMonitorTrunk(this._groupItems.trunksimplegroup);
                oGroup._monitordata._arrTrunk.push(cmTI);
            }

            for (var j =0 ; j <this._groupItems.trunksimplegroup.length; j++){
                cmTI._data.SetItemValue(this._groupItems.trunksimplegroup[j],this._oXml.queryNodeAttribute(oTrunk,this._groupItems.trunksimplegroup[j]));
            }
            cmTI.SetTrunkCommon(true);
        }
        if(currentCount < sumCount) {
            var newPos = this._oQueryGroup.SetQueryGroupPos(monitorId,trunkNodes.length,true);
            this._oVccBar.TrunkQuery(monitorId,newPos);
        }
        else{
            this._oQueryGroup.DelQueryGroup(monitorId);
            this._OnCallBack("OnTrunkGroupReport",oGroup);
            this._StartNotificationGroup(oGroup);
        }
    }
    this._StartNotificationGroup = function(oGroup){
        if(g_monitorDebug == 1) return;
        if(oGroup.GetMonitored() == true)
            return ;
        oGroup.SetMonitored(true);
        G_MonitorConst.Log(stringFormat("StartNotificationGroup:【{0}】",oGroup._monitorid));
        this._oVccBar.StartNotification(oGroup._monitorid,oGroup._ampGroupType.toString(),oGroup.GetMessageFlag());
    }
    this._EndNotificationGroup = function(oGroup){
        if(g_monitorDebug == 1) return;
        if(oGroup.GetMonitored == false)
            return;
        oGroup.SetMonitored(false);
        this._oVccBar.EndNotification(oGroup._monitorid);
    }

    //Event
    this.OnInitialState = function(oGroups){}

    this.OnAgentGroupQueryPage = function(oGroup){}
    this.OnAgentGroupQuery = function(oGroup){}
    this.OnAgentReport = function(oAgentItem){}
    this.OnAgentCallReportInfo = function(oAgentItem){}
    this.OnAgentStaticReport = function(oAgentItem){}

    this.OnSetReportBtnStatus = function(btnIds,agentStatus){}
    this.OnSetAgentWorkReport = function(agentID,agentStatus,workStatus) {}
    this.ConStatusChange = function(agentStatus){}

    this.OnWallServiceReport = function(oGroup){}
    this.OnWallQueueReport = function(oGroup){}
    this.OnServiceStaticReport = function(oGroup){}

    this.OnTaskReport = function(oGroup){}

    this.OnTrunkReport = function(oGroup){}
    this.OnTrunkSumReport = function(oGroup){}

    this.OnIvrReport = function(oGroup){}

    this.OnServiceReport = function(oGroup){}
    this.OnTelReport = function(oTelItem){}
    this.OnOutboundReport = function(oAgentItem){}
    this.OnQueryMonitorSumReport = function(cmdName,reportInfo){}

    //JVccBar CallBack
    this.__OnMonitorMethodResponseEvent = function (cmdName,param){
        G_MonitorConst.Log(stringFormat("MethodName:【{0}】 return :\r\n【{1}】",cmdName,param));
        if(cmdName == "InitialState"){
            G_MonitorConst.timeOffSet = this._oVccBar.GetMonitorTimeOffSet();
            if(this._LoadInitialStateResponse(param)>=100)
            {
              this._oVccBar.InitialState(this._listGroup.length);
            }
            else{
              this._initial = true;
              G_MonitorConst.SetAgentSubBusy(this._oVccBar.GetBusySubStatus());
              this._OnCallBack("OnInitialState",this._listGroup);
            }

        }
        else if(cmdName == "AgentQuery"){
            this._LoadAgentQueryResponse(param);
        }
        else if(cmdName == "CallReportQuery30"){
            this._LoadCallReportQueryResponse30(param);
        }
        else if(cmdName == "CallReportQuery"){
          this._LoadCallReportQueryResponse(param);
        }
        else if(cmdName == "ServiceQuery"){
            var oGroup = this._LoadServiceQueryResponse(param);
            if(oGroup == null)  return;
            this._OnCallBack("OnServiceGroupReport",oGroup);
            this._StartNotificationGroup(oGroup);
        }
        else if(cmdName == "GetTaskSummary"){
            var oGroup = this._LoadTaskQuerySummaryResponse(param);
            if(oGroup == null)  return;
            this._OnCallBack("OnTaskGroupReport",oGroup);
            this._StartNotificationGroup(oGroup);
        }
        else if(cmdName == "IvrQuery"){
            var oGroup = this._LoadIvrQueryResponse(param);
            if(oGroup == null)  return;
            this._OnCallBack("OnIvrGroupReport",oGroup);
            this._StartNotificationGroup(oGroup);
        }
        else if(cmdName == "TrunkQuery"){
            this._LoadTrunkQueryResponse(param);
        }
        else if(cmdName == "StartNotification") {
            this._loadAgentGroupData();
        }
    }
    this.__OnAgentReport = function (AgentReportInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnAgentReport",AgentReportInfo));
        if(!this._oXml.loadXml(AgentReportInfo))
            return ;
        var vccId = this._oXml.queryNodeAttributeByPath("agent","vccid");
        var monitorId = this._oXml.queryNodeAttributeByPath("agent","monitorid");
        var agentId = this._oXml.queryNodeAttributeByPath("agent","agentid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var cmAI = oGroup._monitordata.GetAgentItem(monitorId,agentId,"");
        var oAgentNode = this._oXml.queryNode("agent");
        if(oAgentNode == null){
            return ;
        }
        for (var j =0 ; j <oAgentNode.attributes.length; j++){
            cmAI._data.SetItemValue(oAgentNode.attributes[j].name,oAgentNode.attributes[j].value);
        }
        cmAI.ResetCommon(false);
        oGroup._monitordata.Staticstics();
        this._OnCallBack("OnAgentReport",cmAI);
    }
    this.__OnAgentStaticReport = function (staticInfo){
        G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnAgentStaticReport",staticInfo));
        if(!this._oXml.loadXml(staticInfo))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("agentSumInfo","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var agentrNodes = (this._IsUnderIe8)?this._oXml.queryNodes("agentSumInfo/agent"):this._oXml.queryNodes("agent");
        if(agentrNodes == null)
            return ;
        for(var i=0;i<agentrNodes.length;i++){
            var oAgent = agentrNodes[i];
            var cmAI = oGroup._monitordata.GetAgentItem(monitorId,this._oXml.queryNodeAttribute(oAgent,"agentId"),"");
            for (var j =0 ; j <this._groupItems.agentgroupST.length; j++){
                cmAI._data.SetItemValue(this._groupItems.agentgroupST[j],
                    this._oXml.queryNodeAttribute(oAgent,this._groupItems.agentgroupST[j]));
            }
            cmAI.ResetCommon(true);
            this._OnCallBack("OnAgentStaticsReport",cmAI);
        }
    }
    this.__OnTaskReport = function (TaskReportInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnTaskReport",TaskReportInfo));
        var oGroup = this._LoadTaskQuerySummaryResponse(TaskReportInfo);
        if(oGroup != null)
             this._OnCallBack("OnTaskGroupReport",oGroup);
    }
    this.__OnWallServiceReport = function (serviceReportInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnWallServiceReport",serviceReportInfo));
		if(!this._oXml.loadXml(serviceReportInfo))
			return ;
		var vccId = this._oXml.queryNodeAttributeByPath("service","vccid");
		var monitorId = this._oXml.queryNodeAttributeByPath("service","monitorid");
		var oGroup = this.GetGroupByid(monitorId);
		if(oGroup == null)
			return;
		var oServiceNode = this._oXml.queryNode("service");
		if(oServiceNode == null){
			return ;
		}
		for (var j =0 ; j <oServiceNode.attributes.length; j++){
			oGroup._monitordata._data.SetItemValue(oServiceNode.attributes[j].name,oServiceNode.attributes[j].value);
		}
		oGroup._monitordata.SetServiceCommon();
		this._OnCallBack("OnServiceGroupReport",oGroup);
	}
    this.__OnWallQueueReport = function (queueInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnWallQueueReport",queueInfo));
        if(!this._oXml.loadXml(queueInfo))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("service","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var oServiceNode = this._oXml.queryNode("service");
        if(oServiceNode == null){
            return ;
        }
        for (var j =0 ; j <oServiceNode.attributes.length; j++){
            oGroup._monitordata._data.SetItemValue(oServiceNode.attributes[j].name,oServiceNode.attributes[j].value);
        }
        arrayEmpty(oGroup._monitordata._arrColine);
        var colineNodes = (this._IsUnderIe8)?this._oXml.queryNodes("service/coline"):this._oXml.queryNodes("coline");
        if(colineNodes == null)
            return ;

        for(var i=0;i<colineNodes.length;i++){
            var oColineNode = colineNodes[i];
            var oColine = new JcmServiceCoLine(this._groupItems.serviceColine);
            oGroup._monitordata._arrColine.push(oColine);
            oColine._data.SetItemValue("index",i);
            for (j =0 ; j <oColineNode.attributes.length; j++){
                oColine._data.SetItemValue(oColineNode.attributes[j].name,oColineNode.attributes[j].value);
            }
        }
        this._OnCallBack("OnServiceGroupQueueReport",oGroup);
    }
    this.__OnServiceStaticReport = function (staticInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnServiceStaticReport",staticInfo));
        var oGroup = this._LoadServiceQueryResponse(staticInfo);
        if(oGroup == null)  return;
        this._OnCallBack("OnServiceGroupReport",oGroup);
    }
    this.__OnTrunkReport = function (trunkInfo){
         /*
         <trunk trunkName="" vccid="" monitorid="" curTime ="" sumCount ="" currentCount ="">
         <coline  type="" urlNum="" fromNum=""  beginTime =""/>
         <coline  type="" urlNum="" fromNum=""  beginTime =""/>
         </trunk>
         */
        if(!this._oXml.loadXml(strParam))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("trunk","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var colineNodes = (this._IsUnderIe8)?this._oXml.queryNodes("trunk/coline"):this._oXml.queryNodes("coline");
        if( colineNodes == null )
            return ;
        var sumCount = parseInt(this._oXml.queryNodeAttributeByPath("trunk","sumCount"));
        var currentCount = parseInt(this._oXml.queryNodeAttributeByPath("trunk","currentCount"));
        var trunkName = this._oXml.queryNodeAttributeByPath("trunk","trunkName");
        var cmTI = oGroup._monitordata.GetTrunkItem(trunkName);
        if(cmTI == null)
            return;
        if(currentCount <= 50){//
            cmTI.Clear();
        }
        for(var i=0;i<colineNodes.length;i++){
            var oColine = colineNodes[i];
            var cmCl =  new JcmTrunkCoLine(this._groupItems.trunkcoline);
            cmTI._arrTrunk.push(cmCl);

            for (var j =0 ; j <this._groupItems.trunkcoline.length; j++){
                cmCl._data.SetItemValue(this._groupItems.trunkcoline[j],this._oXml.queryNodeAttribute(oColine,this._groupItems.trunkcoline[j]));
            }
            cmTI.SetTrunkColineCommon(true);
        }
        if(currentCount >= sumCount) {
            this._OnCallBack("OnTrunkColineReport",oGroup);
        }

    }
    this.__OnTrunkSumReport = function (trunkInfo){
        /*
         <trunkSumInfo vccid="" monitorid="" curTime ="" sumCount ="" currentCount ="">
         <trunk trunkName="" maxNum="" callNum="" callInNum="" callOutNum=""/>
         </trunkSumInfo>
        */
        if(!this._oXml.loadXml(trunkInfo))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("trunkSumInfo","monitorid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var trunkNodes = (this._IsUnderIe8)?this._oXml.queryNodes("trunkSumInfo/trunk"):this._oXml.queryNodes("trunk");
        if(trunkNodes == null)
            return ;
        var sumCount = parseInt(this._oXml.queryNodeAttributeByPath("trunkSumInfo","sumCount"));
        var currentCount = parseInt(this._oXml.queryNodeAttributeByPath("trunkSumInfo","currentCount"));
        for(var i=0;i<trunkNodes.length;i++){
            var oTrunk = trunkNodes[i];
            var cmTI = oGroup._monitordata.GetTrunkItem(this._oXml.queryNodeAttribute(oTrunk,"trunkName"));
            if(cmTI == null){
                cmTI = new JcmMonitorTrunk(this._groupItems.trunksimplegroup);
                oGroup._monitordata._arrTrunk.push(cmTI);
            }

            for (var j =0 ; j <this._groupItems.trunksimplegroup.length; j++){
                cmTI._data.SetItemValue(this._groupItems.trunksimplegroup[j],this._oXml.queryNodeAttribute(oTrunk,this._groupItems.trunksimplegroup[j]));
            }
            cmTI.SetTrunkCommon(true);
        }
        if(currentCount >= sumCount) {
            this._OnCallBack("OnTrunkGroupReport",oGroup);
        }
    }
    this.__OnAgentMonitorSignIn = function(info){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnAgentMonitorSignIn",info));
        this._OnCallBack("ConStatusChange",this._oVccBar.GetAgentStatus()>0?2:1);
    }
    this.__OnAgentMonitorSignOut = function(info){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnAgentMonitorSignOut",info));
        this._OnCallBack("ConStatusChange",0);
    }
    this.__OnTelReport = function (TelReportInfo){
	}
    this.__OnServiceReport = function (ServiceReportInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnServiceReport",ServiceReportInfo));
	}
    this.__OnIvrReport = function (IvrReportInfo){
        G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnIvrReport",IvrReportInfo));
        var oGroup = this._LoadIvrQueryResponse(IvrReportInfo);
        if(oGroup != null)
            this._OnCallBack("OnIvrGroupReport",oGroup);
	}
    this.__OnOutboundReport = function (TaskInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnOutboundReport",TaskInfo));
	}
    this.__OnCallReportInfo = function (CallInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnCallReportInfo",CallInfo));
        if(!this._oXml.loadXml(CallInfo))
            return ;
        var monitorId = this._oXml.queryNodeAttributeByPath("agent","monitorid");
        var agentId = this._oXml.queryNodeAttributeByPath("agent","agentid");
        var oGroup = this.GetGroupByid(monitorId);
        if(oGroup == null)
            return;
        var cmAI = oGroup._monitordata.GetAgentItem(monitorId,agentId,"");
        var oAgentNode = this._oXml.queryNode("agent");
        if(oAgentNode == null){
            return ;
        }
        for (var j =0 ; j <oAgentNode.attributes.length; j++){
            cmAI._data.SetItemValue(oAgentNode.attributes[j].name,oAgentNode.attributes[j].value);
        }
        cmAI.ResetCommon(true);
        //oGroup._monitordata.Staticstics();
        this._OnCallBack("OnAgentCallReportInfo",cmAI);
	}
    this.__OnQueryMonitorSumReport = function (cmdName,reportInfo){
		G_MonitorConst.Log(stringFormat("Event:【{0}】:\r\n【{1}】","OnQueryMonitorSumReport",reportInfo));
	}

    this.__SetReportBtnStatus = function(btnIds,agentStatus){
        this.OnSetReportBtnStatus(btnIds,agentStatus);
    }
    this.__SetAgentWorkReport = function(agentID,agentStatus,workStatus) {
        this.OnSetAgentWorkReport(agentID,agentStatus,workStatus);
    }

    this._createObject = function(){
        this._oVccBar.SetMonitorData(this);
    }

    this._createObject();
    return this;
}

//-------------------------------------
// monitor UI class
//-------------------------------------
var TIMER_AUTO     =  0;
var TIMER_HANDLE   =  1;
var g_oJMonitorTimer = null;
function JcmTime(){
    this.id = "";
    this.interval = 0;
    this.intervalMax = -1;
    this.intervalCount = -1;
    this.callbackEvent = null;
    this.parent = null;
    return this;
}
function JcmTimerEx(minInterval){

    if(typeof(minInterval) == "undefined")
        minInterval = 1000;//1 s

    if(g_oJMonitorTimer != null){
        g_oJMonitorTimer._cellInterVal = minInterval;
        return g_oJMonitorTimer;
    }

    this._cellInterVal = minInterval;
    this._bStart = false;
    this._timers = new Array();
    this._timerType = TIMER_AUTO;//0:自动 1:手动
    this._timerID = null;


    //*******************************
    // public
    //*******************************
    this.IsProcess = function(){
        return this._bStart;
    }
    this.OnTimer = function(){
        for(var i=0;i<this._timers.length;i++)
        {
            if(this._timers[i].intervalMax <=0 )
                continue;
            this._timers[i].intervalCount++;
            if( this._timers[i].intervalCount >= this._timers[i].intervalMax ){
                this._timers[i].intervalCount = 0;
                this._timers[i].callbackEvent(this._timers[i].id,this._timers[i].parent);
            }
        }
    }

    this.Start = function(){
        if(this._bStart)
            return;
        if(this._timerType == TIMER_AUTO) {
            if(g_oJMonitorTimer._timerID == null)
                g_oJMonitorTimer._timerID = setInterval( function(){ g_oJMonitorTimer.OnTimer()} ,g_oJMonitorTimer._cellInterVal);
        }
        this._bStart = true;
    }
    this.Stop = function(){
        if(!this._bStart)
            return ;
        if(g_oJMonitorTimer._timerID != null){
            clearInterval(g_oJMonitorTimer._timerID);
            g_oJMonitorTimer._timerID = null;
        }
        this._bStart = false;
    }

    this.SetTimer = function(id,interval,callbackEvent,parent){
        if(id<0 || interval<=0){
            return -1;
        }
        if(callbackEvent == null || typeof(callbackEvent) == "undefined")
            return -2;
        if(parent == null || typeof(parent) == "undefined")
            return -2;
        var nIndex = this._getTimerIndex(id,parent);
        if(nIndex != -1){
            this.Reset(id);
            return -3;
        }
        var oTimer = new JcmTime();
        oTimer.id = id;
        oTimer.interval = interval;
        oTimer.intervalMax = interval/this._cellInterVal;
        oTimer.callbackEvent = callbackEvent;
        oTimer.parent = parent;
        this._timers.push(oTimer);
        return this._timers.length -1;
    }
    this.KillTimer = function(id,parent){
        var nIndex = this._getTimerIndex(id,parent);
        if(nIndex != -1)
        {
            var oTimer = this._timers[nIndex];
            this._timers.splice(nIndex,1);
        }
    }
    this.KillAllTimer = function(){
        this._timers.splice(0,this._timers.length);
    }
    this.Reset = function(id,parent){
        var nIndex = this._getTimerIndex(id,parent);
        if(nIndex != -1){
            this._timers[nIndex].intervalCount = 0;
        }
    }
    this._getTimerIndex = function(id,parent){
        for(var i=0;i<this._timers.length;i++){
            if(this._timers[i].id == id && this._timers[i].parent == parent)
                return i;
        }
        return -1;
    }
    g_oJMonitorTimer = this;
    return this;
}

var g_last = null;
function JcmMenu(oContainer,id){
	this._oContainer = oContainer;
	this._id = id;
	this._classList = {
		objClass:'',
		MenuClass:'cmenu',
		liAbleClass:'liAble',
		liDisableClass:'liDisable',
		liMouseOverClass:'liMouseOver'
	};

	this._menu = null;
	this._ul = null;
	var oThis = this;

	this.AddMenuItem = function(name,flag,callfun,oParent) {
		if(name == "") {
			var hr = document.createElement("hr");
			hr.size = 1;
			hr.color = "#999999";
			this._menu.appendChild(hr);

			return ;
		}
		var li = document.createElement("LI");
		var oClass = (flag != 0)?this._classList.liAbleClass:this._classList.liDisableClass;
		li.innerHTML = name;
		if(this._ul != null)
            this._ul.appendChild(li);
		else
		    this._menu.appendChild(li);
		li.className = oClass;
		li.onclick = function(){ oThis.OnClickItem(name,flag,callfun,oParent);};
		li.onmouseover = function(){  oThis.ChangeLiClass(this,oThis._classList.liMouseOverClass);}
		li.onmouseout = function(){ oThis.ChangeLiClass(this,oClass)}

	}
	this.RemoveAllItem = function() {
		this._menu.innerHTML = "";
	}
	this.OnClickItem = function(name ,flag,callback,oParent) {
		if(flag == 0){
			return ;
		}
		if(callback != null){
			callback(name,oParent);
		}
	}

	this._Init = function() {
		this._oContainer.oncontextmenu = function(e){ oThis.ShowMenu(e)};
		window.document.onclick = function(){
			if(g_last !== null)
				g_last.HiddenMenu();
			else
				oThis.HiddenMenu();
		};

		this._menu = document.createElement("DIV");
		this._menu.id = oThis._id;
		this._menu.oncontextmenu = function(e){ oThis.stopBubble(e)};
		this._menu.className = this._classList.MenuClass;
		this._menu.style.display = "none";
        if(G_MonitorConst.UI.uve.useul == 1){
            this._ul = document.createElement("ul");
            this._menu.appendChild(this._ul);
        }
		window.document.body.appendChild(this._menu);
	}
	this.ChangeLiClass = function(obj,name){
		obj.className = name
	}
	this.ShowMenu = function(e) {
		if(g_last !== null)
			g_last.HiddenMenu();
		g_last = this;
		var e = e || window.event;
		oThis.stopBubble(e);
		var offsetX = e.clientX;
		var offsetY = e.clientY;
		with(this._menu.style)
		{
			display = "block";
			top = offsetY + "px";
			left = offsetX + "px";
		}
	}
	this.HiddenMenu = function() {
		this._menu.style.display = "none";
	}
	this.stopBubble = function(oEvent) {
		if(oEvent.stopPropagation)
			oEvent.stopPropagation();
		else
			oEvent.cancelBubble = true;
		if(oEvent.preventDefault)
			oEvent.preventDefault();
		else
			oEvent.returnValue = false;
	}

	this._Init();
	return this;
}

var G_SelectAgent = null;
function JcmAgentCtrl(top,left,oContainer,timerID,agentID,sLanguage) {
	this._window = window;
	oContainer = (typeof(oContainer) == "undefined")?null:oContainer;
	this._oContainer = (oContainer==null)?window:oContainer;;
	this._oDiv = null;
	this._top = top;
	this._left = left;
    this._timerID = timerID;
    this._timerOffSet = 0;
    this._timerCount = 0;
    this._oAgentData = null;
	this._oMenu = null;
	this._id = agentID;
    this._bSelected = false;
    this._bWarn = false;
    this._flashCount = 0;
    this.language = sLanguage;
    var oThisAgent = this;

    this._agentConst = {
		MenuIds:['Listen','Help','Insert','Intercept','Intercept','ForceRelease','Disconnect','MENU_Separator','Forceidle','Forcebusy','Forceout'],
		MenuItems:['监听','辅助','强插','代答','拦截','强拆','挂断','','置闲','置忙','签出'],
        eng_MenuItems:['Listen','Help','Insert','Pickup','Intercept','ForceRelease','Disconnect','','Forceidle','Forcebusy','Forceout'],
		itemFlags:[0,0,0,0,0,0,0,-1,0,0,0]
    }

	this.SetContent = function (sContent) {
		this._oDiv.innerHTML = sContent;
	}
	this.SetBackGround = function(bg){
        if(!(typeof(bg) == "undefined")){
            this._oDiv.style.background = bg;
            return;
        }
        if(this._bWarn) {
            if(this._flashCount % 2 == 0)
                bg = G_MonitorConst.UI.AgentConst[6]["color"];
            else
                bg = G_MonitorConst.GetAgentStatusColor(this._oAgentData._astate);
            this._flashCount++;
        }
        else {
            if(this._bSelected)
                bg = G_MonitorConst.UI.AgentConst[5]["color"];
            else
              bg = G_MonitorConst.GetAgentStatusColor(this._oAgentData._astate);
        }

		this._oDiv.style.background = bg;
	}
    this.SetTitle = function(sTitle){
        this._oDiv.title = sTitle;
    }
	this.BindEvent = function(oAgent){
		if(this._oMenu == null) {
			if(G_MonitorConst.mainSetting.agentMenuCmd.value == 0)
				return;
			this._oMenu = new JcmMenu(this._oDiv,oAgent._agentid);
		}
	}
	this.OnMenuClick = function(name,oThis){
		var cmdType = "";
        if(oThis.language == lg_zhcn){
            if(name == "监听") cmdType = "listen";
            else if(name == "辅助") cmdType = "help";
            else if(name == "强插") cmdType = "insert";
            else if(name == "代答") cmdType = "intercept";
            else if(name == "拦截") cmdType = "intercept";
            else if(name == "强拆") cmdType = "forcerelease";
            else if(name == "挂断") cmdType = "disconnect";
            else if(name == "置闲") cmdType = "forceidle";
            else if(name == "置忙") cmdType = "forcebusy";
            else if(name == "签出") cmdType = "forceout";
            else return;
        }
        else{
            if(name == "Listen") cmdType = "listen";
            else if(name == "Help") cmdType = "help";
            else if(name == "Insert") cmdType = "insert";
            else if(name == "Pickup") cmdType = "intercept";
            else if(name == "Intercept") cmdType = "intercept";
            else if(name == "ForceRelease") cmdType = "forcerelease";
            else if(name == "Disconnect") cmdType = "disconnect";
            else if(name == "Forceidle") cmdType = "forceidle";
            else if(name == "Forcebusy") cmdType = "forcebusy";
            else if(name == "Forceout") cmdType = "forceout";
            else return;
        }
		//G_oMonitorCtrl._ExecuteCmd(cmdType,oThis._oAgentData._agentid,0);
        oThis._ExecuteCmd(cmdType,oThis._oAgentData._agentid,0);
	}
    this._ExecuteCmd = function(cmdType,param,mType) {
        if(G_oMonitorCtrl.oJVccBar == null) {
            alert("电话条对象为空,不能执行质检命令!");
            return;
        }
        if(cmdType == "listen") {
            G_oMonitorCtrl.oJVccBar.Listen(param,mType);
        }
        else if(cmdType == "help"){
            G_oMonitorCtrl.oJVccBar.Help(param,mType);
        }
        else if(cmdType == "insert"){
            G_oMonitorCtrl.oJVccBar.Insert(param,mType);
        }
        else if(cmdType == "intercept"){
            G_oMonitorCtrl.oJVccBar.Intercept(param,mType);
        }
        else if(cmdType == "forcerelease"){
            G_oMonitorCtrl.oJVccBar.ForeReleaseCall(param,mType);
        }
        else if(cmdType == "disconnect"){
            G_oMonitorCtrl.oJVccBar.Disconnect();
        }
        else if (cmdType == "forceidle") {
            G_oMonitorCtrl.oJVccBar.ForceIdle(param);
        }
        else if (cmdType == "forcebusy") {
            G_oMonitorCtrl.oJVccBar.ForceBusy(param);
        }
        else if (cmdType == "forceout") {
            G_oMonitorCtrl.oJVccBar.ForceOut(param);
        }

    }
	this.OnSelectAgent = function(e){
        if(G_SelectAgent !== null) {
            G_SelectAgent._bSelected = false;
            G_SelectAgent.SetBackGround();
        }
        G_SelectAgent = this;
        this._bSelected = true;
        this.SetBackGround();
    }
    this.Update = function(oAgent){
        this._oAgentData = oAgent;
		if(G_MonitorConst.mainSetting.agentStatics.value == 1)
			this.SetTitle(this._GetAgentTitle(oAgent));
		this.BindEvent(oAgent);
        this._timerOffSet = getStringTimerInterval(this._oAgentData._atime,getAcpTimeString(false)) - G_MonitorConst.timeOffSet;
        if(this._timerOffSet<0) this._timerOffSet = 0;
        this._timerCount = 0;
        this.SetContent(this._GetAgentContent());
        this.SetBackGround();
    }
    this.ResetPopMenu = function(btnIds){
        if(this._oMenu == null)
            return;
    	var ids = btnIds.split("|");
        var oMenuItems = (this.language == lg_zhcn)?this._agentConst.MenuItems:this._agentConst.eng_MenuItems;
		if(ids.length == oMenuItems.length){
			this._oMenu.RemoveAllItem();
			for(var i=0;i<oMenuItems.length;i++){
				this._oMenu.AddMenuItem(oMenuItems[i],stringToInt(ids[i],0),this.OnMenuClick,this);
			}
		}

	}
    this._GetTimeInterval = function(){
        //var ncount = getStringTimerInterval(this._oAgentData._atime,getAcpTimeString(false));
        return this._getTimerString(this._timerCount + this._timerOffSet);
    }
    this.SetTipTime = function(id){
        if(this._timerID == id){
            this._timerCount++;
            this.SetContent(this._GetAgentContent());
        }
        else{
            if(this._flashCount % 2 == 0)
                this._bSelected = true;
            else
                this._bSelected = false;

            this.SetBackGround();
            this._flashCount++;
            if(this._flashCount == 15){
                g_oJMonitorTimer.KillTimer(id,this);
                this._flashCount = 0;
            }
        }
    }
    this.Warn = function(status,ntime){
        this._bWarn = false;
        var agentStatus = stringToInt(this._oAgentData._astate,0);
        if(agentStatus == status){
            if(status == 0){
                if(this._oAgentData._atime == "" || this._oAgentData._atime == "00000000000000"){
                    this._bWarn = true;
                    this.SetBackGround();
                    return;
                }
            }
            var ncount = getStringTimerInterval(this._oAgentData._atime,getAcpTimeString(false));
            if(ntime<=ncount){
                this._bWarn = true;
            }
        }
        this.SetBackGround();
    }

    this._getTimerString = function(len){
        if(len == 0)
            return "00:00";
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
    this._getAgentStatus = function(){
        oAgent = this._oAgentData;
        if(oAgent._astate<0 || oAgent._astate>4){
            return "";
        }
        else{
            if(this.language == lg_zhcn){
                if(oAgent._astate == 1)
                    return G_MonitorConst.GetAgentSubBusyStatusDes(oAgent._astate,oAgent._aestate,this.language);
                return (oAgent._astate == 3 && oAgent._aestate == 307)?"振铃中":G_MonitorConst.GetAgentStatusDes(oAgent._astate,this.language);
            }
            else{
                if(oAgent._astate == 1)
                    return G_MonitorConst.GetAgentSubBusyStatusDes(oAgent._astate,oAgent._aestate,this.language);
                return (oAgent._astate == 3 && oAgent._aestate == 307)?"Ring":G_MonitorConst.GetAgentStatusDes(oAgent._astate,this.language);
            }
        }
    }
    this._GetAgentContent = function(){
        oAgent = this._oAgentData;
        var sRet = stringFormat("<li class='liAgentTiltle'>{0}</li><hr style='height:1px;border:none;border-top:0px;margin-top: 2px;' color='#999999'><li class='liAgentContent'>{1}</li><li class='liAgentContent'>{2}</li><li class='liAgentContent'>{3}</li>",
                            oAgent._shortagentid,
                            oAgent._data.GetItemValue("agentName"),
                            this._getAgentStatus(),
                            (oAgent._astate == 0)?"----":this._GetTimeInterval()
                           );
        if(G_MonitorConst.UI.uve.useul == 1)
            sRet = "<ul>"+sRet+"</ul>";
        return sRet;
    }
    this._GetAgentTitle = function(oAgent){
        var tipTxt = "";
        if(this.language == lg_zhcn){
            tipTxt = "姓  名：" + oAgent._data.GetItemValue("name") + "\n";
            tipTxt = tipTxt + "最后签入时间:" + G_MonitorConst.GetTimeDisplay(oAgent._lst) + "\n";
            tipTxt = tipTxt + "后处理时长：" + this._getTimerString(oAgent._sact) + "\n";
            tipTxt = tipTxt + "未就绪时长：" + this._getTimerString(oAgent._sbt) + "\n";
            tipTxt = tipTxt + "呼入总时长：" + this._getTimerString(oAgent._ict) + "\n";
            tipTxt = tipTxt + "呼入总次数：" + oAgent._icc.toString() + "\n";
            tipTxt = tipTxt + "呼出总时长：" + this._getTimerString(oAgent._oct) + "\n";
            tipTxt = tipTxt + "呼出总次数：" + oAgent._occ.toString() + "\n";
            tipTxt = tipTxt + "总呼叫时长：" + this._getTimerString(oAgent._sct) + "\n";
            tipTxt = tipTxt + "总呼叫次数：" + oAgent._scc.toString() + "\n";
            tipTxt = tipTxt + "保留总时长：" + this._getTimerString(oAgent._scht) + "\n";
            tipTxt = tipTxt + "保留次数："   + oAgent._schc.toString();
        }
        else{
            tipTxt = "Name：" + oAgent._data.GetItemValue("name") + "\n";
            tipTxt = tipTxt + "Last signin time:" + G_MonitorConst.GetTimeDisplay(oAgent._lst) + "\n";
            tipTxt = tipTxt + "WorkingAfterCall time：" + this._getTimerString(oAgent._sact) + "\n";
            tipTxt = tipTxt + "Not ready time：" + this._getTimerString(oAgent._sbt) + "\n";
            tipTxt = tipTxt + "Callin totle time：" + this._getTimerString(oAgent._ict) + "\n";
            tipTxt = tipTxt + "Callin totle times：" + oAgent._icc.toString() + "\n";
            tipTxt = tipTxt + "Callout totle time：" + this._getTimerString(oAgent._oct) + "\n";
            tipTxt = tipTxt + "Callin totle times：" + oAgent._occ.toString() + "\n";
            tipTxt = tipTxt + "Call totle time：" + this._getTimerString(oAgent._sct) + "\n";
            tipTxt = tipTxt + "Call totle times：" + oAgent._scc.toString() + "\n";
            tipTxt = tipTxt + "Hold totle time：" + this._getTimerString(oAgent._scht) + "\n";
            tipTxt = tipTxt + "Hold totle times："   + oAgent._schc.toString();
        }
        return tipTxt;
    }
	this._create = function(){
		this._oDiv = this._window.document.createElement("DIV");
		this._oDiv.style.position = "absolute";
		this._oDiv.style.left = this._left+"px";
		this._oDiv.style.top = this._top+"px";
		this._oDiv.style.width = G_MonitorConst.UI.AgentSize.width+"px";
		this._oDiv.style.height = G_MonitorConst.UI.AgentSize.height+"px";
		this._oDiv.style.border = G_MonitorConst.UI.line.agentBorder+"px solid "+G_MonitorConst.UI.Color.agentBorderColor;
        this._oDiv.style.borderRadius = "2px";
        this._oDiv.className = "DivBackground";
        this._oDiv.style.cursor = "default";
		this._oDiv.id = this._id;
        this._oDiv.onclick = function(e){oThisAgent.OnSelectAgent(e);};
		if(this._oContainer == this._window)
			this._oContainer.document.body.appendChild(this._oDiv);
		else
			this._oContainer.appendChild(this._oDiv);

	}

	this._create();
	return this;
}
function JcmGroupCtrl(nLeft,nTop,nWidth,nHeight,oContainer,sLanguage){
	this.offset = 6;
	this.offsetleft = 0;
	this.headHeight = 20;
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
    this.language       = sLanguage;
	oContainer = (typeof(oContainer) == "undefined")?null:oContainer;
	this._oContainer = (oContainer==null)?window:oContainer;;
	this._window = window;
	this._oDivMain = null;
	this._oDivHead = null;
	this._listAgent = new Array();
	this._oGroupData = null;

    this._oTimer   = new JcmTimerEx();
    this._oTimer.Start();
	this._DisplayGroupStatics = function(){
		if(this._oDivHead == null){
			this._oDivHead = this._window.document.createElement("DIV");
			this._oDivHead.style.position = "absolute";
			this._oDivHead.style.left = this.left+"px";
			this._oDivHead.style.top = this.top+"px";
			this._oDivHead.style.margin.top = "5px";
			this._oDivHead.style.width = this.width+"px";
			this._oDivHead.style.height = this.headHeight+"px";
			this._oDivHead.style.textAlign = "left";
			this._oDivHead.className = "DivBackground";
			this._oDivHead.style.cursor = "default";
			this._oDivHead.id = "GRPID_"+this._oGroupData._monitorid;
			if(this._oContainer == this._window)
				this._oContainer.document.body.appendChild(this._oDivHead);
			else
				this._oContainer.appendChild(this._oDivHead);
			this._oDivHead.style.background = "#4Dffff";
		}
		var sRet = ""
		if(this.language == lg_zhcn){
            sRet = stringFormat("<li class='liGroupTitle'>【组名:{0}】 【座席总数:{1}】【忙碌:{2}】【空闲:{3}】【工作:{4}】【签出:{5}】【后处理:{6}】</li>",
                this._oGroupData._name,this._oGroupData._monitordata._totalAgents,this._oGroupData._monitordata._agentNotReadyAgents,this._oGroupData._monitordata._agentReadyAgents,
                this._oGroupData._monitordata._agentBusyAgents,this._oGroupData._monitordata._agentNullAgents,this._oGroupData._monitordata._workingAfterCallAgents);
        }
        else{
            sRet = stringFormat("<li class='liGroupTitle'>[Name:{0}] [Agent Total:{1}] [NotReady:{2}] [Ready:{3}] [Calling:{4}] [Signout:{5}] [WorkingAfterCall:{6}]</li>",
                this._oGroupData._name,this._oGroupData._monitordata._totalAgents,this._oGroupData._monitordata._agentNotReadyAgents,this._oGroupData._monitordata._agentReadyAgents,
                this._oGroupData._monitordata._agentBusyAgents,this._oGroupData._monitordata._agentNullAgents,this._oGroupData._monitordata._workingAfterCallAgents);
        }
        if(G_MonitorConst.UI.uve.useul == 1)
            sRet = "<ul>"+sRet+"</ul>";
		this._oDivHead.innerHTML = sRet;
	}
	this.loadGroup = function(oGroup) {
		this._oGroupData = oGroup;
		this._DisplayGroupStatics();
		var xCount = parseInt((nWidth-4)/(G_MonitorConst.UI.AgentSize.width+8));
		var yCount = 1;
		var nTop = this.offset+this.headHeight+this.offset;
		var nLeft = this.offset;
		var agentlist = this._oGroupData._monitordata._listAgentItem;
		for(var i=0;i<agentlist.length;i++){
			if( (i % xCount == 0) && i!=0){
				nTop = nTop + this.offset+G_MonitorConst.UI.AgentSize.height;
				nLeft = this.offsetleft;
				yCount++;
			}
			else
				nLeft = this.offsetleft+(this.offset+G_MonitorConst.UI.AgentSize.width)*(i % xCount);
			var oAGCtrl = new JcmAgentCtrl(nTop,nLeft,this._oDivMain,i,agentlist[i]._agentid,this.language);
            oAGCtrl.Update(agentlist[i]);
            if(oAgent._astate > 0)
           		 this._oTimer.SetTimer(oAGCtrl._timerID,1000,this._OnTimerEvent,oAGCtrl);
			this._listAgent.push(oAGCtrl);
		}

		this.height = this.offset+yCount*(this.offset+this.offset+G_MonitorConst.UI.AgentSize.height)+this.offset+this.headHeight+this.offset;
		this.Refresh();
	}
    this.ResetAgentItem = function(oAgent,oAgentMonitorCtrl){
        var oAGCtrl = this.GetAgentCtrlById(oAgent._agentid);
        if(oAGCtrl != null){
            oAGCtrl.Update(oAgent);
            if(oAgent._astate > 0)
                this._oTimer.SetTimer(oAGCtrl._timerID,1000,this._OnTimerEvent,oAGCtrl);
            else
                this._oTimer.KillTimer(oAGCtrl._timerID,oAGCtrl);

            this._SetAgentPopMenuItem(oAGCtrl,oAgentMonitorCtrl);
        }
		this._DisplayGroupStatics();
    }
    this.GetAgentCtrlById =function (agentId) {
        for(var i=0;i<this._listAgent.length;i++){
            if(this._listAgent[i]._oAgentData._agentid == agentId)
                return this._listAgent[i];
        }
        return null;
    }
    this.ShowSelectAgent = function(oAGCtrl){
        this._oTimer.SetTimer(oAGCtrl._timerID+10000,1000,this._OnTimerEvent,oAGCtrl);
    }
    this.WarmAgentInTeam = function(status,ntime){
        for(var i=0;i<this._listAgent.length;i++){
            this._listAgent[i].Warn(status,ntime);
        }
    }
	this.Clear = function(){
		var agentlist = this._oGroupData._monitordata._listAgentItem;
		for(var i=agentlist.length-1;i>=0;i--){
			var oAGCtrl = this._listAgent[i];
			this._oTimer.KillTimer(oAGCtrl._timerID,oAGCtrl);
			this._listAgent.splice(i,1);
		}

	}
	this._SetAgentPopMenuItem = function(oAgentCtrl,oAgentMonitorCtrl){
        var oAgent = oAgentCtrl._oAgentData;
        var agentMinitorStatus = G_oMonitorCtrl.GetMonitorAgentStatus();
        var isNotMonitorAgent = !(oAgent._agentid == G_oMonitorCtrl.GetMonitorAgentID());
        isNotMonitorAgent = isNotMonitorAgent && (agentMinitorStatus == 2);
        //listen
        var controls = (isNotMonitorAgent && oAgent._astate == 3 && oAgentMonitorCtrl.IsFunctionUserfull("19"))?"1":"0";
        //help
        controls = controls + stringFormat("|{0}", (isNotMonitorAgent && oAgent._astate == 3 && oAgentMonitorCtrl.IsFunctionUserfull("30"))?"1":"0");
        //Insert
        controls = controls + stringFormat("|{0}", (isNotMonitorAgent && oAgent._astate == 3 && oAgentMonitorCtrl.IsFunctionUserfull("20"))?"1":"0");
        //Intercept
        controls = controls + stringFormat("|{0}", (isNotMonitorAgent && oAgent._astate == 3 && oAgentMonitorCtrl.IsFunctionUserfull("21"))?"1":"0");
        //pickup
        controls = controls + stringFormat("|{0}", (isNotMonitorAgent && oAgent._astate == 3 && oAgent._aestate == 307 &&oAgentMonitorCtrl.IsFunctionUserfull("21"))?"1":"0");
        //ForeReleaseCall
        controls = controls + stringFormat("|{0}", (oAgent._astate == 3 && oAgentMonitorCtrl.IsFunctionUserfull("22"))?"1":"0");
        //Disconnect
        controls = controls + stringFormat("|{0}", (oAgentMonitorCtrl.IsFunctionUserfull("6"))?"1":"0");
        controls = controls + "|"+"-1";
        //Forceidle
        controls = controls + stringFormat("|{0}", (oAgent._astate == 4 || oAgent._astate == 1)?"1":"0");
        //Forcebusy
        controls = controls + stringFormat("|{0}",(oAgent._astate == 4 || oAgent._astate == 2)?"1":"0");
        //Forceout
        controls = controls + stringFormat("|{0}",(oAgent._astate == 4 || oAgent._astate == 2 || oAgent._astate == 1)?"1":"0");
        oAgentCtrl.ResetPopMenu(controls);
    }
    this.ReSetPopMenuItem = function(oAgentMonitorCtrl){
		for(var i=0;i<this._listAgent.length;i++){
		    this._SetAgentPopMenuItem(this._listAgent[i],oAgentMonitorCtrl);
		}

	}
	this.Refresh = function () {
		if( this._oDivMain != null) {
			this._oDivMain.style.display ="block";
		}
		this.Resize(this.left,this.top,this.width,this.height);
	}
	this.Resize = function (nLeft,nTop,nWidth,nHeight) {
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>=0)?nWidth:100;
		this.height	= (nHeight>=0)?nHeight:100;

		this._oDivMain.style.left = this.left+"px";
		this._oDivMain.style.top = this.top+"px";
		this._oDivMain.style.width = this.width+"px";
		this._oDivMain.style.height = this.height+"px";
	}
    this._OnTimerEvent = function(id,oThis){
        if(oThis != null) {
            oThis.SetTipTime(id);}
    }
	this._create = function(){
		this._oDivMain = this._window.document.createElement("DIV");
		this._oDivMain.style.position = "absolute";
		this._oDivMain.style.left = this.left+"px";
		this._oDivMain.style.top = this.top+"px";
		this._oDivMain.style.width = this.width+"px";
		this._oDivMain.style.height = this.height+"px";
		this._oDivMain.style.textAlign = "center";
		this._oDivMain.className = "DivBackground";
		this._oDivMain.innerHTML = "";
		if(this._oContainer == this._window)
			this._oContainer.document.body.appendChild(this._oDivMain);
		else
			this._oContainer.appendChild(this._oDivMain);
		this._oDivMain.style.background = G_MonitorConst.UI.Color.groupBackColor;
	}
	this._create();

	return this;
}
function JcmAgentMonitorCtrl(oContainer,sLanguage){
	this.offset = 5;
	this._oContainer = (typeof(oContainer) == "undefined")?null:oContainer;
	this._listGroup = new Array();
	this._curAgentStatus = -1;
	this._workStatus = -1;
    this._status = -1;
    this._ntime = -1;
	this._arrbtn = null;
    this.language = sLanguage;
	this._monitorAgentID = "";
    this._oTimer   = new JcmTimerEx();
    this._oTimer.Start();

	this.AddGroupItem = function(oGroup){
	    if(this.GetGroupCtrlById(oGroup._monitorid) != -1)
	        return;

		var nWidth = this._oContainer.offsetWidth-this.offset*2-30;
		var nLeft = this.offset;
		var nTop = this.offset;
		for(var i=0;i<this._listGroup.length;i++){
			nTop = nTop + this._listGroup[i].height+this.offset*2;
		}
		var oGrpCtrl = new JcmGroupCtrl(nLeft,nTop,nWidth,100,this._oContainer,this.language);
		oGrpCtrl.loadGroup(oGroup);
		this._listGroup.push(oGrpCtrl);
	}
	this.ReSetAgentInfo = function(oAgent){
        var index = this.GetGroupCtrlById(oAgent._monitorid);
        if(index != -1)
			this._listGroup[index].ResetAgentItem(oAgent,this);
    }
	this.SetAgentStatus = function(agentID,agentStatus,workStatus){
		//this._curAgentStatus = agentStatus;
		//this._workStatus = workStatus;
	}
	this.SetEableBtns = function(btnIds,agentStatus){
		this._arrbtn = btnIds.split("|");
		this._curAgentStatus = agentStatus;
		this.ChangeAgentPopMenu();
	}
	this.IsFunctionUserfull =function (id) {
		if(this._arrbtn == null)
			return false;
		for(var i=0;i<this._arrbtn.length;i++) {
			if(this._arrbtn[i] == id){
				return true;
			}
		}
		return false
	}

	this.SearchAgent = function(agentId){
	    var longAgentID = G_MonitorConst.GetLongAgentID(agentId);
        for(var i=0;i<this._listGroup.length;i++){
            var oAgent = this._listGroup[i].GetAgentCtrlById(longAgentID);
            if( oAgent != null)
            {
                this._listGroup[i].ShowSelectAgent(oAgent);
            }
        }
    }
    this.WarnAgents = function(state,ntime){
        this._status = state;
        this._ntime = ntime;
        if(this._status == -1){
            this._oTimer.KillTimer(1000,this);
            this.OnWarnAgent();
            return ;
        }
        this._oTimer.SetTimer(1000,1000,this._OnTimerEvent,this);
    }
    this.OnWarnAgent = function(){
        for(var i=0;i<this._listGroup.length;i++){
            var oGroupCtrl = this._listGroup[i];
            if( oGroupCtrl != null)
            {
                oGroupCtrl.WarmAgentInTeam(this._status,this._ntime);
            }
        }
    }

    this._OnTimerEvent = function(id,oThis){
        if(oThis != null) {
            oThis.OnWarnAgent();
        }
    }

	this.ChangeAgentPopMenu = function() {
		for(var i=0;i<this._listGroup.length;i++){
			this._listGroup[i].ReSetPopMenuItem(this);
		}
	}
    this.GetGroupCtrlById =function (monitorId) {
        for(var i=0;i<this._listGroup.length;i++){
            if(this._listGroup[i]._oGroupData._monitorid == monitorId)
                return i;
        }
        return -1;
    }
    this.Clear = function () {
		for(var i=0;i<this._listGroup.length;i++){
			this.DeleteGroupItem(this._listGroup[i]._oGroupData);
		}
		arrayEmpty(this._listGroup);
		this._oContainer.innerHTML = "";
	}
	this.DeleteGroupItem = function(oGroup){
		var index = this.GetGroupCtrlById(oGroup._monitorid);
		if(index == -1)
			return;
		this._listGroup[index].Clear();
		this._listGroup.splice(index,1);
	}

	this.Resize = function (nLeft,nTop,nWidth,nHeight) {
		this._oContainer.style.left = nLeft+"px";
		this._oContainer.style.top = nTop+"px";
		this._oContainer.style.width = nWidth+"px";
		this._oContainer.style.height = nHeight+"px";
	}

	return this;
}

function JcmAgentMonitorDataGridCtrl(oContainer,sLanguage){
    this.offset = 5;
    this._oContainer = (typeof(oContainer) == "undefined")?null:oContainer;
    this._listGroup = new Array();
	this._arrAgentID = [];
    this._curAgentStatus = -1;
    this._workStatus = -1;
    this._arrbtn = null;
    this.language = sLanguage;
    this._monitorAgentID = "";
    this._headers = {
        headIds:['shortagentid','name','astate','lastLoginTime','lastLogoutTime','loginTime',
		         'sbt','sact','svcc','svct','ict','icc','oct','occ','sct','scc'],
        headIdNames:['座席工号','座席姓名','当前状态','最后登入时间','最后登出时间','登入时长','未就绪时长',
		            '后处理时长','呼入总时长','呼入总次数','呼出总时长','呼出总次数','总呼叫时长','总呼叫次数'],
        eng_headIdNames:['agentID','agentName','status','last login time','last logout time','login time','unready time',
            'WorkingAfterCall Time','in-call time','in-call times','out-call time','out-call times','total call time','total call times']
    };

    this.AddGroupItem = function(oGroup){
        if(this.GetGroupCtrlById(oGroup._monitorid) != -1)
            return;

        var nWidth = this._oContainer.offsetWidth-this.offset*2-20;
        var nLeft = this.offset;
        var nTop = this.offset;
        this._listGroup.push(oGroup);
        this.Refresh();
    }
    this.ReSetAgentInfo = function(oAgent){
        var oTr =  $$("tr"+oAgent._agentid);
        if(oTr != null)
            oTr.innerHTML = this._getContentHtml(oAgent);
        $('#idAgentSTTable').datagrid();
    }
    this._getSpValue = function(oAgent,name){
        if(name == "sbt") return oAgent._sbt;
        else if(name == "sact") return oAgent._sact;
        else if(name == "ict") return oAgent._ict;
        else if(name == "icc") return oAgent._icc;
        else if(name == "oct") return oAgent._oct;
        else if(name == "occ") return oAgent._occ;
        else if(name == "sct") return oAgent._sct;
        else if(name == "scc") return oAgent._scc;
        else if(name == "svcc") return oAgent._svcc;
        else if(name == "svct") return oAgent._svct;
        else if(name == "shortagentid") return oAgent._shortagentid;
        else if(name == "lastLoginTime") return G_MonitorConst.GetTimeDisplay(oAgent._data.GetItemValue(name));
        else if(name == "lastLogoutTime") return G_MonitorConst.GetTimeDisplay(oAgent._data.GetItemValue(name));
        else
            return oAgent._data.GetItemValue(name);
    }
    this._getContentHtml = function(oAgent){
        var sReturn = stringFormat("<tr id='tr{0}' >",oAgent._agentid);
        for(var i=0; i<this._headers.headIds.length;i++) {
            if(this._headers.headIds[i] == "astate")
                if(this.language == lg_zhcn){
                    sReturn = sReturn+stringFormat("<td ><label style='color: {0}'>{1}</label></td>",
                            G_MonitorConst.GetAgentStatusColor(oAgent._astate),
                            (oAgent._astate == 3 && oAgent._aestate == 307)?"振铃中":G_MonitorConst.GetAgentStatusDes(oAgent._astate,this.language));
                }
                else{
                    sReturn = sReturn+stringFormat("<td ><label style='color: {0}'>{1}</label></td>",
                            G_MonitorConst.GetAgentStatusColor(oAgent._astate),
                            (oAgent._astate == 3 && oAgent._aestate == 307)?"Ring":G_MonitorConst.GetAgentStatusDes(oAgent._astate,this.language));
                }
            else
                sReturn = sReturn+stringFormat("<td >{0}</td>",this._getSpValue(oAgent,this._headers.headIds[i]));
        }
        sReturn = sReturn + "</tr>";
        return sReturn;
    }
    this._getTableHead = function(){
        /*
        var sReturn = stringFormat("<table id='idAgentSTTable' style='width:{0}px;height:auto;border:1px solid #ccc;' data-options='singleSelect: true' ><thead><tr>",
                      this._oContainer.offsetWidth);
        for(var i=0; i<this._headers.headIds.length;i++) {
            sReturn = sReturn+stringFormat("<th data-options=\"field:'{0}'\">{1}</th>",this._headers.headIds[i],this._headers.headIdNames[i]);
        }
        sReturn = sReturn + "</tr></thead>";
        */
        var sReturn = stringFormat("<table id='idAgentSTTable' style='width:{0}px;height:auto;border:1px solid #ccc;' data-options='singleSelect: true' ><thead><tr>",
            this._oContainer.offsetWidth-this.offset*2);
        var oHeadName = (this.language == lg_zhcn)?this._headers.headIdNames:this._headers.eng_headIdNames;
        for(var i=0; i<this._headers.headIds.length;i++) {
            sReturn = sReturn+stringFormat("<th data-options=\"field:'{0}'\">{1}</th>",this._headers.headIds[i],oHeadName[i]);
        }
        sReturn = sReturn + "</tr></thead>";
        return sReturn;
    }
    this.Refresh = function(){
        var oGroupAgentlist = null;
		this._oContainer.innerHTML = "";
		arrayEmpty(this._arrAgentID);
        var strTableHtml = this._getTableHead();
        strTableHtml = strTableHtml+"<tbody>";
        for(var i=0;i<this._listGroup.length;i++){
            oGroupAgentlist = this._listGroup[i]._monitordata._listAgentItem;
            for(var j=0;j<oGroupAgentlist.length;j++){
                var oAgent = oGroupAgentlist[j];
				if(getArrayIndex(this._arrAgentID,oAgent._agentid) != -1)
					continue;
				this._arrAgentID.push(oAgent._agentid);
                strTableHtml = strTableHtml+this._getContentHtml(oAgent);
            }
        }
        strTableHtml = strTableHtml+"</tbody></table>";
        this._oContainer.innerHTML = strTableHtml;
        $('#idAgentSTTable').datagrid();
    }
    this.SetAgentStatus = function(agentID,agentStatus,workStatus){
        this._curAgentStatus = agentStatus;
        this._workStatus = workStatus;
    }
    this.SetEableBtns = function(btnIds,agentStatus){
        this._arrbtn = btnIds.split("|");
        this._curAgentStatus = agentStatus;
    }

    this.GetGroupCtrlById =function (monitorId) {
        for(var i=0;i<this._listGroup.length;i++){
            if(this._listGroup[i]._monitorid == monitorId)
                return i;
        }
        return -1;
    }

    this.Clear = function () {
        for(var i=0;i<this._listGroup.length;i++){
            this.DeleteGroupItem(this._listGroup[i]);
        }
        arrayEmpty(this._listGroup);
		arrayEmpty(this._arrAgentID);
        this._oContainer.innerHTML = "";
    }
    this.DeleteGroupItem = function(oGroup){
        var index = this.GetGroupCtrlById(oGroup._monitorid);
        if(index == -1)
            return;
        this._listGroup.splice(index,1);
    }
    this.Resize = function (nLeft,nTop,nWidth,nHeight) {
        this._oContainer.style.left = nLeft+"px";
        this._oContainer.style.top = nTop+"px";
        this._oContainer.style.width = nWidth+"px";
        this._oContainer.style.height = nHeight+"px";
    }
    this.Refresh();

    return this;
}

function JcmDataGrid(oContainer,id,fieldIds,fieldNames) {
	this._oContainer = oContainer;
	this._id = id;
    this.offset = 8;
	oThis = this;

	this._arrData = [];
	this._fieldIds = fieldIds;
	this._fieldNames = fieldNames;

	this._getFieldFormatName = function(name){
		var arr = name.split("|");
		return arr.join("<br>");
	}
	this._getTableHead = function(){
		var sReturn = stringFormat("<table id='Table_{0}' style='width:{0}px;height:auto;border:1px solid #ccc;'  data-options='singleSelect: true'><thead><tr>",this._id,this._oContainer.offsetWidth-this.offset*2-20);
		for(var i=0; i<this._fieldIds.length;i++){
			sReturn = sReturn+stringFormat("<th data-options=\"field:'{0}',align:'center'\">{1}</th>",this._fieldIds[i],this._getFieldFormatName(this._fieldNames[i]));
		}
		sReturn = sReturn + "</tr></thead>";
		return sReturn;
	}
	this._getContentHtml = function(row,oFields){
		var sReturn = stringFormat("<tr id='tr_{0}_{1}'>",this._id,row);
		for(var i=0; i<oFields.length;i++)
		{
			sReturn = sReturn+stringFormat("<td ><label id='td_{0}_{1}_{2}'>{3}</label></td>",this._id,row,i,oFields[i]);
		}
		sReturn = sReturn + "</tr>";
		return sReturn;
	}
	this.SetTableHeader = function(fieldIds,fieldNames){
		this._fieldIds = fieldIds;
		this._fieldNames = fieldNames;
	}
	this.GetCellObject = function(row,col){
		return $$(stringFormat("td_{0}_{1}_{2}",this._id,row,col));
	}
	this.SetTableColEvent = function (col,eventKey,eventFun) {
		for(var i=0;i<this._arrData.length;i++){
			var oTd = $$(stringFormat("td_{0}_{1}_{2}",this._id,i,col));
			if(oTd != null){
				oTd.style.cursor = "pointer";
				oTd.onclick = function() {
					var arr = this.id.split("_");
					oThis.OnClick(parseInt(arr[2]),parseInt(arr[3]));
				}
			}
		}
	}

	this.OnClick = function(row,col){
		alert(stringFormat("({0},{1})",row,col));
	}
	this.AddTableRow = function (rowText) {
		this._arrData.push(rowText)
	}
	this.SetTableRow = function (row,rowText) {
		if(row<=0 || row>this._arrData.length)
			return;
		this._arrData[row] = rowText;
	}
    this.Clear = function(){
        this._arrData.splice(0,this._arrData.length);
        this._oContainer.innerHTML = "";
    }
	this.Refresh = function(){
		var strTableHtml = this._getTableHead()+"<tbody>";
		for(var i=0;i<this._arrData.length;i++){
			var oFields = this._arrData[i];
			strTableHtml = strTableHtml+this._getContentHtml(i,oFields);
		}
		strTableHtml = strTableHtml+"</tbody></table>";
		this._oContainer.innerHTML = strTableHtml;
		var tableID = stringFormat("Table_{0}",this._id);
		$('#'+tableID).datagrid();
	}

	this.Resize = function (nLeft,nTop,nWidth,nHeight) {
		this._oContainer.style.left = nLeft+"px";
		this._oContainer.style.top = nTop+"px";
		this._oContainer.style.width = nWidth+"px";
		this._oContainer.style.height = nHeight+"px";
	}

	return this;
}

function JcmTaskDataGridCtrl(oContainer,id,fieldIds,fieldNames,monitorId,taskId) {
	this._dataGrid = null;
    this._monitorId = monitorId;
    this._taskId = taskId;

	this._Create = function(){
		this._dataGrid = new JcmDataGrid(oContainer,id,fieldIds,fieldNames);
		this._dataGrid.Refresh();
	}
	this.Clear = function(){
		this._dataGrid.Clear();
	}
	this._GetTaskType = function(type){
	    if(type == "JQ") return "精确外拨";
        if(type == "JJ") return "渐进预测外拨";
        if(type == "YC") return "预测外拨";
        if(type == "JQ-YL") return "精确预览外拨";
        if(type == "IVR") return "IVR外拨";
    }

	this.DisplayTaskInfo = function (oGroup) {
		if(oGroup == null) return ;
        this.Clear();
		var oTaskInfo = oGroup._monitordata._arrTask;
		for(var i=0;i<oTaskInfo.length;i++){
			var data = [];
			var oTaskData = oTaskInfo[i]._data;
			for(var j=0;j< this._dataGrid._fieldIds.length;j++){
				if(this._dataGrid._fieldIds[j] == "monitorID")
					data.push(G_MonitorConst.GetShortAgentID (oTaskData.GetItemValue(this._dataGrid._fieldIds[j])));
                else if(this._dataGrid._fieldIds[j] == "taskType")
                    data.push(this._GetTaskType(oTaskData.GetItemValue(this._dataGrid._fieldIds[j])));
				else if(this._dataGrid._fieldIds[j] == "taskID")
					data.push(G_MonitorConst.GetShortTaskID(oTaskData.GetItemValue(this._dataGrid._fieldIds[j])));
				else
					data.push(oTaskData.GetItemValue(this._dataGrid._fieldIds[j]));
			}
 			this._dataGrid.AddTableRow(data);
		}
		this._dataGrid.Refresh();
        for(var i=0;i<oTaskInfo.length;i++){
            var oTaskData = oTaskInfo[i]._data;
            var oCell = this._dataGrid.GetCellObject(i,0);
            if(oCell != null){
                oCell.style.cursor = "pointer";
                oCell.style.textDecoration = "underline";
                oCell.setAttribute("onclick",stringFormat("G_oMonitorCtrl.onSelectTask('{0}','{1}')",oTaskData.GetItemValue("monitorID"),oTaskData.GetItemValue("taskID")));
            }
        }
        if(this._monitorId == ""){
            if(oTaskInfo.length>0){
                var oTaskData = oTaskInfo[0]._data;
                this._monitorId = oTaskData.GetItemValue("monitorID");
                this._taskId = oTaskData.GetItemValue("taskID");
            }
        }
        G_oMonitorCtrl.onSelectTask(this._monitorId,this._taskId);
	}
	this.Refresh= function(){
		this._dataGrid.Refresh();
	}

	this._Create();
	return this;
}
function JcmTaskDataDetailGridCtrl(oContainer,id,fieldIds,fieldNames,sLanguage) {
    this._oContainer = oContainer;
    this._id = id;
    this._offset = 2;
    this._cellWidth  = 80;
    this._cellValueWidth = 300;
    this._cellHeight = 60;
    this.language = sLanguage;

    //this._fieldIds = ['tdTaskInfo','tdTaskProgress','tdTaskAgent','tdTaskSpeed','tdTaskStatistics'];
    this._fieldIds = ['tdTaskInfo','tdTaskProgress','tdTaskAgent','tdTaskSpeed'];
    this._fieldNames = ['外呼信息','外呼进度','外呼座席','外呼速度','外呼统计'];
    this._engfieldNames = ['Info','Progress','Agents','Speed','Statistics'];
    this._fieldHeight = [32,40,40,120,100];


    this._getTableHead = function(){
        var sReturn = stringFormat("<table id='Table_{0}' style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='2' border='1' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._id,this._oContainer.offsetWidth-this._offset*2);
        return sReturn;
    }
    this._getContentHtml = function(i){
        var sReturn = "";
        if(this.language == lg_zhcn)
             sReturn = stringFormat("<td width='{0}' >{1}</td><td width='{2}' align='left' id='td_{3}_{4}'></td>",
            (this._cellWidth),this._fieldNames[i] ,this._cellValueWidth,this._id,this._fieldIds[i]);
        else
            sReturn = stringFormat("<td width='{0}' >{1}</td><td width='{2}' align='left' id='td_{3}_{4}'></td>",
                (this._cellWidth),this._engfieldNames[i] ,this._cellValueWidth,this._id,this._fieldIds[i]);

        return sReturn;
    }

    this._GetSingleTableHtml = function(arrCell,cols){
        if(arrCell.length<=0 || cols<=0)
            return "";
        var cellWidth = 150;
        var strTableHtml = stringFormat("<table style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='0' border='0' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._cellValueWidth-50);
        var sDTableCell = "";
        var count = 0;
        for(var i=0;i<arrCell.length;i++){
            if( (i % cols == 0) ){
                if(sDTableCell != "") {
                    count = 0;
                    strTableHtml = strTableHtml+sDTableCell+"</tr>";
                    sDTableCell = "";
                }
                sDTableCell = stringFormat("<tr height='{0}'>",20);
            }
            count++;
            sDTableCell = sDTableCell+ "<td width='150'>"+arrCell[i]+"</td>";
        }
        if(count >0) {
            for(var i=0;i<cols-count;i++) {
                sDTableCell = sDTableCell+"<td></td>";
            }
            strTableHtml = strTableHtml+sDTableCell+"</tr>";
        }

        strTableHtml = strTableHtml+"</table>";
        return strTableHtml;
    }

    this.DisplaySingleTaskInfo = function (oTask) {
        if(oTask == null) return ;
        var sFormat="";
        if(this.language == lg_zhcn)
            sFormat = "【任务号】:{0}({1}) 【持续时间】：{2}-->{3} ";
        else
            sFormat = "[Task Id]:{0}({1}) [Duration]：{2}-->{3} ";
        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[0])).innerHTML = stringFormat(sFormat,
            G_MonitorConst.GetShortTaskID(oTask._data.GetItemValue("taskID")),
            G_MonitorConst.GetTaskTypeName(oTask._data.GetItemValue("taskType")),
            oTask._data.GetItemValue("startTime"),G_MonitorConst.GetTimeDisplay(oTask._data.GetItemValue("time")));

        //外呼进度

        //sFormat = "【外呼遍数】：{0} &nbsp;&nbsp;&nbsp;&nbsp;【号码总数】：{1}&nbsp;&nbsp;&nbsp;&nbsp;【第1/2/3遍呼到序号】：{2}->{3}->{4}";
        if(this.language == lg_zhcn)
            sFormat = this._GetSingleTableHtml(['【外呼遍数】：{0}','【号码总数】：{1}','【第1/2/3遍呼到序号】：{2}->{3}->{4}'],3);
        else
            sFormat = this._GetSingleTableHtml(['[Times]：{0}','[Total Nums]：{1}','[The 1st/2nd/3rd time called serial number]：{2}->{3}->{4}'],3);

        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[1])).innerHTML = stringFormat(sFormat,
            oTask._data.GetItemValue("MaxCallTime"),oTask._data.GetItemValue("MaxPhoneId"),
            oTask._data.GetItemValue("Progress"),oTask._data.GetItemValue("Progress2"),
            oTask._data.GetItemValue("Progress3")
           );

        //sFormat = "【外呼速度(次/分)】：{0} &nbsp;&nbsp;&nbsp;&nbsp;【近期接通率(%)】:{3} &nbsp;&nbsp;&nbsp;&nbsp;【当前振铃数】:{6} <br>【平均服务时长(秒)】：{1} &nbsp;&nbsp;&nbsp;&nbsp;【近期呼损率(%)】:{4}<br> 【平均空闲时长(秒)】：{2} &nbsp;&nbsp; &nbsp;&nbsp;【平均呼损率(%)】:{5}";
        if(this.language == lg_zhcn)
            sFormat = this._GetSingleTableHtml(['【外呼速度(次/分)】：{0}','【近期接通率(%)】:{3}','【当前振铃数】:{6}','【平均服务时长(秒)】：{1}','【近期呼损率(%)】:{4}','','【平均空闲时长(秒)】：{2}','【平均呼损率(%)】:{5}'],3);
        else
            sFormat = this._GetSingleTableHtml(['[Speed(Frequency per minute)]:{0}','[Recent Connect Rate(%)]:{3}','[Ring Number]:{6}','[The Average Service Time(s)]:{1}','[The Recent Loss Rate(%)]:{4}','','[The Average Ready Time(s)]:{2}','[The Average Loss Rate(%)]:{5}'],3);
        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[3])).innerHTML = stringFormat(sFormat,
            oTask._data.GetItemValue("CallNumPerMin"),oTask._data.GetItemValue("AvgServSec"),
            oTask._data.GetItemValue("AvgIdelSec"),oTask._data.GetItemValue("RecentConnectRate"),
            oTask._data.GetItemValue("RecentLossRate"),oTask._data.GetItemValue("AvgLossRate"),
            oTask._data.GetItemValue("CurrentRingNum")
          );

        if(this.language == lg_zhcn)
            sFormat = this._GetSingleTableHtml(['【登录座席数】：{0}','【当前空闲座席数】：{1}','【当前通话座席数】：{2}','【当前后处理座席数】：{3}','【当前忙碌座席数】：{4}'],5);
        else
            sFormat = this._GetSingleTableHtml(['[Login Agent Count]:{0}','[Ready Agent Count]:{1}','[Calling Agent Count]:{2}','[WorkingAfterCall Agent Count]:{3}','[NotReady Agent Count]:{4}'],5);

        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[2])).innerHTML = stringFormat(sFormat,
            oTask._data.GetItemValue("AgentNum"),oTask._data.GetItemValue("IdleAgentNum"),oTask._data.GetItemValue("ConnectAgentNum"),
            oTask._data.GetItemValue("TidyAgentNum"),
            parseInt(oTask._data.GetItemValue("AgentNum")) - parseInt(oTask._data.GetItemValue("IdleAgentNum")) -parseInt(oTask._data.GetItemValue("TidyAgentNum")) -parseInt(oTask._data.GetItemValue("ConnectAgentNum"))
                    );

    }
    this.Clear = function(){
        this._oContainer.innerHTML = "";
    }
    this._getTableTitle = function(count){
        return stringFormat("<tr height='32' ><td colspan='{0}' align='left'><label id='idSingleTaskTilte'></label></td></tr>",count*2);
    }
    this.Refresh = function(){
        this._cellValueWidth = (this._oContainer.offsetWidth-this._offset*2)-this._cellWidth;
        var strTableHtml = this._getTableHead();
        var sDTableCell = "";
        for(var i=0;i<this._fieldIds.length;i++){
            strTableHtml += stringFormat("<tr height='{0}'>{1}</tr>",this._fieldHeight[i],this._getContentHtml(i));
        }
        strTableHtml = strTableHtml+"</table>";
        this._oContainer.innerHTML = strTableHtml;

    }

    this.Resize = function (nLeft,nTop,nWidth,nHeight) {
        this._oContainer.style.left = nLeft+"px";
        this._oContainer.style.top = nTop+"px";
        this._oContainer.style.width = nWidth+"px";
        this._oContainer.style.height = nHeight+"px";
        this.Refresh();
    }

    return this;
}

function JcmServiceDataGridCtrl(oContainer,id,fieldIds,fieldNames,selMonitorId) {
    this._dataGrid = null;
    this._arrMonitorId = [];
	this._selMonitorId = selMonitorId;
    this._Create = function(){
       this._dataGrid = new JcmDataGrid(oContainer,id,fieldIds,fieldNames);
       this._dataGrid.Refresh();
    }
    this.Clear = function(){
        this._dataGrid.Clear();
    }
    this.AddGroupItem = function(oGroup){
        var data = [];
        var oGroupData = oGroup._monitordata._data;
        for(var i=0;i< this._dataGrid._fieldIds.length;i++){
            data.push(oGroupData.GetItemValue(this._dataGrid._fieldIds[i]));
        }

        var index = this.GetMonitorId(oGroup._monitorid);
        if(index == -1) {
            this._dataGrid.AddTableRow(data);
            this._dataGrid.Refresh();
            this._arrMonitorId.push(oGroup._monitorid);
            index = this._arrMonitorId.length-1;
        }
        else{
            this._dataGrid.SetTableRow(index,data);
            this._dataGrid.Refresh();
        }
		var oCell = this._dataGrid.GetCellObject(index,0);
		if(oCell != null){
			oCell.style.cursor = "pointer";
			oCell.style.textDecoration = "underline";
			oCell.setAttribute("onclick","G_oMonitorCtrl.onSelectService('"+this._arrMonitorId[index]+"')");
		}
		var selIndex = 0;
		if(this._selMonitorId != ""){
			selIndex = this.GetMonitorId(this._selMonitorId);
			if(selIndex == -1) selIndex = 0;
		}
		G_oMonitorCtrl.onSelectService(this._arrMonitorId[selIndex]);
    }

    this.GetMonitorId = function (monitorId) {
        for(var i=0;i<this._arrMonitorId.length;i++){
            if(this._arrMonitorId[i] == monitorId)
                return i;
        }
        return -1;
    }

    this._Create();
    return this;
}
function JcmServiceSingleQueueDataGridCtrl(oContainer,id,fieldIds,fieldNames) {
    this._dataGrid = null;
    this._Create = function(){
        this._dataGrid = new JcmDataGrid(oContainer,id,fieldIds,fieldNames);
        this._dataGrid.Refresh();
    }
    this.Clear = function(){
        this._dataGrid.Clear();
    }
	this.DisplaySingleServiceInfo = function (oGroup) {
		if(oGroup == null) return ;
        this.Clear();
		var oQueueInfo = oGroup._monitordata._arrColine;
		for(var i=0;i<oQueueInfo.length;i++){
			var data = [];
			var oGroupData = oQueueInfo[i]._data;
			for(var j=0;j< this._dataGrid._fieldIds.length;j++){
			    if( this._dataGrid._fieldIds[j] == "callTimeStamp")
				    data.push(G_MonitorConst.GetTimeDisplay(oGroupData.GetItemValue(this._dataGrid._fieldIds[j])));
                else
                    data.push(oGroupData.GetItemValue(this._dataGrid._fieldIds[j]));
			}
			this._dataGrid.AddTableRow(data);
		}
		this._dataGrid.Refresh();
	}
	this.Refresh= function(){
		this._dataGrid.Refresh();
	}

    this._Create();
    return this;
}
function JcmServiceSingleDataGridCtrl(oContainer,id,fieldIds,fieldNames,sLanguage) {
    this._oContainer = oContainer;
    this._id = id;
    this._offset = 10;
    this._cellWidth  = 100;
	this._cellValueWidth = 140;
    this._cellHeight = 60;
    this.language = sLanguage;

    this._fieldIds = ['tdServerInfo','tdServerQueue','tdServerLevel','tdServerAgent'];
    this._fieldNames = ['人工服务信息','服务排队信息','服务水平信息','服务座席信息'];
    this._eng_fieldNames = ['Info','Queue','Level','Agent'];
    this._fieldHeight = [32,40,40,80,100];
    this._ServiceType=[
        '平均分配',
        '座席优先级高',
        '座席优先级低',
        '当前空闲时间最长的优先',
        '当天累计空闲时间最长的优先',
        '当天平均空闲时间最长的优先',
        '当天应答时间最少的优先',
        '当天应答次数最少的优先',
        '组合策略，以多种策略组合来决定优先级'
        ];
    this._eng_ServiceType=[
        'Average distribution',
        'Agent priority high',
        'Agent priority low',
        'Priority of the longest free time today',
        'Priority of the longest accumulated idle time today',
        'Priority of the longest average free time today',
        'Priority of the minimum response time today',
        'Priority of the minimum number of responses today',
        'combination strategy that determines priorities by combining multiple strategies'
    ];

    this._getTableHead = function(){
        var sReturn = stringFormat("<table id='Table_{0}' style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='2' border='1' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._id,this._oContainer.offsetWidth-this._offset*2);
        return sReturn;
    }
    this._getContentHtml = function(i){
        var sReturn = "";
        if(this.language == lg_zhcn)
            sReturn = stringFormat("<td width='{0}' >{1}</td><td width='{2}' align='left' id='td_{3}_{4}'></td>",
            (this._cellWidth),this._fieldNames[i] ,this._cellValueWidth,this._id,this._fieldIds[i]);
        else
            sReturn = stringFormat("<td width='{0}' >{1}</td><td width='{2}' align='left' id='td_{3}_{4}'></td>",
                (this._cellWidth),this._eng_fieldNames[i] ,this._cellValueWidth,this._id,this._fieldIds[i]);

        return sReturn;
    }
    this._GetServiceTypeDes = function(serviceType){
        var Type = stringToInt(serviceType,-1);
        if(Type == -1)
            return "";
        if(Type>=0 && Type<8){
            if(this.language == lg_zhcn)
                return this._ServiceType[Type];
            return this._eng_ServiceType[Type];
        }
        var llType = Type - 100;
        if(llType>=0 && llType<8){
            if(this.language == lg_zhcn)
                return stringFormat("优先考虑接到上次接听的座席上,该座席不能排队，按照策略：%s",this._ServiceType[Type]);
            return stringFormat("Give priority to the busy agent who answer to the call, using the strategy:",this._eng_ServiceType[Type]);
        }
        return "";
    }
    this._GetSingleTableHtml = function(arrCell,cols){
        if(arrCell.length<=0 || cols<=0)
            return "";
        var cellWidth = 150;
        var strTableHtml = stringFormat("<table style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='0' border='0' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._cellValueWidth-50);
        var sDTableCell = "";
        var count = 0;
        for(var i=0;i<arrCell.length;i++){
            if( (i % cols == 0) ){
                if(sDTableCell != "") {
                    count = 0;
                    strTableHtml = strTableHtml+sDTableCell+"</tr>";
                    sDTableCell = "";
                }
                sDTableCell = stringFormat("<tr height='{0}'>",20);
            }
            count++;
            sDTableCell = sDTableCell+ "<td width='150'>"+arrCell[i]+"</td>";
        }
        if(count >0) {
            for(var i=0;i<cols-count;i++) {
                sDTableCell = sDTableCell+"<td></td>";
            }
            strTableHtml = strTableHtml+sDTableCell+"</tr>";
        }

        strTableHtml = strTableHtml+"</table>";
        return strTableHtml;
    }
    this._GetColorText = function(sText,clIndex){
        return stringFormat("<label style='color: {0}'>{1}</label>",
                G_MonitorConst.UI.AgentConst[clIndex]["color"],sText);
    }
    this.DisplaySingleServiceInfo = function (oGroup) {
        if(oGroup == null) return;
        var oService = oGroup._monitordata;
        var sFormat = "";
        if(this.language == lg_zhcn)
            sFormat = "【服务标示】:{0} 【服务名称】：{1}  【当前时间】：{2} ";
        else
            sFormat = "[Service Id]:{0} [Service Name]:{1}  [Current Time]:{2} ";

        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[0])).innerHTML = stringFormat(sFormat,
            oService._data.GetItemValue("shortServiceId"),
            oService._data.GetItemValue("serviceName"),
            G_MonitorConst.GetTimeDisplay(oService._data.GetItemValue("curTime")));

        if(this.language == lg_zhcn)
            sFormat = "【当前排队数】:{0} 【最长等待时间】：{1} 【排队策略】：{2} ";
        else
            sFormat = "[Current Time]:{0} [Max Waiting Time]:{1} [Queue Strategy]:{2} ";

        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[1])).innerHTML = stringFormat(sFormat,
            oService._data.GetItemValue("hsQueueCnt"),
            oService._data.GetItemValue("hsMaxWaitTime"),
            this._GetServiceTypeDes(oService._data.GetItemValue("serviceType"))
        );

        if(this.language == lg_zhcn)
            sFormat = "【等待时间超过服务水平电话数】:{0} ";
        else
            sFormat = "[Waiting time did exceed service level]:{0} ";

        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[2])).innerHTML = stringFormat(sFormat,
            oService._data.GetItemValue("NumCallInQExceedSLT")
        );

        if(this.language == lg_zhcn)
            sFormat = this._GetSingleTableHtml(['【座席总数】：{0}','【登出座席数】：{1}','【忙碌座席数】：{2}','【空闲座席数】：{3}','【通话座席数】：{4}','【后处理座席】：{5}'],6);
        else
            sFormat = this._GetSingleTableHtml(['[Total Agent Nums]:{0}','[Logout Agent Nums]:{1}','[NotReady Agent Nums]:{2}','[Ready Agent Nums]:{3}','[Calling Agent Nums]:{4}','[WorkingAfterCall Agent Nums]:{5}'],6);

        $$(stringFormat("td_{0}_{1}",this._id,this._fieldIds[3])).innerHTML = stringFormat(sFormat,
            oService._data.GetItemValue("hsAllAgentCnt"),
            oService._data.GetItemValue("hsLogoutCnt"),
            oService._data.GetItemValue("hsNotReadyCnt"),
            oService._data.GetItemValue("hsReadyCnt"),
            oService._data.GetItemValue("hsLineBusyCnt"),
            oService._data.GetItemValue("hsDelayCnt")
        );

    }

    this.Clear = function(){
        this._oContainer.innerHTML = "";
    }
    this.Refresh = function(){
        this._cellValueWidth = (this._oContainer.offsetWidth-this._offset*2)-this._cellWidth;
        var strTableHtml = this._getTableHead();
        var sDTableCell = "";
        for(var i=0;i<this._fieldIds.length;i++){
            strTableHtml += stringFormat("<tr height='{0}'>{1}</tr>",this._fieldHeight[i],this._getContentHtml(i));
        }
        strTableHtml = strTableHtml+"</table>";
        this._oContainer.innerHTML = strTableHtml;

    }

    this.Resize = function (nLeft,nTop,nWidth,nHeight) {
        this._oContainer.style.left = nLeft+"px";
        this._oContainer.style.top = nTop+"px";
        this._oContainer.style.width = nWidth+"px";
        this._oContainer.style.height = nHeight+"px";
    }

    return this;
}

function JcmIvrDataGridCtrl(oContainer,id,fieldIds,fieldNames) {
    this._dataGrid = null;
    this._arrMonitorId = [];

    this._Create = function(){
        this._dataGrid = new JcmDataGrid(oContainer,id,fieldIds,fieldNames);
        this._dataGrid.Refresh();
    }
    this.Clear = function(){
        this._dataGrid.Clear();
    }
    this.Refresh= function(){
        this._dataGrid.Refresh();
    }
    this.AddGroupItem = function(oGroup){
        var data = [];
        var oGroupData = oGroup._monitordata._data;
        for(var i=0;i< this._dataGrid._fieldIds.length;i++){
            data.push(oGroupData.GetItemValue(this._dataGrid._fieldIds[i]));
        }

        var index = this.GetMonitorId(oGroup._monitorid);
        if(index == -1) {
            this._dataGrid.AddTableRow(data);
            this._dataGrid.Refresh();
            this._arrMonitorId.push(oGroup._monitorid);
            index = this._arrMonitorId.length-1;
        }
        else{
            this._dataGrid.SetTableRow(index,data);
            this._dataGrid.Refresh();
        }
    }
    this.GetMonitorId = function (monitorId) {
        for(var i=0;i<this._arrMonitorId.length;i++){
            if(this._arrMonitorId[i] == monitorId)
                return i;
        }
        return -1;
    }

    this._Create();
    return this;
}
function JcmIvrChartCtrl(oContainer,id,sLanguage) {
    this._dataGrid = null;
    this._oContainer = oContainer;
    this.language = sLanguage;
    this._id = id;
    this._offset = 2;
    this._cellWidth  = 10;
    this._cellValueWidth = 300;

    this.chart = {
        getTitle:function(sLanguage){
            return (sLanguage==lg_zhcn)?"IVR话路监控图":"IVR Lines Monitor Chart";
        },
        getyAxis:function(sLanguage){
            return (sLanguage==lg_zhcn)?"IVR话路数":"IVR Lines Count";
        },
        getUseData:function(sLanguage){
            return (sLanguage==lg_zhcn)?"使用的话路":"IVR Used Lines";
        },
        getTotalData:function(sLanguage){
            return (sLanguage==lg_zhcn)?"总话路数":"IVR Total Lines";
        },
        xAxisCategories:['第一组', '第二页', '第三组', '第四组', '第五组'],
        dataSeries:{
            useData: [5, 3, 4, 7, 2],
            totalData: [15, 13, 14, 17, 12]
        }
    };

    this._getTableHead = function(){
        var sReturn = stringFormat("<table id='Table_{0}' style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='2' border='1' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._id,this._oContainer.offsetWidth-this._offset*2);
        return sReturn;
    }
    this._Create = function(){
        this._cellValueWidth = (this._oContainer.offsetWidth-this._offset*2)-this._cellWidth;
        var strTableHtml = this._getTableHead();
		 if(this.language == lg_zhcn)
			strTableHtml += stringFormat("<tr height='30'><td width='{0}' align='left'>{1}</td></tr>",this._cellValueWidth,"图型显示");
		else	
		    strTableHtml += stringFormat("<tr height='30'><td width='{0}' align='left'>{1}</td></tr>",this._cellValueWidth,"Chart");
			
        strTableHtml += stringFormat("<tr height='220'><td width='{0}' id='Table_TB_{1}'><div id='container' style='width: {2}px; height: 180px; margin-left:10px;margin-right: 10px;border:0px;'></div></td></tr>",this._cellValueWidth,this._id,this._cellValueWidth-30);
        strTableHtml = strTableHtml+"</table>";
        this._oContainer.innerHTML = strTableHtml;
        this.Clear();
    }
    this.Clear = function(){
        this.chart.dataSeries.useData = [];
        this.chart.dataSeries.totalData = [];
        this.chart.xAxisCategories = [];
       // container.innerHTML = "";
    }
    this.Refresh= function(){
       // container.innerHTML = "";
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: this.chart.getTitle(this.language)
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.chart.xAxisCategories,
                tickPixelInterval:10,
            },
            yAxis: {
                min: 0,
                tickPixelInterval:10,
                title: {
                    text: this.chart.getyAxis(this.language)
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                name: this.chart.getTotalData(this.language),
                data: this.chart.dataSeries.totalData,
            }, {
                name: this.chart.getUseData(this.language),
                data: this.chart.dataSeries.useData,
            }]
        });
    }
    this.AddGroupItem = function(oGroup){
        if(oGroup == null) return;
        var oGroupData = oGroup._monitordata._data;
		var strIvrName = oGroupData.GetItemValue("serviceName");
		var nUserCnt = parseInt(oGroupData.GetItemValue("ivrUseCnt"));
		var nTotleCnt = parseInt(oGroupData.GetItemValue("ivrAllCnt"));

        for(var i=0;i<this.chart.xAxisCategories.length;i++){
            if(this.chart.xAxisCategories[i] == strIvrName ){
                this.chart.dataSeries.useData[i] = nUserCnt;
                this.chart.dataSeries.totalData[i] = nTotleCnt;
                return;
            }
        }
		this.chart.xAxisCategories.push(strIvrName);
        this.chart.dataSeries.useData.push(nUserCnt);
        this.chart.dataSeries.totalData.push(nTotleCnt);
        this.Refresh();
    }

    this._Create();
    return this;
}

function JcmTrunkDataGridCtrl(oContainer,id,fieldIds,fieldNames) {
    this._dataGrid = null;
    this._arrMonitorId = [];

    this._Create = function(){
        this._dataGrid = new JcmDataGrid(oContainer,id,fieldIds,fieldNames);
        this._dataGrid.Refresh();
    }
    this.Clear = function(){
        this._dataGrid.Clear();
    }
    this.Refresh= function(){
        this._dataGrid.Refresh();
    }
    this.DisplayTrunkInfo = function (oGroup) {
        if(oGroup == null) return ;
        this.Clear();
        var oTrunkInfo = oGroup._monitordata._arrTrunk;
        for(var i=0;i<oTrunkInfo.length;i++){
            var data = [];
            var oTrunkData = oTrunkInfo[i]._data;
            for(var j=0;j< this._dataGrid._fieldIds.length;j++){
                data.push(oTrunkData.GetItemValue(this._dataGrid._fieldIds[j]));
            }
            this._dataGrid.AddTableRow(data);
        }
        this._dataGrid.Refresh();
    }
    this.GetMonitorId = function (monitorId) {
        for(var i=0;i<this._arrMonitorId.length;i++){
            if(this._arrMonitorId[i] == monitorId)
                return i;
        }
        return -1;
    }

    this._Create();
    return this;
}
function JcmTrunkChartCtrl(oContainer,id,sLanguage) {
    this._dataGrid = null;
    this._oContainer = oContainer;
    this.language = sLanguage;
    this._id = id;
    this._offset = 2;
    this._cellWidth  = 10;
    this._cellValueWidth = 300;

    this.chart = {
        getTitle:function(sLanguage){
            return (sLanguage==lg_zhcn)?"中继话路监控图":"Trunk Lines Monitor Chart";
        },
        getyAxis:function(sLanguage){
            return (sLanguage==lg_zhcn)?"中继话路数":"Trunk Lines Count";
        },
        getUseData:function(sLanguage){
            return (sLanguage==lg_zhcn)?"正使用话路":"Trunk Used Lines";
        },
        getTotalData:function(sLanguage){
            return (sLanguage==lg_zhcn)?"总话路数":"Trunk Total Lines";
        },
        xAxisCategories:['第一组', '第二页', '第三组', '第四组', '第五组'],
        dataSeries:{
            useData: [5, 3, 4, 7, 2],
            totalData: [15, 13, 14, 17, 12]
        }
    };

    this._getTableHead = function(){
        var sReturn = stringFormat("<table id='Table_{0}' style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='2' border='1' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._id,this._oContainer.offsetWidth-this._offset*2);
        return sReturn;
    }
    this._Create = function(){
        this._cellValueWidth = (this._oContainer.offsetWidth-this._offset*2)-this._cellWidth;
        var strTableHtml = this._getTableHead();
        if(this.language == lg_zhcn)
            strTableHtml += stringFormat("<tr height='30'><td width='{0}' align='left'>{1}</td></tr>",this._cellValueWidth,"图型显示");
        else
            strTableHtml += stringFormat("<tr height='30'><td width='{0}' align='left'>{1}</td></tr>",this._cellValueWidth,"Chart");

        strTableHtml += stringFormat("<tr height='220'><td width='{0}' id='Table_TB_{1}'><div id='container' style='width: {2}px; height: 180px; margin-left:10px;margin-right: 10px;border:0px;'></div></td></tr>",this._cellValueWidth,this._id,this._cellValueWidth-30);
        strTableHtml = strTableHtml+"</table>";
        this._oContainer.innerHTML = strTableHtml;
        this.Clear();
    }
    this.Clear = function(){
        this.chart.dataSeries.useData = [];
        this.chart.dataSeries.totalData = [];
        this.chart.xAxisCategories = [];
        //container.innerHTML = "";
    }
    this.Refresh= function(){
        //container.innerHTML = "";
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: this.chart.getTitle(this.language)
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.chart.xAxisCategories,
                tickPixelInterval:10,
            },
            yAxis: {
                min: 0,
                tickPixelInterval:10,
                title: {
                    text: this.chart.getyAxis(this.language)
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                name: this.chart.getTotalData(this.language),
                data: this.chart.dataSeries.totalData,
            }, {
                name: this.chart.getUseData(this.language),
                data: this.chart.dataSeries.useData,
            }]
        });
    }
    this.DisplayTrunkInfo = function(oGroup){
        if(oGroup == null) return;
        this.Clear();
        var oTrunkInfo = oGroup._monitordata._arrTrunk;
        for(var i=0;i<oTrunkInfo.length;i++){
            var oTrunkData = oTrunkInfo[i]._data;
            var strTrunkName = oTrunkData.GetItemValue("trunkName");
            var nUserCnt = parseInt(oTrunkData.GetItemValue("callNum"));
            var nTotleCnt = parseInt(oTrunkData.GetItemValue("maxNum"));
            this.chart.xAxisCategories.push(strTrunkName);
            this.chart.dataSeries.useData.push(nUserCnt);
            this.chart.dataSeries.totalData.push(nTotleCnt);
        }
        this.Refresh();
    }

    this._Create();
    return this;
}

function JcmWallBroadDataGridCtrl(oContainer,id,fieldIds,fieldNames) {
    this._dataGrid = null;
    this._arrMonitorId = [];
    this._Create = function(){
        this._dataGrid = new JcmDataGrid(oContainer,id,fieldIds,fieldNames);
        this._dataGrid.Refresh();
    }
    this.Clear = function(){
        this._dataGrid.Clear();
    }
    this.DisplayWallBroadData = function(sData,key){
        var arrRowData = sData.split("<br>");
        this.Clear();
        var index = this.GetFieldIndex(key);
        for(var i=0;i<arrRowData.length;i++){
            var data = arrRowData[i].split("|");
            if(data.length != this._dataGrid._fieldIds.length)
                continue;
            if(index != -1){
                if(key == "agentid"){
                    data[index] = G_MonitorConst.GetShortAgentID(data[index]);
                }
                else if(key == "humanserviceid"){
                    data[index] = G_MonitorConst.GetShortHumenService(data[index]);
                }
            }
            this._dataGrid.AddTableRow(data);
        }
        this._dataGrid.Refresh();
    }

    this.GetFieldIndex = function (fieldName) {
        for(var i=0;i< this._dataGrid._fieldIds.length;i++){
            if(this._dataGrid._fieldIds[i] == fieldName)
                return i;
        }
        return -1;
    }

    this._Create();
    return this;
}

function JcmSettingDataGridCtrl(oContainer,id,oSetting,key,sLanguage) {
	this._oContainer = oContainer;
	this._id = id;
	this._offset = 10;
	this._cellWidth  = 200;
	this._cellHeight = 32;
	this._key = key;
    this.language = sLanguage;

	this._oSetting    = oSetting;

	this._getTableHead = function(){
		var sReturn = stringFormat("<table id='Table_{0}' style='BORDER-COLLAPSE: collapse;width:{0}px;height:auto;' cellSpacing='0' cellPadding='2' border='1' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"'>",this._id,this._oContainer.offsetWidth-this._offset*2-20);

		return sReturn;
	}
	this._getFieldFormatName = function(name){
		var arr = name.split("|");
		return arr.join("");
	}

	this._getContentHtml = function(i){
		var oItem = this._oSetting[i];
		var sReturn = "";
        if(this.language == lg_zhcn){
            if(oItem["showFlag"] == "1")
                sReturn = stringFormat("<td width='{0}' align='left'><label ><input id='cb_{1}_{2}' type='checkbox' checked='checked' />{3}</label></td>",
                    (this._cellWidth+20),this._id,oItem["name"],this._getFieldFormatName(oItem["alias"]));
            else
                sReturn = stringFormat("<td width='{0}' align='left'><label ><input id='cb_{1}_{2}' type='checkbox' />{3}</label></td>",
                    (this._cellWidth+20),this._id,oItem["name"],this._getFieldFormatName(oItem["alias"]));
        }
        else{
            if(oItem["showFlag"] == "1")
                sReturn = stringFormat("<td width='{0}' align='left'><label ><input id='cb_{1}_{2}' type='checkbox' checked='checked' />{3}</label></td>",
                    (this._cellWidth+20),this._id,oItem["name"],this._getFieldFormatName(oItem["eng_alias"]));
            else
                sReturn = stringFormat("<td width='{0}' align='left'><label ><input id='cb_{1}_{2}' type='checkbox' />{3}</label></td>",
                    (this._cellWidth+20),this._id,oItem["name"],this._getFieldFormatName(oItem["eng_alias"]));
        }

		return sReturn;
	}
	this.Clear = function(){
		this._oContainer.innerHTML = "";
	}
	this.Refresh = function(){
		var xCount = parseInt((this._oContainer.offsetWidth-this._offset*2-20)/(this._cellWidth+20));
		var strTableHtml = this._getTableHead();
		var sDTableCell = "";
		var count = 0;

		var userCount  = 0;
		for(var i=0;i<this._oSetting.length;i++){
			if(this._oSetting[i]["name"] == this._key)
				continue;
			if( (userCount % xCount == 0) ){
				count = 0;
				if(sDTableCell != "") {
					strTableHtml = strTableHtml+sDTableCell+"</tr>";
					sDTableCell = "";
				}
				sDTableCell = stringFormat("<tr height='{0}'>",this._cellHeight);
			}
			count++;
			sDTableCell = sDTableCell+this._getContentHtml(i);
			userCount++;
		}
		if(count >0)
		{
			for(var i=0;i<xCount-count;i++) {
				sDTableCell = sDTableCell+"<td></td>";
			}
			strTableHtml = strTableHtml+sDTableCell+"</tr>";
		}


		strTableHtml = strTableHtml+"</table>";
		this._oContainer.innerHTML = strTableHtml;

	}

	this.Resize = function (nLeft,nTop,nWidth,nHeight) {
		this._oContainer.style.left = nLeft+"px";
		this._oContainer.style.top = nTop+"px";
		this._oContainer.style.width = nWidth+"px";
		this._oContainer.style.height = nHeight+"px";
	}

	this.Refresh();
	return this;
}

function JHTML5MonitorCtrl(nLeft,nTop,nWidth,nHeight,relationPath,oContentWindow,oWindow){
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	oWindow = (typeof(oWindow) == "undefined")?null:oWindow;
	this._window = (oWindow==null)?window:oWindow;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oMonitor_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
    this.language = getLocalLanguage();
	this.oMonitorShow = null;
	this.oMonitorData = null;
	//oThis = this;

    this._oTimer   = new JcmTimerEx();
    this._oTimer.Start();
	//电话条对象
	this.oJVccBar = null;
	this._relationPath = (typeof(relationPath) == "undefined")?"":relationPath;

	this._header = {
		headTabs:['idlableAgent','idlableTask','idlableService','idlableWallReport','idlableDebug','idlableSetting','idlableStatus'],
		headTabNames:['座席监控','外呼任务','服务监控','大屏展示','调试日志','设置','坐席状态'],
		lastSelTable:"",
		constatus:0
	};

	this._MainFrame = {};
	this._AgentPage = {
	    groupSubPage:{
	    	selGroups:[]  //selected groupID
		},
        conditionSubPage:{},
        agentSubPage:{
        	displayType:-1, //0:draw 1 table
			agentChartCtrl:null
		}
    };
    this._servicePage = {
    	serviceTablePage:null,
		serviceSinglePage:{
    		displayType:-1,//0:detail 1:queue
			serviceSingleCtrl:null,
			selectMonitorid:""
		}
	};
	this._taskPage = {
	    taskTablePage:null,
        taskDetailPage:null,
        selectMonitorid:"",
        selectTaskid:""
    };
    this._ivrPage = {
        ivrTablePage:null,
        ivrChartPage:null
    };
    this._trunkPage = {
        trunkTablePage:null,
        trunkChartPage:null
    };
	this._wallReportPage = {
		wallPortTablePage:null,
		displayType:-1   //0:vccId 1:agent 2:human
	};
	this._settingPage = {
		settingTablePage:null,
		displayType:-1   //0:vccId 1:agent 2:human
	};
	this._arrLog=[];

	this._createObject = function(){
		this.oMonitorShow = this._window.document.createElement("DIV");
		this.oMonitorShow.style.cursor = "default";
		this.oMonitorShow.style.position = "absolute";
		this.oMonitorShow.style.border = G_MonitorConst.UI.line.mainBorder+"px solid "+G_MonitorConst.UI.Color.bordColor;
		this.oMonitorShow.style.background =  G_MonitorConst.UI.Color.groupBackColor;
		this.oMonitorShow.style.left = this.left+"px";
		this.oMonitorShow.style.top = this.top+"px";
		this.oMonitorShow.style.width = this.width+"px";
		this.oMonitorShow.style.height = this.height+"px";
		this.oMonitorShow.style.textAlign = "center";
		this.oMonitorShow.id = "silverlightControlHost";

		if(this._contentWindow == this._window)
			this._contentWindow.document.body.appendChild(this.oMonitorShow);
		else
			this._contentWindow.appendChild(this.oMonitorShow);
		this.SetFunctionPage("0|1|2|3|4|6");

        this._LoadDefaultFromLocal();

		this._oTimer.SetTimer(100,1000,this._OnMonitorTimerEvent,this);
	}
    this._LoadDefaultFromLocal = function(){
        //座席
		G_MonitorConst.LoadConfig(0);
		//G_MonitorConst.LoadConfig(1);
		G_MonitorConst.LoadConfig(2);
		G_MonitorConst.LoadConfig(3);
		G_MonitorConst.LoadConfig(4);
		G_MonitorConst.LoadConfig(5);
    }
    this._IslabelUse = function(cmdKey){
		for(var j=0;j<this._header.headTabs.length;j++){
			if(this._header.headTabs[j] == cmdKey)
				return true;
		}
		return false;
	}
	//1、Head mainpage
	this._Refreash = function(){
		this.oMonitorShow.innerHTML = this._getMSLHtml();
		var firstIndex = -1;
		for (var i =0 ; i <this._header.headTabs.length; i++) {
			if(firstIndex == -1)
				firstIndex = i;
			if(this._header.headTabs[i] == this._header.lastSelTable){
				firstIndex = i;
			}
			$$(this._header.headTabs[i]).setAttribute("onclick","G_oMonitorCtrl.onHeadClick('"+this._header.headTabs[i]+"',false)");
		}
		this._MainFrame = $$("idMainFrame");
		if(firstIndex >=0)
			this.onHeadClick(this._header.headTabs[firstIndex],true);
		this.SetCtrlStatus(this._header.constatus);
	}
	this._SetHeadStyle = function(cmdKey){
		var oBtn = $$(cmdKey);
		if(oBtn != null)
			oBtn.style.color="red";
		if(this._header.lastSelTable != "" && this._header.lastSelTable != cmdKey) {
			oBtn = $$(this._header.lastSelTable);
			if(oBtn != null)
				oBtn.style.color="black";
		}

		if(this._header.lastSelTable == "idlableAgent"){
			if(this._AgentPage.agentSubPage.agentChartCtrl != null)
				this._AgentPage.agentSubPage.agentChartCtrl.Clear();
			this._AgentPage.agentSubPage.agentChartCtrl = null;
			if(G_MonitorConst.mainSetting.tabGroupDataClose.value == 1){
				this.oMonitorData.EndNotificationGroups(CM_AmpAgent);
				arrayEmpty(this._AgentPage.groupSubPage.selGroups);
			}
		}
		else if(this._header.lastSelTable == "idlableService"){
			if(this._servicePage.serviceTablePage != null)
				this._servicePage.serviceTablePage.Clear();
			this._servicePage.serviceTablePage = null;

			if(this._servicePage.serviceSinglePage.serviceSingleCtrl != null)
				this._servicePage.serviceSinglePage.serviceSingleCtrl.Clear();
			this._servicePage.serviceSinglePage.serviceSingleCtrl = null;
			if(G_MonitorConst.mainSetting.tabGroupDataClose.value == 1){
				this.oMonitorData.EndNotificationGroups(CM_AmpService);
			}
		}
		else if(this._header.lastSelTable == "idlableIvr"){
            if(this._ivrPage.ivrTablePage != null){
                this._ivrPage.ivrTablePage.Clear();
                this._ivrPage.ivrTablePage = null;
            }
            if(this._ivrPage.ivrChartPage != null){
                this._ivrPage.ivrChartPage.Clear();
                this._ivrPage.ivrChartPage = null;
            }
            if(G_MonitorConst.mainSetting.tabGroupDataClose.value == 1){
                this.oMonitorData.EndNotificationGroups(CM_AmpIVRService);
            }
        }
        else if(this._header.lastSelTable == "idlableTrunk"){
            if(this._trunkPage.trunkTablePage != null){
                this._trunkPage.trunkTablePage.Clear();
                this._trunkPage.trunkTablePage = null;
            }
            if(this._trunkPage.ivrChartPage != null){
                this._trunkPage.ivrChartPage.Clear();
                this._trunkPage.ivrChartPage = null;
            }
            if(G_MonitorConst.mainSetting.tabGroupDataClose.value == 1){
                this.oMonitorData.EndNotificationGroups(CM_AmpTrunk);
            }
        }
		else if(this._header.lastSelTable == "idlableWallReport"){
            if(this._wallReportPage.wallPortTablePage != null){
                this._wallReportPage.wallPortTablePage.Clear();
                this._wallReportPage.wallPortTablePage = null;
            }
            this._oTimer.KillTimer(200,this);
        }
        else if(this._header.lastSelTable == "idlableTask"){
            if(this._taskPage.taskTablePage != null){
                this._taskPage.taskTablePage.Clear();
                this._taskPage.taskTablePage = null;
            }
            if(this._taskPage.taskDetailPage != null){
                this._taskPage.taskDetailPage.Clear();
                this._taskPage.taskDetailPage = null;
            }
			if(G_MonitorConst.mainSetting.tabGroupDataClose.value == 1){
				this.oMonitorData.EndNotificationGroups(CM_AmpTask);
			}
        }
		this._header.lastSelTable = cmdKey;
	}
	this._getHeadTableHtml = function(){
		var sReturn = "";
		for(var i=0;i<this._header.headTabs.length;i++){
			if(sReturn == "")
				sReturn = stringFormat("<label id ='{0}' style='cursor: pointer;text-decoration:underline'>{1}</label>",this._header.headTabs[i],this._header.headTabNames[i]);
			else
				sReturn = sReturn + stringFormat(" | <label id ='{0}' style='cursor: pointer;text-decoration:underline'>{1}</label>",this._header.headTabs[i],this._header.headTabNames[i]);
		}
		return sReturn;
	}
	this._getMSLHtml = function(){
		var sText = "";
		sText = "<TABLE style='BORDER-COLLAPSE: collapse;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0' ID='MainTable'>";
        if(this.language == lg_zhcn)
		    sText = sText + "<tr height='30' ><td align='left'>"+this._getHeadTableHtml()+"</td><td align='right' ><label id ='idlableSetting' style='cursor: pointer;text-decoration:underline' onclick='G_oMonitorCtrl.OnSettingClick();'>设置</label> | <image id ='idimageStatus' style='width:12px; height: 12px; margin-top: 8px; ' border='0' src=''><label id ='idlableStatus' >没有登录</label> </td></tr>";
        else
            sText = sText + "<tr height='30' ><td align='left'>"+this._getHeadTableHtml()+"</td><td align='right' ><label id ='idlableSetting' style='cursor: pointer;text-decoration:underline' onclick='G_oMonitorCtrl.OnSettingClick();'>Setting</label> | <image id ='idimageStatus' style='width:12px; height: 12px; margin-top: 8px; ' border='0' src=''><label id ='idlableStatus' >not login</label> </td></tr>";
		sText = sText + "<tr ><td colspan='2' >";
        sText += "<div id='idMainFrame' style='width:100%;height:"+(this.height-34)+"px;word-wrap:break-word;word-break:break-all;top:0px; '></div>";
		return 	sText;
	}
	this.OnSettingClick = function(){
		this.onHeadClick("idlableSetting",false);
	}
	this.onHeadClick = function(cmdKey,bInit){
		if(this._header.lastSelTable == cmdKey && bInit == false)
			return ;
		if(cmdKey == "idlableAgent"){
			this._SetHeadStyle(cmdKey);
            this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor ;
			this._InitAgentTabPage();
		}
		else if(cmdKey == "idlableTask"){
			this._SetHeadStyle(cmdKey);
			this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
			this._InitTaskTabPage();
		}
		else if(cmdKey == "idlableService"){
			this._SetHeadStyle(cmdKey);
			this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
			this._InitServiceTabPage();
		}
        else if(cmdKey == "idlableIvr"){
            this._SetHeadStyle(cmdKey);
            this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
            this._InitIvrTabPage();
        }
        else if(cmdKey == "idlableTrunk"){
            this._SetHeadStyle(cmdKey);
            this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
            this._InitTrunkTabPage();
        }
		else if(cmdKey == "idlableWallReport"){
			this._SetHeadStyle(cmdKey);
			this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
			this._InitWallReportTabPage();
		}
		else if(cmdKey == "idlableDebug"){
			this._SetHeadStyle(cmdKey);
			this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
			this._InitDebugTabPage();
		}
		else if(cmdKey == "idlableSetting"){
			this._SetHeadStyle(cmdKey);
			this._MainFrame.style.background = G_MonitorConst.UI.Color.defaultGroupColor;
			this._InitSettingTabPage();
		}
	}
	this.SetCtrlStatus = function(conStatus){
		var oStatus = $$("idlableStatus");
		if(oStatus == null) return;
        var oConStatus = (this.language==lg_zhcn)?G_MonitorConst.UI.ConStatus:G_MonitorConst.UI.eng_ConStatus;
		if(conStatus>=0 && conStatus < oConStatus.length){
			oStatus.innerHTML = oConStatus[conStatus];
			this._header.constatus = conStatus;
			var oImageStatus = $$("idimageStatus");
			if(conStatus == 0)
				oImageStatus.src = this._relationPath +"scripts/ui/images/unlogin.png";
			else
				oImageStatus.src = this._relationPath +"scripts/ui/images/login.png";
		}
	}

	//2、agentPage
	this._InitAgentTabPage = function(){
		var sText = "";
		sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='1' bordercolor='"+G_MonitorConst.UI.Color.bordColor+"' >";
        if(this.language == lg_zhcn){
            sText = sText + "<tr height='40' ><td align='left'><div id='divSelectGroup' style='padding:2px 0;top:0px;'></div></td><td align='middle' width='120px'><div style='padding:2px 0;'><label  style='cursor: pointer;text-decoration:underline' onclick='G_oMonitorCtrl.OnAgentStartMonitor()'>开始监控</label> </div></td></tr>";
            sText = sText + "<tr height='30' ><td align='left'>"+this._getConditionHtml()+"</td><td><label id ='idDisplayChart' onclick='G_oMonitorCtrl.onAgentDisplayClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>图形显示</label> | <label id ='idDisplayTable' onclick='G_oMonitorCtrl.onAgentDisplayClick(1,false);' style='cursor: pointer;text-decoration:underline'>表格显示</label></td></tr>";
        }
        else{
            sText = sText + "<tr height='40' ><td align='left'><div id='divSelectGroup' style='padding:2px 0;top:0px;'></div></td><td align='middle' width='120px'><div style='padding:2px 0;'><label  style='cursor: pointer;text-decoration:underline' onclick='G_oMonitorCtrl.OnAgentStartMonitor()'>Start</label> </div></td></tr>";
            sText = sText + "<tr height='30' ><td align='left'>"+this._getConditionHtml()+"</td><td><label id ='idDisplayChart' onclick='G_oMonitorCtrl.onAgentDisplayClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>Chart</label> | <label id ='idDisplayTable' onclick='G_oMonitorCtrl.onAgentDisplayClick(1,false);' style='cursor: pointer;text-decoration:underline'>Sheet</label></td></tr>";
        }
		sText = sText + "<tr ><td colspan='2' id='TdAgentDisplay'><div id='idAgentDisplay' style='width:100%;height:100%;position:relative;overflow-y:auto;top:0px;'></div></td></tr>";
		sText = sText + "</TABLE>";
		this._MainFrame.innerHTML = sText;

		this.onAgentDisplayClick(0,true);
	}
	this._getConditionHtml = function() {
        var sText = "";
        if(this.language == lg_zhcn){
            sText += "座席工号：<input type='text' id='idSearchAgent' size='8' value='' />&nbsp;";
            sText += "<input type='button' onclick='G_oMonitorCtrl.OnSerchAgent();' value='查找' title='查找座席' />";
            sText += "&nbsp;&nbsp;&nbsp; 超时报警：<SELECT ID='idAgentType' NAME='idAgentType'> <OPTION VALUE='1' SELECTED>忙碌<OPTION VALUE='2'>空闲 <OPTION VALUE='0' >签出</SELECT>";
            sText += "&nbsp;大于&nbsp;<input type='text' id='idtxtWarn' size='4' value='' />&nbsp;秒&nbsp; <input type='button' id='idBtnWarn' onclick='G_oMonitorCtrl.OnWarn();' value='告警'/>";
        }
        else{
            sText += "Agent Id：<input type='text' id='idSearchAgent' size='8' value='' />&nbsp;";
            sText += "<input type='button' onclick='G_oMonitorCtrl.OnSerchAgent();' value='Find' title='Fand Agent' />";
            sText += "&nbsp;&nbsp;&nbsp; Overtime alarm：<SELECT ID='idAgentType' NAME='idAgentType'> <OPTION VALUE='1' SELECTED>notReady<OPTION VALUE='2'>Ready<OPTION VALUE='0' >SignOut</SELECT>";
            sText += "&nbsp;Greater&nbsp;<input type='text' id='idtxtWarn' size='4' value='' />&nbsp;Second&nbsp; <input type='button' id='idBtnWarn' onclick='G_oMonitorCtrl.OnWarn();' value='Alarm'/>";
        }
        return sText;
    }
    this.OnSerchAgent = function(){
        var destAgentId = $$("idSearchAgent").value;
        if(this._AgentPage.agentSubPage.displayType == 0){
            this._AgentPage.agentSubPage.agentChartCtrl.SearchAgent(destAgentId);
        }
        else{

        }
    }
    this.OnWarn = function(){
        var oBtn = $$("idBtnWarn");
        if(oBtn.value == "停止")
        {
            if(this._AgentPage.agentSubPage.displayType == 0){
                this._AgentPage.agentSubPage.agentChartCtrl.WarnAgents(-1,-1);
                oBtn.value = "告警";
                return;
            }
       }
        var vTimer = $$("idtxtWarn").value;
        if(trimStr(vTimer) == "") return;
        var oAgentType = $$("idAgentType");
        var state = parseInt(oAgentType.options[oAgentType.options.selectedIndex].value);
        if(this._AgentPage.agentSubPage.displayType == 0){
            this._AgentPage.agentSubPage.agentChartCtrl.WarnAgents(state,stringToInt(vTimer,0));
            oBtn.value = "停止";
        }
    }
	this.OnAgentStartMonitor = function(){
		if(this.oMonitorData == null) return;
		var arrStop = this._AgentPage.groupSubPage.selGroups.concat();
		var oGroups = this.oMonitorData._listGroup;
		arrayEmpty(this._AgentPage.groupSubPage.selGroups);
		this._AgentPage.agentSubPage.agentChartCtrl.Clear();
		for(var i=0;i<oGroups.length;i++){
			var oGroup = oGroups[i];
			if(oGroup._ampGroupType != CM_AmpAgent)
				continue;
			var oSelCheck =  $$(oGroup._monitorid);
			if(oSelCheck == null)
				continue;
			if(oSelCheck.checked == true)
			{
				var arrStopIndex = getArrayIndex(arrStop);
				if( arrStopIndex != -1){//重新选择
					this._AgentPage.groupSubPage.selGroups.push(arrStop[arrStopIndex]);
					var oGroup = this.oMonitorData.GetGroupByid(arrStop[arrStopIndex]);
					this._AgentPage.agentSubPage.agentChartCtrl.AddGroupItem(oGroup);
                    this.OnSetReportBtnStatus(this.oJVccBar.GetBtnStatus(""),this.oJVccBar.GetAgentStatus());
					arrStop.splice(arrStopIndex,1);
					continue;
				}
				this._AgentPage.groupSubPage.selGroups.push(oGroup._monitorid);
				this.oMonitorData.loadAgentGroupData(oGroup._monitorid);
			}
		}
		for(var j=0;j<arrStop.length;j++)
			this.oMonitorData.EndNotificationGroup(arrStop[j]);
	}
	this.onAgentDisplayClick = function(type,bInit){
		if(this._AgentPage.agentSubPage.displayType == type && bInit == false)
			return;
		if(this._AgentPage.agentSubPage.agentChartCtrl != null ) {
			this._AgentPage.agentSubPage.agentChartCtrl.Clear();
			this._AgentPage.agentSubPage.agentChartCtrl = null;
		}
		var oBtnChart = $$("idDisplayChart");
		var oBtnTable = $$("idDisplayTable");
		var oDivDisplay = $$("idAgentDisplay");
		oDivDisplay.style.height = ($$("TdAgentDisplay").offsetHeight-8)+"px";
		oDivDisplay.style.width = ($$("TdAgentDisplay").offsetWidth-8)+"px";
		if(type == 0){
			oBtnChart.style.color="red";
			oBtnTable.style.color="black";
			this._AgentPage.agentSubPage.agentChartCtrl = new JcmAgentMonitorCtrl($$("idAgentDisplay"),this.language);
		}
		else{
			oBtnChart.style.color="black";
			oBtnTable.style.color="red";
			this._AgentPage.agentSubPage.agentChartCtrl = new JcmAgentMonitorDataGridCtrl($$("idAgentDisplay"),this.language);
		}
		if(this.oMonitorData == null)  return ;
        var oDivSelectGroup = $$("divSelectGroup");
        if (oDivSelectGroup == null) return;
        var strHtml = "";
        for (var i = 0; i < this.oMonitorData._listGroup.length; i++) {
            var oGroup = this.oMonitorData._listGroup[i];
            if (oGroup._ampGroupType != CM_AmpAgent)
                 continue;
             var shtml = stringFormat("<label><input id='{0}' type='checkbox' />{1} </label>", oGroup._monitorid,oGroup._name);
             strHtml = strHtml + shtml;
        }
        oDivSelectGroup.innerHTML = strHtml;

		for(var i=0;i<this.oMonitorData._listGroup.length;i++){
			var oGroup = this.oMonitorData._listGroup[i];
			if(oGroup._ampGroupType != CM_AmpAgent)
				continue;
			var oSelCheck = $$(oGroup._monitorid);
			if(oSelCheck == null)
				continue;
			if(getArrayIndex(this._AgentPage.groupSubPage.selGroups,oGroup._monitorid) >=0){
				oSelCheck.checked = true;
				this._AgentPage.agentSubPage.agentChartCtrl.AddGroupItem(oGroup);
                this.OnSetReportBtnStatus(this.oJVccBar.GetBtnStatus(""),this.oJVccBar.GetAgentStatus());
			}
		}
		this._AgentPage.agentSubPage.displayType = type;
	}
	this._ExecuteCmd = function(cmdType,param,mType) {
		if(this.oJVccBar == null) {
			alert("电话条对象为空,不能执行质检命令!");
			return;
		}
		if(cmdType == "listen") {
			this.oJVccBar.Listen(param,mType);
		}
		else if(cmdType == "help"){
			this.oJVccBar.Help(param,mType);
		}
		else if(cmdType == "insert"){
			this.oJVccBar.Insert(param,mType);
		}
		else if(cmdType == "intercept"){
			this.oJVccBar.Intercept(param,mType);
		}
		else if(cmdType == "forcerelease"){
			this.oJVccBar.ForeReleaseCall(param,mType);
		}
		else if(cmdType == "disconnect"){
			this.oJVccBar.Disconnect();
		}
		else if (cmdType == "forceidle") {
			this.oJVccBar.ForceIdle(param);
		}
		else if (cmdType == "forcebusy") {
			this.oJVccBar.ForceBusy(param);
		}
		else if (cmdType == "forceout") {
			this.oJVccBar.ForceOut(param);
		}

	}

	//3、taskPage
	this._InitTaskTabPage = function(){
        var sText = "";
        sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
        sText = sText + "<tr height='200' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "'><td valign='top'><div id='idTaskTable' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
        sText = sText + "<tr ><td colspan='2' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdTaskDisplay' ><div id='idTaskDisplay' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
        sText = sText + "</TABLE>";
        this._MainFrame.innerHTML = sText;
        var oDivDisplay = $$("idTaskDisplay");
        oDivDisplay.style.height = ($$("TdTaskDisplay").offsetHeight-8)+"px";
        oDivDisplay.style.width = ($$("TdTaskDisplay").offsetWidth-8)+"px";

        this._taskPage.taskTablePage = new JcmTaskDataGridCtrl($$('idTaskTable'),
            "idTaskTable",
            G_MonitorConst.GetDislayArrayItem(G_MonitorConst.Task4Table,"name"),
            (this.language == lg_zhcn)?G_MonitorConst.GetDislayArrayItem(G_MonitorConst.Task4Table,"alias"):G_MonitorConst.GetDislayArrayItem(G_MonitorConst.Task4Table,"eng_alias"),
            this._taskPage.selectMonitorid,this._taskPage.selectTaskid);

        this._taskPage.taskDetailPage = new JcmTaskDataDetailGridCtrl($$("idTaskDisplay"),"idTaskDisplay",
            G_MonitorConst.GetDislayArrayItem(G_MonitorConst.Task4DetailTable,"name"),
            (this.language == lg_zhcn)?G_MonitorConst.GetDislayArrayItem(G_MonitorConst.Task4DetailTable,"alias"):G_MonitorConst.GetDislayArrayItem(G_MonitorConst.Task4DetailTable,"eng_alias"),
            this.language);
        this._taskPage.taskDetailPage.Refresh();

        if(this.oMonitorData == null)  return ;
        this.oMonitorData.loadTaskGroupData();
	}
	this.onSelectTask = function(monitorId,taskId){
        var oTask = this.oMonitorData.GetTaskByid(monitorId,taskId);
        if(oTask == null) return;
        this._taskPage.selectMonitorid = monitorId;
        this._taskPage.selectTaskid = taskId;
        this._taskPage.taskDetailPage.DisplaySingleTaskInfo(oTask);
    }

	//4、servicePage
	this._InitServiceTabPage = function(){
		var sText = "";
		sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
		sText = sText + "<tr height='250' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "'><td valign='top'><div id='idServiceTable' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
        if(this.language == lg_zhcn)
		    sText = sText + "<tr height='30'><td align='left'><label id ='idServiceIMS' onclick='G_oMonitorCtrl.onServiceDisplayClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>即时信息</label> | <label id ='idServiceQueue' onclick='G_oMonitorCtrl.onServiceDisplayClick(1,false);' style='cursor: pointer;text-decoration:underline'>排队信息</label></td></tr>";
        else
            sText = sText + "<tr height='30'><td align='left'><label id ='idServiceIMS' onclick='G_oMonitorCtrl.onServiceDisplayClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>Instant</label> | <label id ='idServiceQueue' onclick='G_oMonitorCtrl.onServiceDisplayClick(1,false);' style='cursor: pointer;text-decoration:underline'>Queue</label></td></tr>";

		sText = sText + "<tr ><td colspan='2' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdServiceDisplay' ><div id='idServiceDisplay' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
		sText = sText + "</TABLE>";
		this._MainFrame.innerHTML = sText;
		this._servicePage.serviceTablePage = new JcmServiceDataGridCtrl($$('idServiceTable'),
                    "idServiceTable",
                     G_MonitorConst.GetDislayArrayItem(G_MonitorConst.ServiceTable,"name"),
                     (this.language == lg_zhcn)?G_MonitorConst.GetDislayArrayItem(G_MonitorConst.ServiceTable,"alias"):G_MonitorConst.GetDislayArrayItem(G_MonitorConst.ServiceTable,"eng_alias"),
					 this._servicePage.serviceSinglePage.selectMonitorid);

		var distype = (this._servicePage.serviceSinglePage.displayType == -1)?0:this._servicePage.serviceSinglePage.displayType;
        this.onServiceDisplayClick(distype,true);
		if(this.oMonitorData == null)  return ;
		this.oMonitorData.loadServiceGroupData();
	}
	this.onServiceDisplayClick = function (type,bForce) {
		if(this._servicePage.serviceSinglePage.displayType == type && bForce == false)
		    return;
        if(this._servicePage.serviceSinglePage.serviceSingleCtrl != null){
            this._servicePage.serviceSinglePage.serviceSingleCtrl.Clear();
            this._servicePage.serviceSinglePage.serviceSingleCtrl = null;
        }
		var oDivDisplay = $$("idServiceDisplay");
		oDivDisplay.style.height = ($$("TdServiceDisplay").offsetHeight-8)+"px";
		oDivDisplay.style.width = ($$("TdServiceDisplay").offsetWidth-8)+"px";

        if(type == 0){
            $$('idServiceIMS').style.color="red";
            $$('idServiceQueue').style.color="black";
            this._servicePage.serviceSinglePage.serviceSingleCtrl = new JcmServiceSingleDataGridCtrl($$('idServiceDisplay'),
                     "idSingleServiceTable",
                      G_MonitorConst.GetDislayArrayItem(G_MonitorConst.SingleServiceTable,"name"),
                      (this.language == lg_zhcn)?G_MonitorConst.GetDislayArrayItem(G_MonitorConst.SingleServiceTable,"alias"):G_MonitorConst.GetDislayArrayItem(G_MonitorConst.SingleServiceTable,"eng_alias"),
                      this.language);
            this._servicePage.serviceSinglePage.serviceSingleCtrl.Refresh();
        }
        else{
            $$('idServiceIMS').style.color="black";
            $$('idServiceQueue').style.color="red";
            this._servicePage.serviceSinglePage.serviceSingleCtrl = new JcmServiceSingleQueueDataGridCtrl($$('idServiceDisplay'),
                    "idSingleServiceQueueTable",
                     G_MonitorConst.GetArrayItem(G_MonitorConst.SingleServiceQueueColineTable,"name"),
                     (this.language == lg_zhcn)?G_MonitorConst.GetArrayItem(G_MonitorConst.SingleServiceQueueColineTable,"alias"):G_MonitorConst.GetArrayItem(G_MonitorConst.SingleServiceQueueColineTable,"eng_alias")
                    );
			//this._servicePage.serviceSinglePage.serviceSingleCtrl.Refresh();
        }
        this._servicePage.serviceSinglePage.displayType = type;
		if(this.oMonitorData != null){
			this._servicePage.serviceSinglePage.serviceSingleCtrl.DisplaySingleServiceInfo(
				this.oMonitorData.GetGroupByid(this._servicePage.serviceSinglePage.selectMonitorid));
		}
	}
	this.onSelectService = function(monitorid){
		if(this.oMonitorData == null)  return ;
		this._servicePage.serviceSinglePage.selectMonitorid = monitorid;
		this._servicePage.serviceSinglePage.serviceSingleCtrl.DisplaySingleServiceInfo(
			            this.oMonitorData.GetGroupByid(monitorid));
	}

	//8.ivrPage
    this._InitIvrTabPage = function(){
        var sText = "";
        sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
        sText = sText + "<tr height='230' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "'><td valign='top'><div id='idIvrTable' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";

        sText = sText + "<tr ><td style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdIvrChart' ><div id='idIvrChart' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
        sText = sText + "</TABLE>";
        this._MainFrame.innerHTML = sText;

        this._ivrPage.ivrTablePage = new JcmIvrDataGridCtrl($$('idIvrTable'),
                                   "idIvrTable",
                                   G_MonitorConst.GetDislayArrayItem(G_MonitorConst.IvrTable,"name"),
                                  (this.language == lg_zhcn)?G_MonitorConst.GetDislayArrayItem(G_MonitorConst.IvrTable,"alias"):G_MonitorConst.GetDislayArrayItem(G_MonitorConst.IvrTable,"eng_alias")
                                  );
        var oDivDisplay = $$("TdIvrChart");
        oDivDisplay.style.height = ($$("TdIvrChart").offsetHeight-8)+"px";
        oDivDisplay.style.width = ($$("TdIvrChart").offsetWidth-8)+"px";

        this._ivrPage.ivrChartPage = new JcmIvrChartCtrl($$('idIvrChart'),
                                  "idIvrChart",
                                  this.language
                                  );
        if(this.oMonitorData == null)  return ;
        this.oMonitorData.loadIvrGroupData();

    }

    //9.trunkPage
    this._InitTrunkTabPage = function(){
        var sText = "";
        sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
        sText = sText + "<tr height='230' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "'><td valign='top'><div id='idTrunkTable' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";

        sText = sText + "<tr ><td style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdTrunkChart' ><div id='idTrunkChart' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
        sText = sText + "</TABLE>";
        this._MainFrame.innerHTML = sText;

        this._trunkPage.trunkTablePage = new JcmTrunkDataGridCtrl($$('idTrunkTable'),
            "idTrunkTable",
            G_MonitorConst.GetDislayArrayItem(G_MonitorConst.TrunkTable,"name"),
            (this.language == lg_zhcn)?G_MonitorConst.GetDislayArrayItem(G_MonitorConst.TrunkTable,"alias"):G_MonitorConst.GetDislayArrayItem(G_MonitorConst.TrunkTable,"eng_alias")
        );
        var oDivDisplay = $$("TdTrunkChart");
        oDivDisplay.style.height = ($$("TdTrunkChart").offsetHeight-8)+"px";
        oDivDisplay.style.width = ($$("TdTrunkChart").offsetWidth-8)+"px";

        this._trunkPage.trunkChartPage = new JcmTrunkChartCtrl($$('idTrunkChart'),
            "idTrunkChart",
            this.language
        );
        if(this.oMonitorData == null)  return ;
        this.oMonitorData.loadTrunkGroupData();

    }

	//5、wallreportPage
	this._InitWallReportTabPage = function(){
		var sText = "";
		sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
		sText = sText + "<tr height='30'><td align='middle'><label id ='idWallCallIn' onclick='G_oMonitorCtrl.onWallReportDisplayClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>企业呼入汇总</label> | <label id ='idWallReportAgent' onclick='G_oMonitorCtrl.onWallReportDisplayClick(1,false);' style='cursor: pointer;text-decoration:underline'>座席状态统计</label> | <label id ='idHumanServiceReport' onclick='G_oMonitorCtrl.onWallReportDisplayClick(2,false);' style='cursor: pointer;text-decoration:underline'>人工服务报告</label></td></tr>";
		sText = sText + "<tr ><td colspan='2' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdWallReportDisplay' ><div id='idWallReportDisplay' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
		sText = sText + "</TABLE>";
		this._MainFrame.innerHTML = sText;
    	var distype = (this._wallReportPage.displayType == -1)?0:this._wallReportPage.displayType;
		this.onWallReportDisplayClick(distype,true);
		if(this.oMonitorData == null)  return ;
		this.oMonitorData.loadServiceGroupData();
	}
	this.onWallReportDisplayClick = function(type,bInit){
		if(this._wallReportPage.displayType == type && bInit == false)
			return;
		if(this._wallReportPage.wallPortTablePage != null){
			this._wallReportPage.wallPortTablePage.Clear();
			this._wallReportPage.wallPortTablePage = null;
		}
		var oDivDisplay = $$("idWallReportDisplay");
		oDivDisplay.style.height = ($$("TdWallReportDisplay").offsetHeight-8)+"px";
		oDivDisplay.style.width = ($$("TdWallReportDisplay").offsetWidth-8)+"px";
        $$('idWallCallIn').style.color="black";
        $$('idWallReportAgent').style.color="black";
        $$('idHumanServiceReport').style.color="black";
		if(type == 0){
            $$('idWallCallIn').style.color="red";
			this._wallReportPage.wallPortTablePage = new JcmWallBroadDataGridCtrl($$('idWallReportDisplay'),
				"idWallReportTable",
                G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportCallInReportTable,"name"),
                G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportCallInReportTable,"alias"));
		}
		else if(type == 1){
            $$('idWallReportAgent').style.color="red";
			this._wallReportPage.wallPortTablePage = new JcmWallBroadDataGridCtrl($$('idWallReportDisplay'),
				"idWallReportTable",
                G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportAgentReportTable,"name"),
                G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportAgentReportTable,"alias"));
		}
		else if(type == 2){
            $$('idHumanServiceReport').style.color="red";
			this._wallReportPage.wallPortTablePage = new JcmWallBroadDataGridCtrl($$('idWallReportDisplay'),
				"idWallReportTable",
                G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportHumanServiceReportTable,"name"),
                G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportHumanServiceReportTable,"alias"));
		}
		this._wallReportPage.displayType = type;
        if(this._GetWallReportData())
            this._oTimer.SetTimer(200,5000,this._OnMonitorTimerEvent,this);
	}
	this._GetWallReportData = function(){
	    var type = this._wallReportPage.displayType;
	    if(type<0 || type>2)
	        return false;
        if(G_MonitorConst.vccid == "" ||G_MonitorConst.WallBroadIP == ""|| G_MonitorConst.WallBroadPort == 0)
            return false;
	    var strTable = G_MonitorConst.WallReportTableName.names[type];
        var arrFields;
        if(type == 0)
            arrFields = G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportCallInReportTable,"name")
        else if(type == 1)
            arrFields = G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportAgentReportTable,"name")
        else if(type == 2)
            arrFields = G_MonitorConst.GetDislayArrayItem(G_MonitorConst.WallReportHumanServiceReportTable,"name")
        var url = stringFormat("http://{0}:{1}/wallReport.shp?f1={2}&t1={3}&c1={4}",
                    G_MonitorConst.WallBroadIP,G_MonitorConst.WallBroadPort,arrFields.join("|"),strTable,G_MonitorConst.vccid);
        G_MonitorConst.HttpAjaxSubmit(url,this.OnWallBroadData);
        return true;
    }
    this.OnWallBroadData = function(str){
        var str1= getSubString(str,"<body>","</body>");
        str = trimStr(str1);
        if(str == "-39"|| str == "-32") {
            //-39:大屏同步数据表不存在 -32:数据不存在!
            return ;
        }
        G_oMonitorCtrl._wallReportPage.wallPortTablePage.DisplayWallBroadData(str,
                   G_MonitorConst.WallReportTableName.keys[G_oMonitorCtrl._wallReportPage.displayType]);
    }

    //6、debugPage
	this._InitDebugTabPage = function(){
		var sText = "";
		sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
        if(this.language == lg_zhcn)
		    sText = sText + "<tr height='30'><td align='right'><label id ='idWallCallIn' onclick='G_oMonitorCtrl.onEmptyLogClick();' style='color:red;cursor: pointer;text-decoration:underline'>清空日志</label></td></tr>";
        else
            sText = sText + "<tr height='30'><td align='right'><label id ='idWallCallIn' onclick='G_oMonitorCtrl.onEmptyLogClick();' style='color:red;cursor: pointer;text-decoration:underline'>Empty</label></td></tr>";

		sText = sText + "<tr ><td colspan='2' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdDebugDisplay' ><TEXTAREA id='idtaDebugInfo' style='overflow:auto;font-family:verdana;font-size:12px'></TEXTAREA></td></tr>";
		sText = sText + "</TABLE>";
		this._MainFrame.innerHTML = sText;
		var oTADebug = $$("idtaDebugInfo");
		oTADebug.style.height = ($$("TdDebugDisplay").offsetHeight-8)+"px";
		oTADebug.style.width = ($$("TdDebugDisplay").offsetWidth-8)+"px";

		for(var i=0;i<this._arrLog.length;i++){
			this._displayLog(this._arrLog[i]+"\r\n");
		}
	}
	this.AddLog = function (sText) {
		if(G_MonitorConst.mainSetting.logFlag.value == 1 && this._IslabelUse("idlableDebug")) {
			this._arrLog.push(sText);
			this._displayLog(sText+"\r\n");
		}
	}
	this._displayLog = function(sText){
		var oTextareaInfo=$$("idtaDebugInfo");
		if(oTextareaInfo != null)
			oTextareaInfo.value = oTextareaInfo.value + sText;
	}
	this.onEmptyLogClick = function() {
		var oTADebug = $$("idtaDebugInfo");
		if(oTADebug != null)
			oTADebug.value = "";
		arrayEmpty(this._arrLog);
	}

	//7、settingPage
	this._InitSettingTabPage = function() {
		var sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='100%' height='100%' border='0'>";
        if(this.language == lg_zhcn){
            sText += "<tr height='30'><td align='left'>当前版本号："+G_MonitorConst.Version+" 更新日期:"+G_MonitorConst.UpdateDay+"</td><td align='middle'><label onclick='G_oMonitorCtrl.OnSaveSetting();' style='color:black;cursor: pointer;text-decoration:underline'>保存设置</label></td><td align='right'>";
            sText += "<label id ='idMainSetting0' onclick='G_oMonitorCtrl.onSubSettingClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>总体设置</label>";
            if(this._IslabelUse("idlableTask") && false)
                sText += "| <label id ='idMainSetting1' onclick='G_oMonitorCtrl.onSubSettingClick(1,false);' style='color:black;cursor: pointer;text-decoration:underline'>外呼任务显示项</label>";
            if(this._IslabelUse("idlableService"))
                sText += "| <label id ='idMainSetting2' onclick='G_oMonitorCtrl.onSubSettingClick(2,false);' style='color:black;cursor: pointer;text-decoration:underline'>人工服务显示项</label>";
            if(this._IslabelUse("idlableSetting")){
                sText += "| <label id ='idMainSetting3' onclick='G_oMonitorCtrl.onSubSettingClick(3,false);' style='color:black;cursor: pointer;text-decoration:underline'>大屏-企业呼入汇总显示项</label>";
                sText += "| <label id ='idMainSetting4' onclick='G_oMonitorCtrl.onSubSettingClick(4,false);' style='color:black;cursor: pointer;text-decoration:underline'>大屏-座席统计显示项</label>";
                sText += "| <label id ='idMainSetting5' onclick='G_oMonitorCtrl.onSubSettingClick(5,false);' style='color:black;cursor: pointer;text-decoration:underline'>大屏-人工服务显示项</label>";
            }
        }
        else{
            sText += "<tr height='30'><td align='left'>Version："+G_MonitorConst.Version+" Update date:"+G_MonitorConst.UpdateDay+"</td><td align='middle'><label onclick='G_oMonitorCtrl.OnSaveSetting();' style='color:black;cursor: pointer;text-decoration:underline'>Save</label></td><td align='right'>";
            sText += "<label id ='idMainSetting0' onclick='G_oMonitorCtrl.onSubSettingClick(0,false);' style='color:red;cursor: pointer;text-decoration:underline'>General</label>";
            if(this._IslabelUse("idlableTask") && false)
                sText += "| <label id ='idMainSetting1' onclick='G_oMonitorCtrl.onSubSettingClick(1,false);' style='color:black;cursor: pointer;text-decoration:underline'>Task-Display-Items</label>";
            if(this._IslabelUse("idlableService"))
                sText += "| <label id ='idMainSetting2' onclick='G_oMonitorCtrl.onSubSettingClick(2,false);' style='color:black;cursor: pointer;text-decoration:underline'>Service-Display-Items</label>";
            if(this._IslabelUse("idlableSetting")){
                sText += "| <label id ='idMainSetting3' onclick='G_oMonitorCtrl.onSubSettingClick(3,false);' style='color:black;cursor: pointer;text-decoration:underline'>WallBroad-Depart</label>";
                sText += "| <label id ='idMainSetting4' onclick='G_oMonitorCtrl.onSubSettingClick(4,false);' style='color:black;cursor: pointer;text-decoration:underline'>WallBroad-AgentStatics</label>";
                sText += "| <label id ='idMainSetting5' onclick='G_oMonitorCtrl.onSubSettingClick(5,false);' style='color:black;cursor: pointer;text-decoration:underline'>WallBroad-Service</label>";
            }
        }
		sText += "</td></tr>";
		sText +=  "<tr ><td colspan='3' style='background:"+G_MonitorConst.UI.Color.defaultGroupColor + "' id='TdSettingDisplay' ><div id='idSettingDisplay' style='width:100%;height:100%;position:relative;overflow-y:auto'></div></td></tr>";
		sText += "</TABLE>";
		this._MainFrame.innerHTML = sText;
		this.onSubSettingClick(0,true);

	}
	this.OnSaveSetting = function(){
		var oSettingItem;
		switch(this._settingPage.displayType){
			case 0:
				{
					G_MonitorConst.mainSetting.logFlag.value = $$(G_MonitorConst.mainSetting.logFlag.id).checked ?1:0;
					G_MonitorConst.mainSetting.tabGroupDataClose.value = $$(G_MonitorConst.mainSetting.tabGroupDataClose.id).checked ?1:0;
					G_MonitorConst.mainSetting.agentMenuCmd.value = $$(G_MonitorConst.mainSetting.agentMenuCmd.id).checked ?1:0;
					G_MonitorConst.mainSetting.agentStatics.value = $$(G_MonitorConst.mainSetting.agentStatics.id).checked ?1:0;
					G_MonitorConst.SaveConfig(this._settingPage.displayType);
					alert("保存成功!");
					return ;
				}
			case 1:
				{
					oSettingItem = G_MonitorConst.Task4Table;
					break;
				}
			case 2:
				{
					oSettingItem = G_MonitorConst.ServiceTable;
					break;
				}
			case 3:
				{
					oSettingItem = G_MonitorConst.WallReportCallInReportTable;
					break;
				}
			case 4:
				{
					oSettingItem = G_MonitorConst.WallReportAgentReportTable;
					break;
				}
			case 5:
				{
					oSettingItem = G_MonitorConst.WallReportHumanServiceReportTable;
					break;
				}
			default:
				return;
		}
		for(var i=0;i<oSettingItem.length;i++){
			var oItem = oSettingItem[i];
			var id = stringFormat("cb_idSubSetting_{0}",oItem["name"]);
			var oCheck = $$(id);
			if(oCheck != null){
				if(oCheck.checked)
					oItem["showFlag"] = 1;
				else
					oItem["showFlag"] = 0;
			}
		}
		G_MonitorConst.SaveConfig(this._settingPage.displayType);
		alert("保存成功!");
	}
	this.onSubSettingClick = function (type,bInit) {
		if(this._settingPage.displayType == type && bInit == false)
			return ;
		var oBtn = $$(stringFormat("idMainSetting{0}",this._settingPage.displayType));
		if(oBtn != null)
			oBtn.style.color="black";

		var oDivSettingDisplay = $$("idSettingDisplay");
		if(oDivSettingDisplay == null) return ;
		oDivSettingDisplay.style.height = ($$("TdSettingDisplay").offsetHeight-8)+"px";
		oDivSettingDisplay.style.width = ($$("TdSettingDisplay").offsetWidth-8)+"px";

		this._settingPage.displayType = type;
		$$(stringFormat("idMainSetting{0}",this._settingPage.displayType)).style.color="red";

		if(this._settingPage.settingTablePage != null){
			this._settingPage.settingTablePage.Clear();
			this._settingPage.settingTablePage = null;
		}

		if(type == 0){
			var sText = "<TABLE style='BORDER-COLLAPSE: collapse;top:0px;' cellSpacing='0' cellPadding='2' width='96%' height='100%' border='0'>";
            if(this.language == lg_zhcn){
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.logFlag.id,G_MonitorConst.mainSetting.logFlag.des);
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.tabGroupDataClose.id,G_MonitorConst.mainSetting.tabGroupDataClose.des);
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.agentMenuCmd.id,G_MonitorConst.mainSetting.agentMenuCmd.des);
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.agentStatics.id,G_MonitorConst.mainSetting.agentStatics.des);
            }
            else{
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.logFlag.id,G_MonitorConst.mainSetting.logFlag.eng_des);
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.tabGroupDataClose.id,G_MonitorConst.mainSetting.tabGroupDataClose.eng_des);
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.agentMenuCmd.id,G_MonitorConst.mainSetting.agentMenuCmd.eng_des);
                sText += stringFormat("<tr height='30'><td align='left'><label><input id='{0}' type='checkbox' />{1} </label></td></tr>",
                    G_MonitorConst.mainSetting.agentStatics.id,G_MonitorConst.mainSetting.agentStatics.eng_des);
            }

			sText += "<tr ><td align='left'></td></tr>";
			sText += "</TABLE>";
			oDivSettingDisplay.innerHTML = sText;

			$$(G_MonitorConst.mainSetting.logFlag.id).checked = (G_MonitorConst.mainSetting.logFlag.value == 1)?true:false;
			$$(G_MonitorConst.mainSetting.tabGroupDataClose.id).checked = (G_MonitorConst.mainSetting.tabGroupDataClose.value == 1)?true:false;
			$$(G_MonitorConst.mainSetting.agentMenuCmd.id).checked = (G_MonitorConst.mainSetting.agentMenuCmd.value == 1)?true:false;
			$$(G_MonitorConst.mainSetting.agentStatics.id).checked = (G_MonitorConst.mainSetting.agentStatics.value == 1)?true:false;
		}
		else if(type == 1){
			this._settingPage.settingTablePage = new JcmSettingDataGridCtrl(oDivSettingDisplay,"idSubSetting",G_MonitorConst.Task4Table,"taskID",this.language);
		}
		else if(type == 2){
			this._settingPage.settingTablePage = new JcmSettingDataGridCtrl(oDivSettingDisplay,"idSubSetting",G_MonitorConst.ServiceTable,"shortServiceId",this.language);
		}
		else if(type == 3){
			this._settingPage.settingTablePage = new JcmSettingDataGridCtrl(oDivSettingDisplay,"idSubSetting",G_MonitorConst.WallReportCallInReportTable,G_MonitorConst.WallReportTableName.keys[0],this.language);
		}
		else if(type == 4){
			this._settingPage.settingTablePage = new JcmSettingDataGridCtrl(oDivSettingDisplay,"idSubSetting",G_MonitorConst.WallReportAgentReportTable,G_MonitorConst.WallReportTableName.keys[1],this.language);
		}
		else if(type == 5){
			this._settingPage.settingTablePage = new JcmSettingDataGridCtrl(oDivSettingDisplay,"idSubSetting",G_MonitorConst.WallReportHumanServiceReportTable,G_MonitorConst.WallReportTableName.keys[2],this.language);
		}
	}

	//8、inline event/function
    this.OnSetReportBtnStatus = function(btnIds,agentStatus) {
        if(G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl != null)
        {
            G_MonitorConst.Log(stringFormat("SetReportBtnStatus({0},{1})",btnIds,agentStatus));
            G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl.SetEableBtns(btnIds,agentStatus);
        }
    }
    this.OnSetAgentWorkReport = function(agentID,agentStatus,workStatus) {
        if(G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl != null)
            G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl.SetAgentStatus(agentID,agentStatus,workStatus);
    }

    this.OnInitialState = function(oGroups){
        if(G_oMonitorCtrl._AgentPage.groupSubPage != null)
            arrayEmpty(G_oMonitorCtrl._AgentPage.groupSubPage.selGroups);
        var oDivSelectGroup = $$("divSelectGroup");
        if(oDivSelectGroup != null)
            oDivSelectGroup.innerHTML = "";
        G_oMonitorCtrl.onHeadClick(G_oMonitorCtrl._header.lastSelTable,true);
    }
    this.OnAgentGroupQuery = function(oGroup){
        if(G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl != null){
            G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl.AddGroupItem(oGroup);
            G_oMonitorCtrl.OnSetReportBtnStatus(G_oMonitorCtrl.oJVccBar.GetBtnStatus(""),G_oMonitorCtrl.oJVccBar.GetAgentStatus());
        }
    }
    this.OnAgentReport = function(oAgentItem){
        if(G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl != null)
            G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl.ReSetAgentInfo(oAgentItem);
    }
    this.OnTaskReport = function(oGroup){
        if(G_oMonitorCtrl._taskPage.taskTablePage != null)
            G_oMonitorCtrl._taskPage.taskTablePage.DisplayTaskInfo(oGroup);
    }
    this.OnWallServiceReport = function(oGroup){
        if(G_oMonitorCtrl._servicePage.serviceTablePage != null)
            G_oMonitorCtrl._servicePage.serviceTablePage.AddGroupItem(oGroup);
    }
    this.OnWallQueueReport = function(oGroup){
        if(G_oMonitorCtrl._servicePage.serviceSinglePage.displayType == 1  &&
            G_oMonitorCtrl._servicePage.serviceSinglePage.serviceSingleCtrl != null){
            G_oMonitorCtrl._servicePage.serviceSinglePage.serviceSingleCtrl.DisplaySingleServiceInfo(oGroup);
        }
    }

    this.OnAgentStaticReport = function(oAgentItem){
        if(G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl != null)
            G_oMonitorCtrl._AgentPage.agentSubPage.agentChartCtrl.ReSetAgentInfo(oAgentItem);
    }
    this.OnIvrReport = function (oGroup){
        if(G_oMonitorCtrl._ivrPage.ivrTablePage != null)
            G_oMonitorCtrl._ivrPage.ivrTablePage.AddGroupItem(oGroup);
        if(G_oMonitorCtrl._ivrPage.ivrChartPage != null)
            G_oMonitorCtrl._ivrPage.ivrChartPage.AddGroupItem(oGroup);
    }
    this.OnTrunkReport = function(oGroup){

    }
    this.OnTrunkSumReport = function(oGroup){
        if(G_oMonitorCtrl._trunkPage.trunkTablePage != null)
            G_oMonitorCtrl._trunkPage.trunkTablePage.DisplayTrunkInfo(oGroup);
        if(G_oMonitorCtrl._trunkPage.trunkChartPage != null)
            G_oMonitorCtrl._trunkPage.trunkChartPage.DisplayTrunkInfo(oGroup);
    }
    this.ConStatusChange = function(agentStatus){
        G_oMonitorCtrl.SetCtrlStatus(agentStatus);
        if(agentStatus == 0)
            G_oMonitorCtrl.UnInitial();
    }

	this._OnMonitorTimerEvent = function(id,oThis){
	    switch (id){
            case 100:
            {
                if(oThis != null) {
                    oThis._oTimer.KillTimer(100,oThis);
                    oThis.OnMonitorControlLoad();
                }
                break
            }
            case 200:
            {
                //oThis._oTimer.KillTimer(id);
                oThis._GetWallReportData();
                break;
            }
        }
	}
    this.GetMonitorAgentStatus = function(){
        if(this.oJVccBar == null)
            return -1;
        return this.oJVccBar.GetAgentStatus();
    }
    this.GetMonitorAgentID = function(){
        if(this.oJVccBar == null)
            return "";
        return this.oJVccBar.GetAttribute("AgentID");
    }

    //公用函数函数
    this.SetVccBarCtrl = function(oVccBar){
        this.oJVccBar = oVccBar;
    }
    this.Intial = function(){
        if(this.oJVccBar == null)
            return -1;
        if(!(this.oJVccBar.GetAttribute("AppType") == 1 || this.oJVccBar.GetAttribute("AppType") == 2)){
            return -1;
        }
        if(this.oMonitorData == null){
            this.oMonitorData = new JcmMonitorManager(this.oJVccBar);

            //Agent status Event
            this.oMonitorData.OnSetAgentWorkReport = this.OnSetAgentWorkReport;
            this.oMonitorData.OnSetReportBtnStatus = this.OnSetReportBtnStatus;

            this.oMonitorData.OnInitialState = this.OnInitialState;

            this.oMonitorData.OnAgentGroupQuery = this.OnAgentGroupQuery;
            this.oMonitorData.OnAgentReport = this.OnAgentReport;
            this.oMonitorData.OnAgentStaticReport = this.OnAgentStaticReport;

            this.oMonitorData.OnTaskReport = this.OnTaskReport;

            this.oMonitorData.OnWallServiceReport = this.OnWallServiceReport;
            this.oMonitorData.OnWallQueueReport = this.OnWallQueueReport;

            this.oMonitorData.OnIvrReport = this.OnIvrReport;

            this.oMonitorData.OnTrunkReport = this.OnTrunkReport;
            this.oMonitorData.OnTrunkSumReport = this.OnTrunkSumReport;

            this.oMonitorData.ConStatusChange = this.ConStatusChange;
        }
        if(this.oJVccBar.GetAttribute("MediaFlag") != "")
            G_MonitorConst.vccid = this.oJVccBar.GetAttribute("MediaFlag");
        if(this.oJVccBar.GetMonitorStatus()){
            this.SetCtrlStatus(this.oJVccBar.GetAgentStatus()>0?2:1);
        }
        else{
            this.SetCtrlStatus(0);
            return -2;
        }

        if(g_monitorDebug == 1) return -1;
        this.oMonitorData.Initial();
        return 0;
    }
    this.UnInitial = function(){
        this.oMonitorData.UnInitial();
        arrayEmpty(this._AgentPage.groupSubPage.selGroups);
        arrayEmpty(this._arrLog);
        this.onHeadClick(this._header.lastSelTable,true);
        this.SetCtrlStatus(0);
    }
    this.SetWallBoardServer = function (ip, port) {
        G_MonitorConst.WallBroadIP = ip;
        G_MonitorConst.WallBroadPort = port;
    }
    this.SetFunctionPage = function (pages) {
        arrayEmpty(this._header.headTabNames);
        arrayEmpty(this._header.headTabs);
        this._header.lastSelTable = "";
        var arr = pages.split("|");
        for(var j=0;j<arr.length;j++){
            var nIndex = stringToInt(arr[j],-1);
            if(nIndex>=0 && nIndex<G_MonitorConst.UI.HeadTabs.length)
            {
                this._header.headTabs.push(G_MonitorConst.UI.HeadTabs[nIndex]["id"]);
                if(this.language == lg_zhcn)
                    this._header.headTabNames.push(G_MonitorConst.UI.HeadTabs[nIndex]["name"]);
                else
                    this._header.headTabNames.push(G_MonitorConst.UI.HeadTabs[nIndex]["eng_name"]);
            }
        }
        this._Refreash();
    }
    this.GetVersion = function() {
        return G_MonitorConst.Version;
    }

    //事件
    this.OnMonitorControlLoad = function(){}
	//显示函数
	this.Display = function (flag) {
		if(flag == 1){
			this.Refresh();
		}
		else{
			//this.oMonitorShow.style.left = "0px";
			//this.oMonitorShow.style.top =  "0px";
			//this.oMonitorShow.style.width = "0px";
			//this.oMonitorShow.style.height = "0px";
			this.oMonitorShow.style.display = "none";
		}
	}
	this.Refresh = function () {
		if( this.oMonitorShow != null) {
			//this.oMonitorShow.style.left = this.left;
			//this.oMonitorShow.style.top = this.top;
			//this.oMonitorShow.style.width = this.width;
			//this.oMonitorShow.style.height = this.height;
			this.oMonitorShow.style.display ="block";
		}
		this.Resize(this.left,this.top,this.width,this.height);
	}
	this.Resize = function (nLeft,nTop,nWidth,nHeight) {
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>=0)?nWidth:100;
		this.height	= (nHeight>=0)?nHeight:100;

		this.oMonitorShow.style.left = this.left+"px";
		this.oMonitorShow.style.top = this.top+"px";
		this.oMonitorShow.style.width = this.width+"px";
		this.oMonitorShow.style.height = this.height+"px";
		this._Refreash();
	}

    G_oMonitorCtrl = this;
	this._createObject();

	return this;
}

