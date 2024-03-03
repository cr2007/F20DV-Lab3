"use strict";

import BarChart from './visualizations/barChart_tut11.js';

console.log(`d3.version: ${d3.version}`);

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
