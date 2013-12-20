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
        Axis.prototype.transformString = function (translate, scale) {
            var translateS = this.isXAligned ? "" + translate : "0," + translate;

            return "translate(" + translateS + ") scale(" + scale + ")";
        };

        Axis.prototype.render = function () {
            this.axisEl.call(this.d3axis);
            this.axisEl.attr("transform", "");
        };

        Axis.prototype.transform = function (translatePair, scale) {
            var translate = this.isXAligned ? translatePair[0] : translatePair[1];

            if (scale != null && scale != this.cachedScale) {
                this.render();
            } else {
                var transform = this.transformString(translate, scale);
                this.axisEl.attr("transform", transform);
            }
            this.cachedTranslate = translate;
            this.cachedScale = scale;
        };
        return Axis;
    })();
    _Axis.Axis = Axis;
})(Axis || (Axis = {}));
