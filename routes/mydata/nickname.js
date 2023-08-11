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

router.post("/setOwnNickname", (req, res) => {

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