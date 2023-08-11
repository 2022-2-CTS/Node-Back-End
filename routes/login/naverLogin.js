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

var naverAccessToken = ''

router.post('/naverLogin_', (req, res) =>  {
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

        var sqlFind = 'SELECT ID FROM NAVER WHERE ID = ?;';
        var sqlInsert = 'INSERT INTO NAVER (ID, NICKNAME) VALUES (?, ?);';

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
                    const token = jwt.sign({id:naverNickname}, secretKey, {expiresIn:'1h'})
                    const data = "로그인 성공!!"
                    res.send({token, data, naverNickname})
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

router.post('/alreadyLoginedNaver', (req, res) => {
    const jwtData = req.body.naverAccessToken
    console.log(req.body.naverAccessToken);
    jwt.verify(jwtData, secretKey, (err, decoded) => {
        if(!err){
            console.log(decoded);
            res.send(decoded);
        }else{
            console.log('error : ', err);
            res.send(err);
        }
    })
})

module.exports = router;