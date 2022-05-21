import { mat4, vec3, vec4 } from "gl-matrix-ts";
import {} from "mathjs";
export class Camera {
  projection_matrix;
  view_matrix;
  gl;
  position;

  constructor(gl: WebGL2RenderingContext) {
    this.projection_matrix = mat4.identity(mat4.create());
    this.view_matrix = mat4.identity(mat4.create());
    this.position = vec4.set(vec4.create(), 0, 0, 0, 1);
    this.gl = gl;
  }

  translate_camera_position(x: number, y: number, z: number) {
    this.position = vec4.add(
      vec4.create(),
      this.position,
      vec4.fromValues(x, y, z, 0)
    );

    this.view_matrix = mat4.translate(
      this.view_matrix,
      mat4.identity(mat4.create()),
      vec3.fromValues(-this.position[0], -this.position[1], -this.position[2])
    );
  }
}
