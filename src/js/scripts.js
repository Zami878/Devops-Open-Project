
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



function updateDisplays() {
    viewAngleValue.textContent = viewAngle + '°';
    pitchAngleValue.textContent = pitchAngle + '°';

    translateXValue.textContent = translateX.toFixed(1);
    translateYValue.textContent = translateY.toFixed(1);
    translateZValue.textContent = translateZ.toFixed(1);

    // Removed rotateX/Y/Z updates
    speedValue.textContent = speed.toFixed(2); // Update speed display

    scaleXValue.textContent = scaleX.toFixed(1);
    scaleYValue.textContent = scaleY.toFixed(1);
    scaleZValue.textContent = scaleZ.toFixed(1);
}


startEngineBtn.addEventListener("click", () => {
    welcomeScreen.style.display = 'none';
    mainApp.style.display = 'flex';
    document.body.style.overflow = 'auto';

    updateDisplays();
    fillTextAreas();

    if (!animationFrameId) {
        lastTimestamp = performance.now(); // Initialize timestamp here
        animationFrameId = requestAnimationFrame(render); // Start render loop
    }
});


viewAngleSlider.addEventListener("input", (e) => {
    viewAngle = parseFloat(e.target.value);
    updateDisplays();
});

pitchAngleSlider.addEventListener("input", (e) => {
    pitchAngle = parseFloat(e.target.value);
    updateDisplays();
});



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

speedSlider.addEventListener("input", (e) => {
    speed = parseFloat(e.target.value);
    updateDisplays();
});


scaleXSlider.addEventListener("input", (e) => {
    scaleX = parseFloat(e.target.value);
    updateDisplays();
});

scaleYSlider.addEventListener("input", (e) => {
    scaleY = parseFloat(e.target.value);
    updateDisplays();
});

