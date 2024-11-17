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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<Group, typeof Group>
      mesh: Object3DNode<Mesh, typeof Mesh>
      spotLight: Object3DNode<SpotLight, typeof SpotLight>
      pointLight: Object3DNode<PointLight, typeof PointLight>
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>
      primitive: Object3DNode<Object3D, any>
      sphereGeometry: Object3DNode<BufferGeometry, any>
      boxGeometry: Object3DNode<BufferGeometry, any>
      cylinderGeometry: Object3DNode<BufferGeometry, any>
      ringGeometry: Object3DNode<BufferGeometry, any>
      planeGeometry: Object3DNode<BufferGeometry, any>
      meshBasicMaterial: Object3DNode<Material, any>
      meshStandardMaterial: Object3DNode<Material, any>
      meshPhysicalMaterial: Object3DNode<Material, any>
      points: Object3DNode<Object3D, any>
      pointMaterial: Object3DNode<Material, any>
      // Add React Three Fiber components
      'pointLight': any
      'ambientLight': any
      'spotLight': any
      'mesh': any
      'primitive': any
      'points': any
      'Canvas': any
      'OrbitControls': any
      'Sparkles': any
      'Float': any
      'Environment': any
      'EffectComposer': any
      'Bloom': any
      'ChromaticAberration': any
      'Suspense': any
    }
  }
} 