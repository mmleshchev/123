// info.js

let infoDiv;
let infoButton;

function createInfoWindow() {
  // Создаём контейнер для модального окна с информацией
  infoDiv = createDiv('');
  infoDiv.id('infoWindow');
  infoDiv.style('position', 'absolute');
  infoDiv.style('top', '50%');
  infoDiv.style('left', '50%');
  infoDiv.style('transform', 'translate(-50%, -50%)');
  infoDiv.style('width', '400px');
  infoDiv.style('padding', '20px');
  infoDiv.style('background', 'rgba(0, 0, 0, 0.8)'); // полупрозрачный фон
  infoDiv.style('color', '#fff');
  infoDiv.style('border-radius', '10px');
  infoDiv.style('font-family', 'sans-serif');
  infoDiv.style('font-size', '16px');
  infoDiv.style('z-index', '1000');
  infoDiv.style('display', 'none'); // окно скрыто по умолчанию

  // Вставляем контент с информацией об артисте и ссылками на официальные страницы
  infoDiv.html(`
    <h2 style="margin-top: 0; text-align: center;">Кто ты? Что ты? Ну-ка назовись</h2>
    <p>
      Здесь вы найдете информацию о Loqiemean: где можно послушать его музыку, его соцсети, а также радио и сайт с мерчом.
    </p>
    <ul>
      <li><a href="https://music.yandex.ru/artist/4545156" target="_blank" style="color: #4fc3f7;">Loqiemean на Яндекс Музыке</a></li>
      <li><a href="https://vk.com/loqiemeanmusic" target="_blank" style="color: #4fc3f7;">Паблик VK</a></li>
      <li><a href="https://t.me/Loqiemeantg" target="_blank" style="color: #4fc3f7;">Loqiemean в Telegram</a></li>
      <li><a href="https://genius.com/artists/Loqiemean" target="_blank" style="color: #4fc3f7;">Loqiemean на Genius</a></li>
      <li><a href="https://mercher.io/collection/loqiemean" target="_blank" style="color: #4fc3f7;">Коллекция мерча Loqiemean на mercher.io</a></li>
      <li><a href="https://t.me/AACRADIO" target="_blank" style="color: #4fc3f7;">AAC RADIO</a></li>
    </ul>
    <p style="text-align: center; margin-top: 20px;">
      <button id="closeInfo" style="padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
    </p>
  `);

  // Обработчик кнопки закрытия внутри окна
  let closeInfoButton = select('#closeInfo');
  closeInfoButton.mousePressed(toggleInfoWindow);
}

function toggleInfoWindow() {
  // Переключаем видимость окна с информацией
  if (infoDiv.style('display') === 'none') {
    infoDiv.style('display', 'block');
  } else {
    infoDiv.style('display', 'none');
  }
}

function setupInfo() {
  // Создаём модальное окно с информацией
  createInfoWindow();

  // Создаём кнопку «Инфо», расположенную снизу по центру
  infoButton = createButton('Инфо');
  infoButton.id('infoButton');
  infoButton.style('position', 'absolute');
  infoButton.style('bottom', '20px');
  infoButton.style('left', '50%');
  infoButton.style('transform', 'translateX(-50%)');
  infoButton.style('padding', '10px 20px');
  infoButton.style('font-size', '16px');
  infoButton.style('cursor', 'pointer');
  infoButton.style('z-index', '1001');
  infoButton.mousePressed(toggleInfoWindow);
}