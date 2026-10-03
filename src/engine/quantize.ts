/**
 * Palette quantisation for lossy PNG compression (the technique behind
 * TinyPNG/pngquant): reduce a true-colour image to at most 256 colours so the
 * PNG can be stored as 8-bit indexed data, then let oxipng pack it.
 *
 * Pipeline: premultiplied-alpha histogram -> variance-based median cut ->
 * k-means refinement -> serpentine Floyd–Steinberg dithering with a
 * nearest-colour cache. Written from scratch so the project stays MIT-licensed
 * (libimagequant is GPL).
 */

// Perceptual weights for squared distances in premultiplied RGBA.
const WR = 1.0;
const WG = 1.2;
const WB = 0.8;
const WA = 1.0;

/** Counts distinct RGBA colours, stopping early once `limit` is exceeded. */
export function countColors(img: ImageData, limit: number): number {
  const d = img.data;
  const seen = new Set<number>();
  for (let p = 0; p < d.length; p += 4) {
    const a = d[p + 3];
    const v = a === 0 ? 0 : ((d[p] << 24) | (d[p + 1] << 16) | (d[p + 2] << 8) | a) >>> 0;
    seen.add(v);
    if (seen.size > limit) break;
  }
  return seen.size;
}

export interface QuantizeResult {
  image: ImageData;
  /** Estimated peak signal-to-noise ratio of the palette (before dithering). */
  psnr: number;
  colors: number;
}

interface Box {
  start: number;
  end: number;
  sse: number;
}

