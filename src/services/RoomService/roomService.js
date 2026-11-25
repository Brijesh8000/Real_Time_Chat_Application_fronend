
// src/services/roomService.js

const IS_PRODUCTION = import.meta.env.PROD;

const ROOM_API_BASE = (
  import.meta.env.VITE_ROOM_API_BASE ||
  (IS_PRODUCTION ? "" : "/api/v1/rooms")
).trim().replace(/\/+$/, "");

// 1. Validate API configuration
function getApiBase() {
  if (!ROOM_API_BASE) {
    throw new Error(
      "Production API URL is missing. Configure VITE_ROOM_API_BASE."
    );
  }

  const url = new URL(ROOM_API_BASE, window.location.origin);

  if (IS_PRODUCTION && url.origin === window.location.origin) {
    throw new Error(
      "Production API must use an absolute backend URL."
    );
  }

  if (IS_PRODUCTION && url.protocol !== "https:") {
    throw new Error(
      "Production API must use HTTPS."
    );
  }

  return url.toString().replace(/\/+$/, "");
}

// 2. Build API URLs
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

// 3. Handle API requests and backend responses
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
      `Unable to connect to backend. Check your API URL and backend availability. Details: ${error.message}`
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

// 4. Create a new room
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

// 5. Get a room by its name
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

// 6. Get previous messages from a room
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
