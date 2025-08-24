import alea from 'alea'
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise'
import { params } from './params'

const getSeededRandom = (seed) => {
  return alea(seed)
}

export const getNoise = (noiseType = '2D') => {
  const random = getSeededRandom(params.seed)
  switch (noiseType) {
    case '2D':
      return createNoise2D(random)
    case '3D':
      return createNoise3D(random)
    case '4D':
      return createNoise4D(random)
  }
}
