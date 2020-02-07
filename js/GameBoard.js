Vue.component('game-board', {
	props: [ 'board', 'size', 'clickingCell' ],
	template: `<div :style=style class='game-board'>
		<game-board-row
			class='game-board-row'
			v-for='(row, i) in board'
			@mousedown-cell=mousedownCell
			@mouseup-cell=mouseupCell
			:key=i
			:cells=row
			:size=cellSize
			:clicking-cell=clickingCell></game-board-row>
	</div>`,
	data() {
		return {
			boardNeedsInit: true
		};
	},
	computed: {
		count() { return this.board.length; },
		colCount() { return this.board[0].length; },
		cellSize() { return Math.floor(this.size / (this.count > this.colCount ? this.count : this.colCount)); },
		style() {
			let size = this.size + 'px';

			return {
				width: this.size + 'px',
			};
		}
	},
	methods: {
		mousedownCell() {
			this.$emit('mousedown-cell');
		},
		mouseupCell() {
			this.$emit('mouseup-cell');
		}
	}
});