
import "./MessageBubble.css";

function formatMessageTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ message, username }) {
  const sender = String(
    message?.sender ?? message?.senderName ?? "Unknown"
  );

  const content = String(
    message?.content ?? message?.message ?? message?.text ?? ""
  );

  const timestamp =
    message?.timestamp ??
    message?.timeStamp ??
    message?.createdAt ??
    message?.sentAt ??
    null;

  const isOwn =
    typeof message?.isOwn === "boolean"
      ? message.isOwn
      : sender === username;

  const senderInitial = sender.charAt(0).toUpperCase() || "?";
  const time = formatMessageTime(timestamp);

  return (
    <article
      className={`message-bubble ${
        isOwn ? "message-bubble--own" : ""
      }`}
      aria-label={`Message from ${isOwn ? "you" : sender}`}
    >
      {!isOwn && (
        <div
          className="message-bubble__avatar"
          aria-hidden="true"
        >
          {senderInitial}
        </div>
      )}

      <div className="message-bubble__content">
        <div className="message-bubble__meta">
          <strong>{isOwn ? "You" : sender}</strong>

          {time && (
            <time dateTime={timestamp}>
              {time}
            </time>
          )}
        </div>

        <div className="message-bubble__text">
          {content}
        </div>
      </div>

      {isOwn && (
        <div
          className="message-bubble__avatar message-bubble__avatar--own"
          aria-hidden="true"
        >
          {String(username || "Y").charAt(0).toUpperCase()}
        </div>
      )}
    </article>
  );
}

export default MessageBubble;
