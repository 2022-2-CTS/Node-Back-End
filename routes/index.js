var express = require('express');
var router = express.Router();

// ADD: body paser, cors
var cors = require('cors');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(cors());
router.use(bodyParser.json());
const axios = require('axios');

router.post('/test', (req, res) => {
  const loginCode = req.body.code;
  console.log(loginCode);

  
  const grantType = 'authorization_code'
  const clientId = 'e6c2fe139670b147caaf750b558a4750' // REST API KEY
  const redirectUri = 'http://localhost:3000/kakao-login'
  const code = loginCode
  

  axios({
    method: 'post',
    url: `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${clientId}&redirect_uri=${redirectUri}&code=${code}`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })
    .then((response) => {
      console.log(JSON.stringify(response.data));
      const {access_token} = response.data
      axios.post(
          `https://kapi.kakao.com/v2/user/me`,
          {},
          {
              headers:{
                  Authorization: `Bearer ${access_token}`,
                  "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
              }
          }
      ).then((response) => {
          console.log('진짜진짜몬가몬가', response.data);
          res.send("로그인 성공!!")
      }).catch((Error)=>{
          console.log(Error);
      })
    })
    .catch((error) => {
      console.log('JWT토큰 발급에 실패했습니다.', error);
      res.send("로그인 실패..")
      // res.status(500).json({ error: 'JWT토큰 발급에 실패했습니다.' });
    });
});


module.exports = router;