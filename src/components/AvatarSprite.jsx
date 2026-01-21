import { useEffect, useRef } from 'react'
import spriteWave from '../assets/Character/Sprite_wave.png'

const FRAME_COLS = 4
const FRAME_ROWS = 2
const FRAME_DURATION = 150
const FRAME_VERTICAL_NUDGE = 23

const AvatarSprite = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return undefined
    }

    const image = new Image()
    image.src = spriteWave

    let animationFrame = 0
    let frameIndex = 0
    let lastTime = 0

    image.onload = () => {
      const frameWidth = Math.floor(image.width / FRAME_COLS)
      const frameHeight = Math.floor(image.height / FRAME_ROWS)

      canvas.width = frameWidth
      canvas.height = frameHeight
      context.imageSmoothingEnabled = false

      const offscreen = document.createElement('canvas')
      offscreen.width = image.width
      offscreen.height = image.height
      const offscreenContext = offscreen.getContext('2d')
      if (!offscreenContext) {
        return
      }
      offscreenContext.drawImage(image, 0, 0)
      const { data } = offscreenContext.getImageData(0, 0, image.width, image.height)

      const frameOffsets = []
      for (let row = 0; row < FRAME_ROWS; row += 1) {
        for (let col = 0; col < FRAME_COLS; col += 1) {
          let bottom = -1
          let left = frameWidth
          let right = -1
          let top = frameHeight
          for (let y = frameHeight - 1; y >= 0 && bottom === -1; y -= 1) {
            const baseY = (row * frameHeight + y) * image.width
            for (let x = 0; x < frameWidth; x += 1) {
              const alpha = data[(baseY + col * frameWidth + x) * 4 + 3]
              if (alpha > 0) {
                bottom = y
                break
              }
            }
          }
          for (let y = 0; y < frameHeight; y += 1) {
            const baseY = (row * frameHeight + y) * image.width
            for (let x = 0; x < frameWidth; x += 1) {
              const alpha = data[(baseY + col * frameWidth + x) * 4 + 3]
              if (alpha > 0) {
                if (x < left) {
                  left = x
                }
                if (x > right) {
                  right = x
                }
                if (y < top) {
                  top = y
                }
              }
            }
          }
          const bottomPadding = bottom === -1 ? frameHeight - 1 : frameHeight - 1 - bottom
          const hasPixels = right >= left && bottom !== -1
          const centerX = hasPixels ? (left + right) / 2 : frameWidth / 2
          const topPadding = top === frameHeight ? 0 : top
          frameOffsets.push({ col, row, bottomPadding, centerX, topPadding, hasPixels })
        }
      }

      const baselinePadding = Math.max(...frameOffsets.map((frame) => frame.bottomPadding))
      const alignedFrames = frameOffsets.map((frame) => ({
        ...frame,
        offsetY: -(baselinePadding - frame.bottomPadding),
        offsetX: Math.round(frameWidth / 2 - frame.centerX),
      }))

      const draw = (time) => {
        if (!lastTime) {
          lastTime = time
        }
        if (time - lastTime >= FRAME_DURATION) {
          frameIndex = (frameIndex + 1) % alignedFrames.length
          lastTime = time
        }

        const frame = alignedFrames[frameIndex]
        context.clearRect(0, 0, frameWidth, frameHeight)
        context.drawImage(
          image,
          frame.col * frameWidth,
          frame.row * frameHeight,
          frameWidth,
          frameHeight,
          frame.offsetX,
          frame.offsetY + FRAME_VERTICAL_NUDGE,
          frameWidth,
          frameHeight,
        )
        animationFrame = requestAnimationFrame(draw)
      }

      animationFrame = requestAnimationFrame(draw)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pip-avatar-sprite"
      role="img"
      aria-label="Pixel portrait of Steven"
    />
  )
}

export default AvatarSprite
