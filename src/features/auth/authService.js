const API = "/api"; // или из .env

export const login = async (email, password) => {
  // пока без backend → mock
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  return user;
};

export const register = async (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const logout = () => {
  localStorage.removeItem("user");
};