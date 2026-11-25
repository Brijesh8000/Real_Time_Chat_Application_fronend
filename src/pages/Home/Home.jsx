
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <div className="home-page__container page-container">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero__content">
            <div className="home-eyebrow">
              <span className="home-eyebrow__dot"></span>
              A SIMPLE SPACE TO CONNECT
            </div>

            <h1 className="home-hero__title">
              Good conversations
              <br />
              start <span>here.</span>
            </h1>

            <p className="home-hero__description">
              Create a room, invite your friends, and start chatting.
              No complicated setup. Just people and conversations.
            </p>

            {/* Main Actions */}
            <div className="home-hero__actions">
              <Link
                to="/create-room"
                className="home-action home-action--primary"
              >
                <span className="home-action__icon">＋</span>

                <span>Create a Room</span>

                <span className="home-action__arrow">↗</span>
              </Link>

              <Link
                to="/join-room"
                className="home-action home-action--secondary"
              >
                <span className="home-action__icon">→</span>

                <span>Join a Room</span>
              </Link>
            </div>

            <div className="home-hero__note">
              <span className="home-hero__note-icon">✳</span>
              Simple, room-based conversations.
            </div>
          </div>

          {/* Decorative Chat Preview */}
          <div className="home-hero__visual">
            <div className="home-decoration home-decoration--one"></div>
            <div className="home-decoration home-decoration--two"></div>

            <div className="home-chat-card">
              <div className="home-chat-card__header">
                <div className="home-chat-card__heading">
                  <span className="home-chat-card__room-icon">
                    #
                  </span>

                  <div>
                    <h2>Just a little chat</h2>
                    <p>A preview of your next conversation</p>
                  </div>
                </div>

                <span
                  className="home-chat-card__dots"
                  aria-hidden="true"
                >
                  •••
                </span>
              </div>

              <div className="home-chat-card__body">
                <div className="home-message">
                  <div className="home-message__avatar home-message__avatar--coral">
                    M
                  </div>

                  <div className="home-message__content">
                    <div className="home-message__meta">
                      <strong>Maya</strong>
                      <span>10:42 AM</span>
                    </div>

                    <div className="home-message__bubble">
                      Hey! Is everyone here? 👋
                    </div>
                  </div>
                </div>

                <div className="home-message home-message--own">
                  <div className="home-message__content">
                    <div className="home-message__meta">
                      <strong>You</strong>
                      <span>10:43 AM</span>
                    </div>

                    <div className="home-message__bubble home-message__bubble--own">
                      Yep! Let's get started.
                    </div>
                  </div>

                  <div className="home-message__avatar home-message__avatar--purple">
                    Y
                  </div>
                </div>

                <div className="home-message">
                  <div className="home-message__avatar home-message__avatar--green">
                    A
                  </div>

                  <div className="home-message__content">
                    <div className="home-message__meta">
                      <strong>Arjun</strong>
                      <span>10:43 AM</span>
                    </div>

                    <div className="home-message__bubble">
                      This is going to be fun! ✨
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-chat-card__footer">
                <span>Messages make moments.</span>

                <span className="home-chat-card__footer-mark">
                  Chatter<span>.</span>
                </span>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="home-floating-note">
              <span className="home-floating-note__icon">↗</span>

              <div>
                <strong>Your people.</strong>
                <p>Your conversation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Small Feature Strip */}
        <section
          className="home-highlights"
          aria-label="Application highlights"
        >
          <div className="home-highlight">
            <span className="home-highlight__number">01</span>

            <div>
              <h3>Create</h3>
              <p>Start your own room.</p>
            </div>
          </div>

          <div className="home-highlight">
            <span className="home-highlight__number">02</span>

            <div>
              <h3>Connect</h3>
              <p>Join a room with an ID.</p>
            </div>
          </div>

          <div className="home-highlight">
            <span className="home-highlight__number">03</span>

            <div>
              <h3>Converse</h3>
              <p>Chat in real time.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
