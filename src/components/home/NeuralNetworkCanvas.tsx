'use client';

import { useEffect, useRef } from 'react';

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  color: string;
};

const NODE_COUNT = 42;
const MAX_DISTANCE = 200;
const COLORS = ['#63a4ff', '#83eaf1', '#1a6fe0'];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createNode(width: number, height: number): Node {
  return {
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-0.3, 0.3),
    vy: rand(-0.3, 0.3),
    radius: rand(2, 4.5),
    pulse: rand(0, Math.PI * 2),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export default function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes: Node[] = [];
    let animationId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(createNode(clientWidth, clientHeight));
      }
    };

    const render = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020817';
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (pointerRef.current.active) {
          const dx = pointerRef.current.x - node.x;
          const dy = pointerRef.current.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < 140) {
            const force = (140 - dist) / 140;
            node.vx -= (dx / dist) * force * 0.03;
            node.vy -= (dy / dist) * force * 0.03;
          }
        }

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // draw connections
      nodes.forEach((node, index) => {
        for (let j = index + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DISTANCE) {
            const opacity = 1 - dist / MAX_DISTANCE;
            ctx.strokeStyle = `rgba(99, 164, 255, ${opacity})`;
            ctx.lineWidth = opacity * 1.2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      // draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(node.pulse) * 1.5;
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#63a4ff55';
        ctx.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // pointer interaction
      if (pointerRef.current.active) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          pointerRef.current.x,
          pointerRef.current.y,
          0,
          pointerRef.current.x,
          pointerRef.current.y,
          120,
        );
        gradient.addColorStop(0, 'rgba(131, 234, 241, 0.45)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(pointerRef.current.x, pointerRef.current.y, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    resize();
    animationId = requestAnimationFrame(render);

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-[#063970] via-[#06264d] to-[#021325] blur-2xl" />
      <canvas
        ref={canvasRef}
        className="h-[360px] w-full rounded-[28px] border border-primary/40 bg-[#010818] shadow-[0_25px_60px_rgba(4,24,51,0.55)]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/10 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
    </div>
  );
}
