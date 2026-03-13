// Delt state for laserkutter-data, slik at den bevares mellom navigasjon
import { ref } from 'vue'

/**
 * @typedef {Object} LaserkutterData
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} total
 * @property {boolean} inUse
 */

/** @type {import('vue').Ref<LaserkutterData | null>} */
export const sharedLaserkutterData = ref(null)

/** @type {import('vue').Ref<boolean>} */
export const isLaserkutterDataLoaded = ref(false)
