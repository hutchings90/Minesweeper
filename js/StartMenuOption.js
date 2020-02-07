Vue.component('start-menu-option', {
	props: [ 'option' ],
	template: `<div class='start-menu-option'>
		<button @click=start>
			<template v-if=showDimensions>
				<span v-html=option.rowCount></span>x<span v-html=option.colCount></span>
			</template>
			<template v-if=showDimensions>(</template><span v-html=option.gameType></span><template v-if=showDimensions>)</template>
		</button>
	</div>`,
	computed: {
		showDimensions() { return !this.option.hide; }
	},
	methods: {
		start() {
			this.$emit('start', this.option);
		}
	}
});