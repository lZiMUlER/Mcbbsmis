class Lottery {
	constructor (Data) {
    return new Promise (LotteryInfo => {
        let Resource = new Object;
        let RRandom = Math ['floor'] (Math ['random'] () * Data ['Resource'] ['length']);
        Resource ['Title'] = Data ['Resource'] [RRandom] ['Title'];
        Resource ['Data'] = new Object;
        let GRandom = Math ['floor'] (Math ['random'] () * Data ['Resource'] [RRandom] ['Group'] ['length']);
        Resource ['Data'] ['Id'] = Data ['Resource'] [RRandom] ['Group'] [GRandom] ['Id'];
        Resource ['Data'] ['Title'] = Data ['Resource'] [RRandom] ['Group'] [GRandom] ['Title'];
        Resource ['Data'] ['Quantity'] = Data ['Resource'] [RRandom] ['Group'] [GRandom] ['Quantity'];
        LotteryInfo (Resource);
    })
	}
};

module ['exports'] = Lottery;