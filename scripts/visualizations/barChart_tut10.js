export default class BarChart {
	// Attributes (you can make those private too)
	width; height; margin;    // Size
	svg; chart; bars;         // Selections
	axisX; axisY;             // Axes
	labelX; labelY;           // Labels
	scaleX; scaleY;           // Scales
	data;                     // Internal Data

	// Add Object attributes for storing callback references
	barClick = () => {};
	barHover = () => {};
	barOut   = () => {};

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
			.classed("barchart", true)
			.attr("width", width).attr("height", height);

		this.chart = this.svg.append("g")
			.attr("transform", `translate(${this.margin[2]}, ${this.margin[0]})`);

		this.bars = this.chart.selectAll("rect.bar");

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
			.attr("transform", `translate(0, ${this.margin[0]})rotate(-90)`)
			.style("text-anchor", "end").attr("dy", 15);
	}

	#updateScales() {
		let chartWidth = this.width - this.margin[2] - this.margin[3],
			chartHeight = this.height - this.margin[0] - this.margin[1];

		let rangeX = [0, chartWidth],
			rangeY = [chartHeight, 0];

		let domainX = this.data.map((d) => d[0]),
			domainY = [0, d3.max(this.data, (d) => d[1])];

		this.scaleX = d3.scaleBand(domainX, rangeX).padding(0.2);
		this.scaleY = d3.scaleLinear(domainY, rangeY);
	}

	#updateAxes() {
		let axisGenX = d3.axisBottom(this.scaleX),
			axisGenY = d3.axisLeft(this.scaleY);

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
			.attr("x", (d) => this.scaleX(d[0]))
			.attr("y", (d) => this.scaleY(d[1]))
			.attr("width", this.scaleX.bandwidth())
			.attr("height", (d) => this.scaleY(0) - this.scaleY(d[1]));

		this.#updateEvents();

		// Add tooltips
		// Adds a title element to all bars
		this.bars.selectAll("title")
			.data(d => [d])
			.join("title")
			.text(d => `${d[0]}: ${d[1]}`);
	}

	#updateEvents() {
		// Rebind these callbacks to events
		this.bars
			.on("mouseover", this.barHover)
			.on("mouseout", this.barOut)
			.on("click", (e, d) => {
				console.log(`Bar Clicked: ${d}`);
				this.barClick(e, d);
			});
	}

	// Public API

	// The dataset parameter needs to be in a generic format,
	// so that it works for all future data
	// here we assume a [[k, v], ...] format for efficiency
	render(dataset) {
		this.data = dataset;
		this.#updateScales();
		this.#updateBars();
		this.#updateAxes();
		return this; // to allow chaining
	}

	setLabels(labelX = "categories", labelY = "values") {
		this.labelX.text(labelX);
		this.labelY.text(labelY);
		return this; // to allow chaining
	}

	setBarClick(f = () => {}) {
		// Register new callback
		this.barClick = f;

		// Rebind callback to event
		this.#updateEvents();

		// Return this for chaining
		return this;
	}

	setBarHover(f = () => {}) {
		// Register new callback
		this.barHover = f;

		// Rebind callback to event
		this.#updateEvents();

		// Return this for chaining
		return this;
	}

	setBarOut(f = () => {}) {
		// Register new callback
		this.barOut = f;

		// Rebind callback to event
		this.#updateEvents();

		// Return this for chaining
		return this;
	}

	highlightBars(keys = []) {
		// Reset Highlight for all bars
		this.bars.classed("highlighted", false);

		// Filter bars and set new highlights
		this.bars.filter(d => keys.includes(d[0]))
			.classed("highlighted", true);

		return this; // to allow chaining
	}
}
