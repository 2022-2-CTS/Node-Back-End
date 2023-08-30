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


//찜 목록 저장하기
router.post("/favorites", (req, res) => {
    const json = req.body.favoriteObject;
    const obj = JSON.parse(json)

    const objData = [
        obj.userId,
        obj.event.title,
        obj.event.location,
        obj.event.startDate,
        obj.event.endDate,
        obj.event.time,
        obj.event.price,
        obj.event.src
    ]

    for (var i=0; i<objData.length; i++){
        if(objData[i] == null || objData[i] == ""){
            res.status(400).json({
                status: "fail",
                data: {
                    msg: "행사 찜하기에 실패했습니다. 다시 시도해주세요."
                }
            })
            return
        }
    }
    
    var sql = 'INSERT INTO FAVORITE (ID, TITLE, LOCATION, STARTDATE, ENDDATE, TIME, PRICE, SRC) VALUES (?,?,?,?,?,?,?,?)';

    maria.query(sql, objData, function(err, rows, fields){
        try{
            if(!err){
                res.status(200).json({status:"success", data:{result:"true"}})
            }else{
                res.status(200).json({status:"success", data:{result:"false", data:"행사 찜하기에 실패했습니다. 다시 시도해주세요."}})
                console.log(err)
            }
        }catch(err){
            res.status(500).json({status:"error", msg:"서버 오류 발생"})
        }
    })
})


//찜 목록 불러오기
router.post("/favorites/list", (req, res) => {
    const userid = req.body.userId;
    console.log(userid)
    
    if(userid == ""){
        res.status(400).json({
            status: "fail",
            data: {
                msg: "찜목록 불러오기에 실패했습니다. 다시 시도해주세요."
            }
        })
        return
    }

    var sql = "SELECT * FROM FAVORITE WHERE ID = ?;"

    maria.query(sql, userid, function(err, rows, feilds){
        try{
            if(!err){
                if(rows.length == 0){
                    res.status(200).json({status:"success", data:{result:"false", msg:"저장된 찜 목록이 없습니다."}})
                }else{
                    res.status(200).json({status:"success", data:{result:"true", msg:rows[0]}})
                }
            }
        }catch(err){
            res.status(500).json({status:"error", msg:"서버 오류 발생"})
        }
    })
})


module.exports = router;