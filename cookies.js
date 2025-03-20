// cookies.js

// Глобальные переменные для эффекта печеньки
let cookieImg;        // текстура печеньки
let cookieX, cookieY;   // позиция печеньки
let cookieSpeed = 1;    // скорость (медленная)
let cookieClicked = false;  // флаг: была ли нажата печенька

// Ресурсы для нового состояния
let newBg;             // новый фон (background)
let cornerImgs = [];   // массив из 4-х изображений (по углам)
let centerGif;         // GIF, который будет показываться в центре

// Звук, который будет воспроизводиться после нажатия на печеньку
let cookieSound;

// Функция preloadCookies() – загружает все необходимые ресурсы
function preloadCookies() {
  // Загрузите текстуру печеньки (проверьте путь)
  cookieImg = loadImage("кукис.png");
  
  // Новый фон
  newBg = loadImage("backgroundcookies.jpg");
  
  // Загружаем 4 изображения для углов (предполагается, что файлы называются corner1.jpg, corner2.jpg, corner3.jpg, corner4.jpg)
  for (let i = 1; i <= 4; i++) {
    cornerImgs.push(loadImage(`corner${i}.jpg`));
  }
  
  // Загружаем GIF для центра вместо видео
  centerGif = loadImage("aac.gif");
  
  // Загружаем звук (убедитесь, что путь корректный)
  cookieSound = loadSound("0317.MP3");
}

// Функция setupCookies() – инициализирует позицию печеньки (звук теперь не запускается здесь)
function setupCookies() {
  // Начинаем с левого края, случайная вертикальная позиция
  cookieX = 0;
  cookieY = random(height);
}

// Функция clearUI() – скрывает все ранее созданные DOM-элементы
function clearUI() {
  // Если глобальные элементы созданы (они объявлены в sketch.js), скрываем их
  if (typeof zoomInButton !== "undefined") zoomInButton.hide();
  if (typeof zoomOutButton !== "undefined") zoomOutButton.hide();
  if (typeof pauseButton !== "undefined") pauseButton.hide();
  if (typeof searchInput !== "undefined") searchInput.hide();
  if (typeof searchButton !== "undefined") searchButton.hide();
  if (typeof searchSuggestions !== "undefined") searchSuggestions.hide();
  if (typeof popupDiv !== "undefined") popupDiv.hide();
  if (typeof bananaButton !== "undefined") bananaButton.hide();

  if (typeof legendDiv !== "undefined") legendDiv.hide();
  if (typeof toggleButton !== "undefined") toggleButton.hide();
  
  
  if (typeof infoDiv !== "undefined") infoDiv.hide();
  if (typeof infoButton !== "undefined") infoButton.hide();
}

// Функция drawCookies() – отрисовывает эффекты
function drawCookies() {
  if (!cookieClicked) {
    // Режим "печенька летит": рисуем печеньку с эффектом помех (случайное затемнение)
    if (random() > 0.1) { // с вероятностью 90% рисуем печеньку
      tint(255, random(150, 255));
      image(cookieImg, cookieX, cookieY, 50, 50);
      noTint();
    }
    cookieX += cookieSpeed;
    // Если печенька уходит за правый край, перемещаем её с левого края
    if (cookieX > width) {
      cookieX = -50;
      cookieY = random(height);
    }
  } else {
    // Режим "печенька нажата": очищаем экран новым фоном и отрисовываем новые элементы
    image(newBg, 0, 0, width, height);
    
    // Отрисовка угловых картинок с эффектом помех:
    let cornerSize = 300;
    if (random() > 0.2) {
      tint(255, random(150, 255));
      image(cornerImgs[0], 0, 0, cornerSize, cornerSize);
      noTint();
    }
    if (random() > 0.2) {
      tint(255, random(150, 255));
      image(cornerImgs[1], width - cornerSize, 0, cornerSize, cornerSize);
      noTint();
    }
    if (random() > 0.2) {
      tint(255, random(150, 255));
      image(cornerImgs[2], 0, height - cornerSize, cornerSize, cornerSize);
      noTint();
    }
    if (random() > 0.2) {
      tint(255, random(150, 255));
      image(cornerImgs[3], width - cornerSize, height - cornerSize, cornerSize, cornerSize);
      noTint();
    }
    
    // Отрисовка GIF в центре с эффектом помех
    let gifW = width * 0.5;
    let gifH = height * 0.5;
    if (random() > 0.2) {
      tint(255, random(150, 255));
      image(centerGif, (width - gifW) / 2, (height - gifH) / 2, gifW, gifH);
      noTint();
    }
  }
}

// Функция, обрабатывающая клик – если клик произошел по печеньке, переходим в новый режим
function mouseClickedCookies() {
  // Если уже переключились, ничего не делаем
  if (cookieClicked) return;
  
  // Если мышь находится внутри прямоугольника, в который вписывается печенька (50x50)
  if (mouseX > cookieX && mouseX < cookieX + 50 && mouseY > cookieY && mouseY < cookieY + 50) {
    cookieClicked = true;
    // Скрываем все UI-элементы
    clearUI();
    // Запускаем звук (если он загружен)
    if (cookieSound) {
      cookieSound.loop();
    }
  }
}
