export const fragShader = `#version 300 es
precision highp float;
            
in vec2 coords;
out vec4 outputColor;

uniform float u_time;
uniform vec2 u_resolution;

#define ZOOM_LENGTH 8.0

float mandelbrot(vec2 p) {
    int iterations = 0;
    int max = 1000;
    vec2 c = vec2(p.x, p.y);
    
    for (int i = 0; i < 1000; i++)
    {
        p = vec2(p.x*p.x - p.y*p.y, 2.*p.x*p.y) + c;
        if (length(p) > 2.0)
            break;
        iterations++;
    }
    return iterations == max ? 0.0 : float(iterations) / float(max);
}

void main(void) {
    vec2 uv = coords;
    uv.x *= (u_resolution.x / u_resolution.y);
    
    float fzoom = 0.65 + 0.38*cos(u_time / 1000.0 / ZOOM_LENGTH);
    float zoom = pow(fzoom, ZOOM_LENGTH) * 1.0;
    
    vec2 center = vec2(-.737611,.18651);
    uv *= zoom;
    uv += center;
    
    float c = mandelbrot(uv);
    
    vec3 color = vec3(c); 
    color.x = c*9.;
    color.y = c*3.;
    color.z = c*1.;
    
    outputColor = vec4(color, 1.0);
}
`;

export const vertexShader = `#version 300 es

precision highp float;

in vec3 a_position;
out vec2 coords;

uniform float u_time;

void main() {   
  gl_Position = vec4(a_position, 1.0);
  coords = vec2(a_position.xy);
}
`;
