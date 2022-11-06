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
const eraser = document.getElementById("eraser");
const paint = document.getElementById("paint");
const line = document.getElementById("line");
const strokeSquare = document.getElementById("square-stroke");
const fillSquare = document.getElementById("square-fill");
const strokeCircle = document.getElementById("circle-stroke");
const fillCircle = document.getElementById("circle-fill");

// Canvas & Brush set
canvas.width = 700;
canvas.height = 700;
ctx.lineWidth = brushSize.value;
ctx.lineCap = "round";

// For tool controls
let isPainting = false;
let isFilling = false;
let isPencil = true;

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
}

// Change brush size
function BrushSizeChange(e) {
  ctx.lineWidth = e.target.value;
}

// Change color use colorPicker
function colorChangePicker(e) {
  ctx.strokeStyle = e.target.value;
  ctx.fillStyle = e.target.value;
}

// Change color use colorPalette
function colorChangePalette(e) {
  const colorData = e.target.dataset.color;
  ctx.strokeStyle = colorData;
  ctx.fillStyle = colorData;
  colorPicker.value = colorData;
}

// Fill canvas
function fillCanvas() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height); // fillRect(x, y, w, h);
  }
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
  } else if (target == "eraser") {
    isPencil = true;
    isFilling = false;
    erase();
  } else if (target == "paint") {
    isPencil = false;
    isPainting = false;
    isFilling = true;
  }
}

// EventListener
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mouseleave", stopPainting);
canvas.addEventListener("click", fillCanvas);
colorPicker.addEventListener("change", colorChangePicker);
colorPalette.forEach((color) =>
  color.addEventListener("click", colorChangePalette)
);
brushSize.addEventListener("change", BrushSizeChange);
toolBtns.forEach((e) => e.addEventListener("click", toolStatusActive));
pencil.addEventListener("click", toolStatusActive);
paint.addEventListener("click", toolStatusActive);
eraser.addEventListener("click", toolStatusActive);
