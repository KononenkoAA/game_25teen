//Создаем div с классом "page"
let page = document.createElement("div");
page.className = "page";
document.body.prepend(page);

//Создаем h1 с классом

let h1 = document.createElement("h1");
h1.innerHTML = "&laquo;Игра пятнашки&raquo;";
page.insertAdjacentElement("afterbegin", h1);

//Создаем таймер

let container = document.createElement("div");
container.className = "container";
page.insertAdjacentElement("beforeend", container);

let timer = document.createElement("div");
timer.className = "timer";
container.insertAdjacentElement("beforeend", timer);

let itemTime = new Array(4).fill(0).map((item, index) => index + 1);

for (let i = 0; i < itemTime.length; i++) {
  let arr = ["hour", "minute", "second", "millisecond"];
  let arr_title = ["Часы", "Минуты", "Секунды", "Миллисекунды"];
  let timer__block = document.createElement("div");
  timer__block.className = "timer__block";
  timer.insertAdjacentElement("beforeend", timer__block);

  let time = document.createElement("div");
  time.className = `time ${arr[i]}`;
  time.innerHTML = "00";
  timer__block.insertAdjacentElement("beforeend", time);

  let title = document.createElement("div");
  title.className = "title";
  title.innerHTML = arr_title[i];

  timer__block.insertAdjacentElement("beforeend", title);
}

// Ходы
let counterContainer = document.createElement("div");
counterContainer.className = "counterContainer";
page.insertAdjacentElement("beforeend", counterContainer);

let containerTitle = document.createElement("div");
containerTitle.className = "containerTitle";
containerTitle.innerHTML = "Кол-во ходов: ";
counterContainer.insertAdjacentElement("beforeend", containerTitle);

let counter = document.createElement("div");
counter.className = "counter";
counter.innerHTML = "0";
counterContainer.insertAdjacentElement("beforeend", counter);

//Создаем div с классом "fifteen"
let fifteen = document.createElement("div");
fifteen.className = "fifteen";
page.insertAdjacentElement("beforeend", fifteen);

//Создаем массив цифр от 1 жо 16
let values = new Array(16).fill(0).map((item, index) => index + 1);

//Создаем 16 блоков с цифрами
for (let i = 0; i < values.length; i++) {
  let item = document.createElement("button");
  item.className = "item";
  item.setAttribute("data-matrix-id", values[i]);

  let span = document.createElement("span");
  span.className = "itemVal";
  span.innerHTML = values[i];

  fifteen.insertAdjacentElement("beforeend", item);
  item.insertAdjacentElement("beforeend", span);
}

//Ссылки на игры от 3х3 до 8х8
let linkArr = new Array(6).fill(0).map((item, index) => index + 1);
let containerLink = document.createElement("div");
containerLink.className = "containerLink";
page.insertAdjacentElement("beforeend", containerLink);

for (let i = 0; i < linkArr.length; i++) {
  let arr = ["3x3", "4x4", "5x5", "6x6", "7x7", "8x8"];
  let link = document.createElement("button");
  link.className = "link";

  link.innerHTML = arr[i];

  containerLink.insertAdjacentElement("beforeend", link);
}

//Создаем кнопку с классом "start" и "stop"
let start = document.createElement("button");
start.className = "start";
start.innerHTML = "Начать игру";
page.insertAdjacentElement("beforeend", start);

let pause = document.createElement("button");
pause.className = "pause";
pause.innerHTML = "Пауза";
page.insertAdjacentElement("beforeend", pause);

let stop = document.createElement("button");
stop.className = "stop";
stop.innerHTML = "Стоп";
page.insertAdjacentElement("beforeend", stop);

//Создаем кнопку с классом "shuffle"
let shuffle = document.createElement("button");
shuffle.className = "shuffle";
shuffle.innerHTML = "Перемешать";
page.insertAdjacentElement("beforeend", shuffle);

//************************************** */
//************************************** */
//************************************** */
//************************************** */

const containerNode = document.querySelector(".fifteen");
const itemNodes = Array.from(containerNode.querySelectorAll(".item"));
const countItems = 16;
if (itemNodes.length != 16) {
  throw new Error(`должно быть ровно ${countItems}`);
}

//************************************** */
//************************************** */
//************************************** */
//************************************** */

//1. Позиционирование item
itemNodes[countItems - 1].style.display = "none";
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
const shuffledArray = shuffleArray(matrix.flat());
matrix = getMatrix(shuffledArray);
setPositionItems(matrix);

//2. Делаем кнопку shuffle

document.querySelector(".shuffle").addEventListener("click", () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
});

//2.1 Делаем кнопку start
document.querySelector(".start").addEventListener("click", () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
});

