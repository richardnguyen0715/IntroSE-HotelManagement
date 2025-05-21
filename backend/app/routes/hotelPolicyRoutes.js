const express = require('express');
const {
    createHotelPolicy,
    getHotelPolicy,
    getHotelPolicyById,
    updateHotelPolicy,
    updateHotelPolicyById,
    partialUpdatePolicy,
    resetHotelPolicyToDefault,
    deleteHotelPolicy,
} = require('../controllers/policyController');
const router = express.Router();


router
    .route('/')
    .get(getHotelPolicy)
    .post(createHotelPolicy)
    .put(updateHotelPolicy)
    .delete(deleteHotelPolicy);

// Route for getting hotel policy by ID: GET /api/system/policy/:id
// Route for updating hotel policy by ID: PUT /api/system/policy/:id
// Route for partially updating hotel policy: PATCH /api/system/policy/:id
// Route for deleting hotel policy: DELETE /api/system/policy/:id

router
    .route('/:id')
    .get(getHotelPolicyById)
    .put(updateHotelPolicyById)
    .patch(partialUpdatePolicy)
    .delete(deleteHotelPolicy);

router
    .route('/reset')
    .post(resetHotelPolicyToDefault);

module.exports = router;