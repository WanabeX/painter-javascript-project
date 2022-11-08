// Canvas
const canvas = document.getElementById("main-canvas");
// Get 2d context
const ctx = canvas.getContext("2d");
// Colors
const colorPalette = Array.from(
  document.getElementsByClassName("color-option")
);
const colorPicker = document.getElementById("color");
// Brush size
const brushSize = document.getElementById("border-line");
// Toolbox
const toolBtns = Array.from(document.querySelectorAll(".drawing-tools button"));
const pencil = document.getElementById("pencil");

// Canvas & Brush set
canvas.width = 700;
canvas.height = 700;
ctx.lineWidth = brushSize.value;
ctx.lineCap = "round";

// Location
var locA, locB;

// For tool controls
let isPainting = false;
let isFilling = false;
let isPencil = true;
let isLine = false;
let isRectangle = false;
let isCircle = false;

// Painting on canvas
function onMove(e) {
  if (isPainting) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(e.offsetX, e.offsetY);
}

// Control painting(start)
function startPainting() {
  isPainting = true;
}

// Control painting(stop)
function stopPainting() {
  isPainting = false;
  ctx.beginPath();
}

// Erase
function erase() {
  ctx.strokeStyle = "#ffffff";
  colorPicker.value = "#ffffff";
  ctx.fillStyle = "#ffffff";
}

// Change brush size
function BrushSizeChange(e) {
  ctx.lineWidth = e.target.value;
  ctx.beginPath();
}

// Change color use colorPicker
function colorChangePicker(e) {
  ctx.strokeStyle = e.target.value;
  ctx.fillStyle = e.target.value;
  ctx.beginPath();
}

// Change color use colorPalette
function colorChangePalette(e) {
  const colorData = e.target.dataset.color;
  ctx.strokeStyle = colorData;
  ctx.fillStyle = colorData;
  colorPicker.value = colorData;
  ctx.beginPath();
}

// Fill canvas
function fillCanvas() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height); // fillRect(x, y, w, h);
  }
}

// Draw straight line
function drawLine(e) {
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function getMousePos(canvas, e) {
  if (isRectangle || isCircle) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
}

function startDrawRect(e) {
  e.preventDefault();
  locA = getMousePos(canvas, e);
}

function stopDrawRect(e) {
  e.preventDefault();
  locB = getMousePos(canvas, e);
  if (isStroke) {
    ctx.strokeRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y); // fillRect(x, y, w, h);
  } else {
    ctx.fillRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y); // fillRect(x, y, w, h);
  }
}

function startDrawCircle(e) {
  e.preventDefault();
  locA = getMousePos(canvas, e);
}

function stopDrawCircle(e) {
  e.preventDefault();
  locB = getMousePos(canvas, e);
  if (isStroke) {
    ctx.arc(locA.x, locA.y, locB.x - locA.x, 0, Math.PI * 2); // arc(x, y, radius, startAngle, endAngle)
    ctx.stroke();
  } else {
    ctx.arc(locA.x, locA.y, locB.x - locA.x, 0, Math.PI * 2); // arc(x, y, radius, startAngle, endAngle)
    ctx.fill();
  }
  ctx.beginPath();
}

// Activate the btn effect and role of the selected tool
function toolStatusActive(e) {
  // Activate the btn effect
  document.querySelector("button.active").classList.remove("active");
  e.target.classList.add("active");
  const target = e.target.id;
  // Activate role
  if (target == "pencil") {
    isPencil = true;
    isFilling = false;
    isLine = false;
    isRectangle = false;
    isStroke = false;
  } else if (target == "eraser") {
    isPencil = true;
    isFilling = false;
    isLine = false;
    isRectangle = false;
    isStroke = false;
    erase();
  } else if (target == "paint") {
    isPencil = false;
    isPainting = false;
    isFilling = true;
    isLine = false;
    isRectangle = false;
    isStroke = false;
  } else if (target == "line") {
    isPencil = false;
    isFilling = false;
    isLine = true;
    isRectangle = false;
    isStroke = false;
  } else if (target == "square-stroke") {
    isPencil = false;
    isFilling = false;
    isPainting = false;
    isLine = false;
    isRectangle = true;
    isStroke = true;
  } else if (target == "square-fill") {
    isPencil = false;
    isFilling = false;
    isPainting = false;
    isLine = false;
    isRectangle = true;
    isStroke = false;
  } else if (target == "circle-stroke") {
    isPencil = false;
    isFilling = false;
    isPainting = false;
    isLine = false;
    isRectangle = false;
    isCircle = true;
    isStroke = true;
  } else if (target == "circle-fill") {
    isPencil = false;
    isFilling = false;
    isPainting = false;
    isLine = false;
    isRectangle = false;
    isCircle = true;
    isStroke = false;
  }
  eventHandler();
  ctx.beginPath();
}

// Pencil, Line tool switchig
function eventHandler() {
  if (isPencil) {
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting); //마우스가 캔버스 밖으로 나갔을 때의 대비책
    canvas.removeEventListener("mouseup", stopDrawRect);
  } else {
    if (isLine) {
      canvas.removeEventListener("mouseup", stopDrawRect);
      line.addEventListener("click", toolStatusActive);
      canvas.addEventListener("click", drawLine);
      canvas.removeEventListener("mousedown", startDrawCircle);
      canvas.removeEventListener("mouseup", stopDrawCircle);
      canvas.removeEventListener("mousedown", startDrawRect);
      canvas.removeEventListener("mouseup", stopDrawRect);
    } else if (isRectangle) {
      canvas.removeEventListener("click", drawLine);
      canvas.removeEventListener("mousedown", startDrawCircle);
      canvas.removeEventListener("mouseup", stopDrawCircle);
      canvas.addEventListener("mousedown", startDrawRect);
      canvas.addEventListener("mouseup", stopDrawRect);
    } else if (isCircle) {
      canvas.removeEventListener("click", drawLine);
      canvas.removeEventListener("mousedown", startDrawRect);
      canvas.removeEventListener("mouseup", stopDrawRect);
      canvas.addEventListener("mousedown", startDrawCircle);
      canvas.addEventListener("mouseup", stopDrawCircle);
    }
    canvas.removeEventListener("mousemove", onMove);
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mouseleave", stopPainting);
  }
}
eventHandler();

canvas.addEventListener("click", fillCanvas);
colorPicker.addEventListener("change", colorChangePicker);
colorPalette.forEach((color) =>
  color.addEventListener("click", colorChangePalette)
);
brushSize.addEventListener("change", BrushSizeChange);
toolBtns.forEach((e) => e.addEventListener("click", toolStatusActive));
