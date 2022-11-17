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
// TextInput & Options
const textOptions = Array.from(
  document.querySelectorAll(".text-selectors select")
);
const fontWeightBtn = document.getElementById("font-weight");
const textInput = document.getElementById("text");
const textSubmit = document.getElementById("text-submit");
// Image edit
const addImgBtn = document.getElementById("addImg");
const saveImgBtn = document.getElementById("save");
const clearBtn = document.getElementById("clear");

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

// For tool status controls
let isPainting = false;
let isShape = false;
let isStroke = false;

// 0: pencil 1: eraser 2: fill, 3: line, 4: rectangle, 5: circle, 6: text
let mode = 0;

// Get x, y coordinates to control drawing tools
function onMove(e) {
  if (isPainting) {
    // painting on canvas
    if (mode === 0) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      return;
      // erase on canvas
    } else if (mode === 1) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      return;
    }
  } else if (isShape) {
    // get coordinates to draw a shape
    if (mode === 4 || mode === 5) {
      return {
        x: e.offsetX,
        y: e.offsetY,
      };
    }
  }
  ctx.moveTo(e.offsetX, e.offsetY);
}

// Control painting(start)
function startPainting(e) {
  if (mode === 0 || mode === 1) {
    isPainting = true;
  } else if (mode === 4 || mode === 5) {
    locA = onMove(e);
    isShape = true;
  }
}

// Control painting(stop)
function stopPainting(e) {
  locB = onMove(e);
  if (isPainting) {
    isPainting = false;
    // draw a rectangle of stroke or fill type
  } else if (isShape && mode === 4) {
    if (isStroke) {
      ctx.strokeRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y); // strokeRect(x, y, w, h);
    } else {
      ctx.fillRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y); // fillRect(x, y, w, h);
    }
    // draw a circle of stroke or fill type
  } else if (isShape && mode === 5) {
    ctx.arc(locA.x, locA.y, locB.x - locA.x, 0, Math.PI * 2); // arc(x, y, radius, startAngle, endAngle)
    if (isStroke) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
  }
  ctx.beginPath();
}

// Eraser color control
function eraseHandler() {
  if (mode === 1) {
    ctx.strokeStyle = "#ffffff";
  } else {
    ctx.strokeStyle = colorPicker.value;
    ctx.fillStyle = colorPicker.value;
  }
}

// Fill canvas
function fillCanvas() {
  if (mode === 2) {
    ctx.fillRect(0, 0, canvas.width, canvas.height); // fillRect(x, y, w, h);
  }
}

// Draw straight line
function drawLine(e) {
  if (mode === 3) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}

// Set text input options
function inputTextHandler(e) {
  const text = textInput.value;
  if (mode === 6 && text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${fontWeightBtn.className} ${textOptions[1].value} ${textOptions[0].value}`;
    // input 'Fill' or 'Stroke' type text
    if (textOptions[2].value == "Fill") {
      ctx.fillText(text, e.offsetX, e.offsetY);
    } else {
      ctx.strokeText(text, e.offsetX, e.offsetY);
    }
    ctx.restore(); // 'save()' and 'restore()' to keep the brush size value
  }
}

// Set font weight
function textBoldActivate(e) {
  var fontThickness = e.target.className;
  if (fontThickness == "normal") {
    e.target.className = "bold";
  } else {
    e.target.className = "normal";
  }
}

// Brush size preview
function previewDrawLine() {
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewCtx.moveTo(10, 15);
  previewCtx.lineTo(180, 15);
  previewCtx.stroke();
}
previewDrawLine();

// Brush size slider thumb tracker
brushSize.oninput = function (e) {
  brushSizeValue.innerText = e.target.value;
  rangeThumbTracker.style.left = brushSize.value * 5 + "%";
  ctx.lineWidth = e.target.value;
  previewCtx.lineWidth = e.target.value;
  previewDrawLine();
  ctx.beginPath();
};

// Add image
function inputImage(e) {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image(); // = document.createElement("img")
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}

// Save image(png)
function saveImage() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

// Clear entire canvas
function clearAll() {
  const confirmMsg = confirm("Are you sure you want to clear everything?");
  if (confirmMsg) {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    return;
  }
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
  // Change mouse cursor & Activate roles
  if (targetName == "drawing") {
    if (targetId == "pencil") {
      canvas.style.cursor = "url(cursors/pencil-line.svg) 0 30, auto";
      mode = 0;
    } else if (targetId == "eraser") {
      canvas.style.cursor = "url(cursors/eraser-line.svg) 0 30, auto";
      mode = 1;
    } else if (targetId == "paint") {
      canvas.style.cursor = "url(cursors/paint-fill.svg) 0 30, auto";
      mode = 2;
    } else if (targetId == "line") {
      canvas.style.cursor = "url(cursors/pen-nib-line.svg) 0 30, auto";
      mode = 3;
    }
  } else if (targetName == "shape") {
    canvas.style.cursor = "crosshair";
    isShape = true;
    if (targetId == "square-stroke") {
      mode = 4;
      isStroke = true;
    } else if (targetId == "square-fill") {
      mode = 4;
      isStroke = false;
    } else if (targetId == "circle-stroke") {
      mode = 5;
      isStroke = true;
    } else if (targetId == "circle-fill") {
      mode = 5;
      isStroke = false;
    }
  } else if (targetId == "text-submit") {
    canvas.style.cursor = "text";
    mode = 6;
  }
  eraseHandler();
  eventHandler();
  ctx.beginPath();
}

// Switchig EventListener
function eventHandler() {
  if (mode === 0 || mode === 1) {
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting); //마우스가 캔버스 밖으로 나갔을 때의 대비책
  } else {
    if (mode === 2 || mode === 3) {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", startPainting);
      canvas.removeEventListener("mouseup", stopPainting);
    } else if (mode === 4 || mode === 5) {
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mousedown", startPainting);
      canvas.addEventListener("mouseup", stopPainting);
    }
    canvas.removeEventListener("mouseleave", stopPainting);
  }
}
eventHandler();

// EventListener
canvas.addEventListener("click", fillCanvas);
canvas.addEventListener("click", drawLine);
canvas.addEventListener("click", inputTextHandler);
toolBtns.forEach((e) => e.addEventListener("click", toolStatusActive));
colorPicker.addEventListener("change", colorChangePicker);
colorPalette.forEach((color) =>
  color.addEventListener("click", colorChangePalette)
);
fontWeightBtn.addEventListener("click", textBoldActivate);
textSubmit.addEventListener("click", toolStatusActive);
addImgBtn.addEventListener("change", inputImage);
saveImgBtn.addEventListener("click", saveImage);
clearBtn.addEventListener("click", clearAll);
