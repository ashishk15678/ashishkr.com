import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SpectralShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffffff") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);

      // The "Ring" thickness
      float mask = smoothstep(0.4, 0.41, dist) * (1.0 - smoothstep(0.44, 0.46, dist));

      // Moving spectrum
      float sweep = fract(angle / 6.2831 + uTime * 0.5);

      // Chromatic Aberration colors
      float r = smoothstep(0.1, 0.0, abs(sweep - 0.1));
      float g = smoothstep(0.1, 0.0, abs(sweep - 0.15));
      float b = smoothstep(0.1, 0.0, abs(sweep - 0.2));

      vec3 spectrum = vec3(r, g, b);

      // Add a strong "white" core to the light for that glare effect
      float glare = smoothstep(0.05, 0.0, abs(sweep - 0.12)) * 1.5;
      vec3 finalColor = spectrum + vec3(glare);

      gl_FragColor = vec4(finalColor * mask, mask * 0.8);
    }
  `,
};

const SpectralRing = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    // @ts-ignore
    meshRef.current.material.uniforms.uTime.value =
      state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        args={[SpectralShaderMaterial]}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default function ShaderMenu() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center bg-[#0a0a0a] rounded-full overflow-hidden shadow-2xl">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <SpectralRing />
        </Canvas>
      </div>
      {/* Icon/Content on top */}
      <div className="z-10 bg-[#151515] w-[80%] h-[80%] rounded-full flex items-center justify-center shadow-inner border border-white/5">
        <svg className="w-8 h-8 text-white fill-white/20" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>
    </div>
  );
}
