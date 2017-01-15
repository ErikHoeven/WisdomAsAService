/**
 * Created by erik on 12/30/16.
 */


function plotSocialGrah(jsonGraph,Tweets){


var graph = jsonGraph
var nodes = graph.nodes
var aantallen = []
var filter = 0



nodes.forEach(function (item) {
    aantallen.push(item.aantal)
})


var invalidEntries = 0
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));


    var RadiusScale = d3.scaleLinear()
        .domain([0,d3.max(aantallen)])
        .range([0,18]);

    var legendaNames =
        graphStructure.nodes.filter(filterLegendaNames)

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
                return groupRadius(d)
            } )
            .attr("fill", function(d) { return  '#'+d.color  })
            .style("stroke-width", "2px")
            .on("mouseover", function (d) {
                showPopover.call(this, d); })
            .on("mouseout",  function (d) { removePopovers(); })
            .on("click", function (d) {   if (d.type == 'child'){
                                                filter = filterTweetsOnWord({cattegorie: d.group, corpus: d.id, type: d.type})
                                            }
                                            if (d.type == 'parent'){
                                                filter = filterTweetsOnWord({cattegorie: d.id, corpus: null, type: d.type, group: d.group  })
                                            }
                                            if (d.type == 'master') {
                                                filter = filterTweetsOnWord({cattegorie: d.id, corpus: null, type: d.type})
                                            }})
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
            if (d.type == 'parent' ){
                output = 18 }
            if (d.type == 'master'){
                output = 20
            }
            else {
                output = Math.floor(RadiusScale(d.aantal)) + 3 //5
            }
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

    function showPopover (d) {
        $(this).popover({
            title: d.id,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html: true,
            content: function () {
                return  "Aantal tweets: " + d.aantal
            }
        });
        $(this).popover('show')
        }

        function removePopovers() {
            $('.popover').each(function () {
                $(this).remove();
            });
        }

        function filter(data){
            var corpus, cattegorie


            if (data.type == 'child'){
                corpus = data.id
            }


        }

    var childInvalidEntries = 0
    function  filterLinkChildStructure (links){
        if (links.source.type == 'child') {
            return true
        }
        else {
            childInvalidEntries++
            return false
        }

    }


}


