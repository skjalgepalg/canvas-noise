import { Pane } from 'tweakpane'
import { getNoise } from './noise'
import { params } from './params'
import { setupTweakPane } from './tweakpane'

/**
 * @type CanvasRenderingContext2D
 */
let ctx
let W, H, x0, y0, cx, cy, canvasWidth, canvasHeight, capturer, noise

// 25 frames per second for 5 seconds => 125 frames per loop
const TOTALT_FRAME_N = params.frameRate * params.duration

// 2π will give us the circumference of a circle
const TWO_PI = Math.PI * 2

/**
 * @param {number} progress progress of the animation
 * @param {number} offset
 * @param {number} x
 * @param {number} y
 */
function periodicFunction(progress, offset, x, y) {
  // R is the radius of the circle
  const R = params.noiseRadius
  // S is the scale of the noise
  // const S = 0.016
  const S = params.noiseScale
  // P is the progress of the animation
  const P = progress

  return noise(
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

function drawFrame(n) {
  let progress = n / TOTALT_FRAME_N
  ctx.fillStyle = params.bgColor

  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.save()

  ctx.globalCompositeOperation = params.compositeOperation

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
  // Uncomment to count frames in console (NB! this gets spammy)
  // console.log(frameN)
  drawFrame(frameN)
  if (frameN < TOTALT_FRAME_N) {
    // Continue the loop
    requestAnimationFrame(loop.bind(null, frameN + 1))
    // Capture the frame if capturer is set
    if (capturer) {
      capturer.capture(ctx.canvas)
    }
  } else if (capturer) {
    // Stop the capturer and save the video
    capturer.stop()
    capturer.save()
  } else {
    // Restart the loop
    requestAnimationFrame(loop.bind(null, 0))
  }
}

/**
 * Resize the canvas to the target dimensions
 * @param {HTMLCanvasElement} targetCanvas
 */
function resizeCanvas(targetCanvas) {
  if (params.fillScreen) {
    params.xDim = window.innerWidth
    params.yDim = window.innerHeight
  }
  targetCanvas.setAttribute('width', `${params.xDim}px`)
  targetCanvas.setAttribute('height', `${params.yDim}px`)
  canvasWidth = targetCanvas.width
  canvasHeight = targetCanvas.height
  const margin = params.margin
  W = canvasWidth - margin
  H = canvasHeight - margin
  x0 = margin
  y0 = margin
  cx = canvasWidth / 2
  cy = canvasHeight / 2
}

// Initialize the canvas and capturer
function init() {
  const canvas = document.createElement('canvas')
  resizeCanvas(canvas)
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  noise = getNoise(params.noiseType)

  const pane = new Pane()

  setupTweakPane(pane)

  pane.on('change', (event) => {
    if (event.last) {
      console.log(event)
      resizeCanvas(canvas)
      noise = getNoise(params.noiseType)
    }
    if (params.record) {
      capturer = new CCapture({
        format: 'webm',
        workersPath: 'node_modules/ccapture.js/build/',
        framerate: 25,
        quality: 100,
      })
      capturer.start()
    }
  })

  window.addEventListener('resize', () => {
    if (params.fillScreen) {
      params.xDim = window.innerWidth
      params.yDim = window.innerHeight
      resizeCanvas(canvas)
    }
  })
}

init()
loop(0)
