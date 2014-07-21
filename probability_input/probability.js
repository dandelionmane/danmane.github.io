function parabolic(r, c) {
  var k = 16*Math.pow(c,3)/9;
  var s = Math.sqrt(c/k);
  var r1 = -s + r;
  var r2 =  s + r;
  return function(x) {
    if (x < r1 || x > r2) return 0;
    return Math.pow(x-r, 2) * -k  + c;
  }
}

function normalDistribution(mu, sigma) {
  return function (x) {
    var k = sigma * Math.sqrt(2 * Math.PI);
    var eTerm = -(x - mu) * (x - mu) / (2 * sigma * sigma);
    return Math.exp(eTerm) / k;
  }
}

function normalizedParabolic(r, c, cutoff, sf) {
  var f = parabolic(r, c);
  return function(x) {
    return f(x) + sf * (c < cutoff ? (cutoff-c)/cutoff : 0);
  }
}

function sample(f, min, max, n) {
  var step = (max-min) / n;
  return _.range(n).map(function(i) {
    var x = i * step + min;
    return {x: x, y: f(x)};
  });
}

function normalizedSample(f, min, max, n) {
  var data = sample(f, min, max, n);
  var step = (max - min) / n;
  var sum = d3.sum(data, function(x) { return x.y }) * step;
  if (sum + 0.01 < 1) {
    var f = 1/sum;
    data = data.map(function(d) { return {x: d.x, y: d.y * f}});
  }
  return data;
}


// ** Test Code ** \\

function integrateSample(f, min, max, n) {
  var step = (max-min) / n;
  var data = sample(f, min, max, n).map(function(x) {return x.y});
  return d3.sum(data) * step;
}

function test(r, c) {
  var n = 10000;
  var k = 16*Math.pow(c,3)/9;
  var s = Math.sqrt(c/k);
  var r1 = -s + r;
  var r2 =  s + r;
  var f = parabolic(r, c);
  return integrateSample(f, r1, r2, 10000);
}
