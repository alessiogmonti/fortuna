/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import {useRef, useMemo} from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DEFAULT_LAYER = 0;

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes } = useGLTF('./fortunaDraco.gltf')
  useFrame(() => (
    group.current.rotation.y += 0.006
  ))
  return (
    <group ref={group} {...props}>
        <mesh geometry={nodes.Node.geometry} layers={props.layer} receiveShadow castShadow>
          {props.layer === DEFAULT_LAYER
            ? <meshStandardMaterial color={new THREE.Color('rgba(82,99,125,1)')} roughness={0.2} metalness={0.9} />
            : <meshBasicMaterial color={new THREE.Color('rgba(52,95,75,1)')} />
          }
        </mesh>
    </group>
  )
}

useGLTF.preload('./fortunaDraco.gltf')
