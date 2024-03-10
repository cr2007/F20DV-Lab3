
# F20DV Lab 3

<table>
	<tr>
		<td><b><a href="https://cr2007.github.io/F20DV-Lab2">← Lab 2</a></b></td>
		<td><b>Lab 3</b></td>
		<td><b>Lab 4 →</b></td>
	</tr>
</table>


[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/cr2007/F20DV-Lab3)

<div align="center">
	<table>
		<tr>
			<td><b><a href="lab3_tutorial9.html">Tutorial 9</a></b></td>
			<td><b><a href="lab3_tutorial10.html">Tutorial 10</a></b></td>
			<td><b><a href="lab3_tutorial11.html">Tutorial 11</a></b></td>
			<td><b><a href="lab3_tutorial12.html">Tutorial 12</a></b></td>
		</tr>
	</table>
</div>


## Interactions

- **Name:** Chandrashekhar Ramaprasad ([cr2007](mailto:cr2007@hw.ac.uk))
- **Course:** Data Visualization and Analytics ([**F20DV**](https://curriculum.hw.ac.uk/coursedetails/F20DV?termcode=202324))

---

#### Progress
![100%](https://progress-bar.dev/100)

- [X] [Highlight and Tooltips](#exercise-highlight-and-tooltips)
- [X] [Linked Selection and Filters](#exercise-linked-selection-and-filters)
- [X] [Let's Make an Animated Bar Chart](#exercise-lets-make-an-animated-bar-chart)
- [X] [D3 Behaviours Sandbox](#exercise-d3-behaviours-sandbox)

---

## Tutorial 9: D3 Selection and Events

[Lab 3 - Tutorial 9](https://cr2007.github.io/F20DV-Lab3/lab3_tutorial9.html)

#### Exercise: Highlight and Tooltips

In this exercise, we added two simple interactions with our bar charts for basic interaction with the charts.

Firstly, we implemented a way to highlight the Bar Charts when the mouse cursor was hovered over the bars.

Secondly, we added a simple tooltip text that is displayed to show additional information about the bars when the cursor is hovered over the bars.

### Code

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<script>hljs.highlightAll();</script>

<details>
<summary><code>barChart.js</code></summary>
<pre><code class="language-javascript">export default class BarChart {

// ...

    #updateBars() {
        this.bars = this.bars
            .data(this.data, (d) => d[0])
            // ...
            .on("mouseover", (event, datum) => {
            // Highlight the bar on cursor hover
                d3.select(event.target)
                .classed("highlighted", true)
            })
            .on("mouseout", (event, datum) => {
                // Remove the highlight on cursor out
                d3.select(event.target)
                .classed("highlighted", false)
            });

        // Add tooltips
        // Adds a title element to all bars
        this.bars.selectAll("title")
            .data(d => [d])
            .join("title")
            .text(d => `${d[0]}: ${d[1]}`);
    }

// ...

}
</code></pre>
</details>

---
<div align="right">
	<a href="#progress">Back To Top ↥</a>
</div>

## Tutorial 10: Linked Interactions

[Lab 3 - Tutorial 10](https://cr2007.github.io/F20DV-Lab3/lab3_tutorial10.html)

#### Exercise: Linked Selection and Filters


### Code

<details>
<summary><code>main.js</code></summary>
<pre><code class="language-javascript">"use strict";

import BarChart from './visualizations/barChart_tut10.js';

/***** Exercise: Linked Selection and Filters *****/
let data = await d3.csv("data/movies_mock.csv", d => {
    return {
        year: +d.release_year,
        revenues: parseFloat(d.revenues),
        genre: d.genre
    }
});

let bar1 = new BarChart("#bar1", 800, 400, [10, 40, 65, 10]),
    bar2 = new BarChart("#bar2", 800, 400, [10, 40, 65, 10]),
    bar3 = new BarChart("#bar3", 800, 400, [10, 40, 65, 10]);

let sortYears = (a, b) => a[0] - b[0];
let yearRevenues = d3.flatRollup(data, v => d3.sum(v, d => d.revenues), d => d.year).sort(sortYears),
    yearCount = d3.flatRollup(data, v => v.length, d => d.year).sort(sortYears),
    genreCount = d3.flatRollup(data, v => v.length, d => d.genre);

bar1.setLabels("Year", "Total Revenues")
    .render(yearRevenues);
bar2.setLabels("Year", "Total Number of Releases")
    .render(yearCount);
bar3.setLabels("Genre", "Total Number of Releases")
    .render(genreCount);

let highlightYear = (e, d) => {
    let year = d[0];
    bar1.highlightBars([year]);
    bar2.highlightBars([year]);
}

let rmvHighlightYear = (e, d) => {
    bar1.highlightBars();
    bar2.highlightBars();
}

bar1.setBarHover(highlightYear).setBarOut(rmvHighlightYear);
bar2.setBarHover(highlightYear).setBarOut(rmvHighlightYear);

let filterGenre = (e, d) => {
    let genre = d[0];
    let filteredData = data.filter(d => d.genre === genre),
        yearRevenuesFiltered = d3.flatRollup(filteredData, v => d3.sum(v, d => d.revenues), d => d.year).sort(sortYears),
        yearCountFiltered = d3.flatRollup(filteredData, v => v.length, d => d.year).sort(sortYears);

    bar1.setLabels("Year", `Revenues: ${genre}`)
        .render(yearRevenuesFiltered);
    bar2.setLabels("Year", `Number of Releases: ${genre}`)
        .render(yearCountFiltered);
}

bar3.setBarClick(filterGenre);
</code></pre>
</details>

<details>
<summary><code>barChart.js</code></summary>
<pre><code class="language-javascript">export default class BarChart {
    // Attributes

    // ...

    // Add Object attributes for storing callback references
    barClick = () => {};
    barHover = () => {};
    barOut   = () => {};

    // ...

    #updateBars() {
        this.bars = this.bars
            // ...

        // ...

        this.#updateEvents();

        // ...
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

    // ...

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
</code></pre>
</details>

---
<div align="right">
	<a href="#progress">Back To Top ↥</a>
</div>

## Tutorial 11: D3 Transitions

[Lab 3 - Tutorial 11](https://cr2007.github.io/F20DV-Lab3/lab3_tutorial11.html)

#### Exercise: Let's Make an Animated Bar Chart

Adds an animated element for the bar chart using D3 Transitions.

There is a visual feedback when `bar3` is clicked, showing an animation in `bar1` and `bar2`.

### Code
<details>
<summary><code>barChart.js</code></summary>
<pre><code class="language-javascript">export default class BarChart {
    // ...

    #updateBars() {
        // Bind and join rectangles to data
        this.bars = this.bars
        .data(this.data, (d) => d[0])
        .join(
            // Initial placement of new rectangles
            enter => enter.append("rect")
                    .attr("x", (d) => this.scaleX(d[0]))
                    .attr("y", (d) => this.scaleY(0)) // Aligned at Bottom
                    .attr("width", this.scaleX.bandwidth())
                    .attr("height", 0), // No height
            // Leave existing rectangles untouched
            update => update,
            exit => exit.transition().duration(300)
                    .attr("y", d => this.scaleY(0)) // Aligned at bottom
                    .attr("height", 0) // No Height
                    .remove() // Destroy rectangle when finished
        )
        .classed("bar", true);

        // Animate Placement and sizing (enter + update only)
        this.bars.transition().duration(500)
            .attr("x", (d) => this.scaleX(d[0]))
            .attr("y", (d) => this.scaleY(d[1]))
            .attr("width", this.scaleX.bandwidth())
            .attr("height", (d) => this.scaleY(0) - this.scaleY(d[1]));
    }
}
</code></pre>
</details>

---
<div align="right">
	<a href="#progress">Back To Top ↥</a>
</div>

## Tutorial 12: Advanced Behaviours

[Lab 3 - Tutorial 12](https://cr2007.github.io/F20DV-Lab3/lab3_tutorial12.html)

#### Exercise: D3 Behaviours Sandbox


### Code
<details>
<summary><code>main.js</code></summary>
<pre><code class="language-javascript">

</code></pre>
</details>

---
<div align="right">
	<a href="#progress">Back To Top ↥</a>
</div>
