// shine.js

/**
 * Рисует эффект свечения вокруг объекта.
 * @param {number} x - Координата x центра объекта.
 * @param {number} y - Координата y центра объекта.
 * @param {number} d - Диаметр объекта.
 * @param {color} col - Цвет свечения (например, color(171, 255, 247)).
 */
function drawGlow(x, y, d, col) {
    push();
    noStroke();
    let glowLayers = 10;
    for (let i = glowLayers; i > 0; i--) {
      let alpha = map(i, 1, glowLayers, 200, 0);
      fill(red(col), green(col), blue(col), alpha);
      let layerSize = d + i * 2;
      ellipse(x, y, layerSize, layerSize);
    }
    pop();
  }