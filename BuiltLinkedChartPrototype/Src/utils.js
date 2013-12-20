var Utils;
(function (Utils) {
    function readyCallback(numToTrigger, callbackWhenReady) {
        var timesCalled = 0;
        return function () {
            timesCalled++;
            if (timesCalled === numToTrigger) {
                callbackWhenReady();
            }
        };
    }
    Utils.readyCallback = readyCallback;

    var CSVParser = (function () {
        function CSVParser() {
        }
        CSVParser.processCSVData = function (indata) {
            indata.forEach(function (d) {
                var dt = d;
                CSVParser.attributes.forEach(function (a) {
                    dt[a] = +dt[a];
                });
                d.date = CSVParser.parseDate(d.date);
            });
            return indata;
        };
        CSVParser.attributes = ["avg", "avgh", "avgl", "hi", "hih", "hil", "lo", "loh", "lol", "precip", "day"];
        CSVParser.parseDate = d3.time.format("%Y-%m-%d").parse;
        return CSVParser;
    })();
    function processCSVData(indata) {
        return CSVParser.processCSVData(indata);
    }
    Utils.processCSVData = processCSVData;
})(Utils || (Utils = {}));
