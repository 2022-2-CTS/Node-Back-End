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

/*
|-----------------------------|
|           앱 로그인           |
|-----------------------------|
*/

// 앱 로그인 기능
// 사용자의 입력인 아이디와 비밀번호를 받아옴
// 비밀번호는 base64로 암호화된 정보로 전송되기 때문에 decoding이 필요함
// 사용자의 입력으로부터 들어온 비밀번호를 디코딩 한것 vs 디비에 암호화 되어 저장된 비밀번호 를 대조
// 대조를 통해 같은 비밀번호임이 인정됨 + 아이디 또한 디비에 저장됨 = 로그인 완료
router.post('/', (req, res) => {
    const id = req.body.sendId;
    const pw = req.body.sendPw;
    
    //culture은 암호해독에 필요한 키 이다. 나중에 수정과 동시에 숨겨야 함
    const originalPw = crypto.AES.decrypt(pw, 'culture').toString(crypto.enc.Utf8);
    console.log('originalPw = ', originalPw);

    // console.log(id, pw)

    var sql = 'SELECT * FROM USER WHERE ID = ?';

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
//로그인과 동시에 jwt가 발급됨
//jwt의 정보를 분석해서 유효시간이 다 되지 않았다면 자동로그인
//아니면 로그아웃의 절차를 밟음.
router.post('/status', (req, res) => {
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


/*
|-----------------------------|
|         카카오 로그인          |
|-----------------------------|
*/

var kakaoAccessToken = ''

router.post('/kakao', (req, res) => {
    const loginCode = req.body.code;
    console.log(loginCode);


    const grantType = 'authorization_code'
    const clientId = 'e6c2fe139670b147caaf750b558a4750' // REST API KEY
    const redirectUri = 'http://localhost:3000/login/kakao'
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

            var sqlFind = 'SELECT ID FROM KAKAO WHERE ID = ?;';
            var sqlInsert = 'INSERT INTO KAKAO (ID, NICKNAME) VALUES (?, ?);';
            maria.query(sqlFind, kakaoId, function(err, rows, fields){
                if(!err){
                    console.log("여기야?")
                    console.log(rows)
                    console.log(fields)
                    if (rows.length == 0){

                        // res.send("success")
                        console.log("여기도?")
                        console.log(rows)
                        maria.query(sqlInsert, [kakaoId, kakaoNickname], function(err, rows, feilds){
                            if(!err){
                                console.log('디비에 저장 성공')
                                console.log(rows)
                            }else{
                                console.log("Error : ", err)
                            }
                        })
                    }else{
                        const token = jwt.sign({id:kakaoNickname}, secretKey, {expiresIn:'1h'})
                        const data = "로그인 성공!!"
                        res.send({token, data, kakaoNickname})
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

router.post('/kakao/status', (req, res) => {
    const jwtData = req.body.kakaoAccessToken;
    console.log(req.body.kakaoAccessToken);
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



/*
|-----------------------------|
|         네이버 로그인          |
|-----------------------------|
*/

var naverAccessToken = ''

router.post('/naver', (req, res) =>  {
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

router.post('/naver/status', (req, res) => {
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