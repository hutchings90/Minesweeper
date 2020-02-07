class StartMenuOption {
	constructor(gameType, mineCount, rowCount, colCount, hide) {
		this.gameType = gameType;
		this.mineCount = mineCount;
		this.rowCount = rowCount;
		this.colCount = colCount;
		this.hide = hide;
	}

	copy(gameType, hide) {
		let copy = Object.assign(new StartMenuOption(), this);

		copy.gameType = gameType;
		copy.hide = hide;

		return copy;
	}
}

class GameBoardCell {
	constructor(row, col) {
		this.init(true);

		this.row = row;
		this.col = col;
	}

	get flippable() { return !this.flipped && !this.flagged; }

	mark() {
		if (this.flipped) return;

		if (this.flagged) {
			this.flagged = false
			this.suspect = true;
		}
		else if (this.suspect) this.suspect = false;
		else this.flagged = true;
	}

	flip(maintainStatus) {
		this.flipped = true;

		if (!maintainStatus) {
			this.flagged = false;
			this.suspect = false;
		}
	}

	init(forNewBoard) {
		this.flipped = false;
		this.flagged = false;
		this.suspect = false;
		this.mouseActive = false;

		if (forNewBoard) {
			this.mine = false;
			this.proximityCount = 0;
		}
	}
}