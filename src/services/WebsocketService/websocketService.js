
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_ENDPOINT =
  import.meta.env.VITE_WS_ENDPOINT ||
  "http://localhost:8081/chat";

const APP_PREFIX =
  import.meta.env.VITE_WS_APP_PREFIX || "/app";

const SEND_MAPPING =
  import.meta.env.VITE_WS_SEND_MAPPING || "/sendMessage";

const TOPIC_PREFIX =
  import.meta.env.VITE_WS_TOPIC_PREFIX || "/topic/room";

export function connectToRoom({
  roomId,
  onMessage,
  onStatus,
  onError,
}) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT),

    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    // Display STOMP connection details in the browser console.
    debug: (message) => {
      console.debug("[STOMP]", message);
    },

    onConnect: () => {
      console.info("[STOMP] Connected successfully.");

      const destination =
        `${TOPIC_PREFIX}/${encodeURIComponent(roomId)}`;

      console.info("[STOMP] Subscribing to:", destination);

      client.subscribe(destination, (frame) => {
        try {
          const message = JSON.parse(frame.body);

          console.log("[STOMP] Received message:", message);

          onMessage?.(message);
        } catch (error) {
          console.error(
            "[STOMP] Could not parse incoming message:",
            error
          );

          onError?.("Unable to read the incoming message.");
        }
      });

      onStatus?.("connected");
    },

    onWebSocketClose: () => {
      console.warn("[STOMP] WebSocket closed.");

      onStatus?.(
        client.active ? "reconnecting" : "disconnected"
      );
    },

    onWebSocketError: (event) => {
      console.error("[STOMP] WebSocket transport error:", event);

      onStatus?.("disconnected");

      onError?.(
        "WebSocket connection failed. Check your backend and endpoint."
      );
    },

    onStompError: (frame) => {
      console.error(
        "[STOMP] Broker error:",
        frame.headers?.message,
        frame.body
      );

      onError?.(
        frame.headers?.message ||
          "The messaging server reported an error."
      );
    },
  });

  onStatus?.("connecting");
  client.activate();

  return client;
}

export function sendChatMessage(
  client,
  roomId,
  username,
  content
) {
  if (!client || !client.connected) {
    throw new Error(
      "Chat is not connected. Please wait for reconnection."
    );
  }

  const destination =
    `${APP_PREFIX}${SEND_MAPPING}/${encodeURIComponent(roomId)}`;

  // Include roomName for compatibility with your DTO.
  const payload = {
    sender: username,
    content: content.trim(),
    roomName: roomId,
  };

  console.log("[STOMP] Sending to:", destination);
  console.log("[STOMP] Payload:", payload);

  client.publish({
    destination,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
