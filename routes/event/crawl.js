// crawl.js : 개별적으로 실행하는 JS 파일
// 실행 방법 : $ node crawl.js

const express = require('express');
const app = express();

// crawling module
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// file read/write moudle
const fs = require('fs');

// step 1. 'api.js'를 이용하여 생성한 각 행사 데이터를 불러온다.
let playData = fs.readFileSync('./json/tmp_play_json.json');
let concertData = fs.readFileSync('./json/tmp_concert_json.json');
let musicalData = fs.readFileSync('./json/tmp_musical_json.json');
let exhibitionData = fs.readFileSync('./json/tmp_exhibition_json.json');

playData = playData.toString();
playJSON = JSON.parse(playData);
playResult = [];

concertData = concertData.toString();
concertJSON = JSON.parse(concertData);
concertResult = [];

musicalData = musicalData.toString();
musicalJSON = JSON.parse(musicalData);
musicalResult = [];

exhibitionData = exhibitionData.toString();
exhibitionJSON = JSON.parse(exhibitionData);
exhibitionResult = [];

// for test
let test_URL = 'http://busandabom.net/play/view.nm?lang=ko&url=play&menuCd=8&res_no=2020030014'
let tmpData;

// step 2. 각 행사 데이터를 순회하면서, 이미지 src 링크를 수집한다.
// for image crawling
async function crawl(nowData) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    // headless: false일때 브라우저 크기 지정해주는 코드
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.setDefaultNavigationTimeout(0);

    await page.goto(nowData.url);

    // 이미지 요소 찾기
    let content = await page.content();
    let $ = cheerio.load(content);

    // 이미지 링크
    let result_image = $('#subcontent > div > div.top.boxing > div.leftbox.img.relative > img');

    // console.log(result_image);
    
    if(result_image.hasOwnProperty('0') == true) {
        let result_image_src = result_image['0']['attribs']['src'];

        // url이 제대로된 url이랑, '/image/~' 이렇게 돼있는게 있음. 이런 경우엔 앞에 다봄 url 추가해줘야함.
        if(result_image_src.startsWith('/')) {
            result_image_src = "https://busandabom.net" + result_image_src
        }

        // 기존 데이터에 이미지 링크 추가
        nowData.data.imgSrc = result_image_src;
        // console.log(result_image_src);

        await page.click('#subcontent > div > div.bottom > ul > li:nth-child(2)');

        // 주소 요소 찾기
        content = await page.content();
        $ = cheerio.load(content);
    
        // 주소 텍스트
        let result_address = $('#tab2 > div.subcont-bg > div > div.boardBasic.mb_scroll > div > table > tbody > tr > td:nth-child(5)').text();
    
        // 기존 데이터에 주소 추가
        nowData.data.location = result_address;
        
        tmpData = nowData;
    }
    else {
        console.log("[SYSTEM] image src 없음");
    }

    await browser.close();
}

// Date format
function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
}

function toStringByFormatting(source, delimiter = '-') {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
}

/* ************* 연극 ************* */
async function crawlPlay() {
    for (let i = 0; i < Object.keys(playJSON).length; i++) {
        if (playJSON[i] == null) continue;
        
        if (playJSON[i].data.op_ed_dt != null){
            var dataDate = new Date(playJSON[i].data.op_ed_dt.toString());
        }
        else {
            var dataDate = new Date();
        }

        // 오늘 날짜
        let todayDate = new Date();

        // '0000-00-00' 포맷으로 변환
        dataDate = toStringByFormatting(dataDate);
        todayDate = toStringByFormatting(todayDate);

        if (todayDate <= dataDate) {
            console.log("> 연극 (" + i + ") " + dataDate + "는 " + todayDate + "보다 나중임.");

            await crawl(playJSON[i]);
            playResult.push(tmpData);
        }
    }

    playResult = JSON.stringify(playResult);
    fs.writeFileSync('./json/play_json.json', playResult);
    console.log("[SYSTEM] 연극 저장 완료");
}

/* ************* 콘서트 ************* */
async function crawlConcert() {
    for (let i = 0; i < Object.keys(concertJSON).length; i++) {
        if (concertJSON[i] == null) continue;

        if (concertJSON[i].data.op_ed_dt != null){
            var dataDate = new Date(concertJSON[i].data.op_ed_dt.toString());
        }
        else {
            var dataDate = new Date();
        }

        // 오늘 날짜
        let todayDate = new Date();

        // '0000-00-00' 포맷으로 변환
        dataDate = toStringByFormatting(dataDate);
        todayDate = toStringByFormatting(todayDate);

        if (dataDate >= todayDate) {
            console.log("> 콘서트 (" + i + ") " + dataDate + "는 " + todayDate + "보다 나중임.");

            await crawl(concertJSON[i]);
            concertJSON[i] = tmpData;
            concertResult.push(tmpData);
        }
    }

    concertResult = JSON.stringify(concertResult);
    fs.writeFileSync('./json/concert_json.json', concertResult);
    console.log("[SYSTEM] 콘서트 저장 완료");
}

/* ************* 뮤지컬 ************* */
async function crawlMusical() {
    for (let i = 0; i < Object.keys(musicalJSON).length; i++) {
        if (musicalJSON[i] == null) continue;
        
        if (musicalJSON[i].data.op_ed_dt != null){
            var dataDate = new Date(musicalJSON[i].data.op_ed_dt.toString());
        }
        else {
            var dataDate = new Date();
        }

        // 오늘 날짜
        let todayDate = new Date();

        // '0000-00-00' 포맷으로 변환
        dataDate = toStringByFormatting(dataDate);
        todayDate = toStringByFormatting(todayDate);

        if (dataDate >= todayDate) {
            console.log("> 뮤지컬 (" + i + ") " + dataDate + "는 " + todayDate + "보다 나중임.");

            await crawl(musicalJSON[i]);
            musicalResult.push(tmpData);
        }
    }

    musicalResult = JSON.stringify(musicalResult);
    fs.writeFileSync('./json/musical_json.json', musicalResult);
    console.log("[SYSTEM] 뮤지컬 저장 완료");
}

/* ************* 전시 ************* */
async function crawlExhibit() {
    for (let i = 0; i < Object.keys(exhibitionJSON).length; i++) {
        if (exhibitionJSON[i] == null) continue;

        if (exhibitionJSON[i].data.op_ed_dt != null){
            var dataDate = new Date(exhibitionJSON[i].data.op_ed_dt.toString());
        }
        else {
            var dataDate = new Date();
        }

        // 오늘 날짜
        let todayDate = new Date();

        // '0000-00-00' 포맷으로 변환
        dataDate = toStringByFormatting(dataDate);
        todayDate = toStringByFormatting(todayDate);

        if (dataDate >= todayDate) {
            console.log("> 전시 (" + i + ") " + dataDate + "는 " + todayDate + "보다 나중임.");

            await crawl(exhibitionJSON[i]);
            exhibitionResult.push(tmpData);
        }
    }

    exhibitionResult = JSON.stringify(exhibitionResult);
    fs.writeFileSync('./json/exhibit_json.json', exhibitionResult);
    console.log("[SYSTEM] 전시 저장 완료");
}

function callCrawl() {
    crawlPlay();
    crawlConcert();
    crawlMusical();
    crawlExhibit();
}

callCrawl();