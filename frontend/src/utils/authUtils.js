export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode payload
    return payload.userId || payload.id || payload._id || null; // depends on your backend
  } catch (e) {
    console.error("Failed to parse token:", e);
    return null;
  }
}