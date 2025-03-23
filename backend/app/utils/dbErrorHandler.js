/**
 * Get unique error field name from MongoDB error object
 * @param {Object} err - MongoDB error object
 * @returns {String} Unique error field name
 */
const getUniqueErrorMessage = (err) => {
    let output;
    try {
      let fieldName = err.message.substring(
        err.message.lastIndexOf('index:') + 7,
        err.message.lastIndexOf('_1')
      );
      output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
    } catch (ex) {
      output = 'Unique field already exists';
    }
    return output;
  };
  
  /**
   * Handle MongoDB error responses
   * @param {Object} err - MongoDB error object
   * @returns {Object} Error object with message
   */
  exports.handleError = (err) => {
    let message = '';
    if (err.code) {
      switch (err.code) {
        case 11000:
        case 11001:
          message = getUniqueErrorMessage(err);
          break;
        default:
          message = 'Database error';
      }
    } else {
      for (let errName in err.errors) {
        if (err.errors[errName].message) message = err.errors[errName].message;
      }
    }
    return { message };
  };