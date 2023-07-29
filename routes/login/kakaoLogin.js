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
const maria = require('../../database/connect/maria');

const crypto = require('crypto-js');

const secretKey = 'culture';


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

module.exports = router;