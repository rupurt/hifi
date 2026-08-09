type GpuQueueConstructor = {
  readonly prototype?: object
}

export function supportsLiquidDomRendering() {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
    return false
  }

  const gpuQueue = Reflect.get(globalThis, 'GPUQueue') as GpuQueueConstructor | undefined

  return Boolean(gpuQueue?.prototype && 'copyElementImageToTexture' in gpuQueue.prototype)
}
