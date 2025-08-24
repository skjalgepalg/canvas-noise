import alea from 'alea'
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise'

const SEED = 'snerk-2025-08-24'
let noise2D = createNoise2D(alea(SEED))
let noise3D = createNoise3D(alea(SEED))
let noise4D = createNoise4D(alea(SEED))

/**
 * @type CanvasRenderingContext2D
 */
let ctx
let W, H, time, x0, y0, cx, cy, wW, hH, capturer

// 25 frames per second for 5 seconds => 125 frames per loop
const TOTALT_FRAME_N = 25 * 5
// Set true and reload to save a recording
const RECORD = true

// 2π will give us the circumference of a circle
const TWO_PI = Math.PI * 2


function periodicFunction(progress, offset, x, y) {
  // R is the radius of the circle
  const R = 1.6
  // S is the scale of the noise
  // const S = 0.016
  const S = 0.007
  // P is the progress of the animation
  const P = progress

  return noise2D(
    // return noise3D(
    // return noise4D(
    offset + R * Math.cos(P * TWO_PI),
    R * Math.sin(P * TWO_PI),
    S * y,
    S * x,
  )
}

function radialOffset(x, y) {
  return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))
}

function frame(n) {
  let progress = n / TOTALT_FRAME_N
  ctx.fillStyle = '#000'

  ctx.fillRect(0, 0, wW, hH)
  ctx.save()

  ctx.globalCompositeOperation = 'lighter'

  // Loop over all pixels inside margin on the x-axis
  for (let i = x0; i < W; i += 10) {
    // Loop over all pixels inside margin on the y-axis
    for (let j = y0; j < H; j += 10) {
      let x = i
      let y = j
      const distancefactor = radialOffset(x, y) / radialOffset(0, 0)
      const vertdistancefactor = radialOffset(0, y) / radialOffset(0, 0)

      const g = 75 * 2
      const r = 1 * (1 + 65 * vertdistancefactor)
      const b = 128 * 2
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      const taper = 50 * (1 - 0.9 * distancefactor)

      let dx =
        taper * periodicFunction(progress - 0.001 * radialOffset(x, y), 0, x, y)
      let dy =
        taper *
        periodicFunction(progress - 0.001 * radialOffset(x, y), 150, x, y)

      ctx.beginPath()
      ctx.arc(x + dx, y + dy, 1, 0, TWO_PI)
      ctx.fill()
    }
  }

  ctx.restore()
}

function loop(frameN) {
  // console.log(frameN)
  frame(frameN)
  if (frameN < TOTALT_FRAME_N) {
    requestAnimationFrame(loop.bind(null, frameN + 1))
    if (capturer) {
      capturer.capture(ctx.canvas)
    }
  } else if (capturer) {
    capturer.stop()
    capturer.save()
  } else {
    requestAnimationFrame(loop.bind(null, 0))
  }
}

// Initialize the canvas and capturer
function init() {
  time = new Date().getTime()
  let canvas = document.createElement('canvas')
  // let dim = 500
  // let xDim = dim;
  // let yDim = dim;
  let xDim = 1080
  let yDim = 1920
  let margin = 55
  // canvas.setAttribute("width", `${dim}px`);
  // canvas.setAttribute("height", `${dim}px`);
  canvas.setAttribute('width', `${xDim}px`)
  canvas.setAttribute('height', `${yDim}px`)
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')

  wW = canvas.width
  hH = canvas.height
  W = wW - margin
  H = hH - margin
  x0 = margin
  y0 = margin
  cx = wW / 2
  cy = hH / 2
  if (RECORD) {
    capturer = new CCapture({
      format: 'webm',
      workersPath: 'node_modules/ccapture.js/build/',
      framerate: 25,
      quality: 100,
    })
    capturer.start()
  }
}

init()
loop(0)
