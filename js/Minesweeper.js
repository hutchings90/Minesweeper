Vue.component('minesweeper', {
	template: `<div class='minesweeper'>
		<game
			v-if=gameOption
			@leave=end
			:game-option=gameOption
			:size=600></game>
		<start-menu
			v-else
			@start=start
			:options=gameOptions
			:custom-option=customGameOption></start-menu>
	</div>`,
	data() {
		return {
			gameOption: null
		};
	},
	computed: {
		easyGameOption() { return new StartMenuOption('Easy', 10, 9, 9); },
		mediumGameOption() { return new StartMenuOption('Medium', 40, 16, 16); },
		expertGameOption() { return new StartMenuOption('Expert', 99, 16, 30); },
		customGameOption() { return this.easyGameOption.copy('Custom', true); },
		gameOptions() {
			return [
				this.easyGameOption,
				this.mediumGameOption,
				this.expertGameOption,
				this.customGameOption
			];
		}
	},
	methods: {
		start(gameOption) {
			this.gameOption = gameOption;
		},
		end() {
			this.gameOption = null;
		}
	}
});