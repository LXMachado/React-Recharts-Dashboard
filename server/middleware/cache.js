// Simple in-memory TTL cache for API responses
const cache = new Map();

export const cacheMiddleware = (ttlSeconds = 300) => {
  return (req, res, next) => {
    // Create cache key from request
    const key = `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;

    // Check if we have a cached response
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      // Serve from cache
      res.set(cached.headers);
      return res.status(cached.status).json(cached.data);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache response
    res.json = function(data) {
      const response = {
        data,
        status: res.statusCode,
        headers: {
          'Content-Type': 'application/json',
          ...res.getHeaders()
        },
        expiry: Date.now() + (ttlSeconds * 1000)
      };

      cache.set(key, response);

      // Clean up expired entries periodically
      if (cache.size > 1000) {
        cleanupExpiredCache();
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

function cleanupExpiredCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expiry < now) {
      cache.delete(key);
    }
  }
}

// Cleanup expired entries every 5 minutes
setInterval(cleanupExpiredCache, 5 * 60 * 1000);