'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
}

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Initialize nodes and connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Create nodes in layers
    const layers = [5, 7, 7, 5]; // Input, hidden1, hidden2, output
    const newNodes: Node[] = [];
    const layerSpacing = width / (layers.length + 1);

    layers.forEach((nodeCount, layerIndex) => {
      const nodeSpacing = height / (nodeCount + 1);
      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          x: layerSpacing * (layerIndex + 1),
          y: nodeSpacing * (i + 1),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 4 + Math.random() * 3,
        });
      }
    });

    // Create connections between adjacent layers
    const newConnections: Connection[] = [];
    let nodeIndex = 0;
    for (let layer = 0; layer < layers.length - 1; layer++) {
      const currentLayerSize = layers[layer];
      const nextLayerSize = layers[layer + 1];
      const currentLayerStart = nodeIndex;
      const nextLayerStart = nodeIndex + currentLayerSize;

      for (let i = 0; i < currentLayerSize; i++) {
        for (let j = 0; j < nextLayerSize; j++) {
          newConnections.push({
            from: currentLayerStart + i,
            to: nextLayerStart + j,
            strength: Math.random(),
          });
        }
      }
      nodeIndex += currentLayerSize;
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Set canvas resolution
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Update and draw connections
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];

        // Pulsing effect
        const pulse = Math.sin(time + conn.strength * Math.PI * 2) * 0.5 + 0.5;
        const distance = Math.hypot(
          mousePos.current.x - (fromNode.x + toNode.x) / 2,
          mousePos.current.y - (fromNode.y + toNode.y) / 2
        );
        const proximityEffect = Math.max(0, 1 - distance / 200);

        const alpha = (0.1 + pulse * 0.2 + proximityEffect * 0.3) * conn.strength;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue color
        ctx.lineWidth = 1 + proximityEffect * 2;
        ctx.stroke();
      });

      // Update and draw nodes
      nodes.forEach((node, index) => {
        // Floating animation
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        const padding = 50;
        if (node.x < padding || node.x > width - padding) node.vx *= -1;
        if (node.y < padding || node.y > height - padding) node.vy *= -1;

        // Mouse interaction
        const dx = mousePos.current.x - node.x;
        const dy = mousePos.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          node.x -= (dx / distance) * force * 2;
          node.y -= (dy / distance) * force * 2;
        }

        // Pulsing glow effect
        const pulse = Math.sin(time * 2 + index * 0.5) * 0.5 + 0.5;
        const proximityGlow = Math.max(0, 1 - distance / 150);

        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * (3 + proximityGlow * 2)
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.6 + proximityGlow * 0.4})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.2 + pulse * 0.2})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (3 + proximityGlow * 2), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${0.8 + pulse * 0.2 + proximityGlow * 0.2})`;
        ctx.fill();

        // Core highlight
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(191, 219, 254, ${0.9 + pulse * 0.1})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, connections]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 shadow-xl">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full w-full cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}
