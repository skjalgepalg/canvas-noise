/**
 * @param {import('tweakpane').Pane} pane
 * @param {import('./params').defaultParams} params
 * @param {() => void} restartAnimationCallback
 */
export const setupTweakPane = (pane, params, restartAnimationCallback) => {
  const recordingFolder = pane.addFolder({
    title: 'Recording',
    expanded: false,
  })
  recordingFolder.addBinding(params, 'frameRate')
  recordingFolder.addBinding(params, 'duration')

  const recordButton = recordingFolder.addButton({
    title: 'Start Recording',
    label: 'Start Recording',
  })
  recordButton.on('click', () => {
    params.record = !params.record
    recordButton.label = params.record ? 'Stop Recording' : 'Start Recording'
    pane.refresh()
    restartAnimationCallback()
  })

  const canvasFolder = pane.addFolder({
    title: 'Canvas',
    expanded: false,
  })
  canvasFolder.addBinding(params, 'fillScreen', {
    type: 'boolean',
    onClick: () => {
      pane.refresh()
    },
  })
  canvasFolder.addBinding(params, 'xDim', {
    type: 'number',
    min: 100,
    max: 1920,
    step: 10,
  })
  canvasFolder.addBinding(params, 'yDim', {
    type: 'number',
    min: 100,
    max: 1920,
    step: 10,
  })
  canvasFolder.addBinding(params, 'margin')
  canvasFolder.addBinding(params, 'bgColor', { type: 'color' })

  const animationFolder = pane.addFolder({
    title: 'Animation',
    expanded: true,
  })
  animationFolder.addBinding(params, 'seed')
  const noiseType = animationFolder.addBinding(params, 'noiseType', {
    options: {
      '2D': '2D',
      '3D': '3D',
      '4D': '4D',
    }
  })
  noiseType.on('change', () => {
    restartAnimationCallback()
  })
  animationFolder.addBinding(params, 'noiseRadius')
  animationFolder.addBinding(params, 'noiseScale')
  animationFolder.addBinding(params, 'dotSize', { type: 'number', min: 0, max: 10, step: 0.1 })
  animationFolder.addBinding(params, 'xStep', { type: 'number', min: 1, max: 100, step: 1 })
  animationFolder.addBinding(params, 'yStep', { type: 'number', min: 1, max: 100, step: 1 })
  animationFolder.addBinding(params, 'green', {
    type: 'number',
    min: 0,
    max: 255,
    step: 1,
  })
  animationFolder.addBinding(params, 'blue', {
    type: 'number',
    min: 0,
    max: 255,
    step: 1,
  })
  animationFolder.addBinding(params, 'red', {
    type: 'number',
    min: 0,
    max: 255,
    step: 1,
  })
  animationFolder.addBinding(params, 'greenTaper', {
    options: {
      none: 'none',
      horizontal: 'horizontal',
      vertical: 'vertical',
      both: 'both',
    },
  })
  animationFolder.addBinding(params, 'blueTaper', {
    options: {
      none: 'none',
      horizontal: 'horizontal',
      vertical: 'vertical',
      both: 'both',
    },
  })
  animationFolder.addBinding(params, 'redTaper', {
    options: {
      none: 'none',
      horizontal: 'horizontal',
      vertical: 'vertical',
      both: 'both',
    },
  })
  animationFolder.addBinding(params, 'compositeOperation', {
    options: {
      lighter: 'lighter',
      'color-burn': 'color-burn',
      'color-dodge': 'color-dodge',
      color: 'color',
      darken: 'darken',
      'destination-atop': 'destination-atop',
      'destination-in': 'destination-in',
      'destination-out': 'destination-out',
      'destination-over': 'destination-over',
      difference: 'difference',
      exclusion: 'exclusion',
      'hard-light': 'hard-light',
      lighten: 'lighten',
      multiply: 'multiply',
      overlay: 'overlay',
      saturation: 'saturation',
      screen: 'screen',
      'soft-light': 'soft-light',
      'source-atop': 'source-atop',
      'source-in': 'source-in',
      'source-out': 'source-out',
      'source-over': 'source-over',
      xor: 'xor',
    },
  })
}
