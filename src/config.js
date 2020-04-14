module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8000,
  CLIENT_ORIGIN:
    process.env.NODE_ENV === "production"
      ? "https://ifeelthat-app.now.sh/"
      : "http://localhost:3000/",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://carlo@localhost/ifeelthat",
};
