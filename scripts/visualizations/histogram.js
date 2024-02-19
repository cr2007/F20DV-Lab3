export default class Histogram {
	// Attributes (you can make those private too)
	width; height; margin;    // Size
	svg; chart; bars;         // Selections
	axisX; axisY;             // Axes
	labelX; labelY;           // Labels
	scaleX; scaleY;           // Scales
	data;                     // Internal Data

	/*
	- container: DOM selector
	- width: visualization width
	- height: visualization heigh
	- margin: chart area margins [top, bottom, left, right]
	*/
	constructor(container, width, height, margin) {
		this.width  = width;
		this.height = height;
		this.margin = margin;

		this.svg = d3.select(container).append("svg")
			.classed("histogram", true)
			.attr("width", this.width).attr("height", this.height);

		this.chart = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.margin[0]})`);

		this.bars = this.chart.selectAll("rect.bar");

		// Axes
		this.axisX = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.height - this.margin[1]})`);
		this.axisY = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.margin[0]})`);

		// Labels
		this.labelX = this.svg.append("text").classed("legend", true)
			.attr("transform", `translate(${this.width / 2}, ${this.height})`)
			.style("text-anchor", "middle").attr("dy", -5);

		this.labelY = this.svg.append("text").classed("legend", true)
			.attr("transform", `translate(0, ${this.margin[0]})rotate(-90)`)
			.style("text-anchor", "end").attr("dy", 15);
	}

	#updateScales() {
		let chartWidth  = this.width  - this.margin[2] - this.margin[3],
			chartHeight = this.height - this.margin[0] - this.margin[1];

		let rangeX = [0, chartWidth],
			rangeY = [chartHeight, 0];

		let domainX = [d3.min(this.data, d => d[1]), d3.max(this.data, d => d[2])],
			domainY = [0, d3.max(this.data, (d) => d[0])];

		this.scaleX = d3.scaleLinear(domainX, rangeX);
		this.scaleY = d3.scaleLinear(domainY, rangeY).nice();
	}

	#updateAxes() {
		let axisGenX = d3.axisBottom(this.scaleX),
			axisGenY = d3.axisLeft(this.scaleY).tickFormat(d3.format(".0%"));

		this.axisX.call(axisGenX);
		this.axisY.call(axisGenY);
	}

	// Private methods
	// data is in the format [[key, value], ...]
	#updateBars() {
		this.bars = this.bars
			.data(this.data, (d) => d[0])
			.join("rect")
			.classed("bar", true)
			.attr("x", (d) => this.scaleX(d[1]) + 0.5)
			.attr("y", (d) => this.scaleY(d[0]))
			.attr("width", d => this.scaleX(d[2]) - this.scaleX(d[1]) - 1)
			.attr("height", (d) => this.scaleY(0) - this.scaleY(d[0]));
	}

	// Public API

	// The dataset parameter needs to be in a generic format,
	// so that it works for all future data
	// here we assume a [[k, v], ...] format for efficiency
	render(dataset, thresholds = 10) {
		// bin generator
		let binGen = d3.bin().thresholds(thresholds);

		// generate data: [[ratio, bin_lower, bin_uppper], ...]
		this.data = binGen(dataset).map((d) => [d.length / dataset.length, d.x0, d.x1]);
		this.#updateScales();
		this.#updateBars();
		this.#updateAxes();
		return this; // to allow chaining
	}

	setLabels(labelX = "values", labelY = "frequencies") {
		this.labelX.text(labelX);
		this.labelY.text(labelY);
		return this; // to allow chaining
	}
}
