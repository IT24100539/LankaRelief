const express = require('express');
const {
  listRequests,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/requestController');

const router = express.Router();

router.get('/', listRequests);
router.post('/', createRequest);
router.patch('/:id', updateRequestStatus);
router.delete('/:id', deleteRequest);

module.exports = router;
