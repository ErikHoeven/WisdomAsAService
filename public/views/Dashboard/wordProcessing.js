/**
 * Created by erik on 2/3/18.
 */
function getWordCloud(div, lstWord) {
    console.info('WordCloud')
    console.info(lstWord)

    var cloud = d3.layout.cloud;
    var fill = d3.schemeCategory20
    var layout = cloud()
        .size([500, 500])
        .words(lstWord.map(function (d) {
            return {text: d, size: 10 + Math.random() * 90, test: "haha"};
        }))
        .padding(5)
        .rotate(function () {
            return ~~(Math.random() * 1) * 90;
        })
        .font("Impact")
        .fontSize(function (d) {
            return d.size;
        })
        .on("end", draw);

    layout.start();
}

function draw(words) {
    d3.select(div).append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return '#000'; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}