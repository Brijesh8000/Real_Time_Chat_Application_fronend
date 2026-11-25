
// src/services/roomService.js

const ROOM_API_BASE = (
  import.meta.env.VITE_ROOM_API_BASE || "/api/v1/rooms"
).trim().replace(/\/+$/, "");

// Check API configuration
function getApiBase() {
  if (!ROOM_API_BASE) {
    throw new Error(
      "Room API URL is not configured. Please check your .env file."
    );
  }

  return ROOM_API_BASE;
}

// Build URLs supporting both relative and absolute API bases
function buildApiUrl(path = "", params = {}) {
  const url = new URL(getApiBase(), window.location.origin);

  if (path) {
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Handle HTTP requests and backend responses
async function apiRequest(url, options = {}) {
  const { headers: customHeaders, ...restOptions } = options;

  let response;

  try {
    response = await fetch(url, {
      ...restOptions,
      headers: {
        Accept: "application/json",
        ...customHeaders,
      },
    });
  } catch (error) {
    throw new Error(
      `Unable to connect to backend. Please check your API URL and Vite proxy configuration. Details: ${error.message}`
    );
  }

  const responseText = await response.text();

  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      (typeof data === "string" ? data : null) ||
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}.`;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// 1. Create a new room
// POST /api/v1/rooms?roomName=...
export async function createRoom(roomName) {
  const name = roomName?.trim();

  if (!name) {
    throw new Error("Please enter a Room ID.");
  }

  const url = buildApiUrl("", {
    roomName: name,
  });

  return apiRequest(url, {
    method: "POST",
  });
}

// 2. Get a room by its name
// GET /api/v1/rooms/{roomName}
export async function getRoom(roomName) {
  const name = roomName?.trim();

  if (!name) {
    throw new Error("Please enter a Room ID.");
  }

  const url = buildApiUrl(encodeURIComponent(name));

  return apiRequest(url, {
    method: "GET",
  });
}

// 3. Get previous messages from a room
// GET /api/v1/rooms/{roomName}/messages
export async function getRoomMessages(roomName) {
  const name = roomName?.trim();

  if (!name) {
    throw new Error("Please enter a Room ID.");
  }

  const url = buildApiUrl(
    `${encodeURIComponent(name)}/messages`
  );

  return apiRequest(url, {
    method: "GET",
  });
}
