const BASELINE_SIZE = 50; // Базовый размер равен 40
const worldFactor = 4;    // Множитель для генерации мира

// Функция вычисления размера по количеству прослушиваний
function computeSize(listens, baseline) {
  if (listens <= 20000) {
    return baseline;
  } else {
    let extra = listens - 20000;
    let increments = floor(extra / 25000);
    return baseline + increments * 0.4;
  }
}

// Глобальные переменные для хранения данных
let tableTracks, tableAlbums, favTable;
let bgImage;
let albumObjects = {};  // Объект для альбомов
let singleObjects = {}; // Объект для синглов

let albumArr = [];
let singleArr = [];
let listensMap = {}; // Словарь прослушиваний

// Глобальные переменные для камеры (мировые координаты центра)
let currentCamX = 0, currentCamY = 0, currentZoom = 1;
let targetCamX = 0, targetCamY = 0, targetZoom = 1;
let camX = 0, camY = 0;
let zoom = 1; // начальный зум

let lastMouseX, lastMouseY;

// Кнопки зума и кнопка паузы
let zoomInButton, zoomOutButton, pauseButton;
let isPaused = false;

// Элементы поиска и автодополнения
let searchInput, searchButton, searchSuggestions;
let searchQuery = ""; // поисковый запрос

// Глобальные переменные для изображений (текстур)
let image5pikes, image8pikes;

// Переменные для отслеживания наведения на альбом (с задержкой)
let hoveredAlbum = null;
let hoverStartTime = 0;

let lokiImg;

function preload() {
  tableTracks = loadTable('loqidata1.csv', 'csv');
  tableAlbums = loadTable('loqidata2.csv', 'csv', 'header');
  favTable = loadTable('favloqidata.csv', 'csv', 'header'); // CSV с предпочтениями
  bgImage = loadImage('spacebackground.jpg');
  
  // Загружаем изображения для текстур спутников
  image5pikes = loadImage('5pikes.png');
  image8pikes = loadImage('8pikes.png');
  
  // Загружаем обложки альбомов и синглов (функция из albumCovers.js)
  preloadAlbumCovers();
  
  // Загрузка ресурсов для бананового плеера (функция из bananaPlayer.js)
  if (typeof preloadBananaPlayer === "function") {
    preloadBananaPlayer();
  }
  
  // Загрузка ресурсов для эффекта печеньки (функция из cookies.js)
  if (typeof preloadCookies === "function") {
    preloadCookies(); 
  }
  lokiImg = loadImage("локи.png");
}

// Функция автодополнения — вызывается при вводе в поле поиска
function updateSearchSuggestions() {
  let query = searchInput.value().toLowerCase();
  searchQuery = query;
  
  let names = [];
  albumArr.forEach(album => names.push(album.name));
  singleArr.forEach(single => names.push(single.trackName));
  albumArr.forEach(album => {
    album.trackList.forEach(track => names.push(track.trackName));
  });
  names = [...new Set(names)];
  
  let suggestions = names.filter(name => name.toLowerCase().startsWith(query));
  
  let html = "";
  suggestions.forEach(suggestion => {
    html += `<div class="suggestion" style="padding:4px; cursor:pointer;">${suggestion}</div>`;
  });
  searchSuggestions.html(html);
  
  let suggestionDivs = selectAll('.suggestion');
  suggestionDivs.forEach(div => {
    div.mousePressed(() => {
      searchInput.value(div.html());
      searchQuery = div.html().toLowerCase();
      searchSuggestions.html("");
      let found = findObjectByQuery(searchQuery);
      if (found) {
        targetCamX = found.x;
        targetCamY = found.y;
        targetZoom = map(found.size, 20, 80, 2.5, 1, true);
      }
    });
  });
}

