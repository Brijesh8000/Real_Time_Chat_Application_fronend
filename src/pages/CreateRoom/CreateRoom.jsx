
import { useState } from "react";
import { Link } from "react-router-dom";

import FormInput from "../../components/FormInput/FormInput";
import { createRoom } from "../../services/RoomService/roomService";

import "./CreateRoom.css";

function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [copied, setCopied] = useState(false);

  // Create a room using the reusable room service.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedRoomId = roomId.trim();

    setError("");
    setCopied(false);

    if (!trimmedRoomId) {
      setError("Please enter a Room ID.");
      return;
    }

    if (trimmedRoomId.length > 50) {
      setError("Room ID must not exceed 50 characters.");
      return;
    }

    setLoading(true);

    try {
      // roomService.js calls your Spring Boot API.
      const data = await createRoom(trimmedRoomId);

      // Use the room name returned by the backend.
      const actualRoomName =
        data?.roomName ||
        data?.roomId ||
        data?.name ||
        trimmedRoomId;

      setRoomId(actualRoomName);
      setCreatedRoomId(actualRoomName);
      setError("");
    } catch (err) {
      setError(
        err.message ||
          "Unable to create the room. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Copy the created room ID.
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(createdRoomId);
      setCopied(true);
      setError("");
    } catch {
      setCopied(false);
      setError(
        "Unable to copy automatically. Please copy the Room ID manually."
      );
    }
  };

  // Reset the form to create another room.
  const handleReset = () => {
    setRoomId("");
    setCreatedRoomId("");
    setError("");
    setCopied(false);
  };

  return (
    <main className="create-room-page">
      <div className="create-room-container page-container">
        <Link to="/" className="create-room-back">
          <span aria-hidden="true">←</span> Back to Home
        </Link>

        <section className="create-room-layout">
          {/* Left: Page introduction */}
          <div className="create-room-intro">
            <span className="create-room-eyebrow">
              <span className="create-room-eyebrow__dot" />
              YOUR SPACE, YOUR PEOPLE
            </span>

            <h1 className="create-room-title">
              Start a
              <br />
              conversation
              <br />
              <span>of your own.</span>
            </h1>

            <p className="create-room-description">
              Create a room, give it a unique ID, and make a
              space where your conversations can begin.
            </p>

            <div className="create-room-tip">
              <span
                className="create-room-tip__icon"
                aria-hidden="true"
              >
                ✳
              </span>

              <p>
                <strong>A little tip</strong>
                <br />
                Choose a room ID that's easy to share with
                the people you want to invite.
              </p>
            </div>

            <div
              className="create-room-decoration"
              aria-hidden="true"
            >
              <span>LET'S TALK</span>
              <span>↗</span>
            </div>
          </div>

          {/* Right: Create room form */}
          <div className="create-room-card">
            {!createdRoomId ? (
              <>
                <div className="create-room-card__header">
                  <div
                    className="create-room-icon"
                    aria-hidden="true"
                  >
                    +
                  </div>

                  <div>
                    <h2>Create a room</h2>
                    <p>It all starts with a Room ID.</p>
                  </div>
                </div>

                <form
                  className="create-room-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Reusable Room ID input */}
                  <FormInput
                    id="roomId"
                    name="roomId"
                    label="Room ID"
                    value={roomId}
                    onChange={(event) => {
                      setRoomId(event.target.value);
                      setError("");
                    }}
                    placeholder="e.g. friends-hangout"
                    hint="Choose a unique ID for your room."
                    error={error}
                    maxLength={50}
                    autoComplete="off"
                    disabled={loading}
                  />

                  <button
                    type="submit"
                    className="create-room-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="create-room-spinner" />
                        Creating room...
                      </>
                    ) : (
                      <>
                        Create Room
                        <span aria-hidden="true">↗</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="create-room-card__footer">
                  Already have a Room ID?
                  <Link to="/join-room">
                    Join a room →
                  </Link>
                </div>
              </>
            ) : (
              /* Room creation success */
              <div
                className="create-room-success"
                aria-live="polite"
              >
                <div
                  className="create-room-success__icon"
                  aria-hidden="true"
                >
                  ✓
                </div>

                <span className="create-room-success__eyebrow">
                  ROOM CREATED
                </span>

                <h2>Your room is ready!</h2>

                <p className="create-room-success__description">
                  Share this Room ID with others so they can
                  find your room.
                </p>

                <div className="create-room-room-id">
                  <div>
                    <span>YOUR ROOM ID</span>
                    <strong>{createdRoomId}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyRoomId}
                    className="create-room-copy"
                    aria-label="Copy Room ID"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>

                {error && (
                  <p
                    className="create-room-alert"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <Link
                  to="/join-room"
                  state={{ roomId: createdRoomId }}
                  className="create-room-submit create-room-continue"
                >
                  Continue to Join Room
                  <span aria-hidden="true">→</span>
                </Link>

                <button
                  type="button"
                  className="create-room-reset"
                  onClick={handleReset}
                >
                  Create another room
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default CreateRoom;
