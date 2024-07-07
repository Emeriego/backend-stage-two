const express = require('express');
const { getAllOrganisations, getOrganisationById, getUserOrganisations, createOrganisation, addUserToOrganisation } = require('../controllers/orgController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all-organisations', getAllOrganisations);
router.get('/organisations', authMiddleware, getUserOrganisations); // Protect this route with the same middleware
router.get('/organisations/:orgId', authMiddleware, getOrganisationById); // Route for getting a specific organisation by its ID, protected by middleware
router.post('/organisations', authMiddleware, createOrganisation); // Route for creating a new organisation, protected by middleware
router.post('/organisations/:orgId/users', authMiddleware, addUserToOrganisation); // Route for adding a user to an organisation, protected by middleware

module.exports = router;