function normalizeName(name) {
  return (typeof name === "string") ? name.trim().toLowerCase() : "";
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('z-index', '1');
  angleMode(DEGREES);
  
  console.log("Album table columns:", tableAlbums.columns);
  
  processData();
  distributeObjects();
  
  // Отцентровываем камеру на центральную область генерации
  camX = (width * worldFactor) / 2;
  camY = (height * worldFactor) / 2;
  zoom = 0.3;
  
  // Инициализируем значения камеры
  currentCamX = camX;
  currentCamY = camY;
  currentZoom = zoom;
  targetCamX = camX;
  targetCamY = camY;
  targetZoom = zoom;
  
  // Создаем кнопки зума
  zoomInButton = createButton("+");
  zoomOutButton = createButton("–");
  repositionButtons();
  zoomInButton.mousePressed(() => { targetZoom *= 1.1; });
  zoomOutButton.mousePressed(() => { targetZoom /= 1.1; });
  
  // Кнопка паузы (правый нижний угол)
  pauseButton = createButton("Pause");
  pauseButton.position(windowWidth - 120, windowHeight - 50);
  pauseButton.mousePressed(togglePause);
  
  // Элементы поиска
  searchInput = createInput();
  searchButton = createButton("OK LOQI");
  searchSuggestions = createDiv("");
  
  searchInput.position(windowWidth / 2 - 150, 10);
  searchInput.size(200);
  searchButton.position(windowWidth / 2 + 60, 10);
  searchSuggestions.position(windowWidth / 2 - 150, 40);
  searchSuggestions.style('background', '#fff');
  searchSuggestions.style('max-height', '150px');
  searchSuggestions.style('overflow-y', 'auto');
  searchSuggestions.style('width', '200px');
  
  searchInput.style('background', 'rgba(255,255,255,0.5)');
  searchInput.elt.addEventListener('focus', () => {
    searchInput.style('background', 'rgba(255,255,255,1)');
  });
  searchInput.elt.addEventListener('blur', () => {
    searchInput.style('background', 'rgba(255,255,255,0.5)');
  });
  
  searchButton.mousePressed(() => {
    searchQuery = searchInput.value().toLowerCase();
    let found = findObjectByQuery(searchQuery);
    if (found) {
      targetCamX = found.x;
      targetCamY = found.y;
      targetZoom = map(found.size, 20, 80, 2.5, 1, true);
    }
  });
  searchInput.input(updateSearchSuggestions);
  
  // Создаем всплывающее окно (popup.js)
  createPopup();
  
  // Инициализируем банановый плеер (функции из bananaPlayer.js)
  if (typeof setupBananaPlayer === "function") {
    setupBananaPlayer();
  }
  
  // Инициализируем эффект печеньки (функция из cookies.js)
  if (typeof setupCookies === "function") {
    setupCookies();
  }
  if (typeof setupLegend === "function") {
    setupLegend();
  }
  
  // Инициализируем окно с информацией об артисте
  if (typeof setupInfo === "function") {
    setupInfo();
  }
}

function togglePause() {
  if (isPaused) {
    isPaused = false;
    loop();
    pauseButton.html("Pause");
  } else {
    isPaused = true;
    noLoop();
    pauseButton.html("Resume");
  }
}

