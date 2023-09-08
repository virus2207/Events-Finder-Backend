const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/:query/:number', (req, res) => {

    res.write(req.params.query + ": " + req.params.number);
    res.end();
});

module.exports = router;