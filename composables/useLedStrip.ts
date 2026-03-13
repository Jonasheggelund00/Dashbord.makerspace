export const useLedStrip = () => {
  // Returns [r, g, b] in 0-255 range
  // thresholds kan sendes inn for å matche lagrede innstillinger
  const ledColorFromTemp = (
    temp: number,
    thresholds = { green: 30, yellow: 40, orange: 50 }
  ): [number, number, number] => {
    if (temp <= thresholds.green)        return [0, 255, 0]      // grønn
    else if (temp <= thresholds.yellow)  return [255, 200, 0]    // gul
    else if (temp <= thresholds.orange)  return [255, 80, 0]     // oransje
    else                                 return [255, 0, 0]      // rød
  }

  const updateFromTemp = async (temp: number) => {
    await $fetch('/api/led', {
      method: 'POST',
      body: { temperature: temp }
    })
  }

  return { ledColorFromTemp, updateFromTemp }
}