export function quantize(img: ImageData, maxColors = 256, dither = 0.8): QuantizeResult {
  const { width, height, data } = img;
  const n = width * height;

  // 1. Histogram over 5-5-5 bits of premultiplied RGB and 4 bits of alpha.
  const HSIZE = 1 << 19;
  const hCount = new Float64Array(HSIZE);
  const hR = new Float64Array(HSIZE);
  const hG = new Float64Array(HSIZE);
  const hB = new Float64Array(HSIZE);
  const hA = new Float64Array(HSIZE);
  let hasTransparent = false;
  for (let p = 0; p < n * 4; p += 4) {
    const a = data[p + 3];
    if (a === 0) {
      hasTransparent = true;
      continue;
    }
    const f = a / 255;
    const r = data[p] * f;
    const g = data[p + 1] * f;
    const b = data[p + 2] * f;
    const key = ((r >> 3) << 14) | ((g >> 3) << 9) | ((b >> 3) << 4) | (a >> 4);
    hCount[key]++;
    hR[key] += r;
    hG[key] += g;
    hB[key] += b;
    hA[key] += a;
  }

  let m = 0;
  for (let k = 0; k < HSIZE; k++) if (hCount[k] > 0) m++;
  const eR = new Float64Array(m);
  const eG = new Float64Array(m);
  const eB = new Float64Array(m);
  const eA = new Float64Array(m);
  const eW = new Float64Array(m);
  for (let k = 0, i = 0; k < HSIZE; k++) {
    const c = hCount[k];
    if (c > 0) {
      eR[i] = hR[k] / c;
      eG[i] = hG[k] / c;
      eB[i] = hB[k] / c;
      eA[i] = hA[k] / c;
      eW[i] = c;
      i++;
    }
  }

  // Fully transparent pixels always get their own palette entry so they stay
  // invisible after quantisation.
  const target = Math.max(2, maxColors - (hasTransparent ? 1 : 0));
  const idx = new Uint32Array(m);
  for (let i = 0; i < m; i++) idx[i] = i;
  const channels = [eR, eG, eB, eA];
  const weights = [WR, WG, WB, WA];

  const boxSse = (start: number, end: number): number => {
    let w = 0;
    const s = [0, 0, 0, 0];
    const s2 = [0, 0, 0, 0];
    for (let i = start; i < end; i++) {
      const e = idx[i];
      const ew = eW[e];
      w += ew;
      for (let c = 0; c < 4; c++) {
        const v = channels[c][e];
        s[c] += v * ew;
        s2[c] += v * v * ew;
      }
    }
    if (w === 0) return 0;
    let sse = 0;
    for (let c = 0; c < 4; c++) sse += (s2[c] - (s[c] * s[c]) / w) * weights[c];
    return sse;
  };

  // 2. Median cut: repeatedly split the box with the largest error along its
  // highest-variance channel, at the position minimising the 1-D error.
  const boxes: Box[] = m > 0 ? [{ start: 0, end: m, sse: boxSse(0, m) }] : [];
  while (boxes.length < target) {
    let bi = -1;
    let best = 0;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.end - b.start > 1 && b.sse > best) {
        best = b.sse;
        bi = i;
      }
    }
    if (bi < 0) break;
    const box = boxes[bi];

    let channel = 0;
    let bestVar = -1;
    for (let c = 0; c < 4; c++) {
      let w = 0;
      let s = 0;
      let s2 = 0;
      const ch = channels[c];
      for (let i = box.start; i < box.end; i++) {
        const e = idx[i];
        const v = ch[e];
        w += eW[e];
        s += v * eW[e];
        s2 += v * v * eW[e];
      }
      const variance = (s2 - (s * s) / w) * weights[c];
      if (variance > bestVar) {
        bestVar = variance;
        channel = c;
      }
    }

    const ch = channels[channel];
    idx.subarray(box.start, box.end).sort((x, y) => ch[x] - ch[y]);

    let tw = 0;
    let ts = 0;
    let ts2 = 0;
    for (let i = box.start; i < box.end; i++) {
      const e = idx[i];
      tw += eW[e];
      ts += ch[e] * eW[e];
      ts2 += ch[e] * ch[e] * eW[e];
    }
    let lw = 0;
    let ls = 0;
    let ls2 = 0;
    let split = box.start + 1;
    let bestErr = Infinity;
    for (let i = box.start; i < box.end - 1; i++) {
      const e = idx[i];
      lw += eW[e];
      ls += ch[e] * eW[e];
      ls2 += ch[e] * ch[e] * eW[e];
      const rw = tw - lw;
      const err = ls2 - (ls * ls) / lw + (ts2 - ls2) - ((ts - ls) * (ts - ls)) / rw;
      if (err < bestErr) {
        bestErr = err;
        split = i + 1;
      }
    }
    boxes.splice(bi, 1, { start: box.start, end: split, sse: boxSse(box.start, split) }, {
      start: split,
      end: box.end,
      sse: boxSse(split, box.end),
    });
  }

  // Palette in premultiplied space.
  const k = boxes.length;
  let pR = new Float64Array(k);
  let pG = new Float64Array(k);
  let pB = new Float64Array(k);
  let pA = new Float64Array(k);
  boxes.forEach((b, i) => {
    let w = 0;
    for (let j = b.start; j < b.end; j++) {
      const e = idx[j];
      const ew = eW[e];
      w += ew;
      pR[i] += eR[e] * ew;
      pG[i] += eG[e] * ew;
      pB[i] += eB[e] * ew;
      pA[i] += eA[e] * ew;
    }
    pR[i] /= w;
    pG[i] /= w;
    pB[i] /= w;
    pA[i] /= w;
  });

  const nearest = (r: number, g: number, b: number, a: number): number => {
    let bi = 0;
    let bd = Infinity;
    for (let i = 0; i < pR.length; i++) {
      const dr = pR[i] - r;
      const dg = pG[i] - g;
      const db = pB[i] - b;
      const da = pA[i] - a;
      const d = dr * dr * WR + dg * dg * WG + db * db * WB + da * da * WA;
      if (d < bd) {
        bd = d;
        bi = i;
      }
    }
    return bi;
  };

  // 3. K-means refinement on the histogram entries.
  let mse = 0;
  for (let iter = 0; iter < 3 && k > 0; iter++) {
    const sR = new Float64Array(k);
    const sG = new Float64Array(k);
    const sB = new Float64Array(k);
    const sA = new Float64Array(k);
    const sW = new Float64Array(k);
    let err = 0;
    let totalW = 0;
    for (let e = 0; e < m; e++) {
      const i = nearest(eR[e], eG[e], eB[e], eA[e]);
      const w = eW[e];
      sR[i] += eR[e] * w;
      sG[i] += eG[e] * w;
      sB[i] += eB[e] * w;
      sA[i] += eA[e] * w;
      sW[i] += w;
      const dr = pR[i] - eR[e];
      const dg = pG[i] - eG[e];
      const db = pB[i] - eB[e];
      const da = pA[i] - eA[e];
      err += ((dr * dr + dg * dg + db * db + da * da) / 4) * w;
      totalW += w;
    }
    mse = totalW ? err / totalW : 0;
    if (iter === 2) break;
    const nR = new Float64Array(k);
    const nG = new Float64Array(k);
    const nB = new Float64Array(k);
    const nA = new Float64Array(k);
    for (let i = 0; i < k; i++) {
      if (sW[i] > 0) {
        nR[i] = sR[i] / sW[i];
        nG[i] = sG[i] / sW[i];
        nB[i] = sB[i] / sW[i];
        nA[i] = sA[i] / sW[i];
      } else {
        nR[i] = pR[i];
        nG[i] = pG[i];
        nB[i] = pB[i];
        nA[i] = pA[i];
      }
    }
    pR = nR;
    pG = nG;
    pB = nB;
    pA = nA;
  }

  // Final palette (premultiplied for matching, straight RGBA for output).
  const total = k + (hasTransparent ? 1 : 0);
  const fR = new Float64Array(total);
  const fG = new Float64Array(total);
  const fB = new Float64Array(total);
  const fA = new Float64Array(total);
  const out8 = new Uint8ClampedArray(total * 4);
  for (let i = 0; i < k; i++) {
    const a = Math.round(Math.min(255, Math.max(1, pA[i])));
    const f = 255 / a;
    out8[i * 4] = Math.round(pR[i] * f);
    out8[i * 4 + 1] = Math.round(pG[i] * f);
    out8[i * 4 + 2] = Math.round(pB[i] * f);
    out8[i * 4 + 3] = a;
    // Match against what will actually be written.
    fA[i] = a;
    fR[i] = (out8[i * 4] * a) / 255;
    fG[i] = (out8[i * 4 + 1] * a) / 255;
    fB[i] = (out8[i * 4 + 2] * a) / 255;
  }
  // The transparent slot (if any) stays at index k with all zeros.
  pR = fR;
  pG = fG;
  pB = fB;
  pA = fA;

  // 4. Remap pixels with serpentine Floyd–Steinberg error diffusion.
  const out = new Uint8ClampedArray(n * 4);
  const cache = new Uint16Array(1 << 22);
  const rowW = width + 2;
  let errCur = new Float32Array(rowW * 3);
  let errNext = new Float32Array(rowW * 3);
  const LIMIT = 48;
  for (let y = 0; y < height; y++) {
    const ltr = (y & 1) === 0;
    errNext.fill(0);
    for (let step = 0; step < width; step++) {
      const x = ltr ? step : width - 1 - step;
      const p = (y * width + x) * 4;
      const a = data[p + 3];
      if (a === 0) continue; // output already zero = transparent slot colour
      const f = a / 255;
      const ei = (x + 1) * 3;
      let r = data[p] * f + errCur[ei] * dither;
      let g = data[p + 1] * f + errCur[ei + 1] * dither;
      let b = data[p + 2] * f + errCur[ei + 2] * dither;
      const max = a; // premultiplied channels cannot exceed alpha
      r = r < 0 ? 0 : r > max ? max : r;
      g = g < 0 ? 0 : g > max ? max : g;
      b = b < 0 ? 0 : b > max ? max : b;
      const key = ((r >> 2) << 16) | ((g >> 2) << 10) | ((b >> 2) << 4) | (a >> 4);
      let ci = cache[key];
      if (ci === 0) {
        ci = nearest(r, g, b, a) + 1;
        cache[key] = ci;
      }
      ci--;
      out[p] = out8[ci * 4];
      out[p + 1] = out8[ci * 4 + 1];
      out[p + 2] = out8[ci * 4 + 2];
      out[p + 3] = out8[ci * 4 + 3];

      let er = r - pR[ci];
      let eg = g - pG[ci];
      let eb = b - pB[ci];
      er = er < -LIMIT ? -LIMIT : er > LIMIT ? LIMIT : er;
      eg = eg < -LIMIT ? -LIMIT : eg > LIMIT ? LIMIT : eg;
      eb = eb < -LIMIT ? -LIMIT : eb > LIMIT ? LIMIT : eb;
      const fwd = ltr ? 3 : -3;
      // right (7/16), down-left (3/16), down (5/16), down-right (1/16)
      errCur[ei + fwd] += (er * 7) / 16;
      errCur[ei + fwd + 1] += (eg * 7) / 16;
      errCur[ei + fwd + 2] += (eb * 7) / 16;
      errNext[ei - fwd] += (er * 3) / 16;
      errNext[ei - fwd + 1] += (eg * 3) / 16;
      errNext[ei - fwd + 2] += (eb * 3) / 16;
      errNext[ei] += (er * 5) / 16;
      errNext[ei + 1] += (eg * 5) / 16;
      errNext[ei + 2] += (eb * 5) / 16;
      errNext[ei + fwd] += er / 16;
      errNext[ei + fwd + 1] += eg / 16;
      errNext[ei + fwd + 2] += eb / 16;
    }
    const t = errCur;
    errCur = errNext;
    errNext = t;
  }

  const psnr = mse > 0 ? 10 * Math.log10((255 * 255) / mse) : 99;
  return { image: new ImageData(out, width, height), psnr, colors: total };
}
