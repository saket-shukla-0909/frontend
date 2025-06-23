
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload)); // decode Base64 payload
    return decoded.exp * 1000 > Date.now(); // check expiry
  } catch (err) {
    return false; // if token invalid or not JWT
  }
};
