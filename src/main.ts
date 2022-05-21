import {
  createBufferInfoFromArrays,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  drawBufferInfo,
  createProgramFromSources,
  createProgramInfoFromProgram,
} from "twgl.js";
import { fragShader, vertexShader } from "./shader";

const canvas = document.querySelector<HTMLCanvasElement>("#glCanvas")!;
const startRecordButton = document.querySelector<HTMLButtonElement>("#record")!;
const stopRecordButton =
  document.querySelector<HTMLButtonElement>("#stop-record")!;
let rec: MediaRecorder;

const record = () => {
  const chunks: Blob[] = []; // here we will store our recorded media chunks (Blobs)
  const stream = canvas.captureStream(); // grab our canvas MediaStream
  rec = new MediaRecorder(stream); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = (e) => chunks.push(e.data);
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = () => exportVid(new Blob(chunks, { type: "video/webm" }));

  rec.start();
};

const stopRecord = () => {
  rec.stop();
};

function exportVid(blob: Blob) {
  const vid = document.createElement("video");
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.body.appendChild(vid);
  const a = document.createElement("a");
  a.download = "myvid.webm";
  a.href = vid.src;
  a.textContent = "download the video";
  document.body.appendChild(a);
}

startRecordButton.onclick = record;
stopRecordButton.onclick = stopRecord;

const main = () => {
  const gl = canvas?.getContext("webgl2")!;

  const program = createProgramFromSources(gl, [vertexShader, fragShader]);
  const programInfo = createProgramInfoFromProgram(gl, program);

  const arrays = {
    a_position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  };
  const bufferInfo = createBufferInfoFromArrays(gl, arrays);

  console.time("fram");

  let last = performance.now();

  const center = [gl.canvas.width / 2, gl.canvas.height / 2];
  const zoom = 1;

  const render = () => {
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const uniforms = {
      u_time: performance.now(),
      u_resolution: [gl.canvas.width, gl.canvas.height],

      iterations: 256,
      camera_center: center,
      camera_zoom: zoom,
    };

    gl.useProgram(programInfo.program);
    setBuffersAndAttributes(gl, programInfo, bufferInfo);
    setUniforms(programInfo, uniforms);
    drawBufferInfo(gl, bufferInfo);

    console.log(performance.now() - last);
    last = performance.now();

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

main();
export {};
