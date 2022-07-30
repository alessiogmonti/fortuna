import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Loader, useFBO, Stage, Effects, Environment, OrbitControls } from '@react-three/drei'
import Model from './FortunaDraco'
import { FXAAShader } from 'three-stdlib'
import { AdditiveBlendingShader } from './shaders/AdditiveBlendingShader'
import { VolumetricLightShader } from './shaders/VolumetricLightShader'
import './App.css'

const DEFAULT_LAYER = 0
const OCCLUSION_LAYER = 1

// function Elf({ layer = DEFAULT_LAYER }) {
//   const group = useRef()
//   const { nodes } = useGLTF('/scene.glb')
//   const material = useMemo(() => {
//     if (layer === DEFAULT_LAYER) return new THREE.MeshStandardMaterial({ color: new THREE.Color('#2a2a2a'), roughness: 1, metalness: 0.9 })
//     else return new THREE.MeshBasicMaterial({ color: new THREE.Color('black') })
//   }, [layer])

//   useFrame(() => (group.current.rotation.y += 0.004))

//   return (
//     <group ref={group} dispose={null}>
//       <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
//         <mesh geometry={nodes.mesh_0.geometry} material={material} layers={layer} receiveShadow castShadow />
//         <mesh geometry={nodes.mesh_1.geometry} material={material} layers={layer} receiveShadow castShadow />
//         <mesh geometry={nodes.mesh_2.geometry} material={material} layers={layer} receiveShadow castShadow />
//       </group>
//     </group>
//   )
// }

function Post() {
  const { gl, camera, size } = useThree()
  const occlusionRenderTarget = useFBO()
  const occlusionComposer = useRef()
  const composer = useRef()
  useFrame(() => {
    camera.layers.set(OCCLUSION_LAYER)
    occlusionComposer.current.render()
    camera.layers.set(DEFAULT_LAYER)
    composer.current.render()
  }, 1)
  return (
    <>
      {/* <mesh layers={OCCLUSION_LAYER} position={[1, 12, -20]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial />
      </mesh> */}
      <Effects ref={occlusionComposer} disableGamma disableRender args={[gl, occlusionRenderTarget]} renderToScreen={false}>
        <shaderPass args={[VolumetricLightShader]} needsSwap={false} />
      </Effects>
      <Effects ref={composer} disableRender>
        <shaderPass args={[AdditiveBlendingShader]} uniforms-tAdd-value={occlusionRenderTarget.texture} />
        <shaderPass args={[FXAAShader]} uniforms-resolution-value={[1 / size.width, 1 / size.height]} renderToScreen />
      </Effects>
    </>
  )
}

export default function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 0], fov: 55, near: 0.1, far: 2000 }} gl={{ antialias: true }} onCreated={state => state.gl.setClearColor( 0xffffff, 0)}>
        {/* <color attach="background" args={['black']} /> */}
        <Suspense fallback={null}>    
          <Stage intensity={1}>
            <Model layer = {DEFAULT_LAYER} position={[0,0,0]} scale={0.01}/>
            <Model layer = {OCCLUSION_LAYER} position={[0,0,0]} scale={0.01} />
          </Stage>
          <Post />
        </Suspense>
        <OrbitControls target={Model.position} zoomSpeed={0.5} autoRotate autoRotateSpeed={0.4} rotateSpeed={2} dampingFactor={0.5} minPolarAngle={-Math.PI / 2} maxPolarAngle={Math.PI / 1.7} makeDefault />
      </Canvas>
      <Loader />
    </>
  )
}

