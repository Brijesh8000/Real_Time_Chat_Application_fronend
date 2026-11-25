
import { Link, useLocation } from "react-router-dom";
import "./RoomNotFound.css";

function RoomNotFound() {
  const location = useLocation();
  const roomId = location.state?.roomId;

  return (
    <main className="room-not-found">
      <div className="room-not-found__container page-container">
        <div className="room-not-found__content">
          {/* Decorative icon */}
          <div className="room-not-found__icon" aria-hidden="true">
            <span>#</span>
            <span className="room-not-found__question">?</span>
          </div>

          {/* Error label */}
          <span className="room-not-found__eyebrow">
            {roomId ? "ROOM UNAVAILABLE" : "PAGE NOT FOUND"}
          </span>

          {/* Heading */}
          <h1>
            {roomId ? (
              <>
                Looks like this
                <br />
                room is <span>missing.</span>
              </>
            ) : (
              <>
                Oops! Wrong
                <br />
                <span>conversation.</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="room-not-found__description">
            {roomId ? (
              <>
                We couldn't find the room you're looking for.
                Please check the Room ID and try again.
              </>
            ) : (
              <>
                We couldn't find the page you were looking for.
                Let's get you back to Chatter.
              </>
            )}
          </p>

          {/* Display the Room ID when available */}
          {roomId && (
            <div className="room-not-found__room-id">
              <span>ROOM ID YOU ENTERED</span>
              <strong>{roomId}</strong>
            </div>
          )}

          {/* Navigation actions */}
          <div className="room-not-found__actions">
            <Link
              to="/join-room"
              state={{ roomId: roomId || "" }}
              className="room-not-found__button room-not-found__button--primary"
            >
              Try Joining Again
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/"
              className="room-not-found__button room-not-found__button--secondary"
            >
              <span aria-hidden="true">←</span>
              Back to Home
            </Link>
          </div>

          {/* Small footer note */}
          <div className="room-not-found__note">
            <span aria-hidden="true">✳</span>
            Every good conversation starts somewhere.
          </div>
        </div>

        {/* Decorative background elements */}
        <div
          className="room-not-found__decoration room-not-found__decoration--one"
          aria-hidden="true"
        >
          #
        </div>

        <div
          className="room-not-found__decoration room-not-found__decoration--two"
          aria-hidden="true"
        >
          ?
        </div>
      </div>
    </main>
  );
}

export default RoomNotFound;
