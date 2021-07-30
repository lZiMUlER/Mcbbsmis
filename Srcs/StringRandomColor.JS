class SRC {
	static Catch = new Array;
	static Result = null;

	constructor (Mode = false, Content = 'String Random Colors') {
		if (Object ['prototype'] ['toString'] ['call'] (Mode) === '[object Boolean]')
		if (Mode)
		SRC ['Result'] = SRC ['SSP'] (Content);
		else 
		SRC ['Result'] = SRC ['GRC'] (Content);
	}

	static GRC (Content) {
		return `§${new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g') [Math ['floor'] (Math ['random'] () * 17)]}${Content}`
	}

	static SSP (Content) {
		SRC ['Catch'] ['splice'] (0, SRC ['Catch'] ['length']);
		Content ['split'] ('') ['forEach'] (Value => {
			if (!new RegExp ('\\s', 'img') ['test'] (Value)) 
			SRC ['Catch'] ['push'] (SRC ['GRC'] (Value));
			else
			SRC ['Catch'] ['push'] (Value);
		})
		return SRC ['Catch'] ['join'] ('')
	}
	
	getContent (CallBack) {
		if (CallBack && Object ['prototype'] ['toString'] ['call'] (CallBack) === '[object Function]')
		CallBack (SRC ['Result']);
		else
		return SRC ['Result']
	}
};

module ['exports'] = SRC;