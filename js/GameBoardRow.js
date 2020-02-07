Vue.component('game-board-row', {
	props: [ 'cells', 'size', 'clickingCell' ],
	template: `<div class='game-board-row'>
		<game-board-cell
			v-for='(cell, i) in cells'
			@mousedown=mousedownCell
			@mouseup=mouseupCell
			:key=i
			:cell=cell
			:size=size
			:clicking-cell=clickingCell></game-board-cell>
	</div>`,
	methods: {
		mousedownCell() {
			this.$emit('mousedown-cell');
		},
		mouseupCell() {
			this.$emit('mouseup-cell');
		}
	}
});