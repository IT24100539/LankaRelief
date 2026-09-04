const express = require('express');
const {
  listShelters,
  createShelter,
  updateShelter,
  deleteShelter,
} = require('../controllers/shelterController');

const router = express.Router();

router.get('/', listShelters);
router.post('/', createShelter);
router.patch('/:id', updateShelter);
router.delete('/:id', deleteShelter);

module.exports = router;
