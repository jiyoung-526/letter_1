let video;
let playVideo;
let currentVideo = 0;
let isVideoPlaying = false;
let videoTimerStarted = false;
let videoTimer;

let classifier;
let checkNum = 0;
let label = "This is..";
let proj_let1;
let proj_let2;
let KLSimg;

let projLet2Timer;
let projLet2Display = false;

function preload() {
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/Q8e-0pg9C/');
  proj_let1 = loadImage('Asset/1204_proj_1.png');
  proj_let2 = loadImage('Asset/1204_proj_2.png');
  KLSimg = loadImage('Asset/KLS.png');
  playVideo = createVideo('Asset/KLS_5mb.mp4');
}

function setup() {
  frameRate = 10;
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);  // 웹캠 비디오의 크기 조정
  video.hide();  // 웹캠 비디오를 숨김
  playVideo.hide(); // Hide the video element initially

  document.body.style.overflow = 'hidden';  // 스크롤바 숨기기

  classifyVideo();
}

function draw() {
  background(0);
  
  // projLet2Display가 true이면 proj_let2 이미지만 표시하고 나머지는 실행하지 않음
  if (projLet2Display) {
    image(proj_let2, 0, 0, width, height);
    return;
  }

  // projLet2Display가 false일 때만 나머지 로직 실행
  if (checkNum >= 100 && !videoTimerStarted) {
    videoTimer = setTimeout(playMyVideo, 4700);
    videoTimerStarted = true; // Set the timer flag
  }

  if (!isVideoPlaying) {
    image(proj_let1, 0, 0, width, height);
  } else {
    playVideo.size(windowWidth, windowHeight);
    image(playVideo, 0, 0, windowWidth, windowHeight);
  }

  checkStamp();
}

function checkStamp() {
  if (label == 'KLS' && checkNum < 100) {
    checkNum += 100;
  } else if (label == 'None'){
    checkNum = 0;
  } else if (label == 'put'){
    checkNum = 0;
  }
}

function playMyVideo() {
  if (!isVideoPlaying) {
    playVideo.size(windowWidth, windowHeight);
    image(playVideo, 0, 0, windowWidth, windowHeight);
    playVideo.play();
    isVideoPlaying = true; // Update the state
    playVideo.onended(function() {
      isVideoPlaying = false; // Update the state
      clearTimeout(videoTimer); // Clear the timer
      videoTimerStarted = false; // Reset the timer flag

      // Set the timer to display proj_let2 for 10 seconds
      projLet2Display = true;
      setTimeout(function() {
        projLet2Display = false;
        checkNum = 0; // Reset checkNum to prevent replay
      }, 20000);
    });
  }
}

function classifyVideo() {
  classifier.classify(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  console.log(results[0]);

  classifyVideo();
}