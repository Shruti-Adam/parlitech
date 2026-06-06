import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Html, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';

const Seat = ({ position, party, isSpeaking, voteStatus, mp, onHover, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const getColor = () => {
    if (isSpeaking) return '#3b82f6';
    if (voteStatus === 'for') return '#10b981';
    if (voteStatus === 'against') return '#ef4444';
    if (voteStatus === 'abstain') return '#f59e0b';
    
    switch(party) {
      case 'BJP': return '#FF9933';
      case 'INC': return '#0066FF';
      case 'DMK': return '#FF0000';
      case 'AITC': return '#00FF00';
      default: return '#6b7280';
    }
  };

  useFrame((state) => {
    if (meshRef.current && isSpeaking) {
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.35, 0.3, 0.35]}
        position={[0, 0.15, 0]}
        onPointerOver={() => {
          setHovered(true);
          onHover?.(mp);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick?.(mp)}
      >
        <meshStandardMaterial 
          color={getColor()} 
          emissive={isSpeaking ? '#3b82f6' : hovered ? '#6366f1' : '#000'} 
          emissiveIntensity={isSpeaking ? 0.5 : hovered ? 0.3 : 0}
        />
      </Box>
      {hovered && mp && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs z-50 shadow-xl min-w-[120px]">
            <div className="font-bold text-white text-xs">{mp.name}</div>
            <div className="text-gray-400 text-xs">{mp.party}</div>
            <div className="text-gray-500 text-[10px]">{mp.role}</div>
            <div className="flex justify-between mt-1 text-[10px]">
              <span>INF: {mp.influence_score}</span>
              <span className="text-primary-400">SEN: {mp.sentiment_score}%</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const Parliament3D = ({ activeSpeaker, votingResults, mpsData, onMPClick }) => {
  const controlsRef = useRef();
  const [seats, setSeats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Generate 245 seats in semi-circular arrangement
    const generatedSeats = [];
    const rows = 14;
    const seatsPerRow = [16, 18, 20, 22, 24, 26, 28, 26, 24, 22, 20, 18, 16, 14];
    
    let seatIndex = 0;
    const centerX = 0;
    const centerZ = isMobile ? -6 : -8;
    
    for (let row = 0; row < rows; row++) {
      const radius = (isMobile ? 3 : 4) + row * (isMobile ? 0.4 : 0.55);
      const angleStep = Math.PI * 0.7 / seatsPerRow[row];
      const startAngle = -Math.PI * 0.35;
      
      for (let s = 0; s < seatsPerRow[row]; s++) {
        const angle = startAngle + s * angleStep;
        const x = Math.cos(angle) * radius + centerX;
        const z = Math.sin(angle) * radius + centerZ;
        
        let party = 'Others';
        if (seatIndex < 240) party = 'BJP';
        else if (seatIndex < 339) party = 'INC';
        else if (seatIndex < 363) party = 'DMK';
        else if (seatIndex < 392) party = 'AITC';
        
        generatedSeats.push({
          id: seatIndex,
          position: [x, 0, z],
          party: party,
          isSpeaking: activeSpeaker?.party === party,
          voteStatus: votingResults?.party_breakdown?.[party]?.voteStatus,
          mp: mpsData?.[seatIndex] || { 
            name: `MP ${seatIndex + 1}`, 
            party, 
            role: 'Member of Parliament',
            influence_score: 50,
            sentiment_score: 0
          }
        });
        seatIndex++;
      }
    }
    setSeats(generatedSeats);
  }, [activeSpeaker, votingResults, mpsData, isMobile]);

  // Auto-zoom to active speaker
  useEffect(() => {
    if (activeSpeaker && controlsRef.current) {
      const activeSeat = seats.find(s => s.party === activeSpeaker.party);
      if (activeSeat) {
        // Smooth camera transition
        controlsRef.current.target.set(activeSeat.position[0], 0, activeSeat.position[2]);
      }
    }
  }, [activeSpeaker, seats]);

  const cameraPosition = isMobile ? [0, 3, 10] : [0, 5, 15];
  const cameraFov = isMobile ? 60 : 45;

  return (
    <div className="chamber-container relative">
      <Canvas camera={{ position: cameraPosition, fov: cameraFov }} shadows>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 10, 5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />
        
        {/* Floor */}
        <Box args={[isMobile ? 20 : 28, 0.1, isMobile ? 15 : 20]} position={[0, -0.5, -8]} receiveShadow>
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} metalness={0.1} />
        </Box>
        
        {/* Central Aisle */}
        <Box args={[1.2, 0.12, isMobile ? 12 : 16]} position={[0, -0.45, -8]}>
          <meshStandardMaterial color="#2d2d44" />
        </Box>
        
        {/* Speaker's Podium */}
        <group position={[0, -0.2, isMobile ? -12 : -15]}>
          <Box args={[isMobile ? 2 : 2.5, isMobile ? 1 : 1.2, isMobile ? 1.6 : 2]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#5c3d2e" />
          </Box>
          <Box args={[isMobile ? 2.2 : 2.8, 0.15, isMobile ? 1.8 : 2.3]} position={[0, 1.1, 0]}>
            <meshStandardMaterial color="#6b4c3b" />
          </Box>
          <Text position={[0, 1.5, 0]} fontSize={isMobile ? 0.25 : 0.35} color="#FFD700" anchorX="center">
            SPEAKER
          </Text>
        </group>
        
        {/* Government Benches Label */}
        <group position={[isMobile ? -4 : -6, 0.5, isMobile ? -10 : -12]}>
          <Box args={[isMobile ? 2 : 3, 0.05, 0.6]}>
            <meshStandardMaterial color="#2c5282" />
          </Box>
          <Text position={[0, 0.25, 0]} fontSize={isMobile ? 0.15 : 0.2} color="#90cdf4" anchorX="center">
            GOVERNMENT
          </Text>
        </group>
        
        {/* Opposition Benches Label */}
        <group position={[isMobile ? 4 : 6, 0.5, isMobile ? -10 : -12]}>
          <Box args={[isMobile ? 2 : 3, 0.05, 0.6]}>
            <meshStandardMaterial color="#742a2a" />
          </Box>
          <Text position={[0, 0.25, 0]} fontSize={isMobile ? 0.15 : 0.2} color="#feb2b2" anchorX="center">
            OPPOSITION
          </Text>
        </group>
        
        {/* All Seats */}
        {seats.map((seat) => (
          <Seat
            key={seat.id}
            position={seat.position}
            party={seat.party}
            isSpeaking={seat.isSpeaking}
            voteStatus={seat.voteStatus}
            mp={seat.mp}
            onHover={(mp) => console.log('Hover:', mp.name)}
            onClick={(mp) => onMPClick?.(mp)}
          />
        ))}
        
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableTouchRotate={true}
          pinchSpeed={1}
          zoomSpeed={1}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={isMobile ? 5 : 8}
          maxDistance={isMobile ? 15 : 25}
          target={[0, 0, isMobile ? -6 : -10]}
        />
      </Canvas>
      
      {/* Voting Results Overlay */}
      {votingResults && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl"
        >
          <div className="text-xs text-gray-500 mb-2">VOTING RESULTS</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-success">FOR</span>
              <span className="font-mono text-white">{votingResults.votes?.for || 0}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-error">AGAINST</span>
              <span className="font-mono text-white">{votingResults.votes?.against || 0}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-warning">ABSTAIN</span>
              <span className="font-mono text-white">{votingResults.votes?.abstain || 0}</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-800">
            <div className={`text-center font-bold text-sm ${votingResults.status === 'PASSED' ? 'text-success' : 'text-error'}`}>
              {votingResults.status || 'PENDING'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Parliament3D;