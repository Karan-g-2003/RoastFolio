// Central error handler — all thrown errors end up here.
// Never expose raw error messages to the client in production.
export function errorHandler(err, _req, res, _next) {
  console.error("[Error]", err.message);
  const status  = err.status  || 500;
  const message = err.message || "Something went wrong. Please try again.";
  res.status(status).json({ error: message });
}
