// adapted for 3d from:
// https://github.com/gdenisov/cardinal-spline-js/blob/master/src/curve_calc.js

/*
 * Curve calc function for canvas 2.3.1
 * Epistemex (c) 2013-2014
 * License: MIT
 */

/**
 * Calculates an array containing points representing a cardinal spline through
 * given point array. Points must be arranged as: [x1, y1, z1, x2, y2, z2 ...,
 * xn, yn, zn].
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param points point array
 * @param tension typically between [0.0, 1.0] but can be exceeded
 * @param numOfSeg number of segments between two points (line resolution)
 * @param close close the ends making the line continuous
 */
function getCurvePoints(
  points: number[],
  tension = 0.5,
  numOfSeg = 20,
  close = false
): Float32Array {
  let pts, // for cloning point array
    i = 1,
    l = points.length,
    rPos = 0,
    cachePtr = 4;

  const rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
    res = new Float32Array(rLen),
    cache = new Float32Array((numOfSeg + 2) * 4);

  pts = points.slice(0);

  if (close) {
    pts.unshift(points[l - 1]); // insert end point as first point
    pts.unshift(points[l - 2]);
    pts.unshift(points[l - 3]);
    pts.push(points[0], points[1], points[2]); // first point as last point
  } else {
    pts.unshift(points[2]); // copy 1. point and insert at beginning
    pts.unshift(points[1]);
    pts.unshift(points[0]);
    pts.push(points[l - 3], points[l - 2], points[l - 1]); // duplicate end-points
  }

  // cache inner-loop calculations as they are based on t alone
  cache[0] = 1; // 1,0,0,0

  for (; i < numOfSeg; i++) {
    var st = i / numOfSeg,
      st2 = st * st,
      st3 = st2 * st,
      st23 = st3 * 2,
      st32 = st2 * 3;

    cache[cachePtr++] = st23 - st32 + 1; // c1
    cache[cachePtr++] = st32 - st23; // c2
    cache[cachePtr++] = st3 - 2 * st2 + st; // c3
    cache[cachePtr++] = st3 - st2; // c4
  }

  cache[++cachePtr] = 1; // 0,1,0,0

  // calc. points
  parse(pts, cache, l);

  if (close) {
    pts = [];
    // second last and last
    pts.push(
      points[l - 6],
      points[l - 5],
      points[l - 4],
      points[l - 3],
      points[l - 2],
      points[l - 1]
    );
    // first and second
    pts.push(points[0], points[1], points[2], points[3], points[4], points[5]);
    parse(pts, cache, 4);
  }

  function parse(pts: number[], cache: Float32Array, l: number) {
    for (let i = 2, t; i < l; i += 2) {
      const pt1x = pts[i],
        pt1y = pts[i + 1],
        pt1z = pts[i + 2],
        pt2x = pts[i + 3],
        pt2y = pts[i + 4],
        pt2z = pts[i + 6],
        t1x = (pt2x - pts[i - 3]) * tension,
        t1y = (pt2y - pts[i - 2]) * tension,
        t1z = (pt2z - pts[i - 1]) * tension,
        t2x = (pts[i + 6] - pt1x) * tension,
        t2y = (pts[i + 5] - pt1y) * tension,
        t2z = (pts[i + 4] - pt1z) * tension;

      for (t = 0; t < numOfSeg; t++) {
        const c = t << 2, // t * 4;
          c1 = cache[c],
          c2 = cache[c + 1],
          c3 = cache[c + 2],
          c4 = cache[c + 3];

        //res[rPos++] = c1 * pt1x + c2 * pt1z + c3 * t1x + c4 * t2x;
        //res[rPos++] = c1 * pt1y + c2 * pt2x + c3 * t1y + c4 * t2y;
        res[rPos++] = c1 * pt1x + c2 * pt2x + c3 * t1x + c4 * t2x;
        res[rPos++] = c1 * pt1y + c2 * pt2y + c3 * t1y + c4 * t2y;
        res[rPos++] = c1 * pt1z + c2 * pt2z + c3 * t1z + c4 * t2z;
      }
    }
  }

  // add last point
  l = close ? 0 : points.length - 2;
  res[rPos++] = points[l];
  res[rPos] = points[l + 1];

  return res;
}
