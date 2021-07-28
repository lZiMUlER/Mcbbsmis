class MainActivity {
	constructor (Socket, CallBack) {
		this ['Socket'] = Socket;
		this ['PluginsList'] = new Object;
		this ['PluginsName'] = new Array;
		this ['PluginsMain'] = new Object;
		this ['MTMS'] = null;
		const Root = Socket ['LWPC'] (Socket ['ModulesList'] ['Path'] ['join'] (Socket ['ModulesList'] ['Path'] ['dirname'] (__dirname), '../../', './Plugins/'));
		if (Object ['prototype'] ['toString'] ['call'] (Socket) === '[object Object]')
		Socket ['ModulesList'] ['Fs'] ['exists'] (Root, Status => {
			if (!Status) 
			Socket ['ModulesList'] ['Fs'] ['mkdir'] (Root, Status => null);
			Socket ['ModulesList'] ['Fs'] ['readdir'] (Root, (Status, Results) => {
				Socket ['SendMTM'] = Value => Socket ['SendMTMS'] (`§l§o§9Plugin §l§o§a${this ['MTMS']} §e => §f${Value}`);
				if (Status === null && Results ['length'] !== 0)
				Results ['forEach'] ((Result, Index) => {
					const Path = Socket ['LWPC'] (Socket ['ModulesList'] ['Path'] ['join'] (Root, Result, 'Manifest.JSON'));
					Socket ['ModulesList'] ['Fs'] ['exists'] (Path, Status => {
						if (Status) {
							Socket ['ModulesList'] ['Fs'] ['readFile'] (Path, 'UTF-8', (Status, Data) => {
								if (Status === null && this ['IsJson'] (Data)) {
									const ParseData = JSON ['parse'] (Data);
									if (this ['IsContentLegitimate'] ('Name', 'String', ParseData) && this ['IsContentLegitimate'] ('Description', 'String', ParseData)  && this ['IsContentLegitimate'] ('Author', 'String', ParseData)  && this ['IsContentLegitimate'] ('Main', 'String', ParseData) && this ['IsContentLegitimate'] ('Version', 'String', ParseData)) {
										const Path = Socket ['LWPC'] (Socket ['ModulesList'] ['Path'] ['join'] (Root, Result, ParseData ['Main']));
										Socket ['ModulesList'] ['Fs'] ['exists'] (Path, Status => {
											if (Status)
											try {
												Socket ['ModulesList'] ['Fs'] ['readFile'] (Path, 'UTF-8', (Status, Data) => {
													if (Status === null) {
														if (this ['Repeat'] (this ['PluginsList']) ['indexOf'] (ParseData ['Name']) === -1) {
															Socket ['Manifest'] = ParseData;
															Socket ['Input'] = Func => this ['PluginsMain'] [ParseData ['Name']] = Func;
															this ['MTMS'] = ParseData ['Name'];
															Socket ['SendCMD'] ('Tellraw @a {"rawtext": [{"text": "--------------"}]}');
															Socket ['SendMTMS'] (`§l§o§9PluginStatus §l§o§9[§f${Result}§9] §e=> §a載入成功`);
															Socket ['SendMTMS'] (`§l§o§9PluginInfo §e=> §9[§a${ParseData ['Name'] ['length'] > 15? ParseData ['Name'] ['substring'] (0, 15): ParseData ['Name']}§f@§d${ParseData ['Version'] ['length'] > 9? ParseData ['Version'] ['substring'] (0, 9): ParseData ['Version']}§f#§c${ParseData ['Author'] ['length'] > 10? ParseData ['Author'] ['substring'] (0, 10): ParseData ['Author']}§f#§e${ParseData ['Description'] ['length'] > 12? ParseData ['Description'] ['substring'] (0, 12): ParseData ['Description']}§9]`);
															this ['PluginsName'] ['push'] (ParseData ['Name']);
															this ['PluginsList'] [ParseData ['Name']] = new (eval (`(${Data})`)) (Socket);
															this ['PluginsList'] [ParseData ['Name']] ['Manifest'] = this ['ParseData'];
														} else
														Socket ['SendMTMS'] (`§l§o§9PluginStatus §l§o§9[§f${Result}§9] §e=> §4載入失敗 重複包名`);
														}
												})
											} catch (Err) {}
										})
									}
								}
							})
						}
					});
					if (Index === Results.length - 1)
					setTimeout(Event => {
						if (Object ['prototype'] ['toString'] ['call'] (CallBack) === '[object Function]') 
						CallBack (this ['PluginsName']);
						}, 1000)
				});
			})
		})
	}

	IsJson (Content) {
		try {
			const Obj = JSON ['stringify'] (JSON ['parse'] (Content)) ['split'] ('');
			if (Obj [0] === '{' && Obj [Obj ['length'] - 1] === '}')
			return true;
			return false;
		} catch (Err) {
			return false;
		}
	}

	IsContentLegitimate (Key, Value, ParseData) {
		if (ParseData [Key] !== undefined && Object ['prototype'] ['toString'] ['call'] (ParseData [Key]) === `[object ${Value}]`)
		return true;
		return false;
	}
	
	Repeat (Data) {
		const Result = new Array;
		for (let Value in Data)
		Result ['push'] (Value);
		return Result;
	}
	
	Submit (Data) {
		if (this ['PluginsName'] ['indexOf'] (Data ['Value'] [0]) === -1) {
			this ['Socket'] ['SendMTMS'] ('§l§o§9PluginStatus §l§o§4該擴展插件不存在');
		} else {
			this ['MTMS'] = Data ['Value'] [0];
			if (Object ['prototype'] ['toString'] ['call'] (this ['PluginsMain'] [Data ['Value'] [0]]) === '[object Function]')
			this ['PluginsMain'] [Data ['Value'] [0]] (Data);
		}
	}
}

module ['exports'] = MainActivity;