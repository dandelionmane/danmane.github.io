
var Chart = (function () {
    function Chart(container, height, width, xScale, yScale, data) {
        this.height = height;
        this.width = width;
        this.xScale = xScale;
        this.yScale = yScale;
        this.data = data;
        this.setupDOM(container);
        this.setupD3Objects();
        this.initialRender();
    }
    Chart.prototype.setupD3Objects = function () {
        var formatter = d3.time.format("%b");
        this.xAxis = new Axis.Axis(this.xAxisContiner, this.xScale, "bottom", formatter);
        this.yAxis = new Axis.Axis(this.yAxisContiner, this.yScale, "left", null);
        this.lineRenderer = new MultiLineRenderer.MultiLineRenderer(this.plot, this.data, Chart.dataAttributesToDraw, this.xScale, this.yScale);
    };

    Chart.prototype.setupDOM = function (container) {
        this.div = container.append("div").attr("height", this.height).attr("width", this.width).classed("chart-outer", true);
        this.svg = this.div.append("svg").attr("height", this.height).attr("width", this.width).classed("chart-inner", true);
        this.height -= Chart.margin.top + Chart.margin.bottom;
        this.width -= Chart.margin.left + Chart.margin.right;

        this.plot = this.svg.append("g").classed("plot", true);

        this.xAxisContiner = this.svg.append("g").classed("axis-container", true).classed("x-axis", true).attr("transform", "translate(0," + this.height + ")");

        this.yAxisContiner = this.svg.append("g").classed("axis-container", true).classed("y-axis", true).attr("transform", "translate(25)");
    };

    Chart.prototype.initialRender = function () {
        var dateDomain = d3.extent(this.data, function (d) {
            return d.date;
        });
        var rangeDomain = [100, 0];
        this.xScale.domain(dateDomain);
        this.yScale.domain(rangeDomain);

        this.xAxis.render();
        this.yAxis.render();
        this.lineRenderer.render();
    };

    Chart.prototype.rerender = function (translate, scale) {
        PerfDiagnostics.toggle("axis");
        this.xAxis.transform(translate, scale);
        this.yAxis.transform(translate, scale);
        PerfDiagnostics.toggle("axis");
        PerfDiagnostics.toggle("transform");
        this.lineRenderer.transform(translate, scale);
        PerfDiagnostics.toggle("transform");
    };
    Chart.margin = { top: 20, right: 20, bottom: 30, left: 60 };
    Chart.dataAttributesToDraw = ["avg", "hi", "lo"];
    return Chart;
})();

var ChartGen = (function () {
    function ChartGen(fileNames, meterEnabled) {
        this.meterEnabled = meterEnabled;
        this.makeCharts(fileNames);
    }
    ChartGen.prototype.setupZoomCoordinator = function (xScale, yScale) {
        this.zoomCoordinator = new ZoomCoordinator(this.charts, xScale, yScale, this.chartWidth, this.chartHeight, this.meterEnabled);
    };

    ChartGen.prototype.makeCharts = function (fileNames) {
        var _this = this;
        this.charts = [];
        var numCharts = fileNames.length;
        var containerSelection = d3.select("body");
        var chartsToSide = Math.ceil(Math.sqrt(numCharts));
        this.chartWidth = window.innerWidth / chartsToSide - 30;
        this.chartHeight = window.innerHeight / chartsToSide - 10;
        var xScale = d3.time.scale().range([0, this.chartWidth]);
        var yScale = d3.scale.linear().range([0, this.chartHeight]);
        var readyFunction = Utils.readyCallback(numCharts, function () {
            return _this.setupZoomCoordinator(xScale, yScale);
        });
        fileNames = fileNames.slice(0, numCharts);
        fileNames.forEach(function (fileName) {
            fileName = "Data/" + fileName;
            d3.csv(fileName, function (error, data) {
                var parsedData = Utils.processCSVData(data);
                _this.charts.push(new Chart(containerSelection, _this.chartHeight, _this.chartWidth, xScale, yScale, parsedData));
                readyFunction();
            });
        });
    };
    return ChartGen;
})();

var ZoomCoordinator = (function () {
    function ZoomCoordinator(charts, xScale, yScale, width, height, meterEnabled) {
        if (typeof meterEnabled === "undefined") { meterEnabled = true; }
        var _this = this;
        this.charts = charts;
        this.xScale = xScale;
        this.yScale = yScale;
        this.meterEnabled = meterEnabled;
        this.zooms = charts.map(function (c, id) {
            var z = d3.behavior.zoom();
            z.id = id;
            z(c.div);
            z.on("zoom", function () {
                return _this.synchronize(z);
            });
            z.x(_this.xScale);
            z.y(_this.yScale);
            z.size([width, height]);
            return z;
        });
        if (this.meterEnabled) {
            this.meter = new FPSMeter();
        }
    }
    ZoomCoordinator.prototype.synchronize = function (zoom) {
        PerfDiagnostics.toggle("total");
        var translate = zoom.translate();
        var scale = zoom.scale();
        var hasUniqId = function (z) {
            return z.id != zoom.id;
        };
        this.zooms.filter(hasUniqId).forEach(function (z) {
            z.translate(translate);
            z.scale(scale);
        });
        this.charts.forEach(function (c) {
            c.rerender(translate, scale);
        });
        if (this.meterEnabled)
            this.meter.tick();
        PerfDiagnostics.toggle("total");
    };
    return ZoomCoordinator;
})();
d3.json("data/chartSettings.json", function (error, data) {
    var meterEnabled = data.meterEnabled;
    var cities = data.cities;
    var fileNames = _.pluck(cities, "fileName");

    var cg = new ChartGen(fileNames, meterEnabled);
    window.charts = cg.charts;
});
//# sourceMappingURL=chart.js.map
