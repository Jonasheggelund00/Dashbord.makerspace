// En delt state for printerList, brukt av PrintComponent
import { ref } from 'vue'

/**
 * @typedef {Object} Printer
 * @property {string} [hostname]
 * @property {string} [ip]
 * @property {string} [apiKey]
 * @property {string} [serial]
 * @property {string} [state]
 * @property {boolean} [is_printing]
 * @property {number} [temp_bed]
 * @property {number} [target_bed]
 * @property {number} [temp_nozzle]
 * @property {number} [target_nozzle]
 * @property {number} [nozzle_diameter]
 * @property {boolean} [mmu]
 * @property {number} [min_extrusion_temp]
 * @property {string} [filament_type]
 * @property {boolean|null} [filament_present]
 * @property {string} [error]
 */

/** @type {import('vue').Ref<Printer[]>} */
export const sharedPrinterList = ref([])
