import { useEffect, useRef } from 'react'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const PixelLogo = ({
  src,
  alt,
  size = 140,
  width,
  height,
  pixelSize = 2,
  backgroundColor,
  className,
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!src || !canvasRef.current) {
      return
    }

    const image = new Image()
    image.src = src
    image.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }

      const ratio = image.width / image.height
      const targetWidth = width || size
      const targetHeight = height || size
      const scale = clamp(pixelSize, 4, 16)
      const smallWidth = Math.max(1, Math.floor(targetWidth / scale))
      const smallHeight = Math.max(1, Math.floor(targetHeight / scale))

      const offscreen = document.createElement('canvas')
      offscreen.width = smallWidth
      offscreen.height = smallHeight
      const offCtx = offscreen.getContext('2d')
      if (!offCtx) {
        return
      }

      const fitWidth = ratio >= 1 ? smallWidth : Math.round(smallHeight * ratio)
      const fitHeight = ratio >= 1 ? Math.round(smallWidth / ratio) : smallHeight
      const offsetX = Math.floor((smallWidth - fitWidth) / 2)
      const offsetY = Math.floor((smallHeight - fitHeight) / 2)

      offCtx.clearRect(0, 0, smallWidth, smallHeight)
      offCtx.imageSmoothingEnabled = true
      offCtx.drawImage(image, offsetX, offsetY, fitWidth, fitHeight)

      ctx.clearRect(0, 0, targetWidth, targetHeight)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(offscreen, 0, 0, smallWidth, smallHeight, 0, 0, targetWidth, targetHeight)
    }
  }, [height, pixelSize, size, src, width])

  return (
    <canvas
      ref={canvasRef}
      className={`pixel-logo-canvas${className ? ` ${className}` : ''}`}
      width={width || size}
      height={height || size}
      style={{ width: width || size, height: height || size, backgroundColor }}
      aria-label={alt}
      role="img"
    />
  )
}

export default PixelLogo
