
const canvas = document.getElementById("renderer");
const ctx = canvas.getContext("2d");

const viewAngleSlider = document.getElementById("viewAngle");
const pitchAngleSlider = document.getElementById("pitchAngle");
const viewAngleValue = document.getElementById("viewAngleValue");
const pitchAngleValue = document.getElementById("pitchAngleValue");

const translateXSlider = document.getElementById("translateX");
const translateYSlider = document.getElementById("translateY");
const translateZSlider = document.getElementById("translateZ");
const rotateXSlider = document.getElementById("rotateX");
const rotateYSlider = document.getElementById("rotateY");
const rotateZSlider = document.getElementById("rotateZ");
const scaleXSlider = document.getElementById("scaleX");
const scaleYSlider = document.getElementById("scaleY");
const scaleZSlider = document.getElementById("scaleZ");

const translateXValue = document.getElementById("translateXValue");
const translateYValue = document.getElementById("translateYValue");
const translateZValue = document.getElementById("translateZValue");
const rotateXValue = document.getElementById("rotateXValue");
const rotateYValue = document.getElementById("rotateYValue");
const rotateZValue = document.getElementById("rotateZValue");
const scaleXValue = document.getElementById("scaleXValue");
const scaleYValue = document.getElementById("scaleYValue");
const scaleZValue = document.getElementById("scaleZValue");

const vertexInput = document.getElementById("vertexInput");
const indexInput = document.getElementById("indexInput");
const colorInput = document.getElementById("colorInput");
const updateGeometryButton = document.getElementById("updateGeometryButton");
const resetButton = document.getElementById("resetButton");

const welcomeScreen = document.getElementById("welcome-screen");
const startEngineBtn = document.getElementById("start-engine-btn");
const mainApp = document.getElementById("main-app");

let viewAngle = 0;
let pitchAngle = 10;
let translateX = 0;
let translateY = 0;
let translateZ = 0;
let rotateX = 0;
let rotateY = 0;
let rotateZ = 0;
let scaleX = 1;
let scaleY = 1;
let scaleZ = 1;
let speed = 0.1;

let animationFrameId = null;
let lastTimestamp = 0;

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

