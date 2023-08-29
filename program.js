// キャンバスとビデオの取得
const canvas = document.querySelector('#canvas');
const video = document.querySelector('#video');
// コンテキストの取得
const ctx = canvas.getContext('2d');
let model;
let startFlag = false;
let factor = 1;

// predictions[i].class
// 1: "open"
// 2: "closed"
// 3: "pinch"
// 4: "point"
// 5: "face"

// 現在のclass (-1は初期値)
let current = -1;
// 現在のy座標
let py = 0;

// 検出処理(繰り返す)
function runDetection() {
  model.detect(video).then(predictions => {
    model.renderPredictions(predictions, canvas, ctx, video);
    if (current == -1) {// 前回未検出
      for (let idx = 0; idx < predictions.length; idx++) {
        if (predictions[idx].class == 4) {
          current = idx;
          py = predictions[idx].bbox[1];
        }
      }
    } else {// 前回検出済み
      if (predictions[current]?.class == 4) {
        // 現在のy座標と前回のy座標の差分
        let dy = predictions[current].bbox[1] - py;
        window.scrollBy({
          left: 0,
          top: - dy * factor,
          behavior: 'instant'
        });
        py = predictions[current].bbox[1];
      } else {
        current = -1;
      }
    }
    if (startFlag) {
      // ここで自分を呼んでいる
      requestAnimationFrame(runDetection);
    }
  })
}


// スタートボタンを押したら
document.querySelector('#startButton').addEventListener('click', () => {
  // フラグをtrueに
  startFlag = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.baseLine = "middle";
  ctx.fillText("Loading...", canvas.width/2, canvas.height/2, canvas.width);
  // ハンドトラッキングのモデルを読み込む
  handTrack.load({
    flipHorizontal: true,
    imageScaleFactor: 0.7,
    maxNumBoxes: 5,
    iouThreshold: 0.5,
    scoreThreshold: 0.7,
  }).then(lmodel => {
    model = lmodel;
    // ビデオの開始
    handTrack.startVideo(video).then(status => {
      if (status) {
        runDetection();
      } else {
        console.log("Error", status);
      }
    });
  });
});

// ストップボタンを押したら
document.querySelector('#stopButton').addEventListener('click', () => {
  // ハンドトラッキング終了
  handTrack.stopVideo(video);
  // フラグをfalseに
  startFlag = false;
  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});


document.querySelector("#factor").addEventListener('change', (e) => {
  factor = +e.target.value;
});

function makeDummy() {
  let page = document.querySelector('#page');
  text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, excepturi, sequi obcaecati sint doloremque optio quae libero ab amet, id iusto. Optio esse est molestiae reprehenderit atque cum dicta eveniet!";
  for (let i = 0; i < 4; i++) {
    page.insertAdjacentHTML('beforeend', `
    <h2>タイトル</h2>
    ${text}${text}${text}${text}
    `);
  }
}
makeDummy();