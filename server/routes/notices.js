const express = require('express');
const {
  listNotices,
  createNotice,
  closeNotice,
  deleteNotice,
} = require('../controllers/noticeController');

const router = express.Router();

router.get('/', listNotices);
router.post('/', createNotice);
router.patch('/:id', closeNotice);
router.delete('/:id', deleteNotice);

module.exports = router;
