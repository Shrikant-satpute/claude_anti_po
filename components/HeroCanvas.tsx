'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TECH_COLORS, COLORS } from '@/lib/constants';

// Star field — slow rotating particle cloud
function StarField() {
    const ref = useRef<THREE.Points>(null!);

    const sphere = useMemo(() => {
        const points = new Float32Array(300 * 3);
        for (let i = 0; i < 300; i++) {
            const r = 12 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            points[i * 3 + 2] = r * Math.cos(phi);
        }
        return points;
    }, []);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 55;
            ref.current.rotation.y -= delta / 70;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    opacity={0.5}
                    color="#0f172a"
                    size={0.025}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

// Tech labels — floating in 3D space with deep Z-spread
const techLogos = [
    { name: 'Python', color: TECH_COLORS.python },
    { name: 'Claude AI', color: TECH_COLORS.claude },
    { name: '.NET', color: TECH_COLORS.dotNet },
    { name: 'Angular', color: TECH_COLORS.angular },
    { name: 'PostgreSQL', color: TECH_COLORS.postgresql },
    { name: 'Azure', color: TECH_COLORS.azure },
    { name: 'Docker', color: TECH_COLORS.docker },
    { name: 'DevOps', color: TECH_COLORS.devops },
    { name: 'C#', color: TECH_COLORS.csharp },
    { name: 'EF Core', color: TECH_COLORS.dotNet },
    { name: 'REST API', color: COLORS.secondary },
    { name: 'SQL Server', color: TECH_COLORS.postgresql },
    { name: 'Semantic Kernel', color: COLORS.primary },
    { name: 'MCP', color: COLORS.primary },
    { name: 'Git', color: '#F05032' },
];

function FloatingLogos() {
    const groupRef = useRef<THREE.Group>(null!);
    const { mouse, viewport } = useThree();
    // Smooth scroll tracking — lerped inside useFrame so no React re-renders
    const smoothScrollRef = useRef(0);

    const logos = useMemo(() => {
        return techLogos.map((tech) => {
            const x = (Math.random() - 0.5) * viewport.width * 1.6;
            const y = (Math.random() - 0.5) * viewport.height * 1.6;
            // Wide Z spread: -10 (very deep/small) to +3 (close/large)
            const z = -(Math.random() * 13) - 1;
            // Scale font with distance so far labels feel truly deep
            const depthT = Math.abs(z) / 13; // 0 = close, 1 = far
            const fontSize = THREE.MathUtils.lerp(0.55, 0.18, depthT);
            const opacity = THREE.MathUtils.lerp(1.0, 0.35, depthT);

            return { ...tech, initPos: new THREE.Vector3(x, y, z), fontSize, opacity };
        });
    }, [viewport]);

    useFrame((state, delta) => {
        // Lerp scroll for smooth parallax — no jitter
        smoothScrollRef.current = THREE.MathUtils.lerp(
            smoothScrollRef.current,
            window.scrollY,
            delta * 4
        );

        if (!groupRef.current) return;

        const mouseParX = (mouse.x * viewport.width) / 12;
        const mouseParY = (mouse.y * viewport.height) / 12;
        const scrollY = smoothScrollRef.current;

        groupRef.current.children.forEach((child, i) => {
            const logo = logos[i];
            if (!logo) return;

            // Depth-based parallax factors
            const depthAbs = Math.abs(logo.initPos.z);
            const mouseFactor = depthAbs * 0.025;          // farther = less mouse sway
            const scrollFactor = 0.003 / (depthAbs * 0.3 + 1); // farther = slower scroll

            // Gentle up/down float per label (offset by index)
            const floatOffset = Math.sin(state.clock.elapsedTime * 0.4 + i * 0.9) * 0.25;

            // Scroll drives labels downward (negative Y in Three.js)
            const scrollDrift = -scrollY * scrollFactor;

            const targetX = logo.initPos.x + mouseParX * mouseFactor;
            const targetY = logo.initPos.y + mouseParY * mouseFactor + floatOffset + scrollDrift;

            child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, delta * 1.8);
            child.position.y = THREE.MathUtils.lerp(child.position.y, targetY, delta * 1.8);
        });
    });

    return (
        <group ref={groupRef}>
            {logos.map((logo, i) => (
                <group key={i} position={logo.initPos}>
                    {/* Main label */}
                    <Text
                        fontSize={logo.fontSize}
                        color={logo.color}
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
                        fontWeight={700}
                        fillOpacity={logo.opacity}
                    >
                        {logo.name}
                        <meshBasicMaterial color={logo.color} toneMapped={false} />
                    </Text>
                    {/* Glow halo behind the text */}
                    <Text
                        position={[0, 0, -0.05]}
                        fontSize={logo.fontSize * 1.05}
                        color={logo.color}
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
                        fontWeight={700}
                        fillOpacity={logo.opacity * 0.18}
                    >
                        {logo.name}
                        <meshBasicMaterial
                            color={logo.color}
                            toneMapped={false}
                            transparent
                            opacity={0.3}
                            depthWrite={false}
                        />
                    </Text>
                </group>
            ))}
        </group>
    );
}

export default function HeroCanvas() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <Suspense fallback={null}>
                    <StarField />
                    <FloatingLogos />
                </Suspense>
            </Canvas>
            {/* Gradient overlay — blends canvas into page */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background pointer-events-none" />
        </div>
    );
}
