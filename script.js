'use strict'
// 1行目に記載している 'use strict' は削除しないでください

//ゲームに使用する例文を配列に格納
const texts = [
  "The quick brown fox jumps over the lazy dog",
  "Programming is fun and challenging",
  "Practice makes perfect",
  "Type as fast as you can!",
  "Web development is an exciting field"
];

let currentTextIndex;
let startTime;
let totalKeystrokes = 0;
let correctKeystrokes = 0;

function movePage() {
  document.getElementById('menu-container').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('input-field').addEventListener('focus', startGame);
  document.getElementById('results').style.display = 'block';
  document.getElementById('input-field').value = '';
}

function startGame() {
  currentTextIndex = Math.floor(Math.random() * texts.length);
  displayNextText();
  startTime = new Date().getTime();
  totalKeystrokes = 0;
  correctKeystrokes = 0;
  updateResults();
  document.getElementById('input-display').textContent = '';
  document.getElementById('input-field').addEventListener('input', checkInput);
}


function endGame() {
  document.getElementById('menu-container').style.display = 'block';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('input-field').removeEventListener('input', checkInput);
  document.getElementById('input-field').placeholder = '';
  document.getElementById('input-field').value = '';
  document.getElementById('input-display').textContent = '';
  document.getElementById('text-display').textContent = '';
  document.getElementById('label-type').textContent = '';
}

function closePopup() {
  document.getElementById('results').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('menu-container').style.display = 'block';
  document.getElementById('game-container').style.display = 'none';
}

function displayNextText() {
  document.getElementById('text-display').textContent = texts[currentTextIndex];
  document.getElementById('input-field').placeholder = document.getElementById('text-display').textContent;
}

function checkInput() {
  const inputText = document.getElementById('input-field').value;
  totalKeystrokes++;

  if (inputText === texts[currentTextIndex].substring(0, inputText.length)) {
    correctKeystrokes++;
    document.getElementById('label-type').innerText = inputText;
  }

  if (inputText === texts[currentTextIndex]) {
    document.getElementById('input-field').removeEventListener('input', checkInput);
    const accuracy = calculateAccuracy();
    submit(accuracy);
  }

  updateResults();
}

function calculateWPM(totalKeystrokes, totalTime) {
  const wordsPerMinute = (totalKeystrokes / 5) / (totalTime / 60);
  return Math.round(wordsPerMinute);
}

function calculateAccuracy() {
  const accuracy = (correctKeystrokes / totalKeystrokes) * 100 || 0;
  return accuracy;
}

function updateResults() {
  const accuracy = calculateAccuracy();
  document.getElementById('results').innerHTML = `Accuracy: ${accuracy.toFixed(2)}%`;
}

function submit(accuracy) {
  const endTime = new Date().getTime();
  const totalTime = (endTime - startTime) / 1000;
  const wpm = calculateWPM(totalKeystrokes, totalTime);

  // ユーザーのコードを取得
  const code = document.getElementById("input-tmc").value;

  // Webhookに送信するための設定
  const webhookURL = " ";
  const proxyUsername = " "; //従業員番号
  const proxyPassword = " "; //PCのパスワード
  const proxyServer = "http://" + proxyUsername + ":" + proxyPassword + " "; //proxyは環境変数で設定しているもの
  const messageData = {
    title: `${code}`,
    text:`Accuracy: ${accuracy.toFixed(2)}%<br>
    WPM: ${wpm}`,
  };

  // ゲームの結果を表示
  document.getElementById('popup-wpm').textContent = wpm;
  document.getElementById('popup-acc').textContent = `${accuracy.toFixed(1)}%`;
  document.getElementById('overlay').style.display = 'flex';
  // Webhookにメッセージを送信
  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
    mode: 'no-cors',
  })
  .then(response => {
    console.log("メッセージが送信されました。");
  })
  .catch(error => {
    console.error("エラーが発生しました:", error);
  });
}
