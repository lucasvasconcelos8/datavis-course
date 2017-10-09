//function to create bars graphs with a json data with DC.js, the attribute to measure
//imagine: attribute"Worlwide_Gross"
//		   group "Year"
function graphBarsDC(id, attribute, group) {

    var bar_graph = dc.barChart("#"+id);
	
	d3.json("movies.json", function(error, data){

	
		//criando um crossfilter
        var facts = crossfilter(data);

        var groupDim = facts.dimension(function(d){
                return d[group];
            });

        var attributeGroupBy = groupDim.group().reduceSum(function(d){
                return d[attribute];
            });

        bar_graph.width(768)
				 .height(480)
				 .margins({top: 60, right: 60, bottom: 60, left: 60})
				 .brushOn(false)
                 .dimension(groupDim)
                 .yAxisLabel(attribute)
                 .xAxisLabel(group)
                 .x(d3.scale.ordinal().range([2007,2012]))
                 .xUnits(dc.units.ordinal)
                 .group(attributeGroupBy, group);

        bar_graph.render();

	});
}