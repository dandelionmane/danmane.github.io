var MultiLineRenderer;
(function (_MultiLineRenderer) {
    var MultiLineRenderer = (function () {
        function MultiLineRenderer(container, data, attributes, xScale, yScale) {
            var _this = this;
            this.data = data;
            this.attributes = attributes;
            this.xScale = xScale;
            this.yScale = yScale;
            this.renderArea = container.append("g").classed("render-area", true);
            this.renderers = this.attributes.map(function (attribute) {
                var line = d3.svg.line().x(function (d) {
                    return _this.xScale(d.date);
                }).y(function (d) {
                    return _this.yScale(d[attribute]);
                });
                var element = _this.renderArea.append("path").classed("line", true).classed(attribute, true).datum(_this.data);
                return {
                    attribute: attribute,
                    line: line,
                    element: element
                };
            });
        }
        MultiLineRenderer.prototype.render = function () {
            this.renderers.forEach(function (r) {
                r.element.attr("d", r.line);
            });
        };

        MultiLineRenderer.prototype.transform = function (translate, scale) {
            this.renderArea.attr("transform", "translate(" + translate + ") scale(" + scale + ")");
        };
        return MultiLineRenderer;
    })();
    _MultiLineRenderer.MultiLineRenderer = MultiLineRenderer;
})(MultiLineRenderer || (MultiLineRenderer = {}));
//# sourceMappingURL=multiLineRenderer.js.map
