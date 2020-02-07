Vue.component('game-footer', {
	props: [ 'clickingCell', 'mineCount', 'flaggedCellCount', 'playing', 'ended', 'won' ],
	template: `<div class='game-footer'>
		<div>
			<img src='assets/timer.png'/>
			<span v-html=timeDisplay></span>
		</div>

		<div>
			<img @mousedown=mousedownFace @mouseup=mouseupFace :src=faceSrc :class=faceClass />
		</div>

		<div>
			<span v-html=minesLeft></span>
			<img src='assets/cell/mine.png'/>
		</div>
	</div>`,
	data() {
		return {
			seconds: 0,
			interval: null,
			faceMousedown: false
		};
	},
	computed: {
		timeDisplay() { return Math.min(999, this.seconds); },
		minesLeft() { return this.won ? 0 : (this.mineCount - this.flaggedCellCount); },
		lost() { return this.ended && !this.won; },
		faceState() {
			if (this.clickingCell || this.faceMousedown) return 'anticipation';
			if (this.won) return 'won';
			if (this.lost) return 'lost';
			return 'smile';
		},
		faceSrc() { return 'assets/face/' + this.faceState + '.png'; },
		faceAvailable() { return !(this.ended || this.clickingCell); },
		faceClass() {
			return {
				available: this.faceAvailable
			};
		}
	},
	watch: {
		playing() {
			if (this.playing) this.startTimer();
		},
		ended() {
			if (this.ended) this.stopTimer();
			else this.clearTimer();
		}
	},
	methods: {
		startTimer() {
			this.seconds = 0;
			this.interval = setInterval(() => this.seconds++, 1000);
		},
		stopTimer() {
			clearInterval(this.interval);
		},
		clearTimer() {
			this.seconds = 0;
		},
		mousedownFace() {
			if (this.faceAvailable) this.faceMousedown = true;
		},
		mouseupFace() {
			if (!this.faceMousedown) return;

			this.stopTimer();
			this.clearTimer();
			this.faceMousedown = false;
			this.$emit('restart');
		}
	}
});