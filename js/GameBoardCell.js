Vue.component('game-board-cell', {
	props: [ 'cell', 'size', 'clickingCell' ],
	template: `<div @mouseenter=mouseenter @mouseleave=mouseleave @mousedown=mousedown($event) @mouseup=mouseup($event) @contextmenu=mark($event) :style=style :class=classObject class='game-board-cell'>
		<img :src=backgroundSrc />

		<template v-if=flipped>
			<img v-if=cell.mine :src=mineSrc />
			<img v-else-if='proximityCount > 0' :src=proximityCountSrc />
		</template>

		<img v-if=flagged :src=flaggedSrc :class=flaggedClass />
		<img v-if=suspect :src=suspectSrc :class=suspectClass />
		<img v-if=showMouseHover :src=mouseActiveSrc />
	</div>`,
	computed: {
		classObject() {
			return {
				unflipped: !this.flipped
			};
		},
		flaggedClass() {
			return {
				faded: this.flipped
			};
		},
		suspectClass() {
			return {
				faded: this.flipped
			};
		},
		mouseActive: {
			get() { return this.cell.mouseActive; },
			set(mouseActive) { this.cell.mouseActive = mouseActive; }
		},
		dir() { return 'assets/cell/'; },
		proximityCount() { return this.cell.proximityCount; },
		mineSrc() { return this.dir + 'mine.png'; },
		flipped() { return this.cell.flipped; },
		flagged() { return this.cell.flagged; },
		suspect() { return this.cell.suspect; },
		flaggedSrc() { return this.dir + 'flagged.png'; },
		flippedSrc() { return this.dir + 'flipped.png'; },
		suspectSrc() { return this.dir + 'suspect.png'; },
		backgroundSrc() { return this.dir + (this.flipped || (!this.flagged && this.mouseActive && this.clickingCell) ? 'flipped' : 'blank') + '.png'; },
		showMouseHover() { return !this.flipped && !this.clickingCell && this.mouseActive; },
		mouseActiveSrc() { return this.dir + 'hover.png'; },
		proximityCountSrc() { return this.dir + this.proximityCount + '.png'; },
		borderWidth() { return 2; },
		style() {
			let size = (this.size - 4) + 'px';

			return {
				height: size,
				width: size,
				border: this.borderWidth + 'px solid black'
			};
		}
	},
	methods: {
		mouseenter() {
			this.mouseActive = true;
		},
		mouseleave() {
			this.mouseActive = false;
		},
		mousedown(ev) {
			if (ev.which != 1) return;

			ev.preventDefault();
			ev.stopPropagation();

			this.$emit('mousedown');
		},
		mouseup(ev) {
			if (ev.which == 1) this.$emit('mouseup');
		},
		mark(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			this.cell.mark();
		}
	}
});