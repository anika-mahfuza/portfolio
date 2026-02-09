"use client"

import { useEffect, useRef } from 'react'

export function SkillsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

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

    // Fragment shader - Energy Matrix effect
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec2 resolution;
      uniform float time;
      
      #define PI 3.14159265359
      #define RED vec3(0.902, 0.224, 0.275)
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 center = vec2(0.5, 0.5);
        
        // Create flowing energy effect
        float energy = 0.0;
        
        // Multiple wave layers
        for(float i = 1.0; i <= 4.0; i++) {
          float wave = sin(uv.x * 8.0 * i + time * 0.3 + uv.y * 4.0) * 0.5 + 0.5;
          wave *= sin(uv.y * 6.0 * i - time * 0.2) * 0.5 + 0.5;
          energy += wave * 0.15 / i;
        }
        
        // Add flowing lines
        float line1 = smoothstep(0.48, 0.5, sin(uv.y * 20.0 + time * 0.4)) * 
                      smoothstep(0.5, 0.52, sin(uv.y * 20.0 + time * 0.4));
        float line2 = smoothstep(0.48, 0.5, sin(uv.x * 15.0 - time * 0.3)) * 
                      smoothstep(0.5, 0.52, sin(uv.x * 15.0 - time * 0.3));
        
        energy += line1 * 0.1 + line2 * 0.1;
        
        // Add subtle grid
        float gridX = smoothstep(0.98, 1.0, abs(sin(uv.x * 30.0)));
        float gridY = smoothstep(0.98, 1.0, abs(sin(uv.y * 20.0)));
        float grid = max(gridX, gridY) * 0.03;
        
        energy += grid;
        
        // Vignette to keep focus on center
        float vignette = 1.0 - length((uv - center) * 1.2);
        vignette = smoothstep(0.0, 0.7, vignette);
        
        // Combine
        vec3 color = RED * energy * vignette * 0.15;
        
        // Add subtle glow spots
        for(float i = 0.0; i < 3.0; i++) {
          vec2 point = vec2(
            0.2 + 0.6 * sin(time * 0.15 + i * 2.0),
            0.3 + 0.4 * cos(time * 0.12 + i * 1.5)
          );
          float dist = length(uv - point);
          float glow = smoothstep(0.3, 0.0, dist) * 0.08;
          color += RED * glow * vignette;
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.6,
        mixBlendMode: 'screen'
      }}
    />
  )
}
