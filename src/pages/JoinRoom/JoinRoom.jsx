
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import FormInput from "../../components/FormInput/FormInput";
import { getRoom } from "../../services/RoomService/roomService";

import "./JoinRoom.css";

function JoinRoom() {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefill Room ID when coming from Create Room.
  const [roomId, setRoomId] = useState(
    location.state?.roomId || ""
  );

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store validation errors for individual fields.
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    roomId: "",
  });

  // Validate user details and check whether the room exists.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    setError("");

    const newFieldErrors = {
      username: "",
      roomId: "",
    };

    if (!trimmedUsername) {
      newFieldErrors.username = "Please enter your username.";
    } else if (trimmedUsername.length > 30) {
      newFieldErrors.username =
        "Username must not exceed 30 characters.";
    }

    if (!trimmedRoomId) {
      newFieldErrors.roomId = "Please enter the Room ID.";
    } else if (trimmedRoomId.length > 50) {
      newFieldErrors.roomId =
        "Room ID must not exceed 50 characters.";
    }

    setFieldErrors(newFieldErrors);

    // Stop if either field is invalid.
    if (newFieldErrors.username || newFieldErrors.roomId) {
      return;
    }

    setLoading(true);

    try {
      // roomService.js calls:
      // GET /api/v1/rooms/{roomName}
      await getRoom(trimmedRoomId);

      // Room exists. Pass username and Room ID to ChatPage.
      navigate(`/chat/${encodeURIComponent(trimmedRoomId)}`, {
        state: {
          username: trimmedUsername,
          roomId: trimmedRoomId,
        },
      });
    } catch (err) {
      const message = String(err.message || "");

      // Your Spring Boot controller returns HTTP 400
      // with "Room Not Found" when the room does not exist.
      if (
        err.status === 400 &&
        message.toLowerCase().includes("room not found")
      ) {
        navigate("/room-not-found", {
          state: {
            roomId: trimmedRoomId,
          },
        });

        return;
      }

      // Handle other API and connection errors.
      setError(
        message || "Unable to join the room. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="join-room-page">
      <div className="join-room-container page-container">
        <Link to="/" className="join-room-back">
          <span aria-hidden="true">←</span> Back to Home
        </Link>

        <section className="join-room-layout">
          {/* Left introduction */}
          <div className="join-room-intro">
            <span className="join-room-eyebrow">
              <span className="join-room-eyebrow__dot" />
              GOOD TO HAVE YOU HERE
            </span>

            <h1 className="join-room-title">
              Your people
              <br />
              are <span>waiting.</span>
            </h1>

            <p className="join-room-description">
              Enter your name and the Room ID you received.
              You're just one step away from the conversation.
            </p>

            <div className="join-room-tip">
              <span
                className="join-room-tip__icon"
                aria-hidden="true"
              >
                #
              </span>

              <p>
                <strong>Where's my Room ID?</strong>
                <br />
                Ask the person who created the room to share
                its ID with you.
              </p>
            </div>
          </div>

          {/* Right join form */}
          <div className="join-room-card">
            <div className="join-room-card__header">
              <div
                className="join-room-icon"
                aria-hidden="true"
              >
                ↗
              </div>

              <div>
                <h2>Join a room</h2>
                <p>Let's get you connected.</p>
              </div>
            </div>

            <form
              className="join-room-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Username field */}
              <FormInput
                id="username"
                name="username"
                label="Your Name"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);

                  setFieldErrors((previous) => ({
                    ...previous,
                    username: "",
                  }));

                  setError("");
                }}
                placeholder="e.g. Alex"
                hint="Choose the name others will see."
                error={fieldErrors.username}
                maxLength={30}
                autoComplete="nickname"
                disabled={loading}
              />

              {/* Room ID field */}
              <FormInput
                id="joinRoomId"
                name="roomId"
                label="Room ID"
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value);

                  setFieldErrors((previous) => ({
                    ...previous,
                    roomId: "",
                  }));

                  setError("");
                }}
                placeholder="e.g. friends-hangout"
                hint="Ask the room creator for their Room ID."
                error={fieldErrors.roomId}
                maxLength={50}
                autoComplete="off"
                disabled={loading}
                className="join-room-field--room"
              />

              {/* API and connection errors */}
              {error && (
                <div className="join-room-alert" role="alert">
                  <span aria-hidden="true">!</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="join-room-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="join-room-spinner" />
                    Checking room...
                  </>
                ) : (
                  <>
                    Join Conversation
                    <span aria-hidden="true">↗</span>
                  </>
                )}
              </button>
            </form>

            <div className="join-room-card__footer">
              Don't have a room yet?
              <Link to="/create-room">
                Create a room →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default JoinRoom;
