const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// GET all mappings
router.get('/', mapController.getAllMappings);

// POST create new mapping
router.post('/', mapController.createMapping);

// DELETE mapping by id
router.delete('/:id', mapController.deleteMapping);

module.exports = router;
