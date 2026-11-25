
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

// Reusable components
import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import MessageList from "../../components/MessageList/MessageList";
import ChatInput from "../../components/ChatInput/ChatInput";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

// Services
import { getRoomMessages } from "../../services/RoomService/roomService";

import {
  connectToRoom,
  sendChatMessage,
} from "../../services/WebsocketService/websocketService";

import "./ChatPage.css";

// Convert backend message objects to a consistent frontend format.
function normalizeMessage(message, username, index) {
  const sender =
    message?.sender ??
    message?.senderName ??
    message?.username ??
    "Unknown";

  const content =
    message?.content ??
    message?.message ??
    message?.text ??
    "";

  const timestamp =
    message?.timestamp ??
    message?.timeStamp ??
    message?.createdAt ??
    message?.sentAt ??
    null;

  return {
    id:
      message?.id ??
      message?.messageId ??
      `${timestamp ?? "message"}-${index}`,
    sender: String(sender),
    content: String(content),
    timestamp,
    isOwn: String(sender) === username,
  };
}

function ChatPage() {
  const { roomId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username;

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState("connecting");

  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const clientRef = useRef(null);
  const bottomRef = useRef(null);
  const leaveStartedRef = useRef(false);

  // Redirect users who did not enter through Join Room.
  useEffect(() => {
    if (!username) {
      navigate("/join-room", {
        replace: true,
        state: { roomId },
      });
    }
  }, [username, roomId, navigate]);

  // Load previous messages using roomService.js,
  // then establish the WebSocket connection.
  useEffect(() => {
    if (!username || !roomId) return;

    let cancelled = false;
    let client = null;

    async function initializeChat() {
      setLoadingHistory(true);
      setHistoryError("");
      setError("");
      setMessages([]);
      setConnectionStatus("connecting");

      try {
        // Uses GET /api/v1/rooms/{roomName}/messages
        const data = await getRoomMessages(roomId);

        if (cancelled) return;

        const history = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
            ? data.messages
            : [];

        setMessages(
          history.map((message, index) =>
            normalizeMessage(message, username, index)
          )
        );
      } catch (err) {
        if (cancelled) return;

        // Your controller returns HTTP 400 when the room
        // doesn't exist or its messages cannot be retrieved.
        if (err.status === 400 || err.status === 404) {
          navigate("/room-not-found", {
            replace: true,
            state: { roomId },
          });

          return;
        }

        // A history failure does not necessarily mean
        // the WebSocket connection cannot be established.
        setHistoryError(
          err.message || "Unable to load previous messages."
        );
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }

      if (cancelled) return;

      // Establish the real-time connection.
      try {
        client = connectToRoom({
          roomId,

          onMessage: (incomingMessage) => {
            if (cancelled) return;

            setMessages((previous) => [
              ...previous,
              normalizeMessage(
                incomingMessage,
                username,
                previous.length
              ),
            ]);
          },

          onStatus: (status) => {
            if (!cancelled) {
              setConnectionStatus(status);
            }
          },

          onError: (message) => {
            if (!cancelled) {
              setError(message);
            }
          },
        });

        clientRef.current = client;
      } catch {
        if (!cancelled) {
          setConnectionStatus("disconnected");
          setError("Unable to start the WebSocket connection.");
        }
      }
    }

    initializeChat();

    return () => {
      cancelled = true;

      if (clientRef.current === client) {
        clientRef.current = null;
      }

      if (client) {
        client.deactivate();
      }
    };
  }, [roomId, username, navigate]);

  // Scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // Send a message through websocketService.js.
  function handleSendMessage(event) {
    event.preventDefault();

    const content = draft.trim();

    if (
      !content ||
      leaving ||
      connectionStatus !== "connected"
    ) {
      return;
    }

    setError("");

    try {
      sendChatMessage(
        clientRef.current,
        roomId,
        username,
        content
      );

      setDraft("");
    } catch (err) {
      setError(
        err.message || "Unable to send your message."
      );
    }
  }

  // Disconnect from the room before returning home.
  async function handleLeaveRoom() {
    if (leaving || leaveStartedRef.current) return;

    leaveStartedRef.current = true;
    setLeaving(true);

    const client = clientRef.current;
    clientRef.current = null;

    try {
      if (client) {
        await client.deactivate();
      }
    } catch {
      // Return home even if disconnecting reports an error.
    } finally {
      navigate("/", { replace: true });
    }
  }

  return (
    <main className="chat-page">
      <div className="chat-page__container page-container">

        {/* Room Header */}
        <header className="chat-room-header">
          <div className="chat-room-heading">
            <div
              className="chat-room-hash"
              aria-hidden="true"
            >
              #
            </div>

            <div className="chat-room-title-group">
              <span className="chat-room-overline">
                YOUR CONVERSATION
              </span>

              <h1>Room Chat</h1>

              <p>
                Room ID: <strong>{roomId}</strong>
              </p>
            </div>
          </div>

          <div className="chat-room-actions">
            <ConnectionStatus status={connectionStatus} />

            <button
              type="button"
              className="chat-leave-button"
              onClick={handleLeaveRoom}
              disabled={leaving}
            >
              {leaving ? "Leaving..." : "Leave Room"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        {/* Main Chat Panel */}
        <section className="chat-panel">
          <div className="chat-panel__topbar">
            <div>
              <h2>Messages</h2>

              <p>
                Chatting as <strong>{username || "Guest"}</strong>
              </p>
            </div>

            <span className="chat-panel__tag">
              LIVE CHAT
            </span>
          </div>

          {/* Reusable error alerts */}
          {(error || historyError) && (
            <AlertMessage
              type="error"
              title={
                historyError
                  ? "Message History Error"
                  : "Chat Error"
              }
              message={historyError || error}
              onClose={() => {
                setError("");
                setHistoryError("");
              }}
            />
          )}

          {/* Reusable MessageList */}
          <MessageList
            messages={messages}
            username={username}
            loading={loadingHistory}
            bottomRef={bottomRef}
          />

          {/* Reusable ChatInput */}
          <ChatInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onSubmit={handleSendMessage}
            disabled={leaving}
            isConnected={connectionStatus === "connected"}
            maxLength={2000}
          />
        </section>

        {/* Footer */}
        <footer className="chat-page__footer">
          <Link to="/">← Back to home</Link>
          <span>Made for good conversations.</span>
        </footer>

      </div>
    </main>
  );
}

export default ChatPage;
