const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();
router.use(bodyParser.json());

const fs = require('fs');
const axios = require('axios');

const conn = require('../../database/connect/maria');
var sql = 'SELECT * FROM EVENT';

const themeList = [
    ["0001",	"설레임"],
    ["0002",	"즐거움"],
    ["0003",	"특별한"],
    ["0004",	"잔잔한"],
    ["0005",	"감동적인"],
    ["1001",	"봄"],
    ["1002",	"여름"],
    ["1003",	"가을"],
    ["1004",	"겨울"],
    ["1007",	"-"],
    ["1009",	"어린이날"],
    ["1010",	"어버이날"],
    ["1011",	"결혼기념일"],
    ["1012",	"크리스마스"],
    ["2001",	"혼자"],
    ["2002",	"친구"],
    ["2003",	"커플"],
    ["2004",	"자녀"],
    ["2005",	"부모"],
    ["2006",	"가족"],
    ["3001",	"내한"],
    ["3002",	"K-POP"],
    ["3003",	"ROCK"],
    ["3004",	"발라드"],
    ["3005",	"댄스"],
    ["3006",	"재즈"],
    ["3007",	"소울"],
    ["3008",	"R&"],
    ["3009",	"힙합"],
    ["3010",	"인디"],
    ["4001",	"연극"],
    ["4002",	"뮤지컬"],
    ["4003",	"클래식"],
    ["4004",	"전통예술"],
    ["4006",	"콘서트"],
    ["4007",	"무용"],
    ["4008",	"기타"],
    ["4009",	"대중음악"],
    ["4010",	"복합"],
    ["4011",	"서커스/마술"],
    ["4012",	"오페라"],
    ["5001",	"한국화"],
    ["5002",	"양화"],
    ["5003",	"조각"],
    ["5004",	"전통미술"],
    ["5005",	"사진"],
    ["5006",	"판화"],
    ["5007",	"수채화"],
    ["5008",	"공예"],
    ["5009",	"문인화"],
    ["5010",	"서예"],
    ["5011",	"기타"],
]

router.post("/", (req, res) => {
    
    try{
        const themeArray =  req.body.themeArray
        console.log(themeArray)
        const obj = JSON.parse(themeArray)
        var newThemeArray = []
    
        for(var i=0; i<obj.length; i++){
            for(var j=0; j<themeList.length; j++){
                if (obj[i] === themeList[j][0]){
                    newThemeArray.push(themeList[j][1])
                    break
                }
            }
        }
        res.status(200).json({status:"success", data:{themeArray:newThemeArray}})
    }
    catch(err){
        console.log(err)
        res.status(500).json({status:"error", data:{msg:"서버 오류 발생"}})
    }
})

router.post("/list", (req, res) => {

    try{
        const themeCode = req.body.themeCode
        // console.log(themeCode)
        // console.log(typeof(themeCode))
        
        var themeArray = []

        var sql =  "SELECT * FROM EVENT"
        
        conn.query(sql, themeCode, function(err, rows, feilds){
            
            if(!err){
                console.log(rows.length)
                for(var i=0; i<rows.length; i++){
                    if (rows[i].theme != null){
                        var data =  rows[i].theme
                        var words = data.split(',')
                        // console.log(words.length)
                        for (var j=0; j<words.length; j++){
                            if(themeCode === words[j]){
                                // console.log(words[j])
                                themeArray.push(rows[i])
                            }
                        }
                    }
                }
                console.log(themeArray.length)
                res.status(200).json({status:"success", data:themeArray})
            }else{
                res.status(200).json({status:"fail", data:{msg:err}})
            }
        })
    }
    catch(err){
        res.status(500).json({status:"success", msg:"서버 오류 발생"})
    }
})

module.exports = router;