const express = require('express');
const { checkConnectionStatus } = require('../utils/dbStatus');
const router = express.Router();

// Route to check database status
router.get('/db-status', (req, res) => {
  const status = checkConnectionStatus();
  res.status(200).json({ status });
});

module.exports = router;