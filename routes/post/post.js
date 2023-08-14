const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();
router.use(bodyParser.json());

const fs = require('fs');
const axios = require('axios');

const conn = require('../../database/connect/maria');

//작성한 글 DB 저장
router.post('/write', (req, res) => {

    var sql = 'INSERT INTO POST (ID, TITLE, DATE, LOCATION, TAG, CONTENT) values ( ?, ?, ?, ?, ?, ? )';

    var data = [
        req.userId,
        req.title,
        req.date,
        req.location,
        req.tag,
        req.contant,
    ]

    conn.query(sql, data, function (err, rows) {
        if (err) {
            console.log(err)
        }
        else{
            console.log("저장")
        }
    })

})

//DB에 작성된 글 가져오기
router.get('/lists', (req, res) => {

    var sql = 'SELECT * FROM POST';

    conn.query(sql, data, function (err, rows) {
        if (err) {
            console.log(err)
        }
        else{
            let writeData = [];

            for( let i = 0; i < rows.length; i++ )
            {
                let Data = {
                    idx:i, //글 인덱스 생성
                    title: rows[i].title, // 제목
                    location: rows[i].location, // 행사 장소(주소)
                    date: rows[i].date, // 작성 일자
                    tag: rows[i].tag, // 태그
                    content:rows[i].content //글내용

                }
                writeData.push(Data);
            }
            writeData = JSON.stringify(writeData)

            res.send(writeData)
        }
    })

})

module.exports = router;