const axios = require("axios");

/* ============================
   CONFIGURATION
============================ */

// Update BASE_URL to point to the actual ingest endpoint.
// According to your note and the 404 response, it should be /api/events/PROJECT_ID
const PROJECT_ID = "69ad186912aa27c90fc442c1";
const API_KEY = "eed914205e072877fa36ccc3e835f0a1927e21deaaa42c6d5e84816f12d574b0";

// The correct ingest route is /api/events/:projectId (see express app and route registration)
const BASE_URL = "https://lastproject-0dc1.onrender.com/api/events/ingest";
const TOTAL_EVENTS = 2000;
const DELAY_MS = 200;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomSeverity() {
  // Favour INFO and WARN for load, but allow ERROR/CRITICAL sometimes
  const weights = [
    ...Array(8).fill("INFO"),
    ...Array(6).fill("WARN"),
    ...Array(3).fill("ERROR"),
    ...Array(1).fill("CRITICAL"),
  ];
  return weights[Math.floor(Math.random() * weights.length)];
}

function randomString(length = 8) {
  // To add more uniqueness in message per event
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < length; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

function validateServerResponse(res) {
  // Helper for debugging: prints if server returns error structure even with 200/201
  if (res && typeof res === "object" && res.data && res.data.message) {
    if (/error|fail/i.test(res.data.message)) {
      console.warn("Server responded with message:", res.data.message);
    }
  }
}

async function runLoadTest() {
  console.log("Starting load test...");
  let successCount = 0;
  let error500Count = 0;
  let otherErrorCount = 0;

  for (let i = 0; i < TOTAL_EVENTS; i++) {
    const severity = randomSeverity();
    // Use a message signature to avoid always same for each test run
    const message = `Load test event ${i} ${randomString(6)}`;
    try {
      // POST to the correct ingest endpoint
      const resp = await axios.post(
        `${BASE_URL}/${PROJECT_ID}`,
        {
          service: "load-test-service",
          severity,
          message,
          eventTimestamp: new Date().toISOString(),
          metadata: {
            batch: "phase5",
            iteration: i
          },
          environment: "production"
        },
        {
          headers: {
            "x-api-key": API_KEY
          },
          timeout: 5000
        }
      );

      successCount++;
      if (i % 100 === 0) {
        console.log(`Sent ${i} events [last severity: ${severity}]`);
      }
      validateServerResponse(resp);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 500) {
          error500Count++;
          console.error(`500 Internal Server Error at #${i} [severity=${severity}]`);
          if (err.response.data && err.response.data.message) {
            console.error("Message:", err.response.data.message);
          }
          if (error500Count <= 5) {
            console.error("Full error:", err.response.data);
          }
          await sleep(500); // Wait longer for 500s to reduce hammering!
        } else {
          otherErrorCount++;
          console.error(`Request failed with status ${err.response.status}:`, err.response.data);
        }
      } else if (err.code === 'ECONNREFUSED') {
        console.error("Connection refused (server offline?)");
        await sleep(2000); // Wait more if server not up
      } else if (err.code === 'ECONNABORTED') {
        console.error("Request timed out");
      } else {
        console.error("Unknown/No response from server:", err.message || err);
      }
    }

    await sleep(DELAY_MS);
  }

  console.log("Load test complete");
  console.log(`SENT: ${successCount}  500 errors: ${error500Count}  Other errors: ${otherErrorCount}`);
}

runLoadTest();