function processData() {
  // Заполняем listensMap из tableAlbums
  for (let i = 0; i < tableAlbums.getRowCount(); i++) {
    let row = tableAlbums.getRow(i);
    let albumName = (row.get('Название альбома / Сингл') || "").trim();
    let normName = normalizeName(albumName);
    if (normName === "название альбома/сингл" || normName === "название альбома / сингл") continue;
    let listensStr = row.get('Количество прослушиваний') || row.get(1) || "";
    listensStr = listensStr.toString().trim().replace(/,/g, '');
    let listens = parseInt(listensStr) || 0;
    listensMap[normName] = listens;
  }
  
  // Обработка tableTracks
  let nTracks = tableTracks.getRowCount();
  for (let i = 0; i < nTracks; i++) {
    let row = tableTracks.getRow(i);
    let albumField = (row.get(0) || "").trim();
    let normAlbum = normalizeName(albumField);
    if (normAlbum === "название альбома/сингл" || normAlbum === "название альбома / сингл") continue;
    
    let trackName = (row.get(2) || "").trim();
    let normTrack = normalizeName(trackName);
    
    let durationStr = (row.get(3) || "").trim();
    let duration = 0;
    let parts = durationStr.split(':');
    if (parts.length === 2) {
      duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    
    // Если это сингл
    if (normAlbum === "сингл") {
      if (!(normTrack in singleObjects)) {
        let listens = listensMap[normTrack] || 0;
        // Получаем год выпуска и жанр из CSV
        let releaseYear = row.get(1) ? row.get(1).toString().trim() : "";
        let genre = row.get(4) ? row.get(4).toString().trim() : "";
        singleObjects[normTrack] = { 
          trackName: trackName, 
          listens: listens, 
          duration: duration,
          message: "Жанр: " + genre + "<br>Год выпуска: " + releaseYear
        };
      }
    } else {
      // Если это альбом
      if (!(normAlbum in albumObjects)) {
        let listens = listensMap[normAlbum] || 0;
        albumObjects[normAlbum] = { 
          name: albumField, 
          listens: listens, 
          tracks: {},
          trackList: [],
          message: "Описание альбома: " + albumField
        };
      }
      let trackKey = normTrack + "_" + duration;
      if (!(trackKey in albumObjects[normAlbum].tracks)) {
        albumObjects[normAlbum].tracks[trackKey] = { 
          trackName: trackName, 
          duration: duration, 
          angle: random(360),
          orbitOffset: random(20, 100),
          message: "Описание песни: " + trackName + " (длительность: " + duration + " сек)"
        };
        albumObjects[normAlbum].trackList.push(albumObjects[normAlbum].tracks[trackKey]);
      }
    }
  }
  
  // Обработка CSV с предпочтениями
  processFavData();
}

function processFavData() {
  // Для каждой строки favTable: Название альбома / Сингл, Название трека, Любимая песня (да/дада/нет)
  for (let i = 0; i < favTable.getRowCount(); i++) {
    let row = favTable.getRow(i);
    let albumField = (row.get("Название альбома / Сингл") || "").trim();
    let trackField = (row.get("Название трека") || "").trim();
    let favValue = (row.get("Любимая песня (да/дада/нет)") || "").trim();
    console.log("Fav row:", albumField, trackField, favValue);
    let normAlbum = normalizeName(albumField);
    let normTrack = normalizeName(trackField);
    
    if (normAlbum === "сингл") {
      if (singleObjects[normTrack]) {
        singleObjects[normTrack].fav = favValue;
        console.log("Single fav set:", normTrack, favValue);
      }
    } else {
      if (albumObjects[normAlbum] && albumObjects[normAlbum].tracks) {
        for (let key in albumObjects[normAlbum].tracks) {
          let trackObj = albumObjects[normAlbum].tracks[key];
          if (normalizeName(trackObj.trackName) === normTrack) {
            trackObj.fav = favValue;
            console.log("Album track fav set:", trackObj.trackName, favValue);
            break;
          }
        }
      }
    }
  }
}

function distributeObjects() {
  albumArr = Object.values(albumObjects);
  singleArr = Object.values(singleObjects);
  
  function distributeInArea(arr, areaX, areaY, areaW, areaH) {
    let n = arr.length;
    let cols = ceil(sqrt(n));
    let rows = ceil(n / cols);
    let cellW = areaW / cols;
    let cellH = areaH / rows;
    for (let i = 0; i < n; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = areaX + col * cellW + random(cellW * 0.3, cellW * 0.7);
      let y = areaY + row * cellH + random(cellH * 0.3, cellH * 0.7);
      arr[i].x = x;
      arr[i].y = y;
    }
  }
  
  let margin = 50;
  let areaX = margin;
  let areaY = margin;
  let areaW = width * worldFactor - 2 * margin;
  let areaH = height * worldFactor - 2 * margin;
  
  distributeInArea(albumArr, areaX, areaY, areaW, areaH);
  albumArr.forEach(album => {
    album.size = computeSize(album.listens, BASELINE_SIZE);
    console.log("Album:", album.name, "Listens:", album.listens, "Size:", album.size);
  });
  
  distributeInArea(singleArr, areaX, areaY, areaW, areaH);
  singleArr.forEach(single => {
    single.size = computeSize(single.listens, BASELINE_SIZE);
    console.log("Single:", single.trackName, "Listens:", single.listens, "Size:", single.size);
  });
  
  let allObjects = albumArr.concat(singleArr);
  preventCollisions(allObjects, areaX, areaY, areaW, areaH);
}

function preventCollisions(objects, areaX, areaY, areaW, areaH) {
  let maxIterations = 1000;
  let iterations = 0;
  let collisionFound = true;
  while (collisionFound && iterations < maxIterations) {
    collisionFound = false;
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        let obj1 = objects[i];
        let obj2 = objects[j];
        let dx = obj1.x - obj2.x;
        let dy = obj1.y - obj2.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDistance = (obj1.size + obj2.size) / 2;
        if (distance < minDistance) {
          collisionFound = true;
          obj2.x = random(areaX, areaX + areaW);
          obj2.y = random(areaY, areaY + areaH);
        }
      }
    }
    iterations++;
  }
  if (iterations === maxIterations) {
    console.log("Max iterations reached in collision prevention");
  }
}

