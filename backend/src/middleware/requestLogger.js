/**
 * Request Logging Middleware
 * Logs all incoming HTTP requests to the console
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const method = req.method.padEnd(6);
  const route = req.originalUrl;
  const status = res.statusCode;

  // Log request details
  console.log(`\n [${timestamp}] ${method} ${route}`);

  // Store original send function
  const originalSend = res.send;

  // Override send to log response
  res.send = function (data) {
    // Log response status with color coding
    const statusColor = status >= 400 ? '🔴' : status >= 300 ? '🟡' : '🟢';
    console.log(`${statusColor} Response Status: ${status}\n`);

    // Call the original send function
    return originalSend.call(this, data);
  };

  next();
};

export default requestLogger;
