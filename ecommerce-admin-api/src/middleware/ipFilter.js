// src/middleware/ipFilter.js

const ipFilter = (req, res, next) => {
  const whitelist = process.env.IP_WHITELIST;

  // If the whitelist is not defined in the .env file, allow all traffic.
  if (!whitelist) {
    return next();
  }

  const allowedIps = whitelist.split(',').map(ip => ip.trim());
  const clientIp = req.ip;

  if (allowedIps.includes(clientIp)) {
    // If the client's IP is in the whitelist, proceed to the next middleware.
    return next();
  }

  // Otherwise, block the request.
  res.status(403).json({ message: 'Forbidden: IP address not allowed.' });
};

module.exports = ipFilter;