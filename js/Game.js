Vue.component('game', {
	props: [ 'gameOption', 'size' ],
	template: `<div class='game'>
		<game-board
			@mousedown-cell=mousedownCell
			@mouseup-cell=mouseupCell
			:board=board
			:size=size
			:clicking-cell=cellActive></game-board>

		<game-footer
			@restart=restart
			:clicking-cell=cellActive
			:mine-count=gameOption.mineCount
			:flagged-cell-count=flaggedCellCount
			:playing=playing
			:ended=ended
			:won=won></game-footer>

		<game-results
			v-if=ended
			@restart=restart
			@replay=replay
			@leave=leave
			:won=won></game-results>
	</div>`,
	data() {
		let board = [];

		for (let i = 0; i < this.gameOption.rowCount; i++) {
			board.push([]);

			for (let j = 0; j < this.gameOption.colCount; j++) {
				board[i].push(new GameBoardCell(i, j));
			}
		}

		return {
			ended: false,
			needNewBoard: true,
			clickingCell: false,
			lastMousedownCellTs: null,
			lastMousedownCell: null,
			board: board,
			visitChecks: []
		};
	},
	computed: {
		rowCount() { return this.gameOption.rowCount; },
		colCount() { return this.gameOption.colCount; },
		mineCount() { return this.gameOption.mineCount; },
		cellCount() { return this.gameOption.rowCount * this.gameOption.colCount; },
		cells() { return this.board.reduce((cells, row) => cells.concat(row), []); },
		flippedCellCount() { return this.cells.filter(cell => cell.flipped).length; },
		flaggedCellCount() { return this.cells.filter(cell => cell.flagged).length; },
		mineCells() { return this.cells.filter(cell => cell.mine); },
		activeCell() {
			if (!this.clickingCell) return null;

			return this.cells.find(cell => cell.mouseActive);
		},
		cellActive() { return this.activeCell != null; },
		won() { return this.flippedCellCount >= this.cellCount - this.gameOption.mineCount; },
		playing() { return !this.ended && this.flippedCellCount > 0; }
	},
	methods: {
		end() {
			this.ended = true;
			this.mineCells.forEach(cell => cell.flipped);
		},
		mousedownCell() {
			let ts = Date.now();

			this.clickingCell = true;

			if (this.lastMousedownCell
				&& this.lastMousedownCell == this.activeCell
				&& ts - this.lastMousedownCellTs < 500
				&& this.activeCell.flipped
				&& this.activeCell.proximityCount > 0) {
				this.flipFromCell(this.activeCell);
				this.clickingCell = false;
			}
			else {
				this.lastMousedownCellTs = ts;
				this.lastMousedownCell = this.activeCell;
			}
		},
		flaggedNeighborCount(origin) {
			return this.getNeighborCells(origin).filter(cell => cell.flagged).length;
		},
		flipFromCell(cell) {
			this.initVisitChecks();

			let cells = this.getCellGroup([], cell);

			if (cell.flippable || this.flaggedNeighborCount(cell) >= cell.proximityCount) {
				let mines = cells.filter(cell => cell.mine);

				if (mines.length > 0) this.flipCell(mines[0]);
				else cells.forEach(cell => this.flipCell(cell));
			}
		},
		mouseupCell() {
			let cell = this.activeCell;

			this.clickingCell = false;

			if (!cell || !cell.flippable || this.ended) return;

			if (this.needNewBoard) this.start(cell);

			this.flipFromCell(cell);
		},
		flipCell(cell) {
			cell.flipped = true;

			if (cell.mine || this.won) this.end();
		},
		start(cell) {
			this.initBoard(cell);
			this.needNewBoard = false;
			this.ended = false;
		},
		initBoard(cell) {
			let i = 0;
			let cells = this.board.reduce((reduction, row) => {
				let j = 0;

				reduction[i] = row.map(cell => j++);

				if (cell.row == i) reduction[i].splice(cell.col, 1);

				i++;

				return reduction;
			}, {});

			let rowIndexes = Object.keys(cells);
			for (let i = this.mineCount; i > 0; i--) {
				let rowIndex = Number(rowIndexes[Math.floor(Math.random() * rowIndexes.length)]);
				let cols = cells[rowIndex];
				let colIndex = Math.floor(Math.random() * cols.length);
				let col = cols[colIndex];
				let cell = this.board[rowIndex][col];

				cell.mine = true;
				this.updateProximityCounts(cell);

				cols.splice(colIndex, 1);

				if (cols.length < 1) {
					delete cells[rowIndex];
					rowIndexes = Object.keys(cells);
				}
			}
		},
		updateProximityCounts(cell) {
			this.getNeighborCells(cell).forEach(cell => cell.proximityCount++);
		},
		getNeighborCells(cell) {
			let cells = [];
			let rowMin = Math.max(0, cell.row - 1);
			let rowMax = Math.min(cell.row + 1, this.rowCount - 1);
			let colMin = Math.max(0, cell.col - 1);
			let colMax = Math.min(cell.col + 1, this.colCount - 1);

			for (let i = rowMin; i <= rowMax; i++) {
				for (let j = colMin; j <= colMax; j++) {
					cells.push(this.board[i][j]);
				}
			}

			return cells;
		},
		getCellGroup(cells, origin) {
			cells.push(origin);

			this.visitCell(origin);

			if (origin.flipped || origin.proximityCount < 1) this.getNeighborCells(origin).forEach(cell => {
				if (!this.visitChecks[cell.row][cell.col]) cells = this.getCellGroup(cells, cell);
			});

			return cells;
		},
		visitCell(cell) {
			this.visitChecks[cell.row][cell.col] = true;
		},
		initVisitChecks() {
			this.visitChecks = this.board.map(row => row.map(cell => !cell.flippable));
		},
		restart() {
			this.reset(true);
			this.needNewBoard = true;
			this.ended = false;
		},
		replay() {
			this.reset();
			this.ended = false;
		},
		leave() {
			this.needNewBoard = true;
			this.ended = false;
			this.$emit('leave');
		},
		reset(forNewBoard) {
			this.cells.forEach(cell => cell.init(forNewBoard));
		}
	}
});