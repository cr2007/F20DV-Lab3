export default class BubbleChart {
	// Attributes (you can make those private too)
	width; height; margin;  // Size
	svg; chart; bubbles;    // Selections
	axisX; axisY;          	// Axes
	labelX; labelY;        	// Labels
	scaleX; scaleY; scaleR; // Scales
	data;                   // Internal Data

	// Constructor
	constructor(container, width, height, margin) {
		this.width = width;
		this.height = height;
		this.margin = margin;

		this.svg = d3.select(container).append("svg")
			.classed("bubblechart", true)
			.attr("width", width).attr("height", height);

		this.chart = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.margin[0]})`);
		this.bubbles = this.chart.selectAll("circle.bubble");

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

		let maxDataValue = d3.max(this.data, (d) => d[1]),
			maxRadius = 20; // maximum radius of the bubbbles

		let rangeX = [0, plotWidth],
			rangeY = [plotHeight - maxRadius, maxRadius],
			rangeR = [2, maxRadius];

		let domainX = this.data.map((d) => d[0]),
			domainY = [0, maxDataValue];

		this.scaleX = d3.scaleBand(domainX, rangeX).padding(1.5);
		this.scaleY = d3.scaleLinear(domainY, rangeY).nice();
		this.scaleR = d3.scaleSqrt().domain(domainY).range(rangeR);
	}

	#updateAxes() {
		let axisGenX = d3.axisBottom(this.scaleX),
			axisGenY = d3.axisLeft(this.scaleY);

		this.axisX.call(axisGenX);
		this.axisY.call(axisGenY);
	}

	// Private methods
	// data is in the format [[key, value], ...]
	#updateBubbles() {
		this.bubbles = this.bubbles
			.data(this.data, (d) => d[0])
			.join("circle")
			.classed("bubble", true)
			.attr("cx", (d) => this.scaleX(d[0]) + this.scaleX.bandwidth() / 2)
			.attr("cy", (d) => this.scaleY(d[1]))
			.attr("r", (d) => this.scaleR(d[1]));
	}

	// Public API

	// The dataset parameter needs to be in a generic format,
	// so that it works for all future data
	// here we assume a [[k, v], ...] format for efficiency
	render(dataset) {
		this.data = dataset;
		this.#updateScales();
		this.#updateBubbles();
		this.#updateAxes();
		return this; // to allow chaining
	}

	setLabels(labelX = "categories", labelY = "values") {
		this.labelX.text(labelX);
		this.labelY.text(labelY);
		return this; // to allow chaining
	}
}
