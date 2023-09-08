// api.js : 개별적으로 실행하는 JS 파일
// 실행 방법 : $ node api.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// file read/write moudle
const fs = require('fs');
const axios = require('axios');

const key = 'g4PpueQjaKzayfFQRksvGpJ0jDZ%2BGGmRxzFDMU1o80hY8ObYPgFLuyZDB8iKnGoMh5PSeVLp2tp1lToKexwCjQ%3D%3D';

// step 1. 현재 행사에 대한 전체 개수(total count)를 가져온다. -> get___TotalCount()
let playTotalCount;
let concertTotalCount;
let musicalTotalCount;
let exhibitionTotalCount;

// step 2. 전체 개수(total count)만큼 해당 행사 데이터를 가져오는 api를 호출하여 각 행사 데이터 배열에 저장한다. -> get___Data();
let playData = [];
let concertData = [];
let musicalData = [];
let exhibitionData = [];

/* ************* 연극 ************* */
async function getPlayTotalCount() {
    console.log("[SYSTEM] 연극 total count 수집 시작");

    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCulturePlayDetailService/getBusanCulturePlayDetail?serviceKey=' 
            + key 
            + '&resultType=json',
        headers: {},
    };

    axios(config)
        .then(await function (response) {
            playTotalCount = response.data.getBusanCulturePlayDetail.totalCount;
        }).then(await function () {
            getPlayData();
        });
}

async function getPlayData() {
    await console.log("[SYSTEM] 연극 total count : " + playTotalCount);

    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCulturePlayDetailService/getBusanCulturePlayDetail?serviceKey='
            + key
            + '&resultType=json'
            + '&numOfRows='
            + playTotalCount,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "Accept-Encoding": "deflate, br"
        },
    };

    axios(config)
        .then(await function (response) {
            let responseData = response.data.getBusanCulturePlayDetail;

            for (let i = 0; i < playTotalCount; i++) {
                let tmpData = {
                    category: '연극',
                    url: responseData.item[i].dabom_url,
                    data: {
                        title: responseData.item[i].title,
                        op_ed_dt: responseData.item[i].op_ed_dt,
                        op_st_dt: responseData.item[i].op_st_dt,
                        showtime: responseData.item[i].showtime,
                        price: responseData.item[i].price,
                        theme: responseData.item[i].theme
                    }
                }
                playData.push(tmpData);
            }
            
            playData = JSON.stringify(playData);
            fs.writeFileSync('./json/tmp_play_json.json', playData);
            console.log("[SYSTEM] 연극 데이터 수집 완료");
        });

}

/* ************* 콘서트 ************* */
async function getConcertTotalCount() {
    console.log("[SYSTEM] 콘서트 total count 수집 시작");

    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCultureConcertDetailService/getBusanCultureConcertDetail?serviceKey=' 
            + key 
            + '&resultType=json',
        headers: {}
    };

    axios(config)
        .then(await function (response) {
            concertTotalCount = Number(response.data.getBusanCultureConcertDetail.totalCount);
        }).then(await function () {
            getConcertData();
        });
}
async function getConcertData() {
    await console.log("[SYSTEM] 콘서트 total count : " + concertTotalCount);

    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCultureConcertDetailService/getBusanCultureConcertDetail?serviceKey=' 
            + key 
            + '&numOfRows=' 
            + concertTotalCount 
            + '&resultType=json',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "Accept-Encoding": "deflate, br"
        },
    };

    axios(config)
        .then(await function (response) {
            let responseData = response.data.getBusanCultureConcertDetail;

            for (let i = 0; i < concertTotalCount; i++) {
                const tmpData = {
                    category: '콘서트',
                    url: responseData.item[i].dabom_url,
                    data: {
                        title: responseData.item[i].title,
                        op_ed_dt: responseData.item[i].op_ed_dt,
                        op_st_dt: responseData.item[i].op_st_dt,
                        showtime: responseData.item[i].showtime,
                        price: responseData.item[i].price,
                        theme: responseData.item[i].theme
                    }
                }

                concertData.push(tmpData);
            }

            concertData = JSON.stringify(concertData);
            fs.writeFileSync('./json/tmp_concert_json.json', concertData);
            console.log("[SYSTEM] 콘서트 데이터 수집 완료");
        });
}