// Функция поиска объекта по запросу (альбом, спутник, сингл)
function findObjectByQuery(query) {
  let found = null;
  for (let album of albumArr) {
    if (album.name.toLowerCase().includes(query)) {
      found = album;
      break;
    }
    for (let track of album.trackList) {
      if (track.trackName.toLowerCase().includes(query)) {
        let baseOrbit = album.size / 2 + track.orbitOffset;
        let angle = track.angle || random(360);
        let satelliteX = album.x + cos(angle) * baseOrbit;
        let satelliteY = album.y + sin(angle) * baseOrbit;
        found = { x: satelliteX, y: satelliteY, size: album.size, trackName: track.trackName, message: track.message };
        break;
      }
    }
    if (found) break;
  }
  if (!found) {
    for (let single of singleArr) {
      if (single.trackName.toLowerCase().includes(query)) {
        found = single;
        break;
      }
    }
  }
  return found;
}

function draw() {
  background(0);
  
  // Обработка наведения мыши с задержкой 1 секунда для приближения
  if (!mouseIsPressed) {
    let worldMouseX = (mouseX - width / 2) / currentZoom + currentCamX;
    let worldMouseY = (mouseY - height / 2) / currentZoom + currentCamY;
    let hovered = null;
    albumArr.forEach(album => {
      if (dist(worldMouseX, worldMouseY, album.x, album.y) < album.size / 2) {
        hovered = album;
      }
    });
    if (!hovered) {
      singleArr.forEach(single => {
        if (dist(worldMouseX, worldMouseY, single.x, single.y) < single.size / 2) {
          hovered = single;
        }
      });
    }
    if (hovered) {
      if (hoveredAlbum !== hovered) {
        hoveredAlbum = hovered;
        hoverStartTime = millis();
      } else if (millis() - hoverStartTime >= 300) {
        targetCamX = hovered.x;
        targetCamY = hovered.y;
        targetZoom = map(hovered.size, 20, 80, 2.5, 1, true);
      }
    } else {
      hoveredAlbum = null;
    }
  }
  
  // Плавное обновление камеры и зума
  currentCamX = lerp(currentCamX, targetCamX, 0.1);
  currentCamY = lerp(currentCamY, targetCamY, 0.1);
  currentZoom = lerp(currentZoom, targetZoom, 0.1);
  
  push();
  translate(width / 2, height / 2);
  scale(currentZoom);
  translate(-currentCamX, -currentCamY);
  
  // Рисуем повторяющийся фон
  let tileW = bgImage.width;
  let tileH = bgImage.height;
  let viewLeft = currentCamX - (width / 2) / currentZoom;
  let viewTop = currentCamY - (height / 2) / currentZoom;
  let viewRight = currentCamX + (width / 2) / currentZoom;
  let viewBottom = currentCamY + (height / 2) / currentZoom;
  let startX = floor(viewLeft / tileW) * tileW;
  let startY = floor(viewTop / tileH) * tileH;
  for (let x = startX; x < viewRight; x += tileW) {
    for (let y = startY; y < viewBottom; y += tileH) {
      image(bgImage, x, y);
    }
  }
  
  if (lokiImg) {
    push();
    imageMode(CENTER);
    // Центр области генерации: (width*worldFactor/2, height*worldFactor/2)
    image(lokiImg, (width * worldFactor) / 2, (height * worldFactor) / 2);
    imageMode(CORNER);
    pop();
  }

  // Рисуем альбомы
  albumArr.forEach(album => {
    if (searchQuery && album.name.toLowerCase().includes(searchQuery)) {
      stroke(255, 0, 0);
      strokeWeight(4);
    } else {
      noStroke();
    }
    // Отрисовка glow
    drawGlow(album.x, album.y, album.size, color(171, 255, 247));
    
    // Выводим подпись альбома
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(album.name, album.x, album.y - album.size / 2 - 10);
    
    drawOrbits(album);
  });
  
  // Рисуем синглы
  singleArr.forEach(single => {
    if (searchQuery && single.trackName.toLowerCase().includes(searchQuery)) {
      stroke(255, 0, 0);
      strokeWeight(4);
    } else {
      noStroke();
    }
    fill(200, 50, 50);
    ellipse(single.x, single.y, single.size, single.size);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(single.trackName, single.x, single.y + single.size / 2 + 10);
  });
  
  // Отрисовываем обложки альбомов (функция из albumCovers.js)
  drawAlbumCovers();
  
  pop();
  
  // Обновляем банановый плеер (функция из bananaPlayer.js)
  if (typeof updateBananaPlayer === "function") {
    updateBananaPlayer();
  }
  
  // Отрисовываем эффект печеньки (функция из cookies.js)
  if (typeof drawCookies === "function") {
    drawCookies();
  }
}

