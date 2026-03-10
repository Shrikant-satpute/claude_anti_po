'use client';

import { useEffect, useRef, useState } from 'react';
import { SKILLS_CONSTELLATION } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

// Bootstrap Icons class per skill id
const SKILL_ICONS: Record<string, string> = {
    dotnet:    'bi-microsoft',
    csharp:    'bi-code-slash',
    aspnet:    'bi-server',
    webapi:    'bi-cloud-upload',
    efcore:    'bi-database',
    sk:        'bi-cpu',
    postgres:  'bi-database-fill',
    sqlserver: 'bi-hdd-network',
    adonet:    'bi-database-dash',
    linq:      'bi-filter-circle',
    angular:   'bi-triangle-fill',
    ts:        'bi-filetype-tsx',
    html:      'bi-filetype-html',
    css:       'bi-filetype-css',
    bootstrap: 'bi-bootstrap',
    jquery:    'bi-filetype-js',
    openai:    'bi-robot',
    azure:     'bi-cloud-fill',
    docker:    'bi-box-seam',
    devops:    'bi-git',
    claude:    'bi-cpu-fill',
    mcp:       'bi-plugin',
    git:       'bi-git',
    vscode:    'bi-code-square',
    postman:   'bi-send-fill',
    pgadmin:   'bi-database-check',
};

const GROUP_LABELS: Record<string, string> = {
    backend:    'Backend',
    database:   'Database',
    frontend:   'Frontend',
    'cloud-ai': 'Cloud & AI',
    tools:      'Tools',
};

const PROFICIENCY: Record<string, number> = {
    backend: 90, database: 90, frontend: 78, 'cloud-ai': 82, tools: 85,
};

type SkillNode = typeof SKILLS_CONSTELLATION[0] & {
    x: number; y: number; vx: number; vy: number; radius: number;
};

const MAX_SPEED = 1.1;
const RESTITUTION = 0.92;

function getRadius(label: string): number {
    const approx = label.length * 6.5;
    return Math.max(30, Math.min(54, approx / 2 + 14));
}

function clampSpeed(node: SkillNode) {
    const speed = Math.hypot(node.vx, node.vy);
    if (speed > MAX_SPEED) {
        node.vx = (node.vx / speed) * MAX_SPEED;
        node.vy = (node.vy / speed) * MAX_SPEED;
    }
    const minSpeed = 0.25;
    if (speed < minSpeed && speed > 0) {
        node.vx = (node.vx / speed) * minSpeed;
        node.vy = (node.vy / speed) * minSpeed;
    }
}

