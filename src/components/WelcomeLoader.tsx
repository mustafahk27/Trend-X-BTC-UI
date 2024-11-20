import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Sparkles } from "@react-three/drei";

function LoadingBitcoin() {
  return (
    <mesh>
      <cylinderGeometry args={[2, 2, 0.2, 32]} />
      <meshPhysicalMaterial
        color="#F7931A"
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#F7931A"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function WelcomeLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.3}
              penumbra={1}
              intensity={1.5}
              color="#F7931A"
              castShadow
            />
            <LoadingBitcoin />
            <Sparkles
              count={50}
              scale={10}
              size={4}
              speed={0.5}
              opacity={0.5}
              color="#F7931A"
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center"
        >
          <motion.h2 
            className="text-4xl font-bold text-white mb-8"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            Welcome to <span className="text-[#F7931A]">TREND-X-BTC</span>
          </motion.h2>

          {/* Loading Progress */}
          <div className="relative w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#F7931A]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
            />
          </div>

          {/* Loading Steps */}
          <div className="mt-8 space-y-2 text-center">
            {[
              "Initializing 3D Environment",
              "Loading Bitcoin Model",
              "Preparing Animations"
            ].map((step, index) => (
              <motion.p
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-sm text-gray-400"
              >
                {step}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
