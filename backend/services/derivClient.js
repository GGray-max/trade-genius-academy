/**
 * Lightweight Deriv WebSocket client wrapper.
 * Currently exposes a single helper to fetch authorized account balance.
 *
 * TODO: Expand with trade execution, subscription to ticks, etc.
 */
const WebSocket = require("ws");

const DERIV_WS_URL = "wss://ws.binaryws.com/websockets/v3?app_id=1089"; // public app_id; replace if you registered your own app

function createDerivClient() {
  const token = process.env.DERIV_API_TOKEN;
  if (!token) {
    throw new Error("DERIV_API_TOKEN not set in .env");
  }

  const ws = new WebSocket(DERIV_WS_URL);

  const send = (msgObj) => {
    ws.send(JSON.stringify(msgObj));
  };

  /**
   * Example helper – get account balance once socket is open.
   * Returns a Promise that resolves with { currency, balance }.
   */
  function getBalance() {
    return new Promise((resolve, reject) => {
      ws.on("open", () => {
        send({ authorize: token });
      });

      ws.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.msg_type === "authorize") {
          send({ balance: 1, version: 2 });
        } else if (msg.msg_type === "balance") {
          ws.close();
          resolve({ currency: msg.balance.currency, balance: msg.balance.balance });
        } else if (msg.error) {
          ws.close();
          reject(new Error(msg.error.message));
        }
      });

      ws.on("error", reject);
    });
  }

  return { getBalance };
}

module.exports = { createDerivClient };
