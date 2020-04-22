/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

// Define Margins and Dimensions
var margins = { left: 100, bottom: 100, top: 50, right: 30 };
var width = 600 - margins.left - margins.right;
var height = 500 - margins.top - margins.bottom;

var year = 0;

// Set up SVG
var g = d3
	.select("#chart-area")
	.append("svg")
	.attr("width", width + margins.left + margins.right)
	.attr("height", height + margins.bottom + margins.top)
	.append("g")
	.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// Add Tooltip
var tip = d3
	.tip()
	.attr("class", "d3-tip")
	.html(function(d) {
		return d;
	});
g.call(tip);

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

// Radius Scale (population)
var pop_area = d3
	.scaleLinear()
	.domain([2000, 1500000000])
	// .domain([2000, 1400000000])
	.range([25 * Math.PI, 1200 * Math.PI]);

var yellow = d3.interpolateYlGn(0), // "rgb(255, 255, 229)"
	yellowGreen = d3.interpolateYlGn(0.5), // "rgb(120, 197, 120)"
	green = d3.interpolateYlGn(1); // "rgb(0, 69, 41)"

// Ordinal Scale for Country colors
var color = d3.scaleOrdinal(d3.schemePaired);
// var color = d3.scaleOrdinal(d3.schemeBlues[9])
// var color = d3.scaleOrdinal(d3.schemeDark2)
// var color = d3.scaleOrdinal(d3.schemeSet1)

// Y LABEL
var yLabel = g
	.append("text")
	.attr("y", -60)
	.attr("x", -(height / 2))
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)");

// X LABEL
var xLabel = g
	.append("text")
	.attr("y", height + 60)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");

var yearLabel = g
	.append("text")
	.attr("y", height - 10)
	.attr("x", width - 40)
	.attr("font-size", "30px")
	.attr("opacity", "0.3")
	.attr("text-anchor", "middle")
	.text("1800");

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

// Add Legend
var continents = ["europe", "asia", "americas", "africa"];

var legend = g
	.append("g")
	.attr("transform", "translate(" + (width - 10) + "," + (height - 125) + ")");

continents.forEach(function(continent, i) {
	var legendRow = legend
		.append("g")
		.attr("transform", "translate(0, " + i * 20 + ")");

	// Add legend color
	legendRow
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", color(continent));

	// Add legend text
	legendRow
		.append("text")
		.attr("x", -10)
		.attr("y", 10)
		.attr("text-anchor", "end")
		.style("text-transform", "capitalize")
		.text(continent);
});

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

	// Add in interval loop
	// Add an update
	d3.interval(function() {
		year = year < 214 ? year + 1 : 0;
		update(cleanedData[year]);
	}, 100);
	// update(cleanedData[0]);
});

function update(data) {
	// Transition variable
	var t = d3.transition().duration(50);

	// JOIN new data with old elements
	var circles = g.selectAll("circle").data(data, function(d) {
		return d.country;
	});

	// EXIT old elementsnot present in new data
	circles
		.exit()
		.attr("class", "exit")
		.remove();

	// ENTER and UPDATE
	circles
		.enter()
		.append("circle")
		.attr("class", "enter")
		.attr("fill", function(d) {
			return color(d.continent);
		})
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		// .attr("cy", function(d) {
		// 	return y(d.life_exp);
		// })
		// .attr("cx", function(d) {
		// 	return x(d.income);
		// })
		// .attr("r", 5)
		// UPDATE
		.merge(circles)
		.transition(t)
		.attr("class", "enter")
		.attr("cy", function(d) {
			return y(d.life_exp);
		})
		.attr("cx", function(d) {
			return x(d.income);
		})
		.attr("r", function(d) {
			return Math.sqrt(pop_area(d.population) / Math.PI);
			// return pop(d.population) / Math.PI
		});

	// Update year label
	yearLabel.text(+(year + 1800));
}
