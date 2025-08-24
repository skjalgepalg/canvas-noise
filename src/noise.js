import alea from 'alea'
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise'

/**
 * @param {string} seed
 * @returns {import('alea').Alea}
 */
const getSeededRandom = (seed) => {
  return alea(seed)
}

/**
 * @param {import('./params').defaultParams} params
 * @returns {import('simplex-noise').NoiseFunction}
 */
export const getNoise = (params) => {
  const { noiseType = '2D', seed } = params
  const random = getSeededRandom(seed)
  switch (noiseType) {
    case '2D':
      return createNoise2D(random)
    case '3D':
      return createNoise3D(random)
    case '4D':
      return createNoise4D(random)
  }
}
