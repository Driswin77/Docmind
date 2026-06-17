const express = require('express');
const multer = require('multer');
const { ingestFile } = require('../controllers/ingestController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temporary storage

router.post('/', upload.single('file'), ingestFile);

module.exports = router;