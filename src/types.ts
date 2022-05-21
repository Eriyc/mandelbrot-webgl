import { vec2type } from "gl-matrix-ts/dist/common";

export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: Record<string, number>;
  uniformLocations: Record<string, WebGLUniformLocation | null>;
};

export type SceneSettings = {
  zoom?: vec2type;
  lookAt?: vec2type;
};
