
describe('Matrix Operations', () => {
  // Matrix creation tests
  test('identityMatrix should return a 4x4 identity matrix', () => {
    const expected = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    expect(identityMatrix()).toEqual(expected);
  });

  test('translationMatrix should return correct translation matrix', () => {
    const expected = [
      [1, 0, 0, 2],
      [0, 1, 0, 3],
      [0, 0, 1, 4],
      [0, 0, 0, 1]
    ];
    expect(translationMatrix(2, 3, 4)).toEqual(expected);
  });

  test('rotationZ should return correct rotation matrix', () => {
    // Test for 90 degrees
    const result = rotationZ(90);
    expect(result[0][0]).toBeCloseTo(0);
    expect(result[0][1]).toBeCloseTo(-1);
    expect(result[1][0]).toBeCloseTo(1);
    expect(result[1][1]).toBeCloseTo(0);
  });

  test('scalingMatrix should return correct scaling matrix', () => {
    const expected = [
      [2, 0, 0, 0],
      [0, 3, 0, 0],
      [0, 0, 4, 0],
      [0, 0, 0, 1]
    ];
    expect(scalingMatrix(2, 3, 4)).toEqual(expected);
  });

  // Matrix multiplication tests
  test('multiplyMatrices should correctly multiply two matrices', () => {
    const m1 = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16]
    ];
    const m2 = [
      [17, 18, 19, 20],
      [21, 22, 23, 24],
      [25, 26, 27, 28],
      [29, 30, 31, 32]
    ];
    const result = multiplyMatrices(m1, m2);
    
    // Test a few values from the result
    expect(result[0][0]).toBe(250);
    expect(result[1][1]).toBe(618);
    expect(result[2][2]).toBe(986);
    expect(result[3][3]).toBe(1354);
  });

  test('multiplyMatrixVector should correctly transform a vector', () => {
    const matrix = [
      [1, 0, 0, 1],  // Translation by 1 in x
      [0, 1, 0, 2],  // Translation by 2 in y
      [0, 0, 1, 3],  // Translation by 3 in z
      [0, 0, 0, 1]
    ];
    const vector = [4, 5, 6];
    const result = multiplyMatrixVector(matrix, vector);
    
    expect(result[0]).toBe(5);  // 4 + 1
    expect(result[1]).toBe(7);  // 5 + 2
    expect(result[2]).toBe(9);  // 6 + 3
    expect(result[3]).toBe(1);  // w coordinate stays 1
  });
});