// albumCovers.js

// Глобальный объект с обложками для альбомов и синглов.
// Ключ – уникальный идентификатор (например, имя альбома или сингла,
// приведённое к нижнему регистру и с заменёнными пробелами на _),
// значение – p5.Image с обложкой.
let albumCovers = {};

/**
 * Функция загрузки обложек.
 * Вызовите эту функцию в preload() основного скетча.
 */
function preloadAlbumCovers() {
  // Проверьте, что пути корректны и файлы существуют!
  albumCovers["контроль"] = loadImage("обложки/Контроль.png", 
    () => { console.log("Cover 'Контроль' loaded"); }, 
    () => { console.error("Error loading cover 'Контроль'"); }
  );
  albumCovers["чёрная_метка"] = loadImage("обложки/Чёрная_метка.jpg", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["зверь_без_нации"] = loadImage("обложки/Зверь_без_нации.jpg", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["сожги_этот_альбом"] = loadImage("обложки/Сожги_Этот_Альбом.jpg", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["повестка"] = loadImage("обложки/ПОВЕСТКА.jpg", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["повес2ка"] = loadImage("обложки/Повес2ка.png", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["пов3стка"] = loadImage("обложки/Пов3стка.png", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["у_себя_на_кухне"] = loadImage("обложки/У_себя_на_кухне.png", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["mlab"] = loadImage("обложки/MLAB.jpeg", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );
  albumCovers["my_little_dead_boy"] = loadImage("обложки/My_Little_Dead_Boy.jpg", 
    () => { console.log("Cover 'another_album' loaded"); }, 
    () => { console.error("Error loading cover 'another_album'"); }
  );


  
  // Пример для синглов:
  albumCovers["good_not_ok"] = loadImage("обложки/Good_Not_Ok.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["jija"] = loadImage("обложки/JIJA.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["алло"] = loadImage("обложки/АЛЛО.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["гвозди"] = loadImage("обложки/Гвозди.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["коалко"] = loadImage("обложки/КОАЛКО.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["паразиты"] = loadImage("обложки/Паразиты.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["самовывоз"] = loadImage("обложки/Самовывоз.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["стая_1993"] = loadImage("обложки/СТАЯ_1993.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["степь"] = loadImage("обложки/Степь.jpeg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["фуф"] = loadImage("обложки/Фуф.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["чёрство"] = loadImage("обложки/Чёрство.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["konstrukt"] = loadImage("обложки/KONSTRUKT.png", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["no_comments"] = loadImage("обложки/No_Comments.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["ok_loqi"] = loadImage("обложки/OK_LOQI.jpg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["живой_питер_2018_(live)"] = loadImage("обложки/живпит.jpeg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );
  albumCovers["зомби_надо_хоронить_(live)"] = loadImage("обложки/знб.jpeg", 
    () => { console.log("Cover 'single_one' loaded"); }, 
    () => { console.error("Error loading cover 'single_one'"); }
  );

}

/**
 * Функция отрисовки обложек поверх объектов.
 * Используется круговой клиппинг, чтобы обложка не выходила за рамки круга.
 * Вызывайте её в draw() после отрисовки остальных объектов.
 */
function drawAlbumCovers() {
  // Отрисовка для альбомов
  for (let album of albumArr) {
    let albumId = album.name.toLowerCase().replace(/\s+/g, '_');
    let coverImg = albumCovers[albumId];
    if (coverImg) {
      push();
      // Переносим систему координат в центр альбома
      translate(album.x, album.y);
      
      // Сохраняем состояние контекста
      drawingContext.save();
      drawingContext.beginPath();
      // Вызов ellipse для Canvas API требует 7 аргументов:
      // (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
      drawingContext.ellipse(0, 0, album.size/2, album.size/2, 0, 0, 2 * Math.PI, false);
      drawingContext.clip();
      
      // Рисуем обложку так, чтобы она заполнила круг
      image(coverImg, -album.size / 2, -album.size / 2, album.size, album.size);
      
      // Восстанавливаем контекст
      drawingContext.restore();
      pop();
    }
  }
  
  // Отрисовка для синглов (если требуется)
  for (let single of singleArr) {
    let singleId = single.trackName.toLowerCase().replace(/\s+/g, '_');
    let coverImg = albumCovers[singleId];
    if (coverImg) {
      push();
      translate(single.x, single.y);
      
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.ellipse(0, 0, single.size/2, single.size/2, 0, 0, 2 * Math.PI, false);
      drawingContext.clip();
      
      image(coverImg, -single.size / 2, -single.size / 2, single.size, single.size);
      
      drawingContext.restore();
      pop();
    }
  }
}