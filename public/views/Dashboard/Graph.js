$(document).ready(function(){

/**
 * Created by erik on 12/30/16.
 */
var invalidEntries = 0
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));



    var graph = graphStructure


    var legendaNames =
        graphStructure.nodes.filter(filterLegendaNames)
    console.info(legendaNames)
    //console.info(graph)

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", function (d)  {
                return groupRadius(d.type)
            } )
            .attr("fill", function(d) { return  '#'+d.color  })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));



    //Add legend to the SVG Area
    var legend = svg.selectAll(".legend")
        .data(legendaNames)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 150)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d) { return '#' + d.color})
        .style("stroke", "grey");
    legend.append("text")
        .attr("x", width - 70)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d.id; });


        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);





        //console.info(graph.links)



        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }


    function groupRadius (d) {
        var output
            if (d == 'parent'){
                output = 10 }
            if (d == 'master'){
                output = 15
            }
            else {
                output = 5 }
        return output
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

function filterLegendaNames (obj) {
    if ('type' in obj && obj.type == 'master'){
        return true
    }
    else {
        return false
        invalidEntries++
    }
}


})