export default function SkillsConstellation() {
    const canvasRef    = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef     = useRef<SkillNode[]>([]);
    const hoveredIdRef   = useRef<string | null>(null);
    const iconImagesRef  = useRef<Record<string, HTMLImageElement>>({});

    const [hoveredSkill, setHoveredSkill] = useState<{
        id: string; label: string; group: string; color: string;
        mouseX: number; mouseY: number; canvasW: number;
    } | null>(null);

    const [marqueeHovered, setMarqueeHovered] = useState(false);

    // Preload Bootstrap Icon SVGs colored white for canvas drawing
    useEffect(() => {
        const CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons';
        Object.entries(SKILL_ICONS).forEach(([skillId, biClass]) => {
            const iconName = biClass.replace('bi-', '');
            fetch(`${CDN}/${iconName}.svg`)
                .then(r => r.text())
                .then(svg => {
                    // Replace currentColor with white so it's visible on dark bubbles
                    const colored = svg.replace(/currentColor/g, '#ffffff');
                    const blob = new Blob([colored], { type: 'image/svg+xml' });
                    const url  = URL.createObjectURL(blob);
                    const img  = new Image();
                    img.onload = () => { iconImagesRef.current[skillId] = img; };
                    img.src = url;
                })
                .catch(() => { /* silently skip if icon not found */ });
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const initNodes = () => {
            const w = canvas.width;
            const h = canvas.height;
            nodesRef.current = SKILLS_CONSTELLATION.map((skill) => {
                const radius = getRadius(skill.label);
                const angle  = Math.random() * Math.PI * 2;
                const speed  = 0.35 + Math.random() * 0.75;
                return {
                    ...skill,
                    x: radius + Math.random() * (w - 2 * radius),
                    y: radius + Math.random() * (h - 2 * radius),
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius,
                };
            });
        };

        const resizeCanvas = () => {
            const container = containerRef.current;
            if (!container) return;
            canvas.width  = container.clientWidth;
            canvas.height = Math.max(560, Math.min(720, window.innerHeight * 0.78));
            initNodes();
        };

        const updatePhysics = () => {
            const nodes = nodesRef.current;
            const w = canvas.width;
            const h = canvas.height;

            for (const node of nodes) {
                if (node.id === hoveredIdRef.current) continue; // freeze hovered node
                node.x += node.vx;
                node.y += node.vy;
                if (node.x - node.radius < 0)  { node.x = node.radius;      node.vx =  Math.abs(node.vx); }
                if (node.x + node.radius > w)   { node.x = w - node.radius;  node.vx = -Math.abs(node.vx); }
                if (node.y - node.radius < 0)   { node.y = node.radius;      node.vy =  Math.abs(node.vy); }
                if (node.y + node.radius > h)   { node.y = h - node.radius;  node.vy = -Math.abs(node.vy); }
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distSq  = dx * dx + dy * dy;
                    const minDist = a.radius + b.radius;
                    if (distSq >= minDist * minDist) continue;
                    const dist = Math.sqrt(distSq);
                    if (dist === 0) continue;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const dvDotN = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                    if (dvDotN > 0) {
                        const impulse = dvDotN * (1 + RESTITUTION) * 0.5;
                        if (a.id !== hoveredIdRef.current) { a.vx -= impulse * nx; a.vy -= impulse * ny; clampSpeed(a); }
                        if (b.id !== hoveredIdRef.current) { b.vx += impulse * nx; b.vy += impulse * ny; clampSpeed(b); }
                    }
                    const overlap = (minDist - dist) * 0.5 + 0.5;
                    if (a.id !== hoveredIdRef.current) { a.x -= nx * overlap; a.y -= ny * overlap; }
                    if (b.id !== hoveredIdRef.current) { b.x += nx * overlap; b.y += ny * overlap; }
                }
            }
        };

        const drawConnections = (nodes: SkillNode[]) => {
            const GAP = 110;
            const now = Date.now();
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const n1 = nodes[i];
                    const n2 = nodes[j];
                    const dist     = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                    const edgeDist = dist - n1.radius - n2.radius;
                    if (edgeDist > GAP || edgeDist < 0) continue;
                    const t     = 1 - edgeDist / GAP;
                    const pulse = Math.sin(now * 0.002 + i + j) * 0.3 + 0.7;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108,99,255,${t * 0.35 * pulse})`;
                    ctx.lineWidth   = 1;
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }
        };

        const drawNodes = (nodes: SkillNode[]) => {
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            for (const node of nodes) {
                const { x, y, color, label, id } = node;
                const isHovered = id === hoveredIdRef.current;
                const r = isHovered ? node.radius * 1.18 : node.radius;

                // Glow aura
                const glow = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 2.5);
                glow.addColorStop(0, color + (isHovered ? '50' : '28'));
                glow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Bubble body
                const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, 0, x, y, r);
                body.addColorStop(0, color + (isHovered ? '90' : '55'));
                body.addColorStop(0.7, color + (isHovered ? '40' : '20'));
                body.addColorStop(1,   color + (isHovered ? '18' : '08'));
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = body;
                ctx.fill();

                // Border
                ctx.strokeStyle = color + (isHovered ? 'FF' : 'BB');
                ctx.lineWidth   = isHovered ? 2 : 1.5;
                ctx.stroke();

                // Specular
                ctx.beginPath();
                ctx.arc(x - r * 0.28, y - r * 0.28, r * 0.22, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                ctx.fill();

                // Icon + Label
                const iconImg  = iconImagesRef.current[id];
                const iconSize = Math.min(r * 0.55, 20);
                const hasIcon  = !!iconImg;

                // Vertical layout: icon in upper half, label in lower half
                const iconCY  = hasIcon ? y - r * 0.2  : y;
                const labelCY = hasIcon ? y + r * 0.32 : y;

                if (hasIcon) {
                    ctx.globalAlpha = isHovered ? 1 : 0.9;
                    ctx.drawImage(iconImg, x - iconSize / 2, iconCY - iconSize / 2, iconSize, iconSize);
                    ctx.globalAlpha = 1;
                }

                ctx.font        = `bold ${isHovered ? 11 : 10}px Inter,sans-serif`;
                ctx.shadowColor = color;
                ctx.shadowBlur  = isHovered ? 18 : 8;
                ctx.fillStyle   = '#ffffff';
                ctx.fillText(label, x, labelCY);
                ctx.shadowBlur  = 0;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updatePhysics();
            drawConnections(nodesRef.current);
            drawNodes(nodesRef.current);
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect   = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let found: SkillNode | null = null;
            for (const node of nodesRef.current) {
                if (Math.hypot(mouseX - node.x, mouseY - node.y) < node.radius) {
                    found = node;
                    break;
                }
            }
            hoveredIdRef.current = found ? found.id : null;
            setHoveredSkill(found
                ? { id: found.id, label: found.label, group: found.group, color: found.color, mouseX, mouseY, canvasW: canvas.width }
                : null
            );
        };

        const handleMouseLeave = () => {
            hoveredIdRef.current = null;
            setHoveredSkill(null);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="py-20 relative overflow-hidden" style={{ background: '#050508' }}>

            {/* Dot grid on black */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Header */}
            <div className="container mx-auto px-4 relative z-10 text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
                    <span className="text-white">Skills &amp; </span>
                    <span style={{ color: '#ff781e' }}>Expertise</span>
                </h2>
                <div
                    className="w-24 h-1 mx-auto rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6C63FF, #ff781e)' }}
                />
            </div>

            {/* Canvas — full width, no max-w constraint */}
            <div ref={containerRef} className="w-full relative cursor-crosshair">
                <canvas ref={canvasRef} className="w-full block" />

                {/* Hover detail card */}
                <AnimatePresence>
                    {hoveredSkill && (() => {
                        const flipX = hoveredSkill.mouseX > hoveredSkill.canvasW - 240;
                        const pct   = PROFICIENCY[hoveredSkill.group] ?? 80;
                        return (
                            <motion.div
                                key={hoveredSkill.id}
                                initial={{ opacity: 0, scale: 0.88, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.88, y: 8 }}
                                transition={{ duration: 0.16 }}
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    left:    flipX ? hoveredSkill.mouseX - 230 : hoveredSkill.mouseX + 18,
                                    top:     hoveredSkill.mouseY - 20,
                                    width:   '220px',
                                    background:    'rgba(8,8,18,0.95)',
                                    border:  `1px solid ${hoveredSkill.color}55`,
                                    borderRadius:  '14px',
                                    padding: '14px 16px',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${hoveredSkill.color}20`,
                                }}
                            >
                                {/* Top accent line */}
                                <div
                                    className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
                                    style={{ background: hoveredSkill.color }}
                                />

                                {/* Icon + Name */}
                                <div className="flex items-center gap-2.5 mt-2 mb-2">
                                    <i
                                        className={`bi ${SKILL_ICONS[hoveredSkill.id] ?? 'bi-code-slash'}`}
                                        style={{ color: hoveredSkill.color, fontSize: '20px' }}
                                    />
                                    <h4 className="font-bold text-base font-space text-white leading-tight">
                                        {hoveredSkill.label}
                                    </h4>
                                </div>

                                {/* Group */}
                                <p
                                    className="text-xs mb-3 pb-2 border-b capitalize"
                                    style={{ color: `${hoveredSkill.color}CC`, borderColor: `${hoveredSkill.color}30` }}
                                >
                                    {GROUP_LABELS[hoveredSkill.group] ?? hoveredSkill.group}
                                </p>

                                {/* Proficiency bar */}
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Proficiency</span>
                                    <span className="text-xs font-bold" style={{ color: hoveredSkill.color }}>{pct}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <div
                                        className="h-1.5 rounded-full transition-all"
                                        style={{
                                            width: `${pct}%`,
                                            background: hoveredSkill.color,
                                            boxShadow: `0 0 8px ${hoveredSkill.color}`,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </div>

            {/* Scrolling pill marquee — pauses on hover */}
            <div
                className="mt-10 w-full overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                }}
                onMouseEnter={() => setMarqueeHovered(true)}
                onMouseLeave={() => setMarqueeHovered(false)}
            >
                <div
                    className="flex gap-3 w-max"
                    style={{
                        animation: 'marquee-scroll 35s linear infinite',
                        animationPlayState: marqueeHovered ? 'paused' : 'running',
                    }}
                >
                    {[...SKILLS_CONSTELLATION, ...SKILLS_CONSTELLATION].map((skill, i) => (
                        <div
                            key={`${skill.id}-${i}`}
                            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
                            style={{
                                background:    'rgba(255,255,255,0.04)',
                                border:        `1px solid ${skill.color}45`,
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <i
                                className={`bi ${SKILL_ICONS[skill.id] ?? 'bi-code'}`}
                                style={{ color: skill.color, fontSize: '14px' }}
                            />
                            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{skill.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
