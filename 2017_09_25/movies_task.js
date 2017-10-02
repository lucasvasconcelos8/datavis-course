//function to create bars graphs with a json data, the attribute to measure and a comparator function
function graphBars(id, data, attribute, comparator) {

	d3.select("#"+id).selectAll("div.h-bar")
		.data(data)
		.enter()
		.append("div")
		.attr("class", "h-bar")
		.append("span")

	//transform type div to number for color pattern
	let numberTo = {
		"box_office" : 1,
		"budget" : 2,
		"profit": 3,
		"box_office_by_genre" : 4
	}

  	let pixels = window.screen.width

	let max = d3.max(data, function(d) {
		return d[attribute]
	})

	//create a range of colors for each graph
	let colorScale = d3.scaleLinear()
        .domain([1, 4])
        .range(["#ff0234", "#04a4c7"]);

	d3.select("#"+id).selectAll("div.h-bar")
		.data(data).attr("class", "h-bar")
		.style("width", function (d) {
            return (d[attribute] * pixels /max) + "px";
        })
		.style("background-color", function(d){
						return colorScale(numberTo[id]);
				})
        .select("span").text(function (d) {
            return d.Film + " - $" + d[attribute];
        });

    if(comparator)
        d3.select("#"+id)
            .selectAll("div.h-bar")
            .sort(comparator(attribute));
}

//function to compare attribute in descending order
var compare = function(attribute) {
	return function(a, b) {
		return a[attribute] < b[attribute] ? 1 : -1
	}
}

//function to calculate the profit from each movie (Box Office - Budget)
var moviesProfit = function(data) {
	for (var i=0; i < data.length; i++) {
		data[i].Profit = data[i].Worldwide_Gross_M - data[i].Budget_M
	}
	return data
}

//function to group movies by genre and the box office for each genre
var groupByGenre = function(data) {

	var genres = {}
	//iterate in each data and sum box_office for each genre
	for (var i=0; i < data.length; i++) {
		if(genres[data[i].Genre] == undefined)
			genres[data[i].Genre] = 0
		genres[data[i].Genre] += data[i].Worldwide_Gross_M
	}

	//create a list of dicts with the genre and your respective box_office(SUM). 
	//OBS: the field with genre name is "Film" because it helps to generate graph bars with one function
	var dataGenres = []
	Object.keys(genres).forEach(function(key, index) {
		dataGenres.push({
			"Film": key,
			"Worldwide_Gross_M": genres[key]
		})
	})

	return dataGenres
}
