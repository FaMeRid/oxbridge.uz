// src/features/about/utils/date.js

export const getDaysUntil = (dateString) => {
  const diff = new Date(dateString) - new Date();
  return Math.ceil(diff / 86400000);
};

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
