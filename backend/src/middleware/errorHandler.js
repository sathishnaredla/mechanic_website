export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error, _req, res, _next) {
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that value already exists' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid record identifier' });
  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status >= 500 ? 'An unexpected server error occurred' : error.message });
}