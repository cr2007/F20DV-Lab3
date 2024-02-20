
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
![25%](https://progress-bar.dev/25)

- [X] [Highlight and Tooltips](#exercise-highlight-and-tooltips)
- [ ] [Linked Selection and Filters](#exercise-linked-selection-and-filters)
- [ ] [Let's Make an Animated Bar Chart](#exercise-lets-make-an-animated-bar-chart)
- [ ] [D3 Behaviours Sandbox](#exercise-d3-behaviours-sandbox)

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
<pre><code class="language-javascript">

</code></pre>
</details>

---
<div align="right">
	<a href="#progress">Back To Top ↥</a>
</div>

## Tutorial 11: D3 Transitions

[Lab 3 - Tutorial 11](https://cr2007.github.io/F20DV-Lab3/lab3_tutorial11.html)

#### Exercise: Let's Make an Animated Bar Chart


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