//3. Меняем позиция item по клику
const blankNumber = 16;
let count = 0;
containerNode.addEventListener("click", (event) => {
  const buttonNode = event.target.closest("button");
  if (!buttonNode) {
    return;
  }

  const buttonNumber = Number(buttonNode.dataset.matrixId);
  const buttonCoords = findCoordsByNumber(buttonNumber, matrix);
  const blankCoords = findCoordsByNumber(blankNumber, matrix);
  const isValid = isValidForSwap(buttonCoords, blankCoords);

  if (isValid) {
    swap(blankCoords, buttonCoords, matrix);
    count++;
    counter.innerHTML = count;
    setPositionItems(matrix);
  }
});

//4.Показать победу

//5. Секундомер

const hourElement = document.querySelector(".hour");
const minuteElement = document.querySelector(".minute");
const secondElement = document.querySelector(".second");
const millisecondElement = document.querySelector(".millisecond");

//Прослушка
start.addEventListener("click", () => {
  clearInterval(interval);
  count = 0;
  counter.innerHTML = 0;

  interval = setInterval(startTimer, 10);
});
shuffle.addEventListener("click", () => {
  clearInterval(interval);
  counter.innerHTML = 0;
  count = 0;

  hour = 00;
  minute = 00;
  second = 00;
  millisecond = 00;
  hourElement.textContent = "00";
  minuteElement.textContent = "00";
  secondElement.textContent = "00";
  millisecondElement.textContent = "00";

  interval = setInterval(startTimer, 10);
});

pause.addEventListener("click", () => {
  clearInterval(interval);
});

stop.addEventListener("click", () => {
  clearInterval(interval);
  count = 0;
  counter.innerHTML = 0;
  hour = 00;
  minute = 00;
  second = 00;
  millisecond = 00;
  hourElement.textContent = "00";
  minuteElement.textContent = "00";
  secondElement.textContent = "00";
  millisecondElement.textContent = "00";
});

// Поля
let hour = 00,
  minute = 00,
  second = 00,
  millisecond = 00,
  interval;

function startTimer() {
  millisecond++;

  if (millisecond < 9) {
    millisecondElement.innerHTML = "0" + millisecond;
  }
  if (millisecond > 9) {
    millisecondElement.innerHTML = millisecond;
  }
  if (millisecond > 99) {
    second++;
    secondElement.innerHTML = "0" + second;
    millisecond = 0;
    millisecondElement.innerHTML = "0" + millisecond;
  }

  //Second
  if (second < 9) {
    secondElement.innerHTML = "0" + second;
  }
  if (second > 9) {
    secondElement.innerHTML = second;
  }
  if (second > 59) {
    minute++;
    minuteElement.innerHTML = "0" + minute;
    second = 0;
    secondElement.innerHTML = "0" + second;
  }

  //Minute
  if (minute < 9) {
    minuteElement.innerHTML = "0" + minute;
  }
  if (minute > 9) {
    minuteElement.innerHTML = minute;
  }
  if (minute > 59) {
    hour++;
    hourElement.innerHTML = "0" + minute;
    minute = 0;
    secondElement.innerHTML = "0" + minute;
  }

  //Hour
  if (hour > 9) {
    hourElement.innerHTML = hour;
  }
}

//************************************** */
//************************************** */
//************************************** */
//************************************** */

//Функции-помощники
function getMatrix(arr) {
  const matrix = [[], [], [], []];
  let y = 0;
  let x = 0;

  for (let i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

function setPositionItems(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

function setNodeStyles(node, x, y) {
  const shiftPs = 100;
  node.style.transform = `translate3d(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function findCoordsByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return { x, y };
      }
    }
  }
  return null;
}

function isValidForSwap(c1, c2) {
  const diffX = Math.abs(c1.x - c2.x);
  const diffY = Math.abs(c1.y - c2.y);

  return (diffX === 1 || diffY === 1) && (c1.x === c2.x || c1.y === c2.y);
}

function swap(c1, c2, matrix) {
  const coords1Number = matrix[c1.y][c1.x];
  matrix[c1.y][c1.x] = matrix[c2.y][c2.x];
  matrix[c2.y][c2.x] = coords1Number;

  if (isWon(matrix)) {
    addWonClass();
  }
}
const winFlatArr = new Array(16).fill(0).map((item, index) => index + 1);

console.log(winFlatArr);

function isWon(matrix) {
  const flatMatrix = matrix.flat();
  for (let i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
      return false;
    }
  }
  return true;
}

const wonClass = "fifteenWon";
function addWonClass() {
  setTimeout(() => {
    containerNode.classList.add(wonClass);

    alert("Вы выиграли!");
    setTimeout(() => {
      containerNode.classList.remove(wonClass);
    }, 9000);
  }, 200);
}
