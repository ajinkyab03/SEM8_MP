export const BASE_URL = "http://localhost:5000/api/v1";

const normalizeToken = (rawToken) => {
  if (!rawToken) return "";
  let token = String(rawToken).trim();

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim();
  }

  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token === "[object Object]"
  ) {
    return "";
  }

  // Basic JWT shape guard.
  if (token.split(".").length !== 3) return "";

  return token;
};

export const getToken = () => {
  const storedToken = localStorage.getItem("token");
  return normalizeToken(storedToken);
};

// Backward-compatible export for existing imports that interpolate `${token}`.
export const token = {
  toString: () => getToken(),
  valueOf: () => getToken(),
};
