
import MessageBubble from "../MessageBubble/MessageBubble";
import "./MessageList.css";

function MessageList({
  messages = [],
  username = "",
  loading = false,
  bottomRef,
}) {
  return (
    <div
      className="message-list"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {/* Loading State */}
      {loading && (
        <div className="message-list__loading" role="status">
          <span
            className="message-list__spinner"
            aria-hidden="true"
          />
          <p>Loading previous messages...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && messages.length === 0 && (
        <div className="message-list__empty">
          <div
            className="message-list__empty-icon"
            aria-hidden="true"
          >
            ✳
          </div>

          <h3>No messages yet</h3>

          <p>
            You're here! Start the conversation with your
            first message.
          </p>
        </div>
      )}

      {/* Actual Messages */}
      {!loading &&
        messages.map((message, index) => (
          <MessageBubble
            key={message.id ?? `${message.sender}-${index}`}
            message={message}
            username={username}
          />
        ))}

      {/* Element used to scroll to the newest message */}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
