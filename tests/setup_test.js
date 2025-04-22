// test/setup.js
// This file sets up the Jest environment and provides mocks for testing

// Mock canvas-related objects and functions if not testing in a DOM environment
global.document = global.document || {
  getElementById: jest.fn().mockImplementation((id) => {
    if (id === 'renderer') {
      return {
        getContext: jest.fn().mockReturnValue({
          createImageData: jest.fn().mockReturnValue({
            data: new Uint8ClampedArray(100 * 100 * 4),
            width: 100,
            height: 100
          }),
          putImageData: jest.fn()
        }),
        width: 100,
        height: 100
      };
    }
    return null;
  }),
  createElement: jest.fn().mockReturnValue({
    getContext: jest.fn().mockReturnValue({
      createImageData: jest.fn(),
      putImageData: jest.fn()
    }),
    width: 100,
    height: 100,
    style: {},
    addEventListener: jest.fn()
  })
};

// Mock for requestAnimationFrame
global.requestAnimationFrame = global.requestAnimationFrame || jest.fn();
global.cancelAnimationFrame = global.cancelAnimationFrame || jest.fn();

// Mock for performance.now()
global.performance = global.performance || { now: jest.fn().mockReturnValue(1000) };

// Mock for Math functions to ensure deterministic tests
const originalMath = Object.create(global.Math);
global.Math.sin = jest.fn().mockImplementation(originalMath.sin);
global.Math.cos = jest.fn().mockImplementation(originalMath.cos);
global.Math.tan = jest.fn().mockImplementation(originalMath.tan);
global.Math.sqrt = jest.fn().mockImplementation(originalMath.sqrt);
global.Math.round = jest.fn().mockImplementation(originalMath.round);
global.Math.floor = jest.fn().mockImplementation(originalMath.floor);
global.Math.ceil = jest.fn().mockImplementation(originalMath.ceil);
global.Math.min = jest.fn().mockImplementation(originalMath.min);
global.Math.max = jest.fn().mockImplementation(originalMath.max);
global.Math.PI = originalMath.PI;

// Import the renderer functions to make them available globally to tests
// Note: In a real setup, you would likely use ES modules or CommonJS modules
// and properly import the functions in each test file

// Mock the canvas and ctx globals that are used in the renderer
global.canvas = document.getElementById('renderer');
global.ctx = canvas.getContext('2d');
global.framebuffer = ctx.createImageData(100, 100);

// Mock all the slider and input elements
const mockSliders = {
  viewAngle: { value: "0", addEventListener: jest.fn() },
  pitchAngle: { value: "10", addEventListener: jest.fn() },
  translateX: { value: "0", addEventListener: jest.fn() },
  translateY: { value: "0", addEventListener: jest.fn() },
  translateZ: { value: "0", addEventListener: jest.fn() },
  scaleX: { value: "1", addEventListener: jest.fn() },
  scaleY: { value: "1", addEventListener: jest.fn() },
  scaleZ: { value: "1", addEventListener: jest.fn() },
  speed: { value: "0.1", addEventListener: jest.fn() }
};

// Mock the display value elements
const mockDisplayValues = {
  viewAngleValue: { textContent: "0°" },
  pitchAngleValue: { textContent: "10°" },
  translateXValue: { textContent: "0.0" },
  translateYValue: { textContent: "0.0" },
  translateZValue: { textContent: "0.0" },
  scaleXValue: { textContent: "1.0" },
  scaleYValue: { textContent: "1.0" },
  scaleZValue: { textContent: "1.0" },
  speedValue: { textContent: "0.10" }
};

// Mock input elements
global.vertexInput = { value: "" };
global.indexInput = { value: "" };
global.colorInput = { value: "" };
global.updateGeometryButton = { addEventListener: jest.fn() };
global.resetButton = { addEventListener: jest.fn() };

// Setup document.getElementById to return our mocks
document.getElementById.mockImplementation((id) => {
  if (id === 'renderer') return global.canvas;
  if (id in mockSliders) return mockSliders[id];
  if (id in mockDisplayValues) return mockDisplayValues[id];
  if (id === 'vertexInput') return global.vertexInput;
  if (id === 'indexInput') return global.indexInput;
  if (id === 'colorInput') return global.colorInput;
  if (id === 'updateGeometryButton') return global.updateGeometryButton;
  if (id === 'resetButton') return global.resetButton;
  return null;
});

// Set initial state variables
global.viewAngle = 0;
global.pitchAngle = 10;
global.translateX = 0;
global.translateY = 0;
global.translateZ = 0;
global.scaleX = 1;
global.scaleY = 1;
global.scaleZ = 1;
global.speed = 0.1;
global.animationFrameId = null;
global.lastTimestamp = 0;
global.currentRotateZ = 0;

// Setup mock shape data
global.vertices = [
  [0, 1, 0],    
  [-1, -1, -1], 
  [1, -1, -1], 
  [1, -1, 1],   
  [-1, -1, 1]
];

global.indices = [
  [0, 1, 2], 
  [0, 2, 3], 
  [0, 3, 4], 
  [0, 4, 1], 
  [1, 3, 2], 
  [1, 4, 3]
];

global.colors = [
  [255, 0, 0, 255],   
  [0, 255, 0, 255],   
  [0, 0, 255, 255],   
  [255, 255, 0, 255], 
  [0, 255, 255, 255]
];