function drawOrbits(album) {
  push();
  translate(album.x, album.y);
  album.trackList.forEach(track => {
    let baseOrbit = album.size / 2 + track.orbitOffset;
    let minOrbit = album.size / 2 + 20;
    let maxOrbit = album.size / 2 + 100;
    let orbitSpeed = map(baseOrbit, minOrbit, maxOrbit, 3, 0.5);
    track.angle = (track.angle || random(360)) + orbitSpeed;
    let orbitDistance = baseOrbit;
    let tx = cos(track.angle) * orbitDistance;
    let ty = sin(track.angle) * orbitDistance;
    
    // Корректировка орбиты, чтобы не пересекаться с синглами
    for (let i = 0; i < singleArr.length; i++) {
      let single = singleArr[i];
      let sx = album.x + tx;
      let sy = album.y + ty;
      let d = dist(sx, sy, single.x, single.y);
      let minDist = 5 + single.size / 2;
      if (d < minDist) {
        orbitDistance += (minDist - d);
        tx = cos(track.angle) * orbitDistance;
        ty = sin(track.angle) * orbitDistance;
      }
    }
    
    // Отрисовка спутника
    push();
    translate(tx, ty);
    noStroke();
    if (track.fav) {
      let favVal = track.fav.toLowerCase();
      if (favVal === "да") {
        image(image5pikes, -8, -8, 20, 20);
      } else if (favVal === "дада") {
        image(image8pikes, -18, -18, 32, 32);
      } else {
        ellipse(0, 0, 10, 10);
      }
    } else {
      ellipse(0, 0, 10, 10);
    }
    pop();
    
    // Подсветка, если название трека совпадает с поисковым запросом
    if (searchQuery && track.trackName.toLowerCase().includes(searchQuery)) {
      push();
      translate(tx, ty);
      stroke(255, 0, 0);
      strokeWeight(2);
      noFill();
      ellipse(0, 0, 14, 14);
      pop();
    }
  });
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  repositionButtons();
  if (searchInput) searchInput.position(windowWidth / 2 - 150, 10);
  if (searchButton) searchButton.position(windowWidth / 2 + 60, 10);
  if (searchSuggestions) searchSuggestions.position(windowWidth / 2 - 150, 40);
}

