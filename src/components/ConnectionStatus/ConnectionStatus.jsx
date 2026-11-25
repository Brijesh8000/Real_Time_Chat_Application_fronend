
import "./ConnectionStatus.css";

const STATUS_CONFIG = {
  connecting: {
    label: "Connecting...",
    description: "Establishing the chat connection",
  },
  connected: {
    label: "Connected",
    description: "The chat connection is active",
  },
  reconnecting: {
    label: "Reconnecting...",
    description: "Trying to reconnect to the chat",
  },
  disconnected: {
    label: "Disconnected",
    description: "The chat connection is inactive",
  },
};

function ConnectionStatus({ status = "disconnected" }) {
  const currentStatus =
    STATUS_CONFIG[status] || STATUS_CONFIG.disconnected;

  return (
    <div
      className={`connection-status connection-status--${STATUS_CONFIG[status] ? status : "disconnected"}`}
      role="status"
      aria-live="polite"
      aria-label={`WebSocket status: ${currentStatus.label}`}
      title={currentStatus.description}
    >
      <span
        className="connection-status__dot"
        aria-hidden="true"
      />

      <span className="connection-status__label">
        {currentStatus.label}
      </span>
    </div>
  );
}

export default ConnectionStatus;
