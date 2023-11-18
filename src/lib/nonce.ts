export const generateNonce = (): string => {
  const rnd = Math.random().toString();
  const alphabet = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghjijklmnopqrstuvwxyz0123456789";
  const jda = [
    alphabet + "+/=",
    alphabet + "+/",
    alphabet + "-_=",
    alphabet + "-_.",
    alphabet + "-_",
  ];
  const b = jda[3];
  const a = [];
  for (let i = 0; i < rnd.length - 1; i++) {
    a.push(rnd[i].charCodeAt(i));
  }
  let c = "";
  let d = 0;
  let m, n, q, r, f, g;
  while (d < a.length) {
    f = a[d];
    g = d + 1 < a.length;

    if (g) {
      m = a[d + 1];
    } else {
      m = 0;
    }
    n = d + 2 < a.length;
    if (n) {
      q = a[d + 2];
    } else {
      q = 0;
    }
    r = f >> 2;
    f = ((f & 3) << 4) | (m >> 4);
    m = ((m & 15) << 2) | (q >> 6);
    q &= 63;
    if (!n) {
      q = 64;
      if (!q) {
        m = 64;
      }
    }
    c += b[r] + b[f] + b[m] + b[q];
    d += 3;
  }
  return c;
};
