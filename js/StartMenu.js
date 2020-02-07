Vue.component('start-menu', {
	props: [ 'options', 'customOption' ],
	template: `<div class='start-menu'>
		<custom-menu
			v-if=custom
			@start=start
			@cancel=cancelCustom
			:option=customOption></custom-menu>
		<start-menu-option
			v-else
			v-for='(option, gameType) in options'
			@start=start
			:key=gameType
			:gameType=gameType
			:option=option></start-menu-option>
	</div>`,
	data() {
		return {
			custom: false
		};
	},
	methods: {
		cancelCustom() {
			this.custom = false;
		},
		start(option) {
			if (option.gameType == 'Custom' && !this.custom) this.custom = true;
			else if (this.validateOption(option)) this.$emit('start', option);
		},
		validateOption(option) {
			return this.validateDimension(option.rowCount) && this.validateDimension(option.colCount);
		},
		validateDimension(dimension) {
			return dimension > 8 && dimension < 100;
		}
	}
});