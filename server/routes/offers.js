const express = require('express');
const {
  listOffers,
  createOffer,
  updateOfferStatus,
  deleteOffer,
} = require('../controllers/offerController');

const router = express.Router();

router.get('/', listOffers);
router.post('/', createOffer);
router.patch('/:id', updateOfferStatus);
router.delete('/:id', deleteOffer);

module.exports = router;
