比如說你的主程序路徑為: MyProject/index.js
```
//導入插件加載器
	const PluginsLoader = require ('plugins-loader');
	
//實例插件加載器
new PluginsLoader (new Object ({
	"Say": Message => {
		console.info (`Hello ${Message}`);
	}
}))
```

那第一個插件的路徑就應該為: MyProject/Plugins/Plugin_1/
裡面有兩個文件分別是 [插件信息, 主程序文件]
如果沒有Plugins文件夾 請先運行一下你的項目 讓插件加載器初始化

插件信息: manifest.json
```
{
	"Name": "Plugins_1",
	"Description": "插件1",
	"Author": "lZiMUl",
	"Main": "./index_1.js",
	"Version": "1.0.0"
}
```
主程序文件: index_1.js
```
class MainActivity {
	constructor (Socket) {
		Socket.Say ('World');
	}
}
```

那第二個插件的路徑就應該為: MyProject/Plugins/Plugin_2/
和上面一樣的

插件信息: manifest.json
```
{
	"Name": "Plugins_2",
	"Description": "插件2",
	"Author": "lZiMUl",
	"Main": "./index_2.js",
	"Version": "1.0.0"
}
```
主程序文件: index_2.js
```
class MainActivity {
	constructor (Socket) {
		Socket.Say ('Node.JS');
	}
}
```

當你運行你的項目時 MyProject/index.js
```
//輸出
Hello World
Hello Node.JS
```
這些插件包會自動運行