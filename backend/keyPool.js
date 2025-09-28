const HOUR_MS = 60 * 60 * 1000;

class KeyPool {
  constructor(keys) {
    const now = Date.now();
    this.slots = keys.map(k => ({ key: k.trim(), count: 0, windowStart: now }));
  }
  resetExpired() {
    const now = Date.now();
    for (const slot of this.slots) {
      if (now - slot.windowStart >= HOUR_MS) {
        slot.count = 0;
        slot.windowStart = now;
      }
    }
  }
  getAvailableKey() {
    this.resetExpired();
    for (const slot of this.slots) {
      if (slot.count < 3) {
        slot.count += 1;
        return slot.key;
      }
    }
    return null;
  }
  getSnapshot() {
    return this.slots.map(s => ({ key: s.key.slice(0,6)+'…', count: s.count, windowStart: s.windowStart }));
  }
}

module.exports = { KeyPool };
