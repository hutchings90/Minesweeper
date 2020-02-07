Vue.component('game-results', {
	props: [ 'won' ],
	template: `<div class='game-results'>
		<div>
			<div>You <span v-html=winLose></span></div>
			<div>
				<button @click=restart>New Board</button>
				<button @click=replay>Replay Board</button>
				<button @click=leave>Menu</button>
			</div>
		</div>
	</div>`,
	computed: {
		winLose() { return this.won ? 'win!' : 'lose.'; }
	},
	methods: {
		restart() {
			this.$emit('restart');
		},
		replay() {
			this.$emit('replay');
		},
		leave() {
			this.$emit('leave');
		}
	}
});