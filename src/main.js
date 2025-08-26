import { Pane } from 'tweakpane'
import { getNoise } from './noise'
import { defaultParams } from './params'
import { setupTweakPane } from './tweakpane'

/** @type {import('./params').defaultParams} */
let params

/**
 * @type CanvasRenderingContext2D
 */
let ctx
/**
 * @type {number}
 * @description The requestAnimationFrame ID
 */
let rafId

/**
 * @type {CCapture | null}
 * @description ccapture instance if recording is active
 */
let capturer = null

let W, H, x0, y0, cx, cy, canvasWidth, canvasHeight, noise

// Compute total frames dynamically from params
function totalFrames() {
  return params.frameRate * params.duration
}

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
  const S = params.noiseScale
  // P is the progress of the animation
  const P = progress

  return noise(
    offset + R * Math.cos(P * TWO_PI),
    R * Math.sin(P * TWO_PI),
    S * y,
    S * x,
  )
}

function radialOffset(x, y) {
  return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))
}

function getColorValue(color, taper, distancefactor) {
  return (
    color *
    (1 +
      (taper === 'horizontal' || taper === 'both' ? 1 * distancefactor : 0)) *
    (1 + (taper === 'vertical' || taper === 'both' ? 1 * distancefactor : 0))
  )
}

function drawFrame(n) {
  let progress = n / totalFrames()
  ctx.fillStyle = params.bgColor

  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.save()

  ctx.globalCompositeOperation = params.compositeOperation

  // Loop over all pixels inside margin on the x-axis
  for (let i = x0; i < W; i += params.xStep) {
    // Loop over all pixels inside margin on the y-axis
    for (let j = y0; j < H; j += params.yStep) {
      let x = i
      let y = j
      const distancefactor = radialOffset(x, y) / radialOffset(0, 0)
      const vertdistancefactor = radialOffset(0, y) / radialOffset(0, 0)
      const horizontaldistancefactor = radialOffset(x, 0) / radialOffset(0, 0)

      const g = getColorValue(
        params.green,
        params.greenTaper,
        horizontaldistancefactor,
        vertdistancefactor,
      )
      // const r = 1 * (1 + 65 * vertdistancefactor)
      const r = getColorValue(
        params.red,
        params.redTaper,
        horizontaldistancefactor,
        vertdistancefactor,
      )

      const b = getColorValue(
        params.blue,
        params.blueTaper,
        horizontaldistancefactor,
        vertdistancefactor,
      )
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      const taper = 50 * (1 - 0.9 * distancefactor)

      let dx =
        taper * periodicFunction(progress - 0.001 * radialOffset(x, y), 0, x, y)
      let dy =
        taper *
        periodicFunction(progress - 0.001 * radialOffset(x, y), 150, x, y)

      ctx.beginPath()

      ctx.arc(x + dx, y + dy, params.dotSize, 0, TWO_PI)
      ctx.fill()
    }
  }

  ctx.restore()
}

function loop(frameN) {
  // Uncomment to count frames in console (NB! this gets spammy)
  // console.log(frameN)
  drawFrame(frameN)
  if (frameN < totalFrames()) {
    // Continue the loop
    rafId = requestAnimationFrame(loop.bind(null, frameN + 1))
    // Capture the frame if capturer is set
    if (capturer) {
      capturer.capture(ctx.canvas)
    }
  } else if (capturer) {
    // Stop the capturer and save the video
    capturer.stop()
    capturer.save()
    params.record = false
    capturer = null
    console.log('Capturer stopped', { params })
  } else {
    // Restart the loop
    rafId = requestAnimationFrame(loop.bind(null, 0))
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

function stopAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (capturer) {
    try {
      capturer.stop()
      capturer.save()
    } catch (e) {
      // noop
      console.error(e, 'Error stopping capturer')
    } finally {
      console.log('Capturer stopped', { params })
    }
    capturer = null
  }
}

function startAnimation() {
  stopAnimation()
  // Setup noise
  noise = getNoise(params)
  // Start recording if enabled
  if (params.record) {
    capturer = new CCapture({
      format: 'webm',
      workersPath: 'node_modules/ccapture.js/build/',
      framerate: params.frameRate,
      quality: 100,
    })
    capturer.start()
  }
  loop(0)
}

// Initialize the canvas and capturer
function init() {
  // Setup params, destructure to avoid mutating defaultParams
  params = { ...defaultParams }

  console.log('init', { params })
  // Setup canvas
  const canvas = document.createElement('canvas')
  resizeCanvas(canvas)
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  // Setup noise
  noise = getNoise(params)

  const pane = new Pane({
    title: 'Parameters',
  })

  setupTweakPane(pane, params, startAnimation)

  pane.on('change', (event) => {
    if (event.last) {
      console.log(event)
      resizeCanvas(canvas)
    }
  })

  window.addEventListener('resize', () => {
    if (params.fillScreen) {
      // Make sure the canvas dimensions are even, ffmpeg must be able to divise by 2 for encoding
      params.xDim = window.innerWidth % 2 !== 0 ? window.innerWidth : window.innerWidth - 1
      params.yDim = window.innerHeight % 2 !== 0 ? window.innerHeight : window.innerHeight - 1
      resizeCanvas(canvas)
    }
  })
}

init()
startAnimation()
