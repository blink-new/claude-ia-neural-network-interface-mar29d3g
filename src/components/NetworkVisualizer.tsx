import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const NetworkVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation parameters
    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const layerCount = 5;
    const nodesPerLayer = 8;
    const nodeSize = 4;
    const nodeSpacing = canvas.height / (nodesPerLayer + 1);
    const layerSpacing = canvas.width / (layerCount + 1);

    // Create nodes
    for (let layer = 0; layer < layerCount; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        const x = layerSpacing * (layer + 1);
        const y = nodeSpacing * (i + 1);
        nodes.push({
          x,
          y,
          pulseState: 0,
          pulseDirection: 1,
          pulseSpeed: 0.02 + Math.random() * 0.01,
        });

        // Create connections to previous layer
        if (layer > 0) {
          const prevLayerStart = (layer - 1) * nodesPerLayer;
          const currentNodeIndex = layer * nodesPerLayer + i;
          
          // Connect to 2-3 nodes in previous layer
          const connectionCount = 2 + Math.floor(Math.random() * 2);
          for (let c = 0; c < connectionCount; c++) {
            const targetNodeIndex = prevLayerStart + Math.floor(Math.random() * nodesPerLayer);
            connections.push({
              from: nodes[targetNodeIndex],
              to: nodes[currentNodeIndex],
              pulsePosition: Math.random(),
              pulseDirection: 1,
              pulseSpeed: 0.01 + Math.random() * 0.01,
              active: Math.random() > 0.3,
            });
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      connections.forEach(connection => {
        if (!connection.active) return;
        
        // Base connection line
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.strokeStyle = 'rgba(148, 129, 237, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Pulse along connection
        connection.pulsePosition += connection.pulseDirection * connection.pulseSpeed;
        if (connection.pulsePosition > 1 || connection.pulsePosition < 0) {
          connection.pulseDirection *= -1;
          connection.active = Math.random() > 0.3; // Randomly activate/deactivate
        }
        
        const pulseX = connection.from.x + (connection.to.x - connection.from.x) * connection.pulsePosition;
        const pulseY = connection.from.y + (connection.to.y - connection.from.y) * connection.pulsePosition;
        
        // Draw pulse
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 129, 237, 0.8)';
        ctx.fill();
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Update pulse
        node.pulseState += node.pulseDirection * node.pulseSpeed;
        if (node.pulseState > 1 || node.pulseState < 0) {
          node.pulseDirection *= -1;
        }
        
        // Draw node with pulse effect
        const size = nodeSize * (1 + node.pulseState * 0.5);
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 129, 237, ${0.5 + node.pulseState * 0.5})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <Card className="col-span-12 overflow-hidden bg-black/5 dark:bg-white/5">
      <CardHeader className="border-b bg-background/50 px-5 py-3">
        <CardTitle className="text-sm font-medium">
          Neural Network Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <canvas
          ref={canvasRef}
          className="h-48 w-full"
        />
      </CardContent>
    </Card>
  );
};

// Types
interface Node {
  x: number;
  y: number;
  pulseState: number;
  pulseDirection: number;
  pulseSpeed: number;
}

interface Connection {
  from: Node;
  to: Node;
  pulsePosition: number;
  pulseDirection: number;
  pulseSpeed: number;
  active: boolean;
}

export default NetworkVisualizer;