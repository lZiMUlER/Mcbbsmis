class Gm {
	Coordinate = null

	setHome (Coordinate) {
		this ['Coordinate'] = new String (`Tp @s ${Coordinate [0]} ${Coordinate [1]} ${Coordinate [2]}`);
	}
	
	getHome () {
		return this ['Coordinate'];
	}
};

module ['exports'] = Gm;