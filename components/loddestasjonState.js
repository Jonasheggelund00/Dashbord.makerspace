// Delt state for loddestasjon-data, slik at den bevares mellom navigasjon
import { ref } from 'vue'

/**
 * @typedef {Object} LoddestasjonData
 * @property {boolean} vibration
 * @property {boolean} tilt
 * @property {boolean} drop
 * @property {number} battery
 * @property {number} thermalMin
 * @property {number} thermalMax
 * @property {number} thermalAvg
 */

/** @type {import('vue').Ref<LoddestasjonData | null>} */
export const sharedLoddestasjonData = ref(null)

/** @type {import('vue').Ref<boolean>} */
export const isDataLoaded = ref(false)
