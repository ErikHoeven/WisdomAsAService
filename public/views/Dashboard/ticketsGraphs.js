/**
 * Created by erik on 8/27/17.
 */
function plotGraph (div, ds) {
    console.info('plotGraph...')
// ------------------Data ---------------------------------------------------
    var label = moment(ds[0].key).format('YYYY-MM-DD')
        , rest = ds[0].value
        ,labels = Object.keys(rest)
        , dsArray = []
    labels.forEach(function (label) {
        dsArray.push({label: label, y: ds[0].value[label]})
    })

// ------------------Build Grapph ---------------------------------------------------
    var chart = new CanvasJS.Chart(div, {
        theme: "theme2",//theme1
        title:{
            text: "Tickets per Group"
        },
        animationEnabled: true,   // change to true
        data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "column",
                dataPoints: dsArray
            }
        ]
    });
    chart.render();

}

function d3GraphPlot(div, ds) {
    console.info('d3GraphPlot')

    console.info(ds)
    console.info('ds')
    var data = [], object = {}

    ds.forEach(function (e) {
        object.snapshot = e.key
        object = Object.assign(object,e.value)
        data.push(object)
    })

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1500 ,
        height = 1500;

    var x0 = d3.scaleBand()
        .range([0, width], .1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.axisBottom(x0)
    var yAxis = d3.axisLeft(y)
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#ticketChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "snapshot"; });
    console.info(ageNames)


    data.forEach(function(d) {
        d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });
    console.info('To Ages')
    console.info(data)

    x0.domain(data.map(function(d) { return d.Groups; }));
    x1.domain(ageNames).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    var state = svg.selectAll(".groups")
        .data(data)
        .enter().append("g")
        .attr("class", "groups")
        .attr("transform", function(d) { return "translate(" + x0(d.Groups) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
        .enter().append("rect")
        .attr("width", x1.range())
        .attr("x", function(d) { console.info(d.name)
            return x1(d.name); })
        .attr("y", function(d) { console.info(y(d.value))
            return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(ageNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });


}
