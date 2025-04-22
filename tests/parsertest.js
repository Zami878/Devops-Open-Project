// test/parser.test.js
describe('Parser Functions', () => {
  test('parseVertices should correctly parse vertex data', () => {
    const input = `
      [1.0, 2.0, 3.0]
      [4.0, 5.0, 6.0]
      [7.0, 8.0, 9.0]
    `;
    
    const result = parseVertices(input);
    
    expect(result.length).toBe(3);
    expect(result[0]).toEqual([1.0, 2.0, 3.0]);
    expect(result[1]).toEqual([4.0, 5.0, 6.0]);
    expect(result[2]).toEqual([7.0, 8.0, 9.0]);
  });

  test('parseVertices should handle different formats and whitespace', () => {
    const input = `
      [1,2,3]
      [ 4 , 5 , 6 ]
      [7.5,8.5,9.5]
    `;
    
    const result = parseVertices(input);
    
    expect(result.length).toBe(3);
    expect(result[0]).toEqual([1, 2, 3]);
    expect(result[1]).toEqual([4, 5, 6]);
    expect(result[2]).toEqual([7.5, 8.5, 9.5]);
  });

  test('parseVertices should throw error for invalid input', () => {
    const invalidInput = `
      [1, 2, 3]
      [4, 5] // Missing z coordinate
      [7, 8, 9]
    `;
    
    expect(() => parseVertices(invalidInput)).toThrow(/Need exactly 3 numbers/);
  });

  test('parseIndices should correctly parse face index data', () => {
    const input = `
      [0, 1, 2]
      [1, 2, 3]
      [2, 3, 0]
    `;
    
    const result = parseIndices(input);
    
    expect(result.length).toBe(3);
    expect(result[0]).toEqual([0, 1, 2]);
    expect(result[1]).toEqual([1, 2, 3]);
    expect(result[2]).toEqual([2, 3, 0]);
  });

  test('parseIndices should round floating point values to integers', () => {
    const input = `
      [0.2, 1.7, 2.1]
      [1.9, 2.3, 3.6]
    `;
    
    const result = parseIndices(input);
    
    expect(result.length).toBe(2);
    expect(result[0]).toEqual([0, 2, 2]);
    expect(result[1]).toEqual([2, 2, 4]);
  });

  test('parseColors should correctly parse RGB and RGBA color data', () => {
    const input = `
      [255, 0, 0]       // Red (RGB)
      [0, 255, 0, 128]  // Semi-transparent green (RGBA)
      [0, 0, 255, 255]  // Blue (RGBA)
    `;
    
    const result = parseColors(input);
    
    expect(result.length).toBe(3);
    expect(result[0]).toEqual([255, 0, 0, 255]);     // Red with default alpha
    expect(result[1]).toEqual([0, 255, 0, 128]);     // Green with specified alpha
    expect(result[2]).toEqual([0, 0, 255, 255]);     // Blue with specified alpha
  });

  test('parseColors should clamp values to valid range (0-255)', () => {
    const input = `
      [-10, 300, 100]  // Invalid values that should be clamped
    `;
    
    const result = parseColors(input);
    
    expect(result.length).toBe(1);
    expect(result[0]).toEqual([0, 255, 100, 255]);  // Clamped to valid ranges
  });
});