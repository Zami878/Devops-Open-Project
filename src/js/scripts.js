
const canvas = document.getElementById("renderer");
const ctx = canvas.getContext("2d");

// Camera controls
const viewAngleSlider = document.getElementById("viewAngle");
const pitchAngleSlider = document.getElementById("pitchAngle");
const viewAngleValue = document.getElementById("viewAngleValue");
const pitchAngleValue = document.getElementById("pitchAngleValue");

// Object controls
const translateXSlider = document.getElementById("translateX");
const translateYSlider = document.getElementById("translateY");
const translateZSlider = document.getElementById("translateZ");
const rotateXSlider = document.getElementById("rotateX");
const rotateYSlider = document.getElementById("rotateY");
const rotateZSlider = document.getElementById("rotateZ");
const scaleXSlider = document.getElementById("scaleX");
const scaleYSlider = document.getElementById("scaleY");
const scaleZSlider = document.getElementById("scaleZ");

// Display values for sliders
const translateXValue = document.getElementById("translateXValue");
const translateYValue = document.getElementById("translateYValue");
const translateZValue = document.getElementById("translateZValue");
const rotateXValue = document.getElementById("rotateXValue");
const rotateYValue = document.getElementById("rotateYValue");
const rotateZValue = document.getElementById("rotateZValue");
const scaleXValue = document.getElementById("scaleXValue");
const scaleYValue = document.getElementById("scaleYValue");
const scaleZValue = document.getElementById("scaleZValue");

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

// Current values from sliders
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

// For animation
let animationFrameId = null;
let lastTimestamp = 0;

// Default shape is a pyramid
const defaultVertices = [
    [0, 1, 0],    // Top
    [-1, -1, -1], // Base 1
    [1, -1, -1],  // Base 2
    [1, -1, 1],   // Base 3
    [-1, -1, 1]   // Base 4
];

const defaultIndices = [
    [0, 1, 2], // Front
    [0, 2, 3], // Right
    [0, 3, 4], // Back
    [0, 4, 1], // Left
    [1, 3, 2], // Bottom 1
    [1, 4, 3]  // Bottom 2
];

const defaultColors = [
    [255, 0, 0, 255],   // Red
    [0, 255, 0, 255],   // Green
    [0, 0, 255, 255],   // Blue
    [255, 255, 0, 255], // Yellow
    [0, 255, 255, 255]  // Cyan
