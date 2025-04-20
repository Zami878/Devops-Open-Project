
const canvas = document.getElementById("renderer");
const ctx = canvas.getContext("2d");

// Camera controls
const viewAngleSlider = document.getElementById("viewAngle");
const pitchAngleSlider = document.getElementById("pitchAngle");
const viewAngleValue = document.getElementById("viewAngleValue");
const pitchAngleValue = document.getElementById("pitchAngleValue");


// Object controls
//translate slider
const translateXSlider = document.getElementById("translateX");
const translateYSlider = document.getElementById("translateY");
const translateZSlider = document.getElementById("translateZ");

//scale slider
const scaleXSlider = document.getElementById("scaleX");
const scaleYSlider = document.getElementById("scaleY");
const scaleZSlider = document.getElementById("scaleZ");

//speed slider
const speedSlider = document.getElementById("speed"); 
// Display values for sliders
const translateXValue = document.getElementById("translateXValue");
const translateYValue = document.getElementById("translateYValue");
const translateZValue = document.getElementById("translateZValue");


const scaleXValue = document.getElementById("scaleXValue");
const scaleYValue = document.getElementById("scaleYValue");
const scaleZValue = document.getElementById("scaleZValue");

const speedValue = document.getElementById("speedValue")

// Geometry input
const vertexInput = document.getElementById("vertexInput");
const indexInput = document.getElementById("indexInput");
const colorInput = document.getElementById("colorInput");
const updateGeometryButton = document.getElementById("updateGeometryButton");
const resetButton = document.getElementById("resetButton");


// Welcome screen
const welcomeScreen = document.getElementById("welcome-screen");
const startEngineBtn = document.getElementById("start-engine-btn");
const mainApp = document.getElementById("main-app");

//slider values
let viewAngle = 0;
let pitchAngle = 10;

let translateX = 0;
let translateY = 0;
let translateZ = 0;

let scaleX = 1;
let scaleY = 1;
let scaleZ = 1;

let speed = 0.1;

let animationFrameId = null;
let lastTimestamp = 0;
let currentRotateZ = 0;


//default shpe pyramid
const defaultVertices = [
    [0, 1, 0],    
    [-1, -1, -1], 
    [1, -1, -1], 
    [1, -1, 1],   
    [-1, -1, 1]   
];

const defaultIndices = [
    [0, 1, 2], 
    [0, 2, 3], 
    [0, 3, 4], 
    [0, 4, 1], 
    [1, 3, 2], 
    [1, 4, 3]  
];

const defaultColors = [
    [255, 0, 0, 255],   
    [0, 255, 0, 255],   
    [0, 0, 255, 255],   
    [255, 255, 0, 255], 
    [0, 255, 255, 255]  
];


// Current shape data
let vertices = defaultVertices.map(v => [...v]);
let indices = defaultIndices.map(i => [...i]);
let colors = defaultColors.map(c => [...c]);

// Setup canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const framebuffer = ctx.createImageData(canvasWidth, canvasHeight);


// Object controls
translateXSlider.addEventListener("input", (e) => {
    translateX = parseFloat(e.target.value);
    updateDisplays();
});

translateYSlider.addEventListener("input", (e) => {
    translateY = parseFloat(e.target.value);
    updateDisplays();
});

translateZSlider.addEventListener("input", (e) => {
    translateZ = parseFloat(e.target.value);
    updateDisplays();
});


// Reset button 
resetButton.addEventListener("click", () => {
    viewAngle = 0;
    pitchAngle = 10;
    viewAngleSlider.value = "0";
    pitchAngleSlider.value = "10";

    translateX = 0;
    translateY = 0;
    translateZ = 0;
    translateXSlider.value = "0";
    translateYSlider.value = "0";
    translateZSlider.value = "0";

    // Reset speed and rotation angle
    speed = 0.1; 
    speedSlider.value = "0.1";
    currentRotateZ = 0; 

    scaleX = 1;
    scaleY = 1;
    scaleZ = 1;
    scaleXSlider.value = "1";
    scaleYSlider.value = "1";
    scaleZSlider.value = "1";

    vertices = defaultVertices.map(v => [...v]);
    indices = defaultIndices.map(i => [...i]);
    colors = defaultColors.map(c => [...c]);

    updateDisplays();
    fillTextAreas();
});



function parseVertices(text) {
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        const parts = line.replace(/[\[\]\s]/g, '').split(',');
        if (parts.length !== 3) {
            throw new Error(`Line ${i+1}: Need exactly 3 numbers for a vertex`);
        }

        const nums = parts.map(part => parseFloat(part));
        if (nums.some(isNaN)) {
            throw new Error(`Line ${i+1}: Invalid number`);
        }

        result.push(nums);
    }
    return result;
}

function parseIndices(text) {
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        const parts = line.replace(/[\[\]\s]/g, '').split(',');
        if (parts.length !== 3) {
            throw new Error(`Line ${i+1}: Need exactly 3 indices per face`);
        }

        const nums = parts.map(part => Math.round(parseFloat(part)));
        if (nums.some(isNaN)) {
            throw new Error(`Line ${i+1}: Invalid index`);
        }

        result.push(nums);
    }
    return result;
}

function parseColors(text) {
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        const parts = line.replace(/[\[\]\s]/g, '').split(',');
        if (parts.length < 3 || parts.length > 4) {
            throw new Error(`Line ${i+1}: Need 3 or 4 color values (RGB or RGBA)`);
        }

        const nums = parts.map(part => {
            const num = parseInt(part);
            return Math.max(0, Math.min(255, num));
        });

        if (nums.length === 3) nums.push(255); 
        result.push(nums);
    }
    return result;
}
