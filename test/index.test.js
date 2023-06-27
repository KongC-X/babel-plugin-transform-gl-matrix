import {
    vec2,
    vec3,
    mat2,
    mat2d,
    mat3,
    mat4,
    quat,
    quat2,
    glMatrix,
  } from 'gl-matrix';
  
  glMatrix.setMatrixArrayType(Array);
  
  test('mat2d expand', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const m1 = mat2d(...arr);
    const m2 = mat2d.fromValues(...arr);
    expect(m1).toEqual(m2);
  });