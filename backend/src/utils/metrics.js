// utils/metrics.js

class MetricsStore {
    constructor() {
      this.totalEventsIngested = 0;
      this.eventsLastMinute = 0;
      this.failedApiKeyAttempts = 0;
      this.rateLimitHits = 0;
      this.activeSocketConnections = 0;
  
      // Reset rolling minute counter
      setInterval(() => {
        this.eventsLastMinute = 0;
      }, 60 * 1000);
    }
  
    incrementEvent() {
      this.totalEventsIngested++;
      this.eventsLastMinute++;
    }
  
    incrementApiKeyFailure() {
      this.failedApiKeyAttempts++;
    }
  
    incrementRateLimitHit() {
      this.rateLimitHits++;
    }
  
    incrementSocketConnections() {
      this.activeSocketConnections++;
    }
  
    decrementSocketConnections() {
      if (this.activeSocketConnections > 0) {
        this.activeSocketConnections--;
      }
    }
  
    getSnapshot() {
      return {
        totalEventsIngested: this.totalEventsIngested,
        eventsLastMinute: this.eventsLastMinute,
        failedApiKeyAttempts: this.failedApiKeyAttempts,
        rateLimitHits: this.rateLimitHits,
        activeSocketConnections: this.activeSocketConnections
      };
    }
  }
  
  module.exports = new MetricsStore();