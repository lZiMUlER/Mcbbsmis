'use strict';

const Import = require ('modules-import');

//基模塊
new Import (new Array ('fs', 'http', 'path'));

//Linux Window 路徑矯正
const LCPC = FilePath => FilePath ['replace'] (new RegExp ('/', 'img'), Path ['sep'] === '\\'? '\\\\': '/');

function SendMSM (Socket, Message, Mode) {
    Socket ['send'] (JSON ['stringify'] (!Mode? new Object ({
        "header":{
            "messagePurpose": "commandRequest",
            "messageType": "commandRequest",
            "requestId":"c3014476-21b7-41f6-85d8-c964870a2444",
            "version": 1
        },
        "body": {
            "origin": {
                "type": "player"
            },
            "commandLine": `say §o§l§b(§3Mcbbsmis§b) §9Building §e${Message}`,
            "version": 1
        }
    }): new Object ({
        "header":{
            "messagePurpose": "commandRequest",
            "messageType": "commandRequest",
            "requestId":"c3014476-21b7-41f6-85d8-c964870a2444",
            "version": 1
        },
        "body": {
            "origin": {
                "type": "player"
            },
            "commandLine": `Title @s Actionbar §o§l§b(§3Mcbbsmis§b) §9Building §e${Message}`,
            "version": 1
        }
    })))
};

function Deep (Socket, Data) {
    let Resource = new Array;
    let ParseBuild = JSON ['parse'] (Data ['join'] (''));
    Resource ['push'] (`建築物名稱§d:§c ${ParseBuild ['Headers'] ['Name']}`);
    Resource ['push'] (`建築物描述§d:§c ${ParseBuild ['Headers'] ['Description']}`);
    Resource ['push'] (`建築物成員§d:§c ${function (Contributors, Combination) {
    Contributors ['forEach'] (Value => {
    Combination ['push'] (`${Value ['Name']} (${Value ['Position']} # ${Value ['Mail']})`)});
    return Combination ['join'] (' | ');
    } (ParseBuild ['Headers'] ['Contributors'], new Array)}`);
        Resource ['push'] (`建築物團隊§d:§c ${ParseBuild ['Headers'] ['Team'] ['Name']}`);
        Resource ['push'] (`建築物郵箱§d:§c ${ParseBuild ['Headers'] ['Team'] ['Mail']}`);
        Resource ['push'] (`建築物主頁§d:§c ${ParseBuild ['Headers'] ['Team'] ['Homepage']}`);
        Resource ['push'] (`建築物類型§d:§c ${ParseBuild ['Headers'] ['Type']}`);
        Resource ['push'] (`建築物大小§d:§c ${ParseBuild ['Bodyers'] ['Blocks'] ['length'] + ParseBuild ['Bodyers'] ['Entitys'] ['length']} Bytes`);
        Resource ['push'] (`建築物唯碼§d:§c ${ParseBuild ['Headers'] ['Uuid']}`);
        Resource ['push'] (`建築物許可§d:§c ${ParseBuild ['Headers'] ['Certification'] ['License']}`);
        Resource ['push'] (`建築物公鑰§d:§c ${ParseBuild ['Headers'] ['Certification'] ['PublicKey']}`);
        Resource ['forEach'] (Value => SendMSM (Socket, Value, false));
        let Schedule = setInterval (Data => {
        	SendMSM (Socket, '正在生成中，請稍等...', true)
        }, 1000)
        ParseBuild ['Bodyers'] ['Commands'] ['forEach'](Value => {
            Socket ['send'] (JSON ['stringify'] (new Object ({
                "header":{
                    "messagePurpose": "commandRequest",
                    "messageType": "commandRequest",
                    "requestId":"0bc13120-c967-497a-ae74-27781617ba21",
                    "version": 1
                },
                "body": {
                    "origin": {
                        "type": "player"
                    },
                    "commandLine": Value ['Command'],
                    "version": 1
                }
            })));
            SendMSM (Socket, Value ['Tips'], false)
        });
        ParseBuild ['Bodyers'] ['Blocks'] ['forEach'](Value => {
            Socket ['send'] (JSON ['stringify'] (new Object ({
                "header":{
                    "messagePurpose": "commandRequest",
                    "messageType": "commandRequest",
                    "requestId":"e9fcaff0-a43d-4dd0-a1b3-b9d5e268e22c",
                    "version": 1
                },
                "body": {
                    "origin": {
                        "type": "player"
                    },
                    "commandLine": `SetBlock ${Value ['Location'] ['X']} ${Value ['Location'] ['Y']} ${Value ['Location'] ['Z']} ${Value ['Id']} ${Value ['Data']} ${Value ['Mode']}`,
                    "version": 1
                }
            })));
        });
        ParseBuild ['Bodyers'] ['Entitys'] ['forEach'](Value => {
            Socket ['send'] (JSON ['stringify'] (new Object ({
                "header":{
                    "messagePurpose": "commandRequest",
                    "messageType": "commandRequest",
                    "requestId":"c3014476-21b7-41f6-85d8-c964870a2444",
                    "version": 1
                },
                "body": {
                    "origin": {
                        "type": "player"
                    },
                    "commandLine": `Summon ${Value ['Id']} ${Value ['Location'] ['X']} ${Value ['Location'] ['Y']} ${Value ['Location'] ['Z']} ${Value ['Name']}`,
                    "version": 1
                }
            })));
        });
        clearInterval (Schedule);
        SendMSM (Socket, `【${ParseBuild ['Headers'] ['Name']}】建築物生成完畢`, false);
};

function Local (Socket, Name) {
    let BuildBuffer = new Array;
    let BuildPath = Path ['join'] (Path ['resolve'] (), LCPC (`Mcbbsmis/Configs/Buildings/${Name}.JSON`));
    try {
    let BuildData = Fs ['createReadStream'] (BuildPath);
    BuildData ['on'] ('data', Buffer => BuildBuffer ['push'] (new String (Buffer)));
    BuildData ['on'] ('end', () => {
        Deep (Socket, BuildBuffer)
    })
    } catch (E) {}
}
function Online (Socket, Url) {
    let BuildBuffer = new Array;
    Http ['get'] (Url, Response => {
        try {
        Response ['on'] ('data', Buffer => BuildBuffer ['push'] (new String (Buffer)))
        Response ['on'] ('end', () => Deep (BuildBuffer))
        } catch (E) {}
    })
}

function MainActivity (Socket, Mode, Path) {
    switch (Mode) {
        case 'Local':
            Local (Socket, Path);
        break;
        case 'Online':
            Online (Socket, Path);
        break;
    }
}

module ['exports'] = MainActivity;