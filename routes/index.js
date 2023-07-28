var express = require('express');
var router = express.Router();

// ADD: body paser, cors
var cors = require('cors');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(cors());
router.use(bodyParser.json());
const axios = require('axios');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const maria = require('../database/connect/maria');

const crypto = require('crypto-js');

const secretKey = 'culture';

//회원가입 부분
router.post('/signup', function(req, res) {
  const ID = req.body.sendId;
  const PW = req.body.sendPw;
  var sql = 'INSERT INTO user (ID, PW) VALUES (?, ?);';

  console.log(ID, PW);
  maria.query(sql, [ID, PW], function(err, rows, fields){
    if(!err) {
      console.log("되는거야 뭐야");
      res.send("가입완료");
      console.log(rows);
    }else{
      console.log("error : ", err);
    }
  })
})

//회원가입 유효 아이디 확인 부분
router.post('/validCheck', (req, res) => {
  const validId = req.body.sendValidId;
  console.log(validId);

  var sql = 'SELECT ID FROM user WHERE ID = ?';

  maria.query(sql, validId, function(err, rows, fields){
    if(!err){
      console.log(rows.length)
      console.log(fields)
      if (rows.length == 0){
        res.send("success")
      }else{
        res.send("fail")
      }
    }else{
      console.log("error", err)
    }
  })
})

// 앱 로그인 기능
router.post('/login', (req, res) => {
  const id = req.body.sendId;
  const pw = req.body.sendPw;
  
  // const bytes = crypto.AES.encrypt(pw, 'culture').toString();
  // console.log('originalbytes = ', bytes);
  const originalPw = crypto.AES.decrypt(pw, 'culture').toString(crypto.enc.Utf8);
  console.log('originalPw = ', originalPw);

  // console.log(id, pw)

  var sql = 'SELECT * FROM user WHERE ID = ?';

  maria.query(sql, [id], function(err, rows, fields){
    if(!err){
      // console.log(rows[0].PW)
      // const bytesInDB = crypto.AES.encrypt(rows[0].PW, 'culture').toString();
      if (rows.length == 0){
        res.send("fail")
      }else{
        const originalPwInDB = crypto.AES.decrypt(rows[0].PW, 'culture').toString(crypto.enc.Utf8);
        console.log(originalPwInDB)
        console.log("제발!!")
        if (originalPw == originalPwInDB){
          console.log("우와!! 성공!!")
          const token = jwt.sign({id : id}, secretKey, {expiresIn:'1h'})
          res.json({token})
        }
      }
    }else{
      console.log(err)
    }
  })
})

//이미 로그인 된 유저인지 확인하는 부분
router.post('/alreadyLogined', (req, res) => {
  const jwtData = req.body.validToken;
  console.log(req.body.validToken);
  jwt.verify(jwtData, secretKey, (err, decoded) => {
    if (!err){
      console.log(decoded);
      res.send(decoded);
    }else{
      console.log('error : ', err);
      res.send(err);
    }
  })
})

//카카오 로그인 구현부

var kakaoAccessToken = ''

router.post('/kakaoLogin', (req, res) => {
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
      const {access_token} = response.data;
      kakaoAccessToken = access_token;
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
        console.log('진짜진짜몬가몬가', response.data.id);
        console.log('진짜진짜몬가몬가', response.data.kakao_account.profile.nickname);
        
        const kakaoId = (response.data.id).toString()
        const kakaoNickname = response.data.kakao_account.profile.nickname;

        var sqlFind = 'SELECT ID FROM kakaouser WHERE ID = ?;';
        var sqlInsert = 'INSERT INTO kakaouser (ID, NICKNAME) VALUES (?, ?);';
        maria.query(sqlFind, kakaoId, function(err, rows, fields){
          if(!err){
            console.log("여기야?")
            console.log(rows.length)
            console.log(fields)
            if (rows.length == 0){
              // res.send("success")
              console.log("여기도?")
              maria.query(sqlInsert, [kakaoId, kakaoNickname], function(err, rows, feilds){
                if(!err){
                  console.log('디비에 저장 성공')
                  console.log(rows)
                }else{
                  console.log("Error : ", err)
                }
              })
            }else{
              res.send("로그인 성공!!")
            }
          }else{
            console.log("error", err)
          }
        })
      }).catch((err) => {
        console.log(err)
      })
        // res.send("로그인 성공!!")
    }).catch((Error)=>{
        console.log(Error);
    })
  })

