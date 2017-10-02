function graphBars(id, data, attribute, comparator) {

	d3.select("#"+id).selectAll("div.h-bar")
		.data(data)
		.enter()
		.append("div")
		.attr("class", "h-bar")
		.append("span")

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

var compare = function(attribute) {
	return function(a, b) {
		return a[attribute] < b[attribute] ? 1 : -1
	}
}

var moviesProfit = function(data) {
	for (var i=0; i < data.length; i++) {
		data[i].Profit = data[i].Worldwide_Gross_M - data[i].Budget_M
	}
	return data
}

var groupByGenre = function(data) {
	var genres = {}
	for (var i=0; i < data.length; i++) {
		if(genres[data[i].Genre] == undefined)
			genres[data[i].Genre] = 0
		genres[data[i].Genre] += data[i].Worldwide_Gross_M
	}

	var dataGenres = []
	Object.keys(genres).forEach(function(key, index) {
		dataGenres.push({
			"Film": key,
			"Worldwide_Gross_M": genres[key]
		})
	})

	return dataGenres
}
