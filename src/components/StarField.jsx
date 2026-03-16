import { useRef, useEffect } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let stars = []
    let shootingStars = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createStars() {
      stars = []
      const count = Math.floor((canvas.width * canvas.height) / 3000)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.05,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          color: ['#ffffff', '#c4b5fd', '#93c5fd', '#a5f3fc'][Math.floor(Math.random() * 4)],
        })
      }
    }

    function addShootingStar() {
      if (Math.random() < 0.003) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 6,
          angle: (Math.PI / 4) + (Math.random() * 0.3),
          opacity: 1,
        })
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      for (const star of stars) {
        star.opacity += star.twinkleSpeed
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1
        }
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.opacity * 0.8
        ctx.fill()
      }

      // Draw shooting stars
      addShootingStar()
      ctx.globalAlpha = 1
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        const endX = s.x - Math.cos(s.angle) * s.length
        const endY = s.y + Math.sin(s.angle) * s.length

        const gradient = ctx.createLinearGradient(s.x, s.y, endX, endY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.opacity -= 0.015

        if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
          shootingStars.splice(i, 1)
        }
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    resize()
    createStars()
    animate()

    window.addEventListener('resize', () => {
      resize()
      createStars()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
