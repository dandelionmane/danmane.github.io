function viz() {

var v = {};
var redGreenColorScale = new Plottable.Scale.InterpolatedColor(["#FF0000", "#FF8000", "#FFFF00", "#7FFF00", "#00FF00"]).range([-1, 1]);
var opacityScale = new Plottable.Scale.Linear().domain([0, 1]).range([0.1, 1]);
var X_DOMAIN = [-1.05, 1.05];
var Y_DOMAIN = [0, 5];
var CUTOFF = 0.4;
var SCALING_FACTOR = 0.4;

function generateInputChart(selection, distributionGen) {
  var confidenceDomain = ["totally unsure", "vague idea", "good guess", "pretty sure", "goddamn confident"];
  var ratingDescriptionDomain = ["sucks", "meh", "average", "good", "awesome"];
  var rating = 0;
  var confidence = 1;
  var distributionXScale = new Plottable.Scale.Linear().domain(X_DOMAIN);
  var distributionYScale = new Plottable.Scale.Linear().domain(Y_DOMAIN);

  var ordinalXScale = new Plottable.Scale.Ordinal().domain(ratingDescriptionDomain);
  var ordinalYScale = new Plottable.Scale.Ordinal().domain(confidenceDomain);

  var gridRenderer = new Plottable.Plot.Grid(generateBackgroundGridData(), ordinalXScale, ordinalYScale)
                          .project("fill", "rating", redGreenColorScale)
                          .project("opacity", "confidence", opacityScale)
                          .project("x", "ratingStr", ordinalXScale)
                          .project("y", "confidenceStr", ordinalYScale);
  var xAxis  = new Plottable.Axis.Category(ordinalXScale, "bottom");
  var yAxis  = new Plottable.Axis.Category(ordinalYScale, "left");
  distributionBarPlot = new Plottable.Plot.VerticalBar([], distributionXScale, distributionYScale)
                                      .project("y", 5, distributionYScale)
                                      .project("width", function(x) { return distributionXScale.scale(x.width) - distributionXScale.scale(0)})
                                      .project("height", 0, distributionYScale)
                                      .project("fill-opacity", 0)
                                      .project("stroke-width", 0)
                                      .project("stroke", function() {return "black"});
                                      // .project("fill", function() {return "#CCC"})
  var distributionAreaPlot = new Plottable.Plot.Area([], distributionXScale, distributionYScale)
                                  .project("y0", function() {return distributionYScale.range()[0]}, null)
                                  .project("fill", function() {return "#CCC"})
                                  .project("fill-opacity", 1);
  var center = gridRenderer.merge(distributionBarPlot).merge(distributionAreaPlot);
  var clickToSubmitInteraction  = new Plottable.Interaction.Click(center).callback(setParams).registerWithComponent();
  var nameLabel = new Plottable.Component.TitleLabel().text("Barack Obama");
  var traitLabel = new Plottable.Component.AxisLabel().text("Intelligence");

  var table = new Plottable.Component.Table([[null,  nameLabel ],
                                             [null,  traitLabel],
                                             [yAxis, center    ],
                                             [null,  xAxis    ]]);
  table.renderTo(selection);
  center.element.on("mousemove", function() {
    var xy = d3.mouse(center.element.node());
    setParams(xy[0], xy[1], true)
  });
  function setParams(px, py, doNotSubmit) {
    var x = distributionXScale.invert(px);
    var y = distributionYScale.invert(py);
    rating = x;
    confidence = y;
    if (rating >  1) rating =  1;
    if (rating < -1) rating = -1;
    update(doNotSubmit);
  }
  var hasInteracted = false
  function update(doNotSubmit) {
    var distribution = distributionGen(rating, confidence, CUTOFF, SCALING_FACTOR);
    var areadata = sample(distribution, -1.05, 1.05, 400);
    var w = 4/25 * Math.pow(1.7, 5-confidence);
    var bardata = [{width: w, x: rating - w/2}]
    distributionBarPlot.dataSource().data(bardata);
    distributionAreaPlot.dataSource().data(areadata);

  }
  update(true);


  function generateBackgroundGridData() {
    var rating2float = new Plottable.Scale.Ordinal().domain(ratingDescriptionDomain).range([-1, 1]);
    var confidence2float = new Plottable.Scale.Ordinal().domain(confidenceDomain).range([0, 1]);
    var gridData = [];
    confidenceDomain.forEach(function(c) {
      ratingDescriptionDomain.forEach(function(r) {
        var datum = {confidenceStr: c, ratingStr: r, confidence: confidence2float.scale(c), rating: rating2float.scale(r)};
        gridData.push(datum);
      });
    });
    return gridData;
  }

  function setNameAndTrait(name, trait) {
    nameLabel.text(name);
    traitLabel.text(trait);
  }
  return setNameAndTrait;

}
v.generateInputChart = generateInputChart;

return v;
}

