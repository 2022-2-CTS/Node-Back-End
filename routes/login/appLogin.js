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

//회원가입 부분
//유저의 입력으로 id와 pw를 받아옴
//데이터베이스에 저장함
//이 부분에서 중복성 검사는 따로 하지 않음. 회원가입 절차 중 앞선 입력이 완료되고 검증이 된 경우에만 버튼이 활성화되기 때문
router.post('/signup', function(req, res) {
    const ID = req.body.sendId;
    const PW = req.body.sendPw;
    var sql = 'INSERT INTO USER (ID, PW) VALUES (?, ?);';
  
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
//사용자가 입력한 아이디가 디비에 있는지 확인하는 부분
//반환값으로 rows의 길이가 1이면 데이터가 있는것, 0이면 데이터가 없는것임
router.post('/validCheck', (req, res) => {
    const validId = req.body.sendValidId;
    console.log(validId);

    var sql = 'SELECT ID FROM USER WHERE ID = ?';

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
// 사용자의 입력인 아이디와 비밀번호를 받아옴
// 비밀번호는 base64로 암호화된 정보로 전송되기 때문에 decoding이 필요함
// 사용자의 입력으로부터 들어온 비밀번호를 디코딩 한것 vs 디비에 암호화 되어 저장된 비밀번호 를 대조
// 대조를 통해 같은 비밀번호임이 인정됨 + 아이디 또한 디비에 저장됨 = 로그인 완료
router.post('/login', (req, res) => {
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

module.exports = router;