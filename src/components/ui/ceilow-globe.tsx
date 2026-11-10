"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface GlobeProps {
  className?: string;
}

interface SpherePoint {
  lat: number;
  lon: number;
  isHighlight?: boolean;
}

const COTONOU_LAT = (6.37 * Math.PI) / 180;
const COTONOU_LON = (2.39 * Math.PI) / 180;

function generateGlobePoints(): SpherePoint[] {
  const points: SpherePoint[] = [];
  const total = 260;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < total; i++) {
    const y = 1 - (i / (total - 1)) * 2;
    const lat = Math.asin(y);
    const lon = ((goldenAngle * i) % (Math.PI * 2)) - Math.PI;
    points.push({ lat, lon });
  }

  return points;
}

const SPHERE_POINTS = generateGlobePoints();

export function CeilowGlobe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId = 0;
    let phi = -COTONOU_LON + 0.35;
    const tilt = 0.22;

    const render = () => {
      const displaySize = canvas.offsetWidth || 160;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetPx = Math.round(displaySize * dpr);

      if (canvas.width !== targetPx || canvas.height !== targetPx) {
        canvas.width = targetPx;
        canvas.height = targetPx;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = w * 0.43;

      ctx.clearRect(0, 0, w, h);

      // Fond de sphère net conforme aux tokens Ceilow
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#F5F4F2";
      ctx.fill();
      ctx.lineWidth = Math.max(1.5, w * 0.01);
      ctx.strokeStyle = "#332E29";
      ctx.stroke();

      // Méridien et équateur discrets
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * Math.sin(tilt), 0, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1, w * 0.005);
      ctx.strokeStyle = "#D8D5D0";
      ctx.stroke();

      // Projection 3D des points de la sphère
      const projected = SPHERE_POINTS.map((p) => {
        const theta = p.lon + phi;
        const cosLat = Math.cos(p.lat);
        const x3d = cosLat * Math.sin(theta);
        const y3d = Math.sin(p.lat);
        const z3d = cosLat * Math.cos(theta);

        const yRot = y3d * Math.cos(tilt) - z3d * Math.sin(tilt);
        const zRot = y3d * Math.sin(tilt) + z3d * Math.cos(tilt);

        return {
          x: cx + x3d * radius * 0.92,
          y: cy - yRot * radius * 0.92,
          z: zRot,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      for (const pt of projected) {
        if (pt.z < -0.15) continue;
        const visibility = (pt.z + 0.15) / 1.15;
        const dotRadius = Math.max(1.1, w * 0.0095 * (0.55 + visibility * 0.55));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = pt.z > 0.2 ? "#332E29" : "#8A857D";
        ctx.fill();
      }

      // Repère Cotonou / Bénin mis en avant en jaune Ceilow (#FFD946)
      const cTheta = COTONOU_LON + phi;
      const cCosLat = Math.cos(COTONOU_LAT);
      const cx3d = cCosLat * Math.sin(cTheta);
      const cy3d = Math.sin(COTONOU_LAT);
      const cz3d = cCosLat * Math.cos(cTheta);
      const cyRot = cy3d * Math.cos(tilt) - cz3d * Math.sin(tilt);
      const czRot = cy3d * Math.sin(tilt) + cz3d * Math.cos(tilt);

      if (czRot > -0.05) {
        const mx = cx + cx3d * radius * 0.92;
        const my = cy - cyRot * radius * 0.92;
        ctx.beginPath();
        ctx.arc(mx, my, Math.max(4, w * 0.042), 0, Math.PI * 2);
        ctx.fillStyle = "#FFD946";
        ctx.fill();
        ctx.lineWidth = Math.max(1.5, w * 0.01);
        ctx.strokeStyle = "#332E29";
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        phi += 0.0055;
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    render();

    const handleResize = () => {
      if (prefersReducedMotion) {
        render();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={cn("relative aspect-square w-full max-w-[160px] mx-auto", className)}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

