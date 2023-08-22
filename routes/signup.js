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
    const ID = req.body.userId;
    const PW = req.body.userPw;
    var sql = 'INSERT INTO USER (ID, PW) VALUES (?, ?);';
  
    maria.query(sql, [ID, PW], function(err, rows, fields){
        if(!err) {
            res.status(200).json({status:"success", data:null});
        }else{
            res.status(400).json({status:"fail", data:{msg:"회원가입에 실패했습니다. 다시 시도해주세요"}})
            res.status(500).json({status:"error", msg:"서버 오류 발생"})
        }
    })
})
  
//회원가입 유효 아이디 확인 부분
//사용자가 입력한 아이디가 디비에 있는지 확인하는 부분
//반환값으로 rows의 길이가 1이면 데이터가 있는것, 0이면 데이터가 없는것임
router.post('/check/id/valid', (req, res) => {
    const validId = req.body.userId;
    console.log(validId);

    var sql = 'SELECT ID FROM USER WHERE ID = ?';

    maria.query(sql, validId, function(err, rows, fields){
    if(!err){
        if (rows.length == 0){
            res.status(200).json({status:"success", data:null});
        }else{
            res.status(400).json({status:"fail", data:{msg:"중복된 아이디 입니다. 다시 시도해주세요"}})
        }
    }else{
        res.status(500).json({status:"error", msg:"서버 오류 발생"})
    }
    })
})


//닉네임 설정 기능
//닉네임이 null인지 아닌지 확인
router.post("/nickname/status", (req, res) => {
    const userType = req.body.userType;
    const userId = req.body.userId;

    var sql = ""

    if(userType == "USER"){
        sql = "SELECT APPNICKNAME FROM " + userType + " WHERE ID = " + '"' +  userId + '"'; 
    }
    else{
        sql = "SELECT APPNICKNAME FROM " + userType + " WHERE NICKNAME = " + '"' + userId + '"'; 
    }
    
    maria.query(sql, function(err, rows, fields){
        if(!err){
            if(rows[0].APPNICKNAME != null){
                var nickname = rows[0].APPNICKNAME;
                res.status(200).json({status:"success", data:nickname});
            }else{
                res.status(400).json({status:"fail", data:{msg:"설정된 닉네임이 없습니다. 닉네임 설정으로 이동합니다."}})
            }
        }else{
            res.status(500).json({status:"error", msg:"서버 오류 발생"})
        }
    })
})

//닉네임이 null인 경우 새롭게 저장
router.post("/nickname", (req, res) => {

    const userType = req.body.userType;
    const userId = req.body.userId;
    const nickname = req.body.nickname;

    var sql = ""

    if(userType == "USER"){
        sql = "UPDATE " + userType + " SET APPNICKNAME = ? WHERE ID = " + '"' + userId + '"';
    }
    else{
        sql = "UPDATE " + userType + " SET APPNICKNAME = ? WHERE NICKNAME = " + '"' + userId + '"';
    }
    maria.query(sql, [nickname], function(err, rows, fields){
        if(!err){
            res.status(200).json({status:"success", data:nickname});
        }else{
            res.status(400).json({status:"fail", data:{msg:"닉네임 설정에 실패했습니다. 다시 시도해주세요."}})
            res.status(500).json({status:"error", msg:"서버 오류 발생"})
        }
    })
})

module.exports = router;