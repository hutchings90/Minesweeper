Vue.component('custom-menu', {
	props: [ 'option', 'bounds' ],
	template: `<div @keyup.esc=cancel class='custom-menu'>
		<div @keyup.enter=start class='compact-table-container'>
			<table>
				<thead></thead>
				<tbody>
					<tr>
						<td>Height: <span v-html=rowCount colspan=2></span></td>
					</tr>
					<tr>
						<td colspan=3>
							<div class='slider-container'>
								<input v-model=option.rowCount @input=updateRowCount :min=minRowCount :max=maxRowCount type=range />
							</div>
						</td>
					</tr>

					<tr>
						<td>Width: <span v-html=colCount colspan=2></span></td>
					</tr>
					<tr>
						<td colspan=3>
							<div class='slider-container'>
								<input v-model=option.colCount @input=updateColCount :min=minColCount :max=maxColCount type=range />
							</div>
						</td>
					</tr>

					<tr>
						<td>Mines: <span v-html=mineCount colspan=2></span></td>
					</tr>
					<tr>
						<td colspan=3>
							<div class='slider-container'>
								<input v-model=option.mineCount @input=updateMineCount :min=minMines :max=maxMines type=range />
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			<button @click=start type=submit>Start</button>
			<button @click=cancel type=button>Cancel</button>
		</div>
	</div>`,
	data() {
		return {
			rowCount: this.option.rowCount,
			colCount: this.option.colCount,
			mineCount: this.option.mineCount
		}
	},
	computed: {
		cells() { return this.rowCount * this.colCount; },
		minRowCount() { return 9; },
		maxRowCount() { return 30; },
		minColCount() { return 9; },
		maxColCount() { return 24; },
		minMines() { return 10; },
		maxMines() { return Math.min(this.cells - 10, Math.floor(this.cells * .9)); },
	},
	watch: {
		maxMines() {
			if (this.mineCount > this.maxMines) {
				this.option.mineCount = this.maxMines;
				this.updateMineCount();
			}
		}
	},
	methods: {
		start() {
			this.$emit('start', this.option);
		},
		cancel() {
			this.$emit('cancel');
		},
		updateRowCount() {
			this.updateDimension('rowCount', this.option.rowCount);
		},
		updateColCount() {
			this.updateDimension('colCount', this.option.colCount);
		},
		updateMineCount() {
			this.mineCount = this.option.mineCount;
		},
		updateDimension(dimension, value) {
			this[dimension] = value;
		}
	}
});