// test/integration.test.js
describe('Integration Tests', () => {
  let originalCanvas, originalCtx, originalFramebuffer;
  let mockCanvas, mockCtx;
  
  beforeEach(() => {
    // Save original globals
    originalCanvas = global.canvas;
    originalCtx = global.ctx;
    originalFramebuffer = global.framebuffer;
    
    // Mock canvas and context
    mockCanvas = {
      width: 100,
      height: 100
    };
    
    mockCtx = {
      createImageData: jest.fn().mockReturnValue({
        data: new Uint8ClampedArray(100 * 100 * 4),
        width: 100,
        height: 100
      }),
      putImageData: jest.fn()
    };
    
    // Set up mocks
    global.canvas = mockCanvas;
    global.ctx = mockCtx;
    global.framebuffer = mockCtx.createImageData();
    
    // Mock requestAnimationFrame and performance
    global.requestAnimationFrame = jest.fn();
    global.performance = { now: jest.fn().mockReturnValue(1000) };
    
    // Reset animation state
    global.animationFrameId = null;
    global.lastTimestamp = 0;
    global.currentRotateZ = 0;
  });
  
  afterEach(() => {
    // Restore original globals
    global.canvas = originalCanvas;
    global.ctx = originalCtx;
    global.framebuffer = originalFramebuffer;
  });

  test('render function should process a complete frame', () => {
    // Set up test conditions
    global.vertices = [[0, 1, 0], [-1, -1, -1], [1, -1, -1]];
    global.indices = [[0, 1, 2]];
    global.colors = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255]];
    
    // Set camera parameters
    global.viewAngle = 0;
    global.pitchAngle = 10;
    
    // Set object parameters
    global.translateX = 0;
    global.translateY = 0;
    global.translateZ = 0;
    global.scaleX = 1;
    global.scaleY = 1;
    global.scaleZ = 1;
    global.speed = 0.1;
    
    // Call render with a timestamp
    render(1100); // 100ms after the "lastTimestamp" (1000)
    
    // Verify that the rendering pipeline was executed
    expect(mockCtx.putImageData).toHaveBeenCalled();
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('updateGeometryButton should correctly parse and update geometry', () => {
    // Mock DOM elements
    global.vertexInput = { value: "[0, 1, 0]\n[-1, -1, -1]\n[1, -1, -1]" };
    global.indexInput = { value: "[0, 1, 2]" };
    global.colorInput = { value: "[255, 0, 0]\n[0, 255, 0]\n[0, 0, 255]" };
    
    // Create and set up the event listener
    const updateGeometryButton = document.createElement('button');
    updateGeometryButton.id = 'updateGeometryButton';
    document.body.appendChild(updateGeometryButton);
    
    // Set up click handler (assuming this would normally be done in init)
    updateGeometryButton.addEventListener('click', () => {
      try {
        global.vertices = parseVertices(vertexInput.value);
        global.indices = parseIndices(indexInput.value);
        global.colors = parseColors(colorInput.value);
        // No error handling needed for test
      } catch (e) {
        // Just for test
        console.error(e);
      }
    });
    
    // Trigger click
    updateGeometryButton.click();
    
    // Verify geometry was updated
    expect(global.vertices.length).toBe(3);
    expect(global.indices.length).toBe(1);
    expect(global.colors.length).toBe(3);
    
    // Check for correct values
    expect(global.vertices[0]).toEqual([0, 1, 0]);
    expect(global.indices[0]).toEqual([0, 1, 2]);
    expect(global.colors[0]).toEqual([255, 0, 0, 255]); // Note the added alpha
  });
});