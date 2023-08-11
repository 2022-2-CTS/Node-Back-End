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


router.get( '/musicals', (req, res) => {

    conn.query(sql, function (err, rows, fields) { //rows

        if (err) {
            console.log(err)
        }
        else {
            let musicalData = [];

            for ( let i = 0; i < rows.length; i++ ) {

                if ( rows[i].category == "뮤지컬" ) {

                    let event = {
                        title: rows[i].title, // 행사 제목
                        location: rows[i].location, // 행사 장소(주소)
                        startDate: rows[i].st_dt, // 행사 시작일
                        endDate: rows[i].ed_dt, // 행사 종료일
                        time: rows[i].showtime, // 행사 시간(duration)
                        price: rows[i].price, // 행사 가격
                        src: rows[i].poster // 행사 포스터 이미지 경로 url
                    }
                    musicalData.push(event);
                }
            }
            musicalData = JSON.stringify(musicalData)

            res.send(musicalData)
        }
    })
})

router.get( '/exhibitions', (req, res) => {

    conn.query(sql, function (err, rows, fields) { //rows

        if (err) {
            console.log(err)
        }
        else {
            let exhibitionData = [];

            for ( let i = 0; i < rows.length; i++ ) {

                if ( rows[i].category == "전시" ) {

                    let event = {
                        title: rows[i].title, // 행사 제목
                        location: rows[i].location, // 행사 장소(주소)
                        startDate: rows[i].st_dt, // 행사 시작일
                        endDate: rows[i].ed_dt, // 행사 종료일
                        time: rows[i].showtime, // 행사 시간(duration)
                        price: rows[i].price, // 행사 가격
                        src: rows[i].poster // 행사 포스터 이미지 경로 url
                    }
                    exhibitionData.push(event);
                }
            }
            exhibitionData = JSON.stringify(exhibitionData)
            
            res.send(exhibitionData)
        }
    })
})

router.get( '/concerts', (req, res) => {

    conn.query(sql, function (err, rows, fields) { //rows

        if (err) {
            console.log(err)
        }
        else {
            let concertData = [];

            for ( let i = 0; i < rows.length; i++ ) {

                if ( rows[i].category == "콘서트" ) {

                    let event = {
                        title: rows[i].title, // 행사 제목
                        location: rows[i].location, // 행사 장소(주소)
                        startDate: rows[i].st_dt, // 행사 시작일
                        endDate: rows[i].ed_dt, // 행사 종료일
                        time: rows[i].showtime, // 행사 시간(duration)
                        price: rows[i].price, // 행사 가격
                        src: rows[i].poster // 행사 포스터 이미지 경로 url
                    }
                    concertData.push(event);
                }
            }
            concertData = JSON.stringify(concertData)
            
            res.send(concertData)
        }
    })
})

router.get( '/plays', (req, res) => {

    conn.query(sql, function (err, rows, fields) { //rows

        if (err) {
            console.log(err)
        }
        else {
            let playData = [];
            
            for ( let i = 0; i < rows.length; i++ ) {

                if ( rows[i].category == "연극" ) {

                    let event = {
                        title: rows[i].title, // 행사 제목
                        location: rows[i].location, // 행사 장소(주소)
                        startDate: rows[i].st_dt, // 행사 시작일
                        endDate: rows[i].ed_dt, // 행사 종료일
                        time: rows[i].showtime, // 행사 시간(duration)
                        price: rows[i].price, // 행사 가격
                        src: rows[i].poster // 행사 포스터 이미지 경로 url
                    }
                    playData.push(event);
                }
            }
            playData = JSON.stringify(playData)
            
            res.send(playData)
        }
    })
})

module.exports = router;