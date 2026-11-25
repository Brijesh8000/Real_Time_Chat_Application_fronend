
import "./ChatInput.css";

function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isConnected = true,
  maxLength = 2000,
}) {
  const canSend =
    Boolean(value?.trim()) && !disabled && isConnected;

  return (
    <form className="chat-input" onSubmit={onSubmit}>
      <label
        htmlFor="chat-message-input"
        className="chat-input__label"
      >
        Message
      </label>

      <div className="chat-input__row">
        <input
          id="chat-message-input"
          name="message"
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Write something nice..."
          maxLength={maxLength}
          autoComplete="off"
          aria-label="Type your chat message"
          disabled={disabled}
        />

        <button
          type="submit"
          className="chat-input__send"
          disabled={!canSend}
          aria-label="Send message"
        >
          <span>Send</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      <p className="chat-input__hint" aria-live="polite">
        {disabled
          ? "Leaving the room..."
          : !isConnected
            ? "Waiting for the chat connection..."
            : "Be kind. Keep the conversation going."}
      </p>
    </form>
  );
}

export default ChatInput;
