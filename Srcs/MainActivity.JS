//設定嚴格模式
'use strict';

const Import = require ('modules-import');

//基模塊
const Ml = new Import (new Array ('fs', 'os', 'ws', 'ini', 'http', 'https', 'path', 'plugins-loader'));

const {LiveTCP} = require ('bilibili-live-ws');

//Linux Window 路徑矯正
const LWPC = FilePath => FilePath ['replace'] (new RegExp ('/', 'img'), Path ['sep'] === '\\'? '\\\\': '/');

const Gm = require (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Srcs/GoHome.JS')));
const Lottery = require (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Srcs/Lottery.JS')));
const Bg = require (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Srcs/BuildingGenerator.JS')));
const SRC = require (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Srcs/StringRandomColor.JS')));

//基對象定義
const ReadConfig = FileName => JSON ['parse'] (new String (Fs ['readFileSync'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/'), `${FileName}.JSON`))));
const ServiceConfig = Ini ['parse'] (new String (Fs ['readFileSync'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/ServiceConfig.INI')))));
const Interactives = JSON ['parse'] (new String (Fs ['readFileSync'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/Interactives.JSON')))));

const GoHome = new Gm;
const Coordinate = new Array;
let AgentStatus = false;
let MonitorLock = false;
let ListenerStatus = true;
let WebSocket = null;
let [MS, ML] = [false, null];

//進一步設置配置信息,如有值? 用有值: 則用默認值
const Configuration = new Object ({
    "Minecraft": {
        "XboxID": ServiceConfig ['Minecraft'] ['XboxID'] || null
    },
    "WebSocket": {
        "Host": ServiceConfig ['WebSocket'] ['Host'] || Os ['networkInterfaces'] () ['wlan0'] [0] ['address'],
        "Port": ServiceConfig ['WebSocket'] ['Port'] || 9329
    },
    "BiliBili": {
        "RoomID": ServiceConfig ['BiliBili'] ['RoomID'] || 9329583,
        "Csrf": ServiceConfig ['BiliBili'] ['Csrf'] || null,
        "User-Agent": ServiceConfig ['BiliBili'] ['User-Agent'] || null,
        "Cookie": ServiceConfig ['BiliBili'] ['Cookie'] || null
    }
});

//向遊戲客戶端發送訂閱事件函數
function Subscribe (Socket, EventArray) {
    EventArray ['forEach'] (Event => Socket ['send'] (JSON ['stringify'] (new Object ({
        "header": {
            "messagePurpose": "subscribe",
            "messageType": "commandRequest",
            "requestId": "b6b6489b-14d5-4869-9da2-ad306932856b",
            "version": 1
        },
        "body": {
            "eventName": Event
        }
    }))))
};

//發送消息至遊戲客戶端聊天欄
function SendMTM (Message) {
    WebSocket ['send'] (JSON ['stringify'] (new Object ({
        "header":{
            "messagePurpose": "commandRequest",
            "messageType": "commandRequest",
            "requestId":"18237b44-a2af-43c6-bd8c-f52b50a84a56",
            "version": 1
        },
        "body": {
            "origin": {
                "type": "player"
            },
            "commandLine": `say §l§o§b(§l§o§3Mcbbsmis§l§o§b) ${Message}`,
            "version": 1
        }
    })))
};

//發送命令至遊戲客戶端
function SendCMD (Command) {
    WebSocket ['send'] (JSON ['stringify'] (new Object ({
        "header":{
            "messagePurpose": "commandRequest",
            "messageType": "commandRequest",
            "requestId":"5b3cf4f4-8b05-440f-9290-0b8350a76b31",
            "version": 1
        },
        "body": {
            "origin": {
                "type": "player"
            },
            "commandLine": new String ('/') ['concat'] (new String (Command) ['replace'] (new RegExp ('^/', 'im'), '')),
            "version": 1
        }
    })))
};

//獲取隨機禮品
function GetLottery (Name) {
    new Lottery (ReadConfig (Name)) ['then'] (Resource => {
        SendMTM (` §l§o§9Lottery §l§o§5恭喜 §l§o§b[§l§o§c${Configuration ['Minecraft'] ['XboxID']}§l§o§b] §l§o§5在 §l§o§6${Resource ['Title']} §l§o§5禮品中獲得 §l§o§6${Resource ['Data'] ['Quantity']} §l§o§5個 §l§o§6${Resource ['Data'] ['Title']}`);
        SendCMD (`Give ${Configuration ['Minecraft'] ['XboxID']} ${Resource ['Data'] ['Id']} ${Resource ['Data'] ['Quantity']}`)
    });
}

//匹配礼物名称
function GiftName (Name) {
	for (let Value = 0; Value < Interactives ['GiftGroup'] ['length']; Value ++)
	if (Interactives ['GiftGroup'] [Value] === Name)
	return true;
	return false;
};

//添加
function Add (UserName, Key) {
    Interactives [Key] ['push'] (UserName);
    Fs ['writeFile'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/Interactives.JSON')), JSON ['stringify'] (Interactives), () => null);
};

//刪除
function Delete (UserName, Key) {
    let Point = Interactives [Key] ['indexOf'] (UserName);
    if (Point > -1)
    Interactives [Key] ['splice'] (Point, 1);
    Fs ['writeFile'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/Interactives.JSON')), JSON ['stringify'] (Interactives), () => null)
};

//判斷用戶是否存在
function JudgeUsersExist (UserName, Rc) {
    if (UserName !== undefined)
    for (let Value = 0; Value < Rc ['length']; Value ++)
    if (UserName ['toUpperCase'] () === Rc [Value] ['toUpperCase'] ())
    return true;
    return false
};

//更新彈幕黑名單
function UpdateBarrageBlacklists (UserName, Mode) {
    switch (Mode) {
        case 'Add':
            Add (UserName,'BarrageBlacklists');
        break;
        
        case 'Delete':
            Delete (UserName, 'BarrageBlacklists');
        break
    }
};

//更新關鍵詞使用者
function UpdateKeywordUsers (UserName, Mode) {
    switch (Mode) {
        case 'Add':
            Add (UserName, 'KeywordUsers');
        break;
            
        case 'Delete':
            Delete (UserName, 'KeywordUsers');
        break
    }
};

//更新投喂礼物随机事件使用者
function UpdateGiftWhitelists (UserName, Mode) {
    switch (Mode) {
        case 'Add':
            Add (UserName, 'GiftWhitelists');
        break;
            
        case 'Delete':
            Delete (UserName, 'GiftWhitelists');
        break
    }
};

//更新禮物配置屬性
function GiftConfigs (Event, Value, Values) {
	switch (Event) {
		case 'GiftStatus':
			Interactives ['GiftStatus'] = Value;
			Fs ['writeFile'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/Interactives.JSON')), JSON ['stringify'] (Interactives), () => null)
			break;
			
		case 'GiftGroup':
			switch (Value) {
				case 'Add':
					if (JudgeUsersExist (Values, Interactives ['GiftGroup']))
					SendMTM ('§l§o§9GiftStatus §l§o§4無法添加 該禮物已經是觸發因素');
					else {
						SendMTM (` §l§o§9GiftStatus §l§o§a已添加 §l§o§b[${Values}] §l§o§a為觸發禮物`);
						Add (Values, 'GiftGroup');
					}
				break;
					
				case 'Delete':
					if (!JudgeUsersExist (Values, Interactives ['GiftGroup']))
					SendMTM ('§l§o§9GiftStatus §l§o§4無法刪除 該禮物已經不是觸發因素');
					else {
						Delete (Values, 'GiftGroup');
						SendMTM (` §l§o§9GiftStatus §l§o§a已刪除 §l§o§b[${Values}] §l§o§a為觸發禮物`)
					}
				break;
			};
			break;
		case 'GiftQuantity':
			Interactives ['GiftQuantity'] = new Number (Value);
			Fs ['writeFile'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Configs/Interactives.JSON')), JSON ['stringify'] (Interactives), () => null)
			break;
	}
};

//驗證返回數據是否為玩家消息
function Verify (Data) {
    if (Data ['body'] ['eventName'] === 'PlayerMessage')
    if (Data ['body'] ['properties'] ['MessageType'] === 'chat')
    if (Data ['body'] ['properties'] ['Sender'] === Configuration ['Minecraft'] ['XboxID'])
    return true;
    return false
};

//判斷用戶是否有的權限
function VerifyUsers (UserName, Value) {
    let Users = Interactives [Value];
    for (let Value = 0; Value < Users ['length']; Value ++)
    if (UserName ['toUpperCase'] () === Users [Value] ['toUpperCase'] ())
    return true;
    return false
};

//將玩家聊天消息發送至直播間函數
function SendToBL (Message, Rcs) {
    //消息進行編碼
    let EncodeMessage = `------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="bubble"

0
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="msg"

${Message}
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="color"

16777215
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="mode"

1
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="fontsize"

25
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="rnd"

${new Date () ['getTime'] ()}
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="roomid"

${Configuration ['BiliBili'] ['RoomID']}
------${Configuration ['BiliBili'] ['Wkfb']}
Content-Disposition: form-data; name="csrf"

${Configuration ['BiliBili'] ['Csrf']}
------${Configuration ['BiliBili'] ['Wkfb']}--
Content-Disposition: form-data; name="csrf_token"

${Configuration ['BiliBili'] ['Csrf']}
------${Configuration ['BiliBili'] ['Wkfb']}--
`;

    //設定請求配置
    let RequestConfiguration = new Object ({
        "protocol": "http:",
        "host": "api.live.bilibili.com",
        "port": 80,
        "path": "/msg/send",
        "method": "POST",
        "headers": {
            "Host": "api.live.bilibili.com",
            "content-length": EncodeMessage? EncodeMessage ['length']: 0,
            "user-agent": Configuration ['BiliBili'] ['User-Agent'],
            "content-type": `multipart/form-data; boundary=----${Configuration ['BiliBili'] ['Wkfb']}`,
            "accept": "*/*",
            "origin": "https://live.bilibili.com",
            "x-requested-with": "mark.via",
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "referer": "https://live.bilibili.com/",
            "accept-encoding": "gzip, deflate",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cookie": Configuration ['BiliBili'] ['Cookie']
        }});
    //開始請求直播間
    let Request = Http ['request'] (RequestConfiguration, Socket => {
    Socket ['on'] ('data', Message => {
        let Status = JSON ['parse'] (Message);
        if (Rcs)
        if (Status ['code'] === 0 && Status ['message'] === '')
        SendMTM ('§l§o§9SendStatus §l§o§a發送成功');
        else if (Status ['code'] === 0 && Status ['message'] === '非法内容')
        SendMTM ('§l§o§9SnedStatus §l§o§4非法內容');
        else if (Status ['code'] === -500)
        SendMTM ('§l§o§9SendStatus §l§o§4內容過長');
        else
        SendMTM (` §l§o§9SendStatus §l§o§4${JSON ['stringify'] (Status)}`);
	Request ['abort'] ();
    })
}
);
    //開始寫入消息
    Request ['write'] (EncodeMessage? EncodeMessage: null);
    //消息寫入完成
    Request ['end'] ()
};

//監聽直播間彈幕消息函數
function Monitor (RoomID) {
    const Live = new LiveTCP (RoomID);
    //觀眾進入監聽
    Live ['on'] ('WELCOME', Message => {
    	if (ListenerStatus === false)
    	return null;
    	
    	SendMTM (` §l§o§9Welcome §l§o§5熱烈歡迎 §l§o§b[§l§o§c${Message ['data'] ['uname']}§l§o§b] §l§o§5進入了直播間`);
    });
    
    //彈幕監聽
    Live ['on'] ('DANMU_MSG', Message => {
        if (ListenerStatus === false)
       	return null;
    	
    	   let User = Message ['info'] [2];
        let ParseMessage = Message ['info'] [1] ['split'] ('Keywords: ');
        if (ParseMessage [0] === '$')
        if (VerifyUsers (User [1], 'KeywordUsers')) {
          for (let Key in Interactives ['Keywords'])
          if (ParseMessage [1] === Key)
            SendCMD (Interactives ['Keywords'] [Key]);
        } else
        SendToBL ('对不起，您沒有使用關鍵詞的權限', false);
        if (!JudgeUsersExist (User [1], Interactives ['BarrageBlacklists']))
        SendMTM (` §l§o§9Barrage §l§o§b[§l§o§c${User [1]}§l§o§b]§l§o§d: §l§o§6${Message ['info'] [1] ['replace'] (new RegExp ('@e', 'img'), '')}`);
    });
    
    //禮物監聽
    Live ['on'] ('SEND_GIFT', Message => {
    	if (ListenerStatus === false)
    	return null;
    	
    	SendMTM (` §l§o§9Gift §l§o§b[§l§o§c${Message ['data'] ['uname']}§l§o§b]§l§o§d: §l§o§6${Message ['data'] ['action']}了 §l§o§b${Message ['data'] ['giftName']} §l§o§6* §l§o§a${Message ['data'] ['num']}`);
   
   
    	if (Interactives ['GiftStatus'] || false)
    	if (VerifyUsers (Message ['data'] ['uname'], 'GiftWhitelists') && GiftName (Message ['data'] ['giftName']) && new Number (Message ['data'] ['num']) >= Interactives ['GiftQuantity']) {
    		let RandomEvent = Interactives ['RandomEvents'] [Math ['floor'] (Math ['random'] () * Interactives ['RandomEvents'] ['length'])];
    	let RandomNumber = Math ['floor'] (Math ['random'] () * 30);
    	SendMTM  (` §l§o§9RandomEvents §l§o§b[§l§o§c${Message ['data'] ['uname']}§l§o§b]§l§o§d: §l§o§6因投喂 [§l§o§b${Message ['data'] ['giftName']} §l§o§6* §l§o§a${Message ['data'] ['num']}§l§o§6] 礼物触发事件为 §l§o§c[${RandomEvent ['Tips'] ['replace'] (new RegExp ('Number:Random', 'img'), RandomNumber) ['replace'] (new RegExp ('Number:Gift', 'img'), Message ['data'] ['num'] < 25? Message ['data'] ['num'] * 10: 255)}]`);
    	SendCMD (RandomEvent ['Command'] ['replace'] ('Player:XboxID', Configuration ['Minecraft'] ['XboxID']) ['replace'] (new RegExp ('Number:Random', 'img'), RandomNumber) ['replace'] (new RegExp ('Number:Gift', 'img'), Message ['data'] ['num'] < 25? Message ['data'] ['num'] * 10: 255));
    	};
    });
    SendMTM ('§l§o§9ConnectStatus §l§o§a連接成功 正在監聽直播間彈幕');
};

console ['info'] (`-

正在檢測 [ Mcbbsmis ]最新版本，請稍等...

-------Mcbbsmis Service-------

-


`);

Https ['get'] ('https://cdn.jsdelivr.net/gh/lZiMUl/Mcbbsmis/Package.JSON', Response => {
	let LocalVersion = JSON ['parse'] (Fs ['readFileSync'] (LWPC (`${Path ['join'] (Path ['resolve'] (), 'Mcbbsmis/Package')}.JSON`))) ['Vn'];
	let Resource = new Array;
	Response ['on'] ('data', Data => Resource ['push'] (Data));
	Response ['on'] ('end', Data => {
		if (JSON ['parse'] (Resource ['join'] ('')) ['Vn'] > LocalVersion)
		console ['info'] (`-

[ Mcbbsmis ] 新版本已發佈，請更新

請進入以下命令 即可更新

[ cd Mcbbsmis && npm run Update ]

-------Mcbbsmis Service-------

-


`); else console ['info'] (`-

[ Mcbbsmis ] 當前已是最新版本

-------Mcbbsmis Service-------

-


`);

//正則匹配 主機 & 端口 是否合法
if (/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g ['test'] (Configuration ['WebSocket'] ['Host']) && new RegExp ('[2-7][0-9][0-9][0-9]$|8000') ['test'] (Configuration ['WebSocket'] ['Port'])) {

	//開啟WebSocket服務器
	new Ws ['Server'] (new Object ({
    "host": Configuration ['WebSocket'] ['Host'],
    "port": Configuration ['WebSocket'] ['Port']
})) ['on'] ('connection', Socket => {
    //設置全局
    WebSocket = Socket;
    if (!MonitorLock) {
    //監聽直播間彈幕消息
    Monitor (Number (Configuration ['BiliBili'] ['RoomID']));
    MonitorLock = true
    } else
    SendMTM ('§l§o§9ConnectStatus §l§o§a連接成功 正在監聽直播間彈幕');
    //向遊戲客戶端發送請求訂閱事件
    Subscribe (Socket, new Array ('PlayerMessage', 'PlayerTransform'));
    const Pls = new Pl ({
    	"ModulesList": Ml,
    	"Core": Socket,
    	"LWPC": LWPC,
    	"SendCMD": SendCMD,
    	"SendMTMS": SendMTM,
    	"Subscribe": Subscribe,
    	"GetLottery": GetLottery,
    	"GiftName": GiftName,
    	"Add": Add,
    	"Delete": Delete,
    	"JudgeUsersExist": JudgeUsersExist,
    	"UpdateBarrageBlacklists": UpdateBarrageBlacklists,
    	"UpdateKeywordUsers": UpdateKeywordUsers,
    	"UpdateGiftWhitelists": UpdateGiftWhitelists,
    	"GiftConfigs": GiftConfigs,
    	"Verify": Verify,
    	"VerifyUsers": VerifyUsers,
    	"SendToBL": SendToBL,
    	"ReadConfig": ReadConfig,
    	"ServiceConfig": ServiceConfig,
    	"Interactives": Interactives,
    	"LiveTcp": LiveTCP,
    	"SRC": SRC
    }, Result => {
    	[MS, ML] = [true, `§d[§a${Result ['join'] ('§f, §a')}§d]`];
    });

    //監聽玩家聊天欄消息數據並返回消息進行語句判斷
    Socket ['on'] ('message', Data => {
        try {
            let ParseData = JSON ['parse'] (new String (Data));
            if (Verify (ParseData)) {
                if (ParseData ['body'] ['properties'] ['Message'] ['length'] === 1)
                return null;
                //解析消息
                let ParseHelp = ParseData ['body'] ['properties'] ['Message'] ['split'] ('Help');
                let ParseMessage = ParseData ['body'] ['properties'] ['Message'] ['split'] ('Send: ');
                let ParseNode = ParseData ['body'] ['properties'] ['Message'] ['split'] ('Node:');
                let ParseConfig = ParseData ['body'] ['properties'] ['Message'] ['split'] ('Configs: ');
                let ParsePlugin = ParseData ['body'] ['properties'] ['Message'] ['split'] ('Plugins: ');
                //判斷命令前綴
                if (ParseHelp [0] === '$')
                SendMTM (` §l§o§9Helper §l§o§a${Fs ['readFileSync'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Help.MD')), 'UTF-8') }`);
                if (ParseMessage [0] === '$')
                //將玩家聊天消息發送至BiliBili直播間
                SendToBL (ParseMessage [1], true)
                if (ParseNode [0] === '$')
                try {
                	let Console = {
                		"Log": Message => {
                			SendMTM (` §l§o§9NodeJS Console Log: §l§o§a${Message}`);
                			return true;
                		}
                	};
                	SendMTM (` §l§o§9NodeJS Logger: §l§o§a${eval (ParseNode [1] || new String ('Not Found Return Value'))}`);
                } catch (Err) {
                	SendMTM (` §l§o§9NodeJS Logger: §l§o§4${Err}`);
                };
                if (ParseConfig [0] === '$') {
                    let ParseConfigM = ParseConfig [1] ['split'] (' ');
                    switch (ParseConfigM [0]) {
                        case 'BarrageBlacklists':
                            switch (ParseConfigM [1]) {
                                case 'Add':
                                    if (JudgeUsersExist (ParseConfigM [2], Interactives ['BarrageBlacklists']))
                                    SendMTM ('§l§o§9ConfigStatus §l§o§4當前該用戶已經在彈幕黑名單列表裡');
                                    else {
                                    UpdateBarrageBlacklists (ParseConfigM [2], 'Add');
                                    SendMTM ('§l§o§9ConfigStatus §l§o§a已添加當前該用戶為彈幕黑名單');
                                    }
                                break;
                                    
                                case 'Delete':
                                    if (!JudgeUsersExist (ParseConfigM [2], Interactives ['BarrageBlacklists']))
                                    SendMTM ('§l§o§9ConfigStatus §l§o§4當前該用戶不在彈幕黑名單列表裡');
                                    else {
                                    UpdateBarrageBlacklists (ParseConfigM [2], 'Delete');
                                    SendMTM ('§l§o§9ConfigStatus §l§o§a已刪除當前該用戶為彈幕黑名單');
                                    };
                        break;
                        
                        default:
                            SendMTM ('§l§o§9ConfigStatus §l§o§4該配置屬性不存在');
                            };
                        break;
                        
                        case 'KeywordUsers':
                            switch (ParseConfigM [1]) {
                                case 'Add':
                                    if (JudgeUsersExist (ParseConfigM [2], Interactives ['KeywordUsers']))
                                    SendMTM ('§l§o§9ConfigStatus §l§o§4當前該用戶已經是關鍵詞使用者');
                                    else {
                                    UpdateKeywordUsers (ParseConfigM [2], 'Add');
                                    SendMTM ('§l§o§9ConfigStatus §l§o§a已添加當前該用戶為關鍵詞使用者');
                                    }
                                break;
                                
                                case 'Delete':
                                    if (!JudgeUsersExist (ParseConfigM [2], Interactives ['KeywordUsers']))
                                    SendMTM ('§l§o§9ConfigStatus §l§o§4當前該用戶已經不是關鍵詞使用者');
                                    else {
                                    UpdateKeywordUsers (ParseConfigM [2], 'Delete');
                                    SendMTM ('§l§o§9ConfigStatus §l§o§a已刪除當前該用戶為關鍵詞使用者');
                                    };
                        break;
                        
                        default:
                            SendMTM ('§l§o§9ConfigStatus §l§o§4該配置屬性不存在');
                            };
                        break;
                        
                        case 'GiftWhitelists':
                        	switch (ParseConfigM [1]) {
                        		case 'Add':
                        			if (JudgeUsersExist (ParseConfigM [2], Interactives ['GiftWhitelists']))
                        			SendMTM ('§l§o§9ConfigStatus §l§o§4當前該用戶已經是投餵禮物觸發事件使用者');
                              else {
                              	UpdateGiftWhitelists (ParseConfigM [2], 'Add');
                              	SendMTM ('§l§o§9ConfigStatus §l§o§a已添加當前該用戶為投餵禮物觸發事件使用者');
                                    };
                                   break;
                                   
                        		case 'Delete':
                        			if (!JudgeUsersExist (ParseConfigM [2], Interactives ['GiftWhitelists']))
                        			SendMTM ('§l§o§9ConfigStatus §l§o§4當前該用戶已經不是投餵禮物觸發事件使用者');
                                    else {
                                    UpdateGiftWhitelists (ParseConfigM [2], 'Delete');
                                    SendMTM ('§l§o§9ConfigStatus §l§o§a已刪除當前該用戶為投餵禮物觸發使用者');
                                    };
                                    break;
                         default:
                            SendMTM ('§l§o§9ConfigStatus §l§o§4該配置屬性不存在');
                        	};
                        	break;
                        	
                        	case 'GiftStatus':
                        		switch (ParseConfigM [1]) {
                        		case 'True':
                        			GiftConfigs ('GiftStatus', true);
                        			SendMTM ('§l§o§9GiftStatus §l§o§c已更改禮物觸發狀態為 §l§o§a[True]');
                              break;
                                   
                        		case 'False':
                        			GiftConfigs ('GiftStatus', false);
                        			SendMTM ('§l§o§9GiftStatus §l§o§c已更改禮物觸發狀態為 §l§o§4[False]')
                              break;
                              
                         default:
                            SendMTM ('§l§o§9ConfigStatus §l§o§4該配置屬性不存在');
                        	};
                        	break;
                        	
                        	case 'GiftGroup':
                        	switch (ParseConfigM [1]) {
                        		case 'Add':
                        			GiftConfigs ('GiftGroup', 'Add', ParseConfigM [2]);
                               break;
                                   
                        		case 'Delete':
                        			GiftConfigs ('GiftGroup', 'Delete', ParseConfigM [2]);
                               break;
                               
                         default:
                            SendMTM ('§l§o§9ConfigStatus §l§o§4該配置屬性不存在');
                        	};
                        	break;
                        	
                        	case 'GiftQuantity':
                        		if (new RegExp ('[0-9]', 'img') ['test'] (new Number (ParseConfigM [1]))) {
                        		GiftConfigs ('GiftQuantity', ParseConfigM [1]);
                        		SendMTM (` §l§o§9GiftStatus §l§o§a已更改禮物觸發數量為 §l§o§c[${ParseConfigM [1]}]`);
                        		} else
                        		SendMTM (` §l§o§9GiftStatus §l§o§4非法字符 請輸入正確的數值`);
                        	break;
                        	
                        	case 'ListenerStatus':
                        		switch (ParseConfigM [1]) {
                        			case 'True':
                        			 ListenerStatus = true;
                        			 SendMTM (` §l§o§9ListenerStatus §l§o§c已更改彈幕監聽狀態為  §l§o§a[True]`);
                        			 break;

                        			case 'False':
                        			 ListenerStatus = false;
                        			 SendMTM (` §l§o§9ListenerStatus §l§o§c已更改彈幕監聽狀態為 §l§o§4[False]`);
                        			 break;

                           default:
                            SendMTM ('§l§o§9ConfigStatus §l§o§4該配置屬性不存在');
                        		};
                    };
                };
                if (ParsePlugin [0] === '$') {
                	const ParsePlugins = ParsePlugin [1] ['split'] (' ');
                	switch (ParsePlugins [0]) {
                        case 'Building':
                            switch (ParsePlugins [1]) {
                                case 'Local':
                                    new Bg (Socket, 'Local', ParsePlugins [2]);
                                break;
                                
                                case 'Online':
                                    new Bg (Socket, 'Online', ParsePlugins [2])
                                break;
                                
                        default:
                            SendMTM ('§l§o§9PluginStatus §l§o§4該擴展插件屬性不存在');
                            };
                        break;
                        
                        case 'Lottery':
                            GetLottery ('Lottery');
                        break;
                        
                        case 'Agent':
                        	switch (ParsePlugins [1]) {
                        		case 'Create':
                        			SendCMD ('agent create');
                        			if (!AgentStatus) {
                        				AgentStatus = true;
                                SendMTM ('§l§o§9AgentStatus §l§o§a 【Minecraft】 Agent 吉祥物召喚成功');
                        			} else
                              SendMTM ('§l§o§9AgentStatus §l§o§4 【Minecraft】 Agent 吉祥物召喚失敗，Agent 吉祥物已存在');
                        		break;
                        
                        		case 'ComeBack':
                        			SendCMD ('agent tp');
                        		SendMTM ('§l§o§9AgentSay §l§o§e 我來了 嘿嘿嘿');
                        		break;
                        
                        		default:
                            SendMTM ('§l§o§9PluginStatus §l§o§4該擴展插件屬性不存在');
                        	};
                        break;
                        
                        case 'GoHome':
                        	switch (ParsePlugins [1]) {
                        		case 'Set':
                        			GoHome ['setHome'] (Coordinate);
                        		 SendMTM ('§l§o§9GoHomeStatus §l§o§a傳送點設置成功');
                        		break;
                        		
                        		case 'Get':
                        			let Gms = GoHome ['getHome'] ();
                        			if (Gms === null)
                        			SendMTM ('§l§o§9GoHomeStatus §l§o§4你不先設置傳送點，你想回哪去?');
                        			else {
                        			SendCMD (Gms);
                        			SendMTM ('§l§o§9GoHomeStatus §l§o§a傳送成功');
                        			}
                        		break;
                        		
                        		default:
                        		SendMTM ('§l§o§9PluginStatus §l§o§4該擴展插件屬性不存在');
                        	};
                        break;
                        
                        case 'List':
                        	if (MS === true)
                        	SendMTM (`§l§o§9PluginList §l§o§4${ML}`);
                        	else
                        	SendMTM ('§l§o§9PluginList §l§o§4所有所有插件並未加載完畢，請稍等...');
                       	break;
                        	
                        default:
                         Pls ['Submit'] ({
                         	"Value": ParsePlugin [1] ['split'] (' ')
                         }, CallBack => {});
                	}
               }
            } else if (ParseData ['body'] ['eventName'] === 'PlayerTransform') {
            Coordinate [0] = parseInt (ParseData ['body'] ['properties'] ['PosX']) || 0;
            Coordinate [1] = parseInt (ParseData ['body'] ['properties'] ['PosY']) || 67;
            Coordinate [2] = parseInt (ParseData ['body'] ['properties'] ['PosZ']) || 0;
            };
        } catch (Err) {
            Fs ['writeFileSync'] (Path ['join'] (Path ['resolve'] (), LWPC ('Mcbbsmis/Logs/Errors/'), `${new String (Math ['random'] () * 9329583)}.LOG`), new String (Err))
        }
      })
   });
  	//輸出顯示服務器主機和端口
	console ['info'] (`-

--===服務器環境搭建成功===--

這個 [ Mcbbsmis ] 服務運行在

主機: ${
    Configuration ['WebSocket'] ['Host']
}
端口: ${
    Configuration ['WebSocket'] ['Port']
}

請複製這個連接命令:
/Connect ws://${Configuration ['WebSocket'] ['Host']}:${Configuration ['WebSocket'] ['Port']}

-------Mcbbsmis Service-------
-`);
 } else 
 console ['error'] (`
--===服務器環境搭建失敗===--

請檢查 [主機 & 端口] 是否合法

主機範圍 [0.0.0.0 & 255.255.255.255]
端口範圍 [2000 & 8000]

您輸入的主機值為: ${
    Configuration ['WebSocket'] ['Host']
}
你輸入的端口值為: ${
    Configuration ['WebSocket'] ['Port']
}
`)
	});
});