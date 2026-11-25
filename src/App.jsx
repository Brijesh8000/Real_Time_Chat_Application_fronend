
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";

// Pages
import Home from "./pages/Home/Home";
import CreateRoom from "./pages/CreateRoom/CreateRoom";
import JoinRoom from "./pages/JoinRoom/JoinRoom";
import ChatPage from "./pages/ChatPage/ChatPage";
import RoomNotFound from "./pages/RoomNotFound/RoomNotFound";

function App() {
  return (
    <div className="app-layout">
      {/* Common Navbar */}
      <Navbar />

      {/* Application Pages */}
      <main className="app-content">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Create Room Page */}
          <Route
            path="/create-room"
            element={<CreateRoom />}
          />

          {/* Join Room Page */}
          <Route
            path="/join-room"
            element={<JoinRoom />}
          />

          {/* Chat Page */}
          <Route
            path="/chat/:roomId"
            element={<ChatPage />}
          />

          {/* Room Not Found Page */}
          <Route
            path="/room-not-found"
            element={<RoomNotFound />}
          />

          {/* Invalid URLs */}
          <Route
            path="*"
            element={<RoomNotFound />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
