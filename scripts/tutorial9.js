"use strict";

import BarChart from './visualizations/barChart_tut9.js';

console.log(`d3.version: ${d3.version}`);

let cities = [
	{ city: "Edinburgh", pop: 506000, area: 119, alt: 47 },
	{ city: "Dubai", pop: 3604000, area: 1610, alt: 5 },
	{ city: "Putrajaya", pop: 109000, area: 49, alt: 38 },
	{ city: "Qingdao", pop: 10071000, area: 11228, alt: 25 },
	{ city: "Lagos", pop: 8048000, area: 1171, alt: 41 },
	{ city: "Ottawa", pop: 1017000, area: 2790, alt: 70 },
];

/***** Exercise: Highlight and Tooltips *****/
let bar1 = new BarChart("div#bar1", 700, 400, [10, 40, 45, 20]);
let citiesElevation = cities.map((d) => [d.city, d.alt]);
bar1.render(citiesElevation);
