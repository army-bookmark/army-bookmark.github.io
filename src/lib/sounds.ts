'use client'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// Warm bandpass noise — the mechanical thud of a typewriter key body
function noiseBurst(ac: AudioContext, volume: number, bpFreq: number, bpQ: number, decayMs: number, durationMs: number) {
  const len = Math.floor(ac.sampleRate * durationMs / 1000)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const d = buf.getChannelData(0)
  const tau = ac.sampleRate * decayMs / 1000
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / tau)
  const src = ac.createBufferSource()
  src.buffer = buf
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = bpFreq
  bp.Q.value = bpQ
  const gain = ac.createGain()
  gain.gain.value = volume
  src.connect(bp); bp.connect(gain); gain.connect(ac.destination)
  src.start()
}

// Brief triangle-wave ring — the metallic spring resonance after impact
function metalRing(ac: AudioContext, freq: number, volume: number, decayMs: number) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + decayMs / 1000)
  osc.connect(gain); gain.connect(ac.destination)
  osc.start(); osc.stop(ac.currentTime + decayMs / 1000 + 0.01)
}

// Antique typewriter key: warm body thock + delicate spring zing
export function playKeyClick() {
  const ac = getCtx(); if (!ac) return
  noiseBurst(ac, 0.055, 300, 2.8, 4, 22)   // warm mechanical thud
  metalRing(ac, 1050, 0.022, 13)            // brief key-spring resonance
}

// Highpass noise — brighter, more immediate than bandpass
function noiseHP(ac: AudioContext, volume: number, hpFreq: number, decayMs: number, durationMs: number) {
  const len = Math.floor(ac.sampleRate * durationMs / 1000)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const d = buf.getChannelData(0)
  const tau = ac.sampleRate * decayMs / 1000
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / tau)
  const src = ac.createBufferSource()
  src.buffer = buf
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = hpFreq
  const gain = ac.createGain()
  gain.gain.value = volume
  src.connect(hp); hp.connect(gain); gain.connect(ac.destination)
  src.start()
}

// Barely-audible soft touch — 1900 Hz highpass, 12 ms, vol 0.055
export function playHover() {
  const ac = getCtx(); if (!ac) return
  noiseHP(ac, 0.055, 1900, 2, 12)
}

// Satisfying punch — 850 Hz highpass, 38 ms, vol 0.2
export function playClick() {
  const ac = getCtx(); if (!ac) return
  noiseHP(ac, 0.2, 850, 7, 38)
}
