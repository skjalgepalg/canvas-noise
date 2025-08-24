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

  recordingFolder.addButton({
    title: 'Start Recording',
    onClick: () => {
      params.record = !params.record
    },
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
  animationFolder.addBinding(params, 'noiseType', {
    options: {
      '2D': '2D',
      '3D': '3D',
      '4D': '4D',
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