/* ************* 뮤지컬 ************* */
async function getMusicalTotalCount() {
    console.log("[SYSTEM] 뮤지컬 total count 수집 시작");
    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=' 
            + key 
            + '&resultType=json',
        headers: {}
    };
    axios(config)
        .then(await function (response) {
            musicalTotalCount = Number(response.data.getBusanCultureMusicalDetail.totalCount);
        }).then(await function () {
            getMusicalData();
        })
}

async function getMusicalData() {
    await console.log("[SYSTEM] 뮤지컬 total count : " + musicalTotalCount);

    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=' 
            + key + '&numOfRows=' 
            + musicalTotalCount 
            + '&resultType=json',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "Accept-Encoding": "deflate, br"
        },
    };

    axios(config)
        .then(await function (response) {
            let responseData = response.data.getBusanCultureMusicalDetail;
            
            for (let i = 0; i < musicalTotalCount; i++) {
                const tmpData = {
                    category: '뮤지컬',
                    url: responseData.item[i].dabom_url,
                    data: {
                        title: responseData.item[i].title,
                        op_ed_dt: responseData.item[i].op_ed_dt,
                        op_st_dt: responseData.item[i].op_st_dt,
                        showtime: responseData.item[i].showtime,
                        price: responseData.item[i].price,
                        theme: responseData.item[i].theme
                    }
                }

                musicalData.push(tmpData);
            }

            musicalData = JSON.stringify(musicalData);
            fs.writeFileSync('./json/tmp_musical_json.json', musicalData);
            console.log("[SYSTEM] 뮤지컬 데이터 수집 완료");
        });
}

/* ************* 전시 ************* */
async function getExhibitTotalCount() {
    await console.log("[SYSTEM] 전시 total count 수집 시작");
    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCultureExhibitDetailService/getBusanCultureExhibitDetail?serviceKey=' 
            + key 
            + '&resultType=json',
        headers: {},
    };

    await axios(config)
        .then(await function (response) {
            exhibitionTotalCount = Number(response.data.getBusanCultureExhibitDetail.totalCount);
        }).then(await function () {
            getexhibitionData();
        });
}

async function getexhibitionData() {
    await console.log("[SYSTEM] 전시 total count : " + exhibitionTotalCount);

    let config = {
        method: 'get',
        url: 'http://apis.data.go.kr/6260000/BusanCultureExhibitDetailService/getBusanCultureExhibitDetail?serviceKey=' 
            + key 
            + '&numOfRows=' 
            + exhibitionTotalCount 
            + '&resultType=json',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "Accept-Encoding": "deflate, br"
        },
    };

    await axios(config)
        .then(await function (response) {
            let responseData = response.data.getBusanCultureExhibitDetail;

            for (let i = 0; i < exhibitionTotalCount; i++) {
                const tmpData = {
                    category: '전시',
                    url: responseData.item[i].dabom_url,
                    data: {
                        title: responseData.item[i].title,
                        op_ed_dt: responseData.item[i].op_ed_dt,
                        op_st_dt: responseData.item[i].op_st_dt,
                        showtime: responseData.item[i].showtime,
                        price: responseData.item[i].price,
                        theme: responseData.item[i].theme
                    }
                }

                exhibitionData.push(tmpData);
            }

            exhibitionData = JSON.stringify(exhibitionData);
            fs.writeFileSync('./json/tmp_exhibition_json.json', exhibitionData);
            console.log("[SYSTEM] 전시 데이터 수집 완료");
        });
}

// /* ************* MAIN ************* */
getPlayTotalCount();
getConcertTotalCount();
getMusicalTotalCount();
getExhibitTotalCount();