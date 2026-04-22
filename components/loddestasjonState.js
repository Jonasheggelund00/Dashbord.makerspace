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

/** @type {import('vue').Ref<boolean>} */
export const loddestasjonInUse = ref(false)

const LODDESTASJON_THRESHOLD = 35
const LODDESTASJON_ON_DELAY_MS = 3000
const LODDESTASJON_OFF_DELAY_MS = 180000

let loddestasjonOnTimeout = null
let loddestasjonOffTimeout = null

export function updateLoddestasjonUsage(/** @type {number} */ maxTemp) {
	const numeric = typeof maxTemp === 'number' ? maxTemp : NaN
	const overThreshold = !isNaN(numeric) && numeric > LODDESTASJON_THRESHOLD

	if (overThreshold) {
		if (loddestasjonOffTimeout) {
			clearTimeout(loddestasjonOffTimeout)
			loddestasjonOffTimeout = null
		}
		if (!loddestasjonInUse.value && !loddestasjonOnTimeout) {
			loddestasjonOnTimeout = setTimeout(() => {
				loddestasjonInUse.value = true
				loddestasjonOnTimeout = null
			}, LODDESTASJON_ON_DELAY_MS)
		}
	} else {
		if (loddestasjonOnTimeout) {
			clearTimeout(loddestasjonOnTimeout)
			loddestasjonOnTimeout = null
		}
		if (loddestasjonInUse.value && !loddestasjonOffTimeout) {
			loddestasjonOffTimeout = setTimeout(() => {
				loddestasjonInUse.value = false
				loddestasjonOffTimeout = null
			}, LODDESTASJON_OFF_DELAY_MS)
		}
	}
}