function repositionButtons() {
  if (zoomInButton && zoomOutButton) {
    let spacing = 10;
    let btnWidth = 40;
    let btnHeight = 40;
    zoomInButton.position(windowWidth / 6 - btnWidth - spacing / 6, windowHeight - btnHeight - 20);
    zoomOutButton.position(windowWidth / 6 + spacing / 6, windowHeight - btnHeight - 20);
  }
}

function mousePressed() {
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  let dx = mouseX - lastMouseX;
  let dy = mouseY - lastMouseY;
  targetCamX -= dx / currentZoom;
  targetCamY -= dy / currentZoom;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseClicked() {
  console.log("mouseClicked", mouseX, mouseY);
  let worldX = (mouseX - width / 2) / currentZoom + currentCamX;
  let worldY = (mouseY - height / 2) / currentZoom + currentCamY;
  let clickedObject = null;
  
  // Сначала ищем, был ли клик по альбому (и его трекам)
  for (let album of albumArr) {
    if (dist(worldX, worldY, album.x, album.y) < album.size / 2) {
      clickedObject = album;
      break;
    }
    for (let track of album.trackList) {
      let baseOrbit = album.size / 2 + track.orbitOffset;
      let angle = track.angle || random(360);
      let satelliteX = album.x + cos(angle) * baseOrbit;
      let satelliteY = album.y + sin(angle) * baseOrbit;
      if (dist(worldX, worldY, satelliteX, satelliteY) < 10 / 2) {
        clickedObject = { type: "track", album: album, track: track };
        break;
      }
    }
    if (clickedObject) break;
  }
  
  // Если не найдено среди альбомов — проверяем синглы
  if (!clickedObject) {
    for (let single of singleArr) {
      if (dist(worldX, worldY, single.x, single.y) < single.size / 2) {
        clickedObject = single;
        break;
      }
    }
  }
  
  if (clickedObject) {
    if (clickedObject.name && !clickedObject.type) {
      hidePopup();
      showAlbumFactsPopup(clickedObject);
      return;
    } else {
      hideAlbumFactsPopup();
    }
    
    let info = "";
    if (clickedObject.type && clickedObject.type === "track") {
      info += "<strong>Track:</strong> " + clickedObject.track.trackName + "<br>";
      info += "<strong>Album:</strong> " + clickedObject.album.name + "<br>";
      info += "<strong>Duration:</strong> " + clickedObject.track.duration + " sec<br>";
      if (clickedObject.track.message) {
        info += "<em>" + clickedObject.track.message + "</em><br>";
      }
    } else if (clickedObject.name) {
      info += "<strong>Album:</strong> " + clickedObject.name + "<br>";
      info += "<strong>Listens:</strong> " + clickedObject.listens + "<br>";
      if (clickedObject.message) {
        info += "<em>" + clickedObject.message + "</em><br>";
      }
    } else if (clickedObject.trackName) {
      info += "<strong>Single:</strong> " + clickedObject.trackName + "<br>";
      info += "<strong>Duration:</strong> " + clickedObject.duration + " sec<br>";
      if (clickedObject.message) {
        info += "<em>" + clickedObject.message + "</em><br>";
      }
    }
    showPopup(info);
  } else {
    hidePopup();
    hideAlbumFactsPopup();
  }
  
  // Проверяем клик по печеньке (функция из cookies.js)
  if (typeof mouseClickedCookies === "function") {
    mouseClickedCookies();
  }
}

function mouseWheel(event) {
  let zoomFactor = 1 - event.delta * 0.009;
  targetZoom *= zoomFactor;
  return false;
}