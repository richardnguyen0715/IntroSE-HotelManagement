const mongoose = require('mongoose');

/**
 * Check MongoDB connection status
 * @returns {Object} MongoDB connection status
 */
exports.checkConnectionStatus = () => {
  const state = mongoose.connection.readyState;
  let status;
  
  switch (state) {
    case 0:
      status = 'Disconnected';
      break;
    case 1:
      status = 'Connected';
      break;
    case 2:
      status = 'Connecting';
      break;
    case 3:
      status = 'Disconnecting';
      break;
    default:
      status = 'Unknown';
  }
  
  return {
    status,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    port: mongoose.connection.port
  };
};