function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(src))
    document.body.appendChild(script)
  })
}

export async function loadCar() {
  if (document.querySelector('#car3d canvas')) return
  const base = 'https://cdn.jsdelivr.net/npm/three@0.147.0'
  await loadScript(`${base}/build/three.min.js`)
  await loadScript(`${base}/examples/js/loaders/GLTFLoader.js`)
  await loadScript('/car3d.js')
}
