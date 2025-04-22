// test/transformation.test.js
describe('View and Projection Transforms', () => {
  test('perspectiveMatrix should return valid perspective matrix', () => {
    const fov = 60;
    const aspect = 1.5;
    const near = 0.1;
    const far = 100;
    
    const result = perspectiveMatrix(fov, aspect, near, far);
    
    // Check general properties:
    // - Should map points at 'near' to z=-1
    // - Should map points at 'far' to z=1 (in NDC)
    
    // Basic structure checks
    expect(result.length).toBe(4);
    expect(result[0].length).toBe(4);
    
    // Specific value tests - focus on key components
    const f = 1 / Math.tan(fov * 0.5 * Math.PI / 180);
    expect(result[0][0]).toBeCloseTo(f/aspect);
    expect(result[1][1]).toBeCloseTo(f);
    expect(result[2][2]).toBeCloseTo((far+near)/(near-far));
    expect(result[3][2]).toBeCloseTo(-1);
  });

  test('viewMatrix should return valid view matrix', () => {
    const eye = [3, 4, 5];
    const center = [0, 0, 0];
    const up = [0, 1, 0];
    
    const result = viewMatrix(eye, center, up);
    
    // Basic structure checks
    expect(result.length).toBe(4);
    expect(result[0].length).toBe(4);
    
    // Check orthogonality of basis vectors (first 3 rows minus translation)
    // Row 0 (Right vector) and Row 1 (Up vector) should be perpendicular
    const dot01 = result[0][0]*result[1][0] + result[0][1]*result[1][1] + result[0][2]*result[1][2];
    expect(dot01).toBeCloseTo(0);
    
    // Check that the eye position is mapped to the origin
    // This means applying the view matrix to the eye position should give [0,0,0,1]
    const transformed = multiplyMatrixVector(result, [...eye, 1]);
    expect(transformed[0]).toBeCloseTo(0);
    expect(transformed[1]).toBeCloseTo(0);
    expect(transformed[2]).toBeCloseTo(0);
  });
});