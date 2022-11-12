// Canvas
const canvas = document.getElementById("main-canvas");
const previewCanvas = document.getElementById("brush_preview");
// Get 2d context
const ctx = canvas.getContext("2d");
const previewCtx = previewCanvas.getContext("2d");
// Colors
const colorPalette = Array.from(
  document.getElementsByClassName("color-option")
);
const colorPicker = document.getElementById("color");
// Brush size
const brushSize = document.getElementById("border-line");
const rangeThumbTracker = document.querySelector(".range-thumb-tracker");
const brushSizeValue = document.querySelector(".size-num");
// Toolbox
const toolBtns = Array.from(document.querySelectorAll(".drawing-tools button"));
const pencil = document.getElementById("pencil");

// Canvas & Brush set
canvas.width = 700;
canvas.height = 700;
previewCanvas.width = 190;
previewCanvas.height = 30;
ctx.lineWidth = brushSize.value;
previewCtx.lineWidth = brushSize.value;
ctx.lineCap = "round";

// Start, end points of the shape
var locA, locB;

// For tool controls
let isPainting = false;
let isFilling = false;
let isPencil = true;
let isLine = false;
let isRectangle = false;
let isCircle = false;
let isStroke = false;
let isText = false;

// Painting on canvas
function onMove(e) {
  if (isPainting) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return;
  } else if (isRectangle || isCircle) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
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

// Fill canvas
function fillCanvas() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height); // fillRect(x, y, w, h);
  }
}

// Draw straight line
function drawLine(e) {
  if (isLine) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}

// get starting point of the shape
function startDrawShape(e) {
  locA = onMove(e);
}

// Draw shape by getting end point
function stopDrawShape(e) {
  locB = onMove(e);
  if (isRectangle) {
    if (isStroke) {
      ctx.strokeRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y); // strokeRect(x, y, w, h);
    } else {
      ctx.fillRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y); // fillRect(x, y, w, h);
    }
  } else if (isCircle) {
    ctx.arc(locA.x, locA.y, locB.x - locA.x, 0, Math.PI * 2); // arc(x, y, radius, startAngle, endAngle)
    if (isStroke) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
  }
  ctx.beginPath();
}

// Brush size preview
function previewDrawLine() {
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewCtx.moveTo(10, 15);
  previewCtx.lineTo(180, 15);
  previewCtx.stroke();
}
previewDrawLine();

// Change brush size
function BrushSizeChange(e) {
  ctx.lineWidth = e.target.value;
  previewCtx.lineWidth = e.target.value;
  brushSizeValue.innerText = e.target.value;
  previewDrawLine();
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

// Activate the btn effect and role of the selected tool
function toolStatusActive(e) {
  // Activate the btn effect
  document.querySelector("button.active").classList.remove("active");
  e.target.classList.add("active");
  const targetId = e.target.id;
  const targetName = e.target.name;
  // Activate role
  if (targetName == "drawing") {
    if (targetId == "pencil") {
      isPencil = true;
      isFilling = false;
      isLine = false;
    } else if (targetId == "eraser") {
      isPencil = true;
      isFilling = false;
      isLine = false;
      erase();
    } else if (targetId == "paint") {
      isPencil = false;
      isFilling = true;
      isLine = false;
    } else if (targetId == "line") {
      isPencil = false;
      isFilling = false;
      isLine = true;
    }
    isRectangle = false;
    isCircle = false;
    isStroke = false;
  } else if (targetName == "shape") {
    if (targetId == "square-stroke") {
      isRectangle = true;
      isCircle = false;
      isStroke = true;
    } else if (targetId == "square-fill") {
      isRectangle = true;
      isCircle = false;
      isStroke = false;
    } else if (targetId == "circle-stroke") {
      isRectangle = false;
      isCircle = true;
      isStroke = true;
    } else if (targetId == "circle-fill") {
      isRectangle = false;
      isCircle = true;
      isStroke = false;
    }
    isPencil = false;
    isFilling = false;
    isPainting = false;
    isLine = false;
  }
  eventHandler();
  ctx.beginPath();
}

// Switchig EventListener
function eventHandler() {
  if (isPencil) {
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting); //마우스가 캔버스 밖으로 나갔을 때의 대비책
    canvas.removeEventListener("mouseup", stopDrawShape);
  } else {
    if (isLine || isFilling) {
      canvas.removeEventListener("mousedown", startDrawShape);
      canvas.removeEventListener("mouseup", stopDrawShape);
    } else if (isRectangle || isCircle) {
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mousedown", startDrawShape);
      canvas.addEventListener("mouseup", stopDrawShape);
    }
    canvas.removeEventListener("mousemove", onMove);
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mouseleave", stopPainting);
  }
}
eventHandler();

// EventListener
canvas.addEventListener("click", fillCanvas);
canvas.addEventListener("click", drawLine);
canvas.addEventListener("click", inputText);

toolBtns.forEach((e) => e.addEventListener("click", toolStatusActive));
line.addEventListener("click", toolStatusActive);

brushSize.addEventListener("change", BrushSizeChange);
brushSize.oninput = function () {
  rangeThumbTracker.style.left = brushSize.value * 5 + "%";
};

colorPicker.addEventListener("change", colorChangePicker);
colorPalette.forEach((color) =>
  color.addEventListener("click", colorChangePalette)
);

textSubmit.addEventListener("click", toolStatusActive);
