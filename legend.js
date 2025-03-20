// legend.js

let legendDiv, legendHeader, legendContent, toggleButton;

function createLegend() {
  // Основной контейнер легенды
  legendDiv = createDiv('');
  legendDiv.id('legend');
  legendDiv.style('position', 'absolute');
  legendDiv.style('top', '50px');
  legendDiv.style('right', '20px');
  legendDiv.style('width', '300px');
  // Полупрозрачный фон
  legendDiv.style('background', 'rgba(0, 0, 0, 0.7)');
  legendDiv.style('color', '#fff');
  legendDiv.style('border-radius', '8px');
  legendDiv.style('font-family', 'sans-serif');
  legendDiv.style('font-size', '14px');
  legendDiv.style('z-index', '1000');
  
  // Заголовок с кнопкой для сворачивания/разворачивания
  legendHeader = createDiv('');
  legendHeader.parent(legendDiv);
  legendHeader.style('background', 'rgba(0, 0, 0, 0.5)');
  legendHeader.style('padding', '10px');
  legendHeader.style('cursor', 'pointer');
  
  // Заголовок окна
  let headerText = createSpan('Легенда проекта');
  headerText.parent(legendHeader);
  headerText.style('margin-right', '20px');
  
  // Кнопка для переключения состояния окна
  toggleButton = createButton('Свернуть');
  toggleButton.parent(legendHeader);
  toggleButton.style('float', 'right');
  toggleButton.mousePressed(toggleLegend);
  
  // Контейнер для основного содержания легенды
  legendContent = createDiv(`
    <p style="padding: 10px; margin: 0;">
      Данный проект представляет интерактивную визуализацию альбомов и синглов исполнителя Loqiemean.
      Условные обозначения:
    </p>
    <ul style="padding: 0 10px; margin: 0 0 10px 20px;">
      <li>Объекты (планеты) с голубоватым свечением - альбомы. Объекты без свечения - синглы.</li>
      <li>Размер каждой планеты зависит от количества прослушиваний альбома или сингла (данные взяты из VK Музыки).</li>
      <li>Вокруг альбомов вращаются соответствующие песни. Желтые звезды - мои любимые песни. А красные - самые-самые любимые (aka фавориты).</li>
      <li>Сайт оснащен динамическим поиском по песням и альбомам.</li>
      <li>Снизу расположены кнопки запуска/остановки анимации, кнопки регулировки зума и кнопка с основном информации об артисте.</li>
      <li>Все объекты в симуляции кликабельны и при нажатии на них открывается модальное окно с информацией об альбоме/песне.</li>
      <li>Нажав на банан... А вы попробуйте нажать на банан и узнаете...</li>
      <li>Нажав на печеньку... Возможно, Вы примете все файлы cookie. Или и нет. Кто знает ;)</li>
    </ul>
  `);
  legendContent.parent(legendDiv);
}

// Функция переключения сворачивания/разворачивания окна легенды
function toggleLegend() {
  // Если содержимое скрыто, показываем его
  if (legendContent.style('display') === 'none') {
    legendContent.style('display', 'block');
    toggleButton.html('Свернуть');
  } else {
    // Если содержимое видно, скрываем его
    legendContent.style('display', 'none');
    toggleButton.html('Развернуть');
  }
}

// Для примера можно автоматически создать легенду при запуске скетча
function setupLegend() {
  createLegend();
  // Если нужно, можно показать легенду сразу или оставить скрытой
  // legendDiv.style('display', 'block'); // по умолчанию окно отображается
}