router.get('/kakaoLoginToken', (req, res) => {
  res.send(kakaoAccessToken)
})
  


//네이버 로그인 구현부

var naverAccessToken = ''

router.post('/naverLogin', (req, res) =>  {
  const loginCode = req.body.code;
  const stateCode = req.body.state;

  console.log(loginCode);
  console.log(stateCode);

  const clientId = 'o9JmjRrP1GmmANohGaH1';
  const clientSecret = 'NP5C6CJ72j'
  const redirectUri = 'http://localhost:3000/naver-login'

  apiUrl = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
  +clientId + '&client_secret=' + clientSecret + '&redirect_uri=' + redirectUri + '&code=' + loginCode + '&state=' + stateCode;
  axios({
    method : 'get',
    url : apiUrl,
    header : {'X-Naver-Client-Id':clientId, 'X-Naver-Client-Secret':clientSecret}
  })
  .then((response) => {
    console.log(JSON.stringify(response.data))
    const {token_type} = response.data
    const {access_token} = response.data
    naverAccessToken = access_token;
    console.log(access_token)
    axios.post(
      'https://openapi.naver.com/v1/nid/me',
      {},
      {
        headers : {
          Authorization : token_type + ' ' + access_token
        }
      }
    ).then((response) => {
      console.log('이번에도 진짜진짜 몬가몬가다', response.data);

      const naverId = response.data.response.id
      const naverNickname = response.data.response.nickname

      console.log(naverId, naverNickname)

      var sqlFind = 'SELECT ID FROM naveruser WHERE ID = ?;';
      var sqlInsert = 'INSERT INTO naveruser (ID, NICKNAME) VALUES (?, ?);';

      maria.query(sqlFind, naverId, function(err, rows, feilds){
        if(!err){
          if(rows.length == 0){
            maria.query(sqlInsert, [naverId, naverNickname], function(err, rows, feilds){
              if(!err){
                console.log('디비에 저장 성공')
                console.log(rows)
              }else{
                console.log("insert error ", err)
              }
            })
          }else{
            res.send("로그인 성공!!")
          }
        }else{
          console.log("find error", err)
        }
      })
      // res.send("로그인 성공!!")
    }).catch((Error) => {
      res.send("진짜루..?")
      console.log(Error);
      res.send(Error)
    })
  })
  .catch((error) => {
    console.log('JWT토큰 발급에 실패했습니다.', error);
    res.send("로그인 실패..")
    // res.status(500).json({ error: 'JWT토큰 발급에 실패했습니다.' });
  });
});

router.get('/naverLoginToken', (req, res) => {
  res.send(naverAccessToken)
})

router.post('/naverLoginTokenAccess', (req, res) => {
  const naverToken = req.body.naverAccessToken
  console.log(naverToken)
  axios.get(
    "https://openapi.naver.com/v1/nid/me",
    {
      headers:{
        Authorization : `Bearer ${naverToken}`,
      },
    }
  )
  .then((response) => {
    console.log(response.data); // 서버 응답의 데이터를 출력합니다.
    if(response.data.code != -401){
      console.log("나한테")
      res.send('valid')
    }else{
      console.log("왜이래")
      res.send('invalid')
    }
  })
  .catch((err) => {
    console.log("err", err); // 오류가 발생한 경우 오류를 출력합니다.
  });
})

//구글 로그인 구현부
router.post('/googleLogin', (req, res) => {
  const credential = req.body.credentialCode
  const clientId = req.body.clientIdCode

  console.log(credential)
  console.log(clientId)
  
  const decodedToken = jwt.decode(credential, {complete : true});

  console.log(decodedToken);

  if (decodedToken.payload.aud !== clientId){
    console.log('Invalid client ID.');
    res.send("로그인 실패..")
    return;
  }else{
    res.send("로그인 성공!!")
  }
      
})

module.exports = router;