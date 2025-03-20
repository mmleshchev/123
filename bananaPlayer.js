// bananaPlayer.js

let bananaImg, bananaSound;
let bananaButton;  // кликабельный банан
let playerDiv;     // контейнер плеера
let timelineSlider, volumeSlider, playPauseButton;

function preloadBananaPlayer() {
  // Обратите внимание на корректность путей (например, если файлы лежат в папке assets)
  bananaImg = loadImage("банано.png");
  bananaSound = loadSound("бытьдауном.mp3",
    () => { console.log("Banana sound loaded"); },
    (err) => { console.error("Error loading banana sound", err); }
  );
}

function setupBananaPlayer() {
  // Создаем кликабельное изображение банана
  bananaButton = createImg("банано.png", "БАНАН");
  // Размещаем его, например, в левом верхнем углу (или где угодно по вашему выбору)
  bananaButton.position(20, 20);
  bananaButton.size(100, 100);
  bananaButton.mousePressed(handleBananaClick);
  
  // Создаем контейнер для плеера, который будет отображаться по центру в нижней части экрана
  playerDiv = createDiv("");
  playerDiv.style("position", "fixed");
  playerDiv.style("bottom", "20px");
  playerDiv.style("left", "50%");
  playerDiv.style("transform", "translateX(-50%)");
  playerDiv.style("background-color", "rgba(0, 0, 0, 0.8)");
  playerDiv.style("color", "#fff");
  playerDiv.style("padding", "10px");
  playerDiv.style("border-radius", "8px");
  playerDiv.style("font-family", "sans-serif");
  playerDiv.style("font-size", "14px");
  playerDiv.style("line-height", "1.5");
  playerDiv.style("z-index", "10000");
  // Изначально плеер скрыт
  playerDiv.hide();
  
  // Слайдер для таймлайна
  timelineSlider = createSlider(0, 100, 0);
  timelineSlider.parent(playerDiv);
  timelineSlider.style("width", "300px");
  timelineSlider.input(() => {
    if (bananaSound && bananaSound.duration()) {
      let dur = bananaSound.duration();
      // Перемещаем музыку в соответствии со значением слайдера (0–100)
      bananaSound.jump(map(timelineSlider.value(), 0, 100, 0, dur));
    }
  });
  
  // Слайдер для регулировки громкости
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.parent(playerDiv);
  volumeSlider.style("width", "100px");
  volumeSlider.input(() => {
    if (bananaSound) {
      bananaSound.setVolume(volumeSlider.value());
    }
  });
  
  // Кнопка play/pause
  playPauseButton = createButton("Pause");
  playPauseButton.parent(playerDiv);
  playPauseButton.mousePressed(toggleBananaSound);
}

function handleBananaClick() {
  // Выводим сообщение
  alert("вы звоните на банан");
  // Показываем плеер
  playerDiv.show();
  // Если звук еще не воспроизводится, запускаем его
  if (bananaSound && !bananaSound.isPlaying()) {
    bananaSound.play();
    playPauseButton.html("Pause");
  }
}

function toggleBananaSound() {
  if (!bananaSound) return;
  if (bananaSound.isPlaying()) {
    bananaSound.pause();
    playPauseButton.html("Play");
  } else {
    bananaSound.play();
    playPauseButton.html("Pause");
  }
}

function updateBananaPlayer() {
  if (bananaSound && bananaSound.isPlaying()) {
    let current = bananaSound.currentTime();
    let dur = bananaSound.duration();
    timelineSlider.value(map(current, 0, dur, 0, 100));
  }
}
