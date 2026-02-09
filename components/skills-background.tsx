"use client"

import { useEffect, useRef, useState } from 'react'

export function SkillsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    // Fragment shader - Clean Energy Flow
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec2 resolution;
      uniform float time;
      uniform bool isDark;
      
      #define PI 3.14159265359
      #define RED vec3(0.902, 0.224, 0.275)
      #define DARK_RED vec3(0.7, 0.15, 0.2)
      #define LIGHT_RED vec3(1.0, 0.5, 0.5)
      #define WARM_CORAL vec3(1.0, 0.6, 0.55)
      #define SOFT_PEACH vec3(1.0, 0.75, 0.7)
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 center = vec2(0.5, 0.5);
        
        // Create flowing energy effect
        float energy = 0.0;
        
        // Multiple wave layers - more pronounced
        for(float i = 1.0; i <= 3.0; i++) {
          float wave = sin(uv.x * 6.0 * i + time * 0.25 + uv.y * 3.0) * 0.5 + 0.5;
          wave *= sin(uv.y * 5.0 * i - time * 0.18 + uv.x * 2.0) * 0.5 + 0.5;
          energy += wave * 0.25 / i;
        }
        
        // Add flowing lines - thicker and more visible
        float line1 = smoothstep(0.35, 0.5, sin(uv.y * 12.0 + time * 0.35)) * 
                      smoothstep(0.65, 0.5, sin(uv.y * 12.0 + time * 0.35));
        float line2 = smoothstep(0.35, 0.5, sin(uv.x * 10.0 - time * 0.28)) * 
                      smoothstep(0.65, 0.5, sin(uv.x * 10.0 - time * 0.28));
        float line3 = smoothstep(0.4, 0.5, sin((uv.x + uv.y) * 8.0 + time * 0.22)) * 
                      smoothstep(0.6, 0.5, sin((uv.x + uv.y) * 8.0 + time * 0.22));
        
        energy += line1 * 0.15 + line2 * 0.15 + line3 * 0.12;
        
        // Add visible but subtle grid
        float gridX = smoothstep(0.96, 1.0, abs(sin(uv.x * 20.0)));
        float gridY = smoothstep(0.96, 1.0, abs(sin(uv.y * 15.0)));
        float grid = max(gridX, gridY) * 0.08;
        
        energy += grid;
        
        // Softer vignette to show more of the effect
        float vignette = 1.0 - length((uv - center) * 0.9);
        vignette = smoothstep(0.1, 0.8, vignette);
        
        // Choose color based on theme
        vec3 color;
        if (isDark) {
          color = RED * energy * vignette * 0.35;
        } else {
          // Warm coral/peach tones for light mode
          color = WARM_CORAL * energy * vignette * 0.25;
          color += SOFT_PEACH * energy * vignette * 0.15;
        }
        
        // Add soft pulse spots - no glow, just soft circles
        for(float i = 0.0; i < 3.0; i++) {
          vec2 point = vec2(
            0.2 + 0.6 * sin(time * 0.12 + i * 2.1),
            0.25 + 0.5 * cos(time * 0.1 + i * 1.7)
          );
          float dist = length(uv - point);
          float pulse = smoothstep(0.35, 0.0, dist) * 0.15;
          if (isDark) {
            color += RED * pulse * vignette * 0.6;
          } else {
            color += SOFT_PEACH * pulse * vignette * 0.3;
          }
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    
    if (!vertexShader || !fragmentShader) return

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    // Create program
    const program = gl.createProgram()
    if (!program) return
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Create buffer for full-screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'resolution')
    const timeLocation = gl.getUniformLocation(program, 'time')
    const isDarkLocation = gl.getUniformLocation(program, 'isDark')

    // Resize function
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    let lastTime = 0
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime
      timeRef.current += deltaTime
      
      gl.uniform1f(timeLocation, timeRef.current)
      gl.uniform1i(isDarkLocation, isDarkMode ? 1 : 0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(buffer)
    }
  }, [isDarkMode])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: isDarkMode ? 0.85 : 0.35,
        mixBlendMode: isDarkMode ? 'screen' : 'normal'
      }}
    />
  )
}
