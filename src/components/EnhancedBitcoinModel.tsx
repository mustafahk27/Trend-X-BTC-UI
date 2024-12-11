'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Trail } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, Group } from 'three';

interface EnhancedBitcoinModelProps {
  isPredicting?: boolean;
}

export function EnhancedBitcoinModel({ isPredicting = false }: EnhancedBitcoinModelProps) {
  const mainRef = useRef<Group>(null);
  const bitcoinGold = '#F7931A';
  const bitcoinTexture = useLoader(TextureLoader, '/BitcoinSign.svg');
  
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { mass: 1, tension: 120, friction: 14 }
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (mainRef.current) {
      mainRef.current.position.y = Math.sin(time * 0.3) * 0.15;
      
      if (isPredicting) {
        mainRef.current.rotation.y += 0.015;
        mainRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      } else {
        mainRef.current.rotation.y += 0.003;
      }
    }
  });

  const commonMaterial = {
    color: bitcoinGold,
    metalness: 0.7,
    roughness: 0.3,
    envMapIntensity: 1.2,
    emissive: bitcoinGold,
    emissiveIntensity: isPredicting ? 0.4 : 0.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
    reflectivity: 0.8
  };

  const darkMaterial = {
    ...commonMaterial,
    color: '#1a1a1a',
    emissive: bitcoinGold,
    emissiveIntensity: isPredicting ? 0.3 : 0.1,
    metalness: 0.9,
    roughness: 0.5
  };

  // Function to create a side of the coin
  const CoinSide = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      {/* Bitcoin Logo */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshPhysicalMaterial 
          map={bitcoinTexture}
          transparent={true}
          color={bitcoinGold}
          emissive={bitcoinGold}
          emissiveIntensity={isPredicting ? 0.6 : 0.3}
          metalness={0.6}
          roughness={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          opacity={0.9}
        />
      </mesh>

      {/* Energy Rings during prediction */}
      {isPredicting && Array.from({ length: 4 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 0, 0.1]} 
          rotation={[0, 0, (Math.PI * 2 / 4) * i]}
        >
          <ringGeometry args={[2.2 + i * 0.2, 2.3 + i * 0.2, 64]} />
          <meshPhysicalMaterial 
            color={bitcoinGold}
            metalness={0.7}
            roughness={0.4}
            emissive={bitcoinGold}
            emissiveIntensity={0.6 - (i * 0.1)}
            transparent
            opacity={0.4 - (i * 0.05)}
          />
        </mesh>
      ))}

      {/* Circular Text */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * 2.7,
              Math.sin(angle) * 2.7,
              0.1
            ]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <boxGeometry args={[0.1, 0.3, 0.05]} />
            <meshPhysicalMaterial {...darkMaterial} />
          </mesh>
        );
      })}
    </group>
  );

  return (
    <animated.group 
      ref={mainRef}
      position={[0, 0, 0]} 
      scale={scale}
    >
      <Float 
        speed={1.5} 
        rotationIntensity={0.2} 
        floatIntensity={0.2}
        floatingRange={[-0.1, 0.1]}
      >
        {/* Main coin body */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[0, 0, 0]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[3, 3, 0.3, 64]} />
          <meshPhysicalMaterial {...darkMaterial} />
        </mesh>

        {/* Front side */}
        <CoinSide position={[0, 0, 0.16]} rotation={[0, 0, 0]} />

        {/* Back side */}
        <CoinSide position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]} />

        {/* Edge details */}
        {Array.from({ length: 120 }).map((_, i) => (
          <mesh 
            key={i} 
            rotation={[0, (i / 120) * Math.PI * 2, 0]} 
            position={[3, 0, 0]}
          >
            <boxGeometry args={[0.05, 0.3, 0.05]} />
            <meshPhysicalMaterial {...darkMaterial} />
          </mesh>
        ))}

        {/* Prediction effects */}
        {isPredicting && (
          <>
            <Sparkles
              count={50}
              scale={6}
              size={1}
              speed={0.5}
              opacity={0.3}
              color={bitcoinGold}
              noise={0.1}
            />
            
            <Sparkles
              count={100}
              scale={10}
              size={2}
              speed={1}
              opacity={0.2}
              color={bitcoinGold}
              noise={0.2}
            />

            <Trail
              width={0.5}
              length={8}
              color={new THREE.Color(bitcoinGold)}
              attenuation={(t) => t * t}
            >
              <mesh position={[3.5, 0, 0]}>
                <sphereGeometry args={[0.1]} />
                <meshBasicMaterial color={bitcoinGold} />
              </mesh>
            </Trail>

            <pointLight
              position={[0, 0, 3]}
              intensity={1.5}
              color={bitcoinGold}
              distance={8}
              decay={2}
            />
          </>
        )}
      </Float>
    </animated.group>
  );
} 