scaleZSlider.addEventListener("input", (e) => {
    scaleZ = parseFloat(e.target.value);
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


function setPixel(x, y, r, g, b, a = 255) {
    x = Math.round(x);
    y = Math.round(y);

    if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

    const index = (y * canvasWidth + x) * 4;
    framebuffer.data[index] = r;
    framebuffer.data[index + 1] = g;
    framebuffer.data[index + 2] = b;
    framebuffer.data[index + 3] = a;
}

function clearScreen(r, g, b, a = 255) {
    const data = framebuffer.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = a;
    }
}

function mixColors(color1, color2, t) {
    t = Math.max(0, Math.min(1, t));
    return [
        Math.round(color1[0] + t * (color2[0] - color1[0])),
        Math.round(color1[1] + t * (color2[1] - color1[1])),
        Math.round(color1[2] + t * (color2[2] - color1[2])),
        Math.round(color1[3] + t * (color2[3] - color1[3]))
    ];

}


function drawLine(x1, x2, y, color1, color2) {
    const startX = Math.max(0, Math.ceil(x1));
    const endX = Math.min(canvasWidth - 1, Math.floor(x2));

    // Avoid division by zero if startX === endX (single pixel line)
    const denominator = endX - startX;
    if (denominator === 0) {
        if (startX >= 0 && startX < canvasWidth) {
             // Use the average or start color for a single pixel
             const color = mixColors(color1, color2, 0.5);
             setPixel(startX, y, ...color);
        }
        return;
    }

    for (let x = startX; x <= endX; x++) {
        const t = (x - startX) / denominator;
        const color = mixColors(color1, color2, t);
        setPixel(x, y, ...color);
    }
}


function drawTriangle(v0, v1, v2, c0, c1, c2) {
    // Sort vertices by Y (top to bottom)
    let points = [[...v0], [...v1], [...v2]]; // Use copies
    let pointColors = [c0, c1, c2];

    // Bubble sort for 3 elements
    if (points[1][1] < points[0][1]) {
        [points[0], points[1]] = [points[1], points[0]];
        [pointColors[0], pointColors[1]] = [pointColors[1], pointColors[0]];
    }
    if (points[2][1] < points[0][1]) {
        [points[0], points[2]] = [points[2], points[0]];
        [pointColors[0], pointColors[2]] = [pointColors[2], pointColors[0]];
    }
    if (points[2][1] < points[1][1]) {
        [points[1], points[2]] = [points[2], points[1]];
        [pointColors[1], pointColors[2]] = [pointColors[2], pointColors[1]];
    }

    const [top, middle, bottom] = points;
    const [topColor, middleColor, bottomColor] = pointColors;

    // Calculate Y differences to avoid division by zero
    const dy_mid_top = middle[1] - top[1];
    const dy_bot_top = bottom[1] - top[1];
    const dy_bot_mid = bottom[1] - middle[1];

    // Draw top half (top to middle)
    if (dy_mid_top > 0) { // Avoid horizontal line case handled by bottom half or check separately
      for (let y = Math.max(0, Math.ceil(top[1])); y <= Math.min(canvasHeight - 1, Math.floor(middle[1])); y++) {
          const t1 = (y - top[1]) / dy_mid_top;
          // Check if bottom[1] === top[1] (horizontal top edge)
          const t2 = dy_bot_top > 0 ? (y - top[1]) / dy_bot_top : 0; // Avoid division by zero

          const x1 = top[0] + t1 * (middle[0] - top[0]);
          const x2 = top[0] + t2 * (bottom[0] - top[0]);

          const color1 = mixColors(topColor, middleColor, t1);
          const color2 = mixColors(topColor, bottomColor, t2);

          if (x1 < x2) {
              drawLine(x1, x2, y, color1, color2);
          } else {
              drawLine(x2, x1, y, color2, color1);
          }
      }
    }

    // Draw bottom half (middle to bottom)
     if (dy_bot_mid > 0) { // Avoid horizontal line case
        for (let y = Math.max(0, Math.ceil(middle[1]) + 1); y <= Math.min(canvasHeight - 1, Math.floor(bottom[1])); y++) {
            const t1 = (y - middle[1]) / dy_bot_mid;
            const t2 = dy_bot_top > 0 ? (y - top[1]) / dy_bot_top : 1; // Avoid division by zero, t2 goes from top to bottom

            const x1 = middle[0] + t1 * (bottom[0] - middle[0]);
            const x2 = top[0] + t2 * (bottom[0] - top[0]);

            const color1 = mixColors(middleColor, bottomColor, t1);
            const color2 = mixColors(topColor, bottomColor, t2);

            if (x1 < x2) {
                drawLine(x1, x2, y, color1, color2);
            } else {
                drawLine(x2, x1, y, color2, color1);
            }
        }
     }
}



function identityMatrix() {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}

function translationMatrix(tx, ty, tz) {
    return [
        [1,0,0,tx],
        [0,1,0,ty],
        [0,0,1,tz],
        [0,0,0,1]
    ];
}


function rotationZ(angle) {
    const rad = angle * Math.PI / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return [
        [c,-s,0,0],
        [s,c,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}

function multiplyMatrices(m1, m2) {  // takes the input of two matrix 
    const result = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; // enmpty result value matrix

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
} 



function multiplyMatrixVector(matrix, vector) {
    const [x, y, z, w = 1] = vector;
    const m = matrix;

    return [
        m[0][0]*x + m[0][1]*y + m[0][2]*z + m[0][3]*w,
        m[1][0]*x + m[1][1]*y + m[1][2]*z + m[1][3]*w,
        m[2][0]*x + m[2][1]*y + m[2][2]*z + m[2][3]*w,
        m[3][0]*x + m[3][1]*y + m[3][2]*z + m[3][3]*w
    ];
} 


  
function scalingMatrix(sx, sy, sz) {
    return [
        [sx,0,0,0],
        [0,sy,0,0],
        [0,0,sz,0],
        [0,0,0,1]
    ];
}

function perspectiveMatrix(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov * 0.5 * Math.PI / 180);
    const rangeInv = 1 / (near - far);

    return [
        [f/aspect, 0, 0, 0],
        [0, f, 0, 0],
        [0, 0, (far+near)*rangeInv, 2*far*near*rangeInv],
        [0, 0, -1, 0] // Projects Z onto W
    ];
}



function viewMatrix(eye, center, up) {
    const [eyeX, eyeY, eyeZ] = eye;
    const [centerX, centerY, centerZ] = center;
    const [upX, upY, upZ] = up;

    // Forward direction
    let fwdX = centerX - eyeX;
    let fwdY = centerY - eyeY;
    let fwdZ = centerZ - eyeZ;
    const fwdLen = Math.sqrt(fwdX*fwdX + fwdY*fwdY + fwdZ*fwdZ);
    // Normalize, handle potential zero length
    if (fwdLen > 0.00001) {
        fwdX /= fwdLen;
        fwdY /= fwdLen;
        fwdZ /= fwdLen;
    } else {
        fwdX = 0; fwdY = 0; fwdZ = -1; // Default if eye and center coincide
    }


    // Right direction (Cross product: forward x up) - Ensure up is normalized first
    let upLen = Math.sqrt(upX*upX + upY*upY + upZ*upZ);
     let normUpX = upX, normUpY = upY, normUpZ = upZ;
     if (upLen > 0.00001) {
        normUpX /= upLen; normUpY /= upLen; normUpZ /= upLen;
     } else {
        // Handle invalid up vector? Default to Y up maybe?
        normUpX = 0; normUpY = 1; normUpZ = 0;
     }


    let rightX = fwdY * normUpZ - fwdZ * normUpY;
    let rightY = fwdZ * normUpX - fwdX * normUpZ;
    let rightZ = fwdX * normUpY - fwdY * normUpX;
    const rightLen = Math.sqrt(rightX*rightX + rightY*rightY + rightZ*rightZ);
     // Normalize right vector
     if (rightLen > 0.00001) {
        rightX /= rightLen;
        rightY /= rightLen;
        rightZ /= rightLen;
    } else {
        // If fwd and up are parallel, need a default right.
        // If fwd is vertical, use X axis. Otherwise, cross with Y axis.
        if (Math.abs(fwdY) > 0.999) { // Pointing straight up/down
             rightX = 1; rightY = 0; rightZ = 0;
        } else { // Cross fwd with world Y up [0,1,0]
            rightX = -fwdZ; rightY = 0; rightZ = fwdX;
             // Renormalize
             const newRightLen = Math.sqrt(rightX*rightX + rightZ*rightZ);
             if (newRightLen > 0.00001) {
                rightX /= newRightLen; rightZ /= newRightLen;
             }
        }
    }

    // Real up direction (Cross product: right x forward)
    const upDirX = rightY * fwdZ - rightZ * fwdY;
    const upDirY = rightZ * fwdX - rightX * fwdZ;
    const upDirZ = rightX * fwdY - rightY * fwdX;
    // This upDir should already be normalized if right and fwd are orthonormal

    // Translation part of the view matrix
    const tx = -(rightX*eyeX + rightY*eyeY + rightZ*eyeZ);
    const ty = -(upDirX*eyeX + upDirY*eyeY + upDirZ*eyeZ);
    const tz = -(-fwdX*eyeX - fwdY*eyeY - fwdZ*eyeZ); // Simplified: fwdX*eyeX + fwdY*eyeY + fwdZ*eyeZ


    return [
        [rightX, rightY, rightZ, tx],
        [upDirX, upDirY, upDirZ, ty],
        [-fwdX, -fwdY, -fwdZ, tz],
        [0, 0, 0, 1]
    ];
}


function render(timestamp) {
    if (!ctx || !framebuffer) {
        // Stop if canvas context is lost
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
    }

    // Calculate time delta for smooth animation
    const deltaTime = timestamp - lastTimestamp; // T milliseconds 
    lastTimestamp = timestamp;

    clearScreen(0, 0, 0);

    if (vertices.length === 0 || !indices || indices.length === 0 || !colors) {
        // Don't try to render if geometry is invalid/empty
        ctx.putImageData(framebuffer, 0, 0);
        animationFrameId = requestAnimationFrame(render); // Continue loop for controls
        return;
    }


    const rotationDegreesPerSecond = speed * 90; 
    currentRotateY += (rotationDegreesPerSecond * deltaTime) / 1000.0; 
    currentRotateY %= 360; 

    const aspect = canvasWidth / canvasHeight;
    const fov = 60;
    const near = 0.1;
    const far = 100;

    const yaw = viewAngle * Math.PI / 180;
    const pitch = pitchAngle * Math.PI / 180;


    const cameraDistance = 10; // Distance from origin
    const eyeX = cameraDistance * Math.cos(pitch) * Math.sin(yaw);
    const eyeY = cameraDistance * Math.sin(pitch);
    const eyeZ = cameraDistance * Math.cos(pitch) * Math.cos(yaw);

    const eye = [eyeX, eyeY, eyeZ];
    const target = [0, 0, 0];
    const up = [0, 1, 0]; // Assuming Y is up

 
    const view = viewMatrix(eye, target, up);
    const proj = perspectiveMatrix(fov, aspect, near, far);

    // --- Object transformation ---
    const trans = translationMatrix(translateX, translateY, translateZ);
    const rotY = rotationY(currentRotateY); // Use the updated angle
    const scale = scalingMatrix(scaleX, scaleY, scaleZ);

    // --- Combine matrices ---
    // Order: Scale -> Rotate -> Translate (applied right-to-left)
    // World = Translate * Rotate * Scale
    const rotScale = multiplyMatrices(rotY, scale);
    const world = multiplyMatrices(trans, rotScale);

    // Final transform: Projection * View * World
    const viewWorld = multiplyMatrices(view, world);
    const transform = multiplyMatrices(proj, viewWorld);

    // --- Transform all vertices ---
    const transformedVerts = [];
    const vertDepths = []; // Store W or Z for depth sorting/testing if needed

    for (let i = 0; i < vertices.length; i++) {
        const vert = vertices[i];
        const vec = [vert[0], vert[1], vert[2], 1]; // Homogeneous coordinates
        const clip = multiplyMatrixVector(transform, vec);

        // Perspective divide
        const w = clip[3];

        // Basic clipping (clip if behind near plane or W is too small)
        if (w < near) { // Use 'near' plane distance for clipping
            transformedVerts.push(null); // Mark vertex as clipped
            vertDepths.push(Infinity); // Give clipped vertices infinite depth
            continue;
        }

        const invW = 1.0 / w;
        const ndcX = clip[0] * invW;
        const ndcY = clip[1] * invW;
        const ndcZ = clip[2] * invW; // Normalized device coordinates Z (-1 to 1 or 0 to 1)

        // Viewport transform (Normalized Device Coordinates to Screen Coordinates)
        const screenX = (ndcX + 1) * 0.5 * canvasWidth;
        // Y is often inverted in screen space (0 at top)
        const screenY = (1 - ndcY) * 0.5 * canvasHeight;

        transformedVerts.push([screenX, screenY, ndcZ]); // Store screen coords and Z
        vertDepths.push(w); // Store original W for potential depth calculations
    }

    // --- Draw all triangles ---
    for (let i = 0; i < indices.length; i++) {
        const [a, b, c] = indices[i];
        const v0 = transformedVerts[a];
        const v1 = transformedVerts[b];
        const v2 = transformedVerts[c];

        // Skip triangle if any vertex was clipped
        if (!v0 || !v1 || !v2) continue;

        const c0 = colors[a] || [255, 255, 255, 255]; // Default to white if color missing
        const c1 = colors[b] || [255, 255, 255, 255];
        const c2 = colors[c] || [255, 255, 255, 255];


        // Backface culling using screen space coordinates
        // Calculate signed area: (x1-x0)*(y2-y0) - (y1-y0)*(x2-x0)
        // If area is negative (clockwise winding order in screen space), cull it.
        const area = (v1[0]-v0[0])*(v2[1]-v0[1]) - (v1[1]-v0[1])*(v2[0]-v0[0]);
        if (area < 0) continue; // Cull back-facing triangles

        drawTriangle(v0, v1, v2, c0, c1, c2);
    }

    // --- Finalize Frame ---
    ctx.putImageData(framebuffer, 0, 0); // Draw the framebuffer to the canvas
    animationFrameId = requestAnimationFrame(render); // Request next frame
}