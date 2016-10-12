//$(document).ready(function() {
$('#tblBusinessRules').hide();

// Modules

  function loadLineGraph(data, filter, minmax ){
    console.info('loadLineGraph');
    console.info(isNaN(data[0].Data[0].dim));

// DataPreparation for multiple serie
    // Prepare SVG properties
    var margin = {top: 70, right: 70, bottom: 70, left: 100},

        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      if (filter ==  'ActualMonth' || filter ==  'ActualWeek' ){
          width = 400 - margin.left - margin.right


      }



    // Determine if it must be a Time scale or Ordinal scale
    if(isNaN(data[0].Data[0].dim) == true){
        console.info('TimeScale');
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var x = d3.time.scale()
            .range([0, width]);
    }
    if(isNaN(data[0].Data[0].dim) == false) {
        console.info('OrdinalScale');
        var x = d3.scale.ordinal()
            .range([0, width]);

      }


    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        //.tickFormat(d3.time.format("%d-%m"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            console.info(d);
            return x(d.dim);
        })
        .y(function (d) {
            return y(d.measure);
        });


    var svg = d3.select("#lineChartSimple").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      console.info('Loop Through data');
      console.info(data);

      if(filter ==  'ActualMonth' ){
        console.info(filter)

      }
      else {
         console.info('Adjust data to be fit on timescale');
         data.forEach(function (kv) {
             kv.Data.forEach(function (d) {
                 d.dim = parseDate(d.dim);
             });
          });

      }




    var serieData = data;
    var varNames = [];

    data.forEach( function (a) {

        if (a.cattegorie){
        varNames.push({cattegorie: a.cattegorie, kleur: a.kleur})
        }
        });
      console.info(minmax);
    if (filter ==  'ActualMonth' ) {
        x.domain([minmax.min_dim, minmax.max_dim]);
        y.domain([0, minmax.max_measure]);
    }

    else if(filter ==  'ActualWeek' ){
        x.domain([format.parse(minmax.min_dim), format.parse(minmax.max_dim)]);
        y.domain([0, minmax.max_measure])

      }
    else {
        x.domain([format.parse(domainValues.minDimensionValue), format.parse(domainValues.maxDimesnionValue)]);
        y.domain([0, domainValues.maxMeasure]);

    }


    svg.append("g")
        .attr("class", "x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
//        .append("text")
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .attr("y", 15)
        .attr("x", 9)
        .attr("dy", ".35em");

    svg.append("g")
        .attr("class", "y")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var serie = svg.selectAll(".cattegorie")
        .data(serieData)
        .enter().append("g")
        .attr("class", "cattegorie");

    serie.append("path")
        .attr("class", "simpleLine")
        .attr("d", function (d) {
            return line(d.Data);
        })
        .style("stroke", function (d) {
            console.info(d);
            return '#' + d.kleur;
        });

    // Add the scatterplot
    serie.selectAll(".point")
        .data(function (d) { return d.Data; })
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function (d) { return x(d.dim) ; })
        .attr("cy", function (d) { return y(d.measure); })
        .attr("r", "5px")
        .style("fill", function (d) {
           return '#' + d.kleur; })
        .style("stroke", "grey")
        .style("stroke-width", "2px")
        .on("mouseover", function (d) {
            showPopover.call(this, d); })
        .on("mouseout",  function (d) { removePopovers(); })
        .on("click", function (d) { showTable(d); });


    //Add legend to the SVG Area
    var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d) { return '#' + d.kleur})
        .style("stroke", "grey");
    legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d.cattegorie; });

    function removePopovers () {
        $('.popover').each(function() {
            $(this).remove();
        });
    }
    function showPopover (d) {
        $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html: true,
            content: function () {
                return "Cattegorie: " + d.Cattegorie +
                    "<br/>Waarde: " + d.measure
            }
        });
        $(this).popover('show')
    }

    function showTable (d){

         var tblTweets  = [];
         var tblHeaders = [];
         var tblBodyHTML = "";
         var tblHeadersHTML = "";
          $(".table-hover").empty();
        stgTweets.forEach(function(a){

          if(format(d.dim) == a.postDate && d.Cattegorie == a.tweetCattegorie) {
              tblTweets.push(a)
          }
    });

        var tblBodyHTML = "<tbody>";

        tblTweets.forEach(function(a){
            tblBodyHTML =  tblBodyHTML + "<tr><td>"+ a.postDate +"</td><td>"+ a.text +"</td><td>" + a.userFollowerCount + "</td></tr>"
        });
        tblBodyHTML = tblBodyHTML + "</tbody>";
        tblHeadersHTML = " <thead> <tr><th>postDate</th><th>tweetbody</th><th>followerCount</th> </tr></thead>";
        $(".table-hover").append(tblHeadersHTML + tblBodyHTML)
    }



        }



//});