/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

// Define Margins and Dimensions
var margins = { left: 100, bottom: 100, top: 50, right: 30 };
var width = 600 - margins.left - margins.right;
var height = 500 - margins.top - margins.bottom;

// Set up SVG
var g = d3
	.select("#chart-area")
	.append("svg")
	.attr("width", width + margins.left + margins.right)
	.attr("height", height + margins.bottom + margins.top)
	.append("g")
	.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// Y Scale
var y = d3
	.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

// X Scale
var x = d3
	.scaleLog()
	.base(10)
	.domain([300, 150000])
	.range([0, width]);

// Append X and Y Axes
var xAxisGroup = g
	.append("g")
	.attr("class", "x axis")
	// To move it to the bottom
	.attr("transform", "translate(0, " + height + ")");
var xAxisCall = d3
	.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));
xAxisGroup.call(xAxisCall);

var yAxisGroup = g.append("g").attr("class", "y axis");
var yAxisCall = d3.axisLeft(y);
yAxisGroup.call(yAxisCall);

var yAxisGroup = g.append("g").attr("class", "y axis");

d3.json("data/data.json").then(function(data) {
	// console.log(data);

	// Clean Data
	const cleanedData = data.map(function(year) {
		return year["countries"]
			.filter(function(country) {
				var notNull = country.income && country.life_exp;
				return notNull;
			})
			.map(function(country) {
				country.income = +country.income;
				country.life_exp = +country.life_exp;
				return country;
			});
	});

	// console.log(cleanedData);

	// JOIN new data with old elements
	var circles = g.selectAll('circle').data(cleanedData[0], function(d){
		return d.country
	})

	// EXIT old elementsnot present in new data
	// circles.exit().attr('class', 'exit').remove()

	// ENTER and UPDATE
	circles.enter()
		.append('circle')
			.attr('class', 'enter')
			.attr('cy', function(d){
				return y(d.life_exp)
			})
			.attr('cx', function(d){
				return x(d.income)
			})
			.attr('r', 5)
});
