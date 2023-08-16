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
//유저의 입력으로 id와 pw를 받아옴
//데이터베이스에 저장함
//이 부분에서 중복성 검사는 따로 하지 않음. 회원가입 절차 중 앞선 입력이 완료되고 검증이 된 경우에만 버튼이 활성화되기 때문
router.post('/', function(req, res) {
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
router.post('/check/id/valid', (req, res) => {
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


//닉네임 설정 기능
//닉네임이 null인지 아닌지 확인
router.post("/nickname/check", (req, res) => {
    const registerType = req.body.registerType;
    const userId = req.body.userId;

    var sql = ""

    if(registerType == "USER"){
        sql = "SELECT APPNICKNAME FROM " + registerType + " WHERE ID = " + '"' +  userId + '"'; 
    }
    else{
        sql = "SELECT APPNICKNAME FROM " + registerType + " WHERE NICKNAME = " + '"' + userId + '"'; 
    }
    
    maria.query(sql, function(err, rows, fields){
        if(!err){
            console.log(rows[0].APPNICKNAME);
            if(rows[0].APPNICKNAME != null){
                res.send("exist");
            }else{
                res.send("not exist");
            }
        }else{
            console.log(err);
        }
    })
})

//닉네임이 null인 경우 새롭게 저장
router.post("/nickname/set", (req, res) => {

    const registerType = req.body.registerType;
    const userId = req.body.userId;
    const nickname = req.body.nickname;

    var sql = ""

    if(registerType == "USER"){
        sql = "UPDATE " + registerType + " SET APPNICKNAME = ? WHERE ID = " + '"' + userId + '"';
    }
    else{
        sql = "UPDATE " + registerType + " SET APPNICKNAME = ? WHERE NICKNAME = " + '"' + userId + '"';
    }
    maria.query(sql, [nickname], function(err, rows, fields){
        if(!err){
            console.log("DB저장 성공");
            res.send("200");
        }else{
            console.log("DB저장 실패");
            console.log(err)
        }
    })
})

module.exports = router;