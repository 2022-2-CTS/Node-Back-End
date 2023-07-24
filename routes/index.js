var express = require('express');
var router = express.Router();

// ADD: body paser, cors
var cors = require('cors');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(cors());
router.use(bodyParser.json());

// TEST: POST '/api/index/test'
// router.post('/test', (req, res) => {
//   // const code = req.body.code;
//   // console.log(code);
//   res.send("success")
// })

// // TEST: GET '/api/index/test'
// router.get('/test', (req, res) => {
//   res.send("success")
// })

router.post('/test', (req, res) => {
  const loginCode = req.body.code;

  const details = {
    grant_type: 'authorization_code',
    client_id: 'e6c2fe139670b147caaf750b558a4750', // REST API KEY
    redirect_uri: 'http://localhost:3000/kakao-login',
    code: loginCode,
  };

  const formBody = Object.keys(details)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
    .join('&');

  axios({
    method: 'post',
    url: 'https://kauth.kakao.com/oauth/token/',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    data: formBody,
  })
    .then((response) => {
      const jwtToken = response.data.jwt;
      console.log('JWT발급 성공', jwtToken);
      res.json({ jwtToken });
    })
    .catch((error) => {
      console.log('JWT토큰 발급에 실패했습니다.', error);
      // res.status(500).json({ error: 'JWT토큰 발급에 실패했습니다.' });
    });
});


module.exports = router;