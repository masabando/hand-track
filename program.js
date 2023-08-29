const canvas = document.querySelector('#canvas');
const video = document.querySelector('#video');
const ctx = canvas.getContext('2d');
let model;
let startFlag = false;

// navigator.mediaDevices.getUserMedia({
//   video: {
//     facingMode: 'environment'
//   },
//   audio: false
// })

// 検出処理
function runDetection() {
  model.detect(video).then(predictions => {
    model.renderPredictions(predictions, canvas, ctx, video);
    if (startFlag) {
      requestAnimationFrame(runDetection);
    }
  })
}


document.querySelector('#startButton').addEventListener('click', () => {
  startFlag = true;
  handTrack.load({
    flipHorizontal: true,
    imageScaleFactor: 0.7,
    maxNumBoxes: 1,
    iouThreshold: 0.5,
    scoreThreshold: 0.7,
  }).then(lmodel => {
    model = lmodel;
    handTrack.startVideo(video).then(status => {
      if (status) {
        runDetection();
      } else {
        console.log("Error", status);
      }
    });
  });
});

document.querySelector('#startButton').addEventListener('click', () => {
  handTrack.stopVideo(video);
  startFlag = false;
});
