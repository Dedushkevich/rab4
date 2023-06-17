const $area = document.querySelector('.area');
const $addBtn = document.querySelector('.button');

let action = false;
let $selectedBox = null;
let selectedBoxIndex = null;
let selectedNoteIndex = null;
let boxes = [];
let notes = [];

const areaWidth = $area.offsetWidth;
const areaHeight = $area.offsetHeight;
let boxWidth = 0;
let boxHeight = 0;

let startCoords = {
  x: 0,
  y: 0,
};

let distance = {
  x: 0,
  y: 0,
};

if (!!getLS('notes')) {
  boxes = getLS('notes');
  boxGenerator(boxes);
}

if (getLS('notes')) {
  illArea();
}

function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLS(key) {
  return JSON.parse(localStorage.getItem(key));
}

function boxGenerator(list) {
  let template = '';
  for (let i = 0; i < list.length; i++) {
    template +=
      '<div class="box" style="left: ' +
      list[i].x +
      'px; top: ' +
      list[i].y +
      'px;" data-index="' +
      i +
      '"><textarea class="textarea"  placeholder="Text" data-index="' +
      i +
      '"></textarea></div > ';
  }
  $area.innerHTML = template;
  boxWidth = document.querySelector('.box').offsetWidth;
  boxHeight = document.querySelector('.box').offsetHeight;
}

function boxController(x, y) {
  $selectedBox.style.left = x + 'px';
  $selectedBox.style.top = y + 'px';
}

$area.addEventListener('mousedown', function (e) {
  if (e.target.classList.contains('box')) {
    action = true;
    $selectedBox = e.target;
    selectedBoxIndex = e.target.getAttribute('data-index');
    startCoords.x = e.pageX;
    startCoords.y = e.pageY;
  }
});

$area.addEventListener('mouseup', function (e) {
  action = false;
  boxes[selectedBoxIndex].x = distance.x;
  boxes[selectedBoxIndex].y = distance.y;

  setLS('notes', boxes);
});

$area.addEventListener('mousemove', function (e) {
  if (action) {
    distance.x = boxes[selectedBoxIndex].x + (e.pageX - startCoords.x);
    distance.y = boxes[selectedBoxIndex].y + (e.pageY - startCoords.y);

    if (distance.x <= 0) distance.x = 0;
    if (distance.x >= areaWidth - boxWidth) distance.x = areaWidth - boxWidth;

    if (distance.y <= 0) distance.y = 0;
    if (distance.y >= areaHeight - boxHeight) distance.y = areaHeight - boxHeight;

    boxController(distance.x, distance.y);
  }
});

$addBtn.addEventListener('click', function () {
  boxes.push({
    x: 0,
    y: 0,
  });
  boxGenerator(boxes);

  if (getLS('notes')) {
    fillTextarea();
  }
});

$area.addEventListener('change', onTextareaChange);

function onTextareaChange(e) {
  boxes[e.target.getAttribute('data-index')].message = e.target.value;

  setLS('notes', boxes);
}
function fillTextarea() {
  const updatedNotes = getLS('notes');

  updatedNotes.forEach((el, index) => {
    document.querySelector(`textarea[data-index="${index}"]`).value = el.message;
  });

  return updatedNotes;
}