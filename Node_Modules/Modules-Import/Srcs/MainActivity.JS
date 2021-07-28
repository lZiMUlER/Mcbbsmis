'use strict';

class MainActivity {
	constructor (Name) {
		let ModuleLists = new Object;
		if (Object ['prototype'] ['toString'] ['call'] (Name) === '[object String]') {
			global [MainActivity ['Refactor'] (Name)] = require (Name);
			ModuleLists [MainActivity ['Refactor'] (Name)] = require (Name);
		} else if (Object ['prototype'] ['toString'] ['call'] (Name) === '[object Array]') {
			Name ['forEach'] (Value => global [MainActivity ['Refactor'] (Value)] = require (Value));
			Name ['forEach'] (Value => ModuleLists [MainActivity ['Refactor'] (Value)] = require (Value));
		};
		return ModuleLists;
	};
	
	static Refactor (OldName) {
		let NewName = new Array;
		if (new RegExp ('-', 'img') ['test'] (OldName))
		OldName ['split'] ('-') ['forEach'] (Value => NewName ['push'] (Value ['split'] ('') [0]));
		else if (new RegExp ('_', 'img') ['test'] (OldName))
		OldName ['split'] ('_') ['forEach'] (Value => NewName ['push'] (Value ['split'] ('') [0]));
		else
		OldName ['split'] ('') ['forEach'] (Value => NewName ['push'] (Value));
		NewName ['unshift'] (NewName ['shift'] () ['toUpperCase'] ());
		return NewName ['join'] ('');
	};
};

module ['exports'] = MainActivity;