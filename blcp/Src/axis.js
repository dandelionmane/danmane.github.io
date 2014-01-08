var Axis;
(function (_Axis) {
    var Axis = (function () {
        function Axis(container, scale, orientation, formatter) {
            this.container = container;
            this.scale = scale;
            this.orientation = orientation;
            this.formatter = formatter;
            this.d3axis = d3.svg.axis().scale(this.scale).orient(this.orientation);
            this.axisEl = this.container.append("g").classed("axis", true);
            if (this.formatter != null) {
                this.d3axis.tickFormat(formatter);
            }
            this.cachedScale = 1;
            this.cachedTranslate = 0;
            this.isXAligned = this.orientation === "bottom" || this.orientation === "top";
        }
        Axis.axisXTransform = function (selection, x) {
            selection.attr("transform", function (d) {
                return "translate(" + x(d) + ",0)";
            });
        };

        Axis.axisYTransform = function (selection, y) {
            selection.attr("transform", function (d) {
                return "translate(0," + y(d) + ")";
            });
        };

        Axis.prototype.transformString = function (translate, scale) {
            var translateS = this.isXAligned ? "" + translate : "0," + translate;
            return "translate(" + translateS + ")";
        };

        Axis.prototype.render = function () {
            var domain = this.scale.domain();
            var extent = Math.abs(domain[1] - domain[0]);
            var min = +d3.min(domain);
            var max = +d3.max(domain);
            var newDomain;
            var standardOrder = domain[0] < domain[1];
            if (typeof (domain[0]) == "number") {
                newDomain = standardOrder ? [min - extent, max + extent] : [max + extent, min - extent];
            } else {
                newDomain = standardOrder ? [new Date(min - extent), new Date(max + extent)] : [new Date(max + extent), new Date(min - extent)];
            }
            var copyScale = this.scale.copy().domain(newDomain);
            var ticks = copyScale.ticks(30);
            this.d3axis.tickValues(ticks);

            this.axisEl.call(this.d3axis);
        };

        Axis.prototype.rescale = function () {
            var tickTransform = this.isXAligned ? Axis.axisXTransform : Axis.axisYTransform;
            var tickSelection = this.axisEl.selectAll(".tick");
            tickSelection.call(tickTransform, this.scale);
            this.axisEl.attr("transform", "");
        };

        Axis.prototype.transform = function (translatePair, scale) {
            var translate = this.isXAligned ? translatePair[0] : translatePair[1];
            if (scale != null && scale != this.cachedScale) {
                this.cachedTranslate = translate;
                this.cachedScale = scale;
                this.rescale();
            } else {
                translate -= this.cachedTranslate;
                var transform = this.transformString(translate, scale);
                this.axisEl.attr("transform", transform);
            }
        };
        return Axis;
    })();
    _Axis.Axis = Axis;
})(Axis || (Axis = {}));
//# sourceMappingURL=axis.js.map
