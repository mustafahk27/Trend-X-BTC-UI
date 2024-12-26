import { Object3DNode } from '@react-three/fiber'
import { 
  Group, 
  Mesh, 
  SpotLight, 
  PointLight, 
  AmbientLight,
  BufferGeometry,
  Material,
  Object3D
} from 'three'
import { 
  OrbitControls as OrbitControlsImpl,
  Sparkles as SparklesImpl,
  Float as FloatImpl,
  Environment as EnvironmentImpl
} from '@react-three/drei'
import { 
  EffectComposer as EffectComposerImpl,
  Bloom as BloomImpl,
  ChromaticAberration as ChromaticAberrationImpl
} from '@react-three/postprocessing'
import { Canvas as CanvasImpl } from '@react-three/fiber'
import { Suspense as SuspenseImpl } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<Group, typeof Group>
      mesh: Object3DNode<Mesh, typeof Mesh>
      spotLight: Object3DNode<SpotLight, typeof SpotLight>
      pointLight: Object3DNode<PointLight, typeof PointLight>
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>
      primitive: Object3DNode<Object3D, typeof Object3D>
      sphereGeometry: Object3DNode<BufferGeometry, typeof BufferGeometry>
      boxGeometry: Object3DNode<BufferGeometry, typeof BufferGeometry>
      cylinderGeometry: Object3DNode<BufferGeometry, typeof BufferGeometry>
      ringGeometry: Object3DNode<BufferGeometry, typeof BufferGeometry>
      planeGeometry: Object3DNode<BufferGeometry, typeof BufferGeometry>
      meshBasicMaterial: Object3DNode<Material, typeof Material>
      meshStandardMaterial: Object3DNode<Material, typeof Material>
      meshPhysicalMaterial: Object3DNode<Material, typeof Material>
      points: Object3DNode<Object3D, typeof Object3D>
      pointMaterial: Object3DNode<Material, typeof Material>
      // React Three Fiber components
      'Canvas': typeof CanvasImpl
      'OrbitControls': typeof OrbitControlsImpl
      'Sparkles': typeof SparklesImpl
      'Float': typeof FloatImpl
      'Environment': typeof EnvironmentImpl
      'EffectComposer': typeof EffectComposerImpl
      'Bloom': typeof BloomImpl
      'ChromaticAberration': typeof ChromaticAberrationImpl
      'Suspense': typeof SuspenseImpl
    }
  }
} 

declare module '@react-three/fiber' {
  interface ThreeElements {
    planeGeometry: JSX.IntrinsicElements['planeGeometry'] & {
      args?: [width?: number, height?: number, widthSegments?: number, heightSegments?: number]
    }
    ringGeometry: JSX.IntrinsicElements['ringGeometry'] & {
      args?: [innerRadius?: number, outerRadius?: number, thetaSegments?: number]
    }
    boxGeometry: JSX.IntrinsicElements['boxGeometry'] & {
      args?: [width?: number, height?: number, depth?: number]
    }
    cylinderGeometry: JSX.IntrinsicElements['cylinderGeometry'] & {
      args?: [radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number]
    }
  }
} 