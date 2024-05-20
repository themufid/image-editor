const fileInput = document.querySelector(".file-input"),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    filterValue = document.querySelector(".filter-info .value"),
    filterSlider = document.querySelector(".slider input"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    previewImg = document.querySelector(".preview-img img"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    chooseImgBtn = document.querySelector(".choose-img"),
    saveImgBtn = document.querySelector(".save-img"),
    undoBtn = document.querySelector(".undo"),
    redoBtn = document.querySelector(".redo"),
    drawOptions = document.querySelectorAll(".draw button"),
    cropResizeOptions = document.querySelectorAll(".crop-resize button"),
    effectOptions = document.querySelectorAll(".effects button"),
    canvas = document.querySelector(".preview-img canvas");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0",
    contrast = "100", hueRotate = "0", blur = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
let history = [], historyIndex = -1;
let isDrawing = false, startX = 0, startY = 0;

const ctx = canvas.getContext("2d");

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
        saveHistory();
    });
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`;
}

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else if (selectedFilter.id === "grayscale") {
        grayscale = filterSlider.value;
    } else if (selectedFilter.id === "contrast") {
        contrast = filterSlider.value;
    } else if (selectedFilter.id === "hue-rotate") {
        hueRotate = filterSlider.value;
    } else if (selectedFilter.id === "blur") {
        blur = filterSlider.value;
    }
    applyFilter();
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
        } else if (option.id === "grayscale") {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
        } else if (option.id === "contrast") {
            filterSlider.max = "200";
            filterSlider.value = contrast;
        } else if (option.id === "hue-rotate") {
            filterSlider.max = "360";
            filterSlider.value = hueRotate;
        } else if (option.id === "blur") {
            filterSlider.max = "100";
            filterSlider.value = blur;
        }
        filterValue.innerText = `${filterSlider.value}%`;
    });
});

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    contrast = "100"; hueRotate = "0"; blur = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
    saveHistory();
}

const saveHistory = () => {
    history = history.slice(0, historyIndex + 1);
    const canvas = document.createElement('canvas');
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    history.push(canvas.toDataURL());
    historyIndex++;
}

const undo = () => {
    if (historyIndex > 0) {
        historyIndex--;
        const imgData = history[historyIndex];
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        previewImg.src = imgData;
    }
}

const redo = () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const imgData = history[historyIndex];
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        previewImg.src = imgData;
    }
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

const drawPencil = () => {
    canvas.width = previewImg.width;
    canvas.height = previewImg.height;
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
}

const startDrawing = (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

const draw = (e) => {
    if (!isDrawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

const stopDrawing = () => {
    isDrawing = false;
    saveHistory();
}

const addText = () => {
    const text = prompt("Masukkan teks:");
    if (text) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(text, 50, 50);
        saveHistory();
    }
}

const cropImage = () => {
    // Fungsi crop sederhana, bisa disesuaikan
    const cropX = 50, cropY = 50, cropWidth = 200, cropHeight = 200;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(previewImg, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    previewImg.src = canvas.toDataURL();
    saveHistory();
}

const resizeImage = () => {
    const newWidth = parseInt(prompt("Masukkan lebar baru:"));
    const newHeight = parseInt(prompt("Masukkan tinggi baru:"));
    if (newWidth && newHeight) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(previewImg, 0, 0, newWidth, newHeight);
        previewImg.src = canvas.toDataURL();
        saveHistory();
    }
}

const applyEffect = (effect) => {
    if (effect === "sepia") {
        ctx.filter = "sepia(1)";
    } else if (effect === "vintage") {
        ctx.filter = "contrast(0.8) brightness(1.2)";
    } else if (effect === "vignette") {
        ctx.filter = "brightness(0.9)";
        ctx.globalAlpha = 0.8;
    }
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
    previewImg.src = canvas.toDataURL();
    saveHistory();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());
saveImgBtn.addEventListener("click", saveImage);
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

drawOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "pencil") {
            drawPencil();
        } else if (option.id === "text") {
            addText();
        }
    });
});

cropResizeOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "crop") {
            cropImage();
        } else if (option.id === "resize") {
            resizeImage();
        }
    });
});

effectOptions.forEach(option => {
    option.addEventListener("click", () => {
        applyEffect(option.id);
    });
});
