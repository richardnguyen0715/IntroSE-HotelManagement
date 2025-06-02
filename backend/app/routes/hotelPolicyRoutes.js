const express = require('express');
const {
    createHotelPolicy,
    getHotelPolicy,
    getHotelPolicyById,
    resetHotelPolicyToDefault,
    deleteHotelPolicy,
    addCustomField,
    updatePolicyField,
    updateMultipleFields,
    deletePolicyField
} = require('../controllers/policyController');
const router = express.Router();


router
    .route('/')
    .get(getHotelPolicy)
    .post(createHotelPolicy)
    .delete(deleteHotelPolicy);

// Route for getting hotel policy by ID: GET /api/system/policy/:id
// Route for updating hotel policy by ID: PUT /api/system/policy/:id
// Route for partially updating hotel policy: PATCH /api/system/policy/:id
// Route for deleting hotel policy: DELETE /api/system/policy/:id

router
    .route('/:id')
    .get(getHotelPolicyById)
    .delete(deleteHotelPolicy);

router
    .route('/reset')
    .post(resetHotelPolicyToDefault);

router
    .route('/add-field')
    .post(addCustomField);

router
    .route('/field/:fieldName')
    .put(updatePolicyField)
    .delete(deletePolicyField);

router
    .route('/update-fields')
    .put(updateMultipleFields);

module.exports = router;