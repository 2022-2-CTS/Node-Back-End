var express = require('express');
var router = express.Router();

// ADD: body paser, cors
var cors = require('cors');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(cors());
router.use(bodyParser.json());

// TEST: POST '/api/index/test'
router.post('/test', (req, res) => {
  const code = req.body.code;
  console.log(code);
  res.send("success")
})

module.exports = router;