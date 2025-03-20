let popupDiv;

function createPopup() {
  console.log("createPopup() called");
  popupDiv = createDiv('');
  popupDiv.style('position', 'fixed');
  popupDiv.style('top', '20px');
  popupDiv.style('right', '20px');
  popupDiv.style('width', '300px');
  popupDiv.style('background-color', 'rgba(0, 0, 0, 0.8)');
  popupDiv.style('color', '#fff');
  popupDiv.style('padding', '10px');
  popupDiv.style('border-radius', '8px');
  popupDiv.style('font-family', 'sans-serif');
  popupDiv.style('font-size', '14px');
  popupDiv.style('line-height', '1.5');
  popupDiv.style('z-index', '10000'); // очень высокий z-index
  popupDiv.style('display', 'none');
  console.log("popupDiv created:", popupDiv);
}

function showPopup(info) {
  console.log("showPopup called:", info);
  if (popupDiv) {
    popupDiv.html(info);
    popupDiv.style('display', 'block');
  } else {
    console.warn("popupDiv не создан! Проверьте, что функция createPopup() была вызвана.");
  }
}

function hidePopup() {
  if (popupDiv) {
    popupDiv.style('display', 'none');
  } else {
    console.warn('popupDiv не создан! Функция createPopup() не была вызвана или произошла ошибка.');
  }
}
