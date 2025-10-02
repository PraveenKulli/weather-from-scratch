const HOUR_MS = 60 * 60 * 1000;

class KeyPool {
  constructor(keys) {
    const now = Date.now();
    this.slots = keys.map(k => ({ key: k.trim(), count: 0, windowStart: now }));
  }
  resetExpired() {
    const now = Date.now();
    for (const s of this.slots) {
      if (now - s.windowStart >= HOUR_MS) {
        s.count = 0;
        s.windowStart = now;
      }
    }
  }
  getAvailableKey() {
    this.resetExpired();
    for (const s of this.slots) {
      if (s.count < 3) {
        s.count++;
        return s.key;
      }
    }
    return null;
  }
  snapshot() {
    return this.slots.map(s => ({
      key: s.key.slice(0, 6) + '…',
      count: s.count,
      windowStart: s.windowStart
    }));
  }
}

module.exports = { KeyPool };
