export default class ScatterPlot {
	// Attributes (you can make those private too)
	width; height; margin; // Size
	svg; plot; scatters;   // Selections
	axisX; axisY;          // Axes
	labelX; labelY;        // Labels
	scaleX; scaleY;        // Scales
	data;                  // Internal Data

	// Constructor
	constructor(container, width, height, margin) {
		this.width = width;
		this.height = height;
		this.margin = margin;

		this.svg = d3.select(container).append("svg")
			.classed("scatterplot", true)
			.attr("width", width).attr("height", height);

		this.plot = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.margin[0]})`);
		this.scatters = this.plot.selectAll("circle.scatter");

		// Axes
		this.axisX = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.height - this.margin[1]})`);
		this.axisY = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.margin[0]})`);

		// Labels
		this.labelX = this.svg.append("text")
			.attr("transform", `translate(${this.width / 2}, ${this.height})`)
			.style("text-anchor", "middle").attr("dy", -5);

		this.labelY = this.svg.append("text")
	}

	#updateScales() {
		let plotWidth = this.width - this.margin[2] - this.margin[3],
			plotHeight = this.height - this.margin[0] - this.margin[1];

		let rangeX = [0, plotWidth],
			rangeY = [plotHeight, 0];

		let domainX = this.data.map((d) => d[0]),
			domainY = [0, d3.max(this.data, (d) => d[1])];

		this.scaleX = d3.scaleBand(domainX, rangeX).padding(0.2);
		this.scaleY = d3.scaleLinear(domainY, rangeY).nice();
	}

	#updateAxes() {
		let axisGenX = d3.axisBottom(this.scaleX),
			axisGenY = d3.axisLeft(this.scaleY);

		this.axisX.call(axisGenX);
		this.axisY.call(axisGenY);
	}

	// Private methods
	// data is in the format [[key, value], ...]
	#updateScatter() {
		this.scatters = this.scatters
			.data(this.data, (d) => d[0])
			.join("circle")
			.classed("scatter", true)
			.attr("cx", (d) => this.scaleX(d[0]) + this.scaleX.bandwidth() / 2)
			.attr("cy", (d) => this.height - this.margin[1] - this.scaleY(d[1]))
			.attr("r", 8);
	}

	// Public API

	// The dataset parameter needs to be in a generic format,
	// so that it works for all future data
	// here we assume a [[k, v], ...] format for efficiency
	render(dataset) {
		this.data = dataset;
		this.#updateScales();
		this.#updateScatter();
		this.#updateAxes();
		return this; // to allow chaining
	}

	setLabels(labelX = "categories", labelY = "values") {
		this.labelX.text(labelX);
		this.labelY.text(labelY);
		return this; // to allow chaining
	}
}
