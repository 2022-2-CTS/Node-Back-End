const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();
router.use(bodyParser.json());

const fs = require('fs');
const axios = require('axios');

const conn = require('../database/connect/maria');

//작성한 글 DB 저장
router.post('/write', (req) => {

    const data = [
        req.body.Writedata.userId,
        req.body.Writedata.title,
        req.body.Writedata.date,
        req.body.Writedata.location,
        req.body.Writedata.tag,
        req.body.Writedata.content,
    ]

    const sql = 'INSERT INTO POST (ID, TITLE, DATE, LOCATION, TAG, CONTENT) values ( ?, ?, ?, ?, ?, ? )';

    conn.query(sql, data, function ( req, res ) {
        try {
            if (data === undefined) {

                res.status(400).json({
                    status: "fail",
                    data: {
                        msg: "글 작성에 실패했습니다. 다시 시도해주세요."
                    }
                });
                
                return;
            }

            res.status(200).json({
                status: "success",
                data: null
            })

        } catch ( error ) {

            res.status(500).json({
                status: "error",
                msg: "서버 오류 발생"
            })

        }
    })

})

//DB에 작성된 글 가져오기
router.get('/lists', (req, res) => {

    const sql = 'SELECT * FROM POST';

    conn.query(sql, function (err, rows) {
        if (err) {
            console.log(err)
        }
        else{

            let writeData = [];

            for( let i = 0; i < rows.length; i++ )
            {
                let Data = {
                    idx:i, //글 인덱스 생성
                    title: rows[i].TITLE, // 제목
                    location: rows[i].LOCATION, // 행사 장소(주소)
                    date: rows[i].DATE, // 작성 일자
                    tag: rows[i].TAG, // 태그
                    content:rows[i].CONTENT //글내용

                }
                
                writeData.push(Data);
            }

            writeData = JSON.stringify(writeData)
            
            try {

                res.status(200).json({
                    status: "success",
                    data: writeData
                })

            } catch (error) {

                res.status(500).json({
                    status: "error",
                    msg: "서버 오류 발생"
                })

            }
        }
    })

})

module.exports = router;