const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();

app.use(bodyParser.json())

const fs = require('fs');
const axios = require('axios');

const conn = require('../../database/connect/maria');
var sql = 'SELECT * FROM apiData';

let Data = [];

conn.query(sql, function (err, rows, fields) { //rows
    if (err) {
        console.log(err)
    }
    else {
        for (let i = 0; i < rows.length; i++) {
            let event = {
                title: rows[i].title, // 행사 제목
                location: rows[i].location, // 행사 장소(주소)
                startDate: rows[i].st_dt, // 행사 시작일
                endDate: rows[i].ed_dt, // 행사 종료일
                time: rows[i].showtime, // 행사 시간(duration)
                price: rows[i].price, // 행사 가격
                src: rows[i].poster // 행사 포스터 이미지 경로 url
            }
            Data.push(event);
        }
        //console.log(Data)
        Data=JSON.stringify(Data)
        fs.writeFileSync('./routes/event/json/getData_json.json', Data);
    }
})
var result= require('./routes/event/json/getData_json.json');
var ss='성공'
router.get('/get', (req, res) => {
    res.send(ss)
})

module.exports = router;