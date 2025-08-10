import React, { useState, useRef } from 'react';
import useStore from '@/lib/store';
import { Wall } from '@/lib/types';

const GRID_SIZE = 20;

const Canvas2D = () => {
  const {
    sceneObjects,
    activeTool,
    addObject,
    selectedObjectId,
    setSelectedObject,
  } = useStore();

  const [drawingWall, setDrawingWall] = useState<[number, number] | null>(null);
  const [mousePos, setMousePos] = useState<[number, number]>([0, 0]);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSvgCoordinates = (e: React.MouseEvent): [number, number] => {
    if (!svgRef.current) return [0, 0];
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    return [Math.round(svgP.x / GRID_SIZE) * GRID_SIZE, Math.round(svgP.y / GRID_SIZE) * GRID_SIZE];
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos(getSvgCoordinates(e));
  };

  const handleClick = (e: React.MouseEvent) => {
    const [x, z] = getSvgCoordinates(e);

    if (activeTool === 'wall') {
      if (!drawingWall) {
        setDrawingWall([x, z]);
      } else {
        const newWall: Omit<Wall, 'id'> = {
          type: 'wall',
          start: drawingWall,
          end: [x, z],
          thickness: 10,
          height: 100,
          position: [0, 0, 0], // Position is not used for walls in 2D
        };
        addObject(newWall);
        setDrawingWall(null);
      }
    } else if (activeTool === 'select') {
      // Basic selection logic - find the clicked object
      // This is a simplified implementation. A real app would need more robust hit detection.
      const clickedObject = sceneObjects.find(obj => {
        if (obj.type === 'wall') {
          // Simple bounding box check for walls
          const minX = Math.min(obj.start[0], obj.end[0]);
          const maxX = Math.max(obj.start[0], obj.end[0]);
          const minZ = Math.min(obj.start[1], obj.end[1]);
          const maxZ = Math.max(obj.start[1], obj.end[1]);
          return x >= minX - 5 && x <= maxX + 5 && z >= minZ - 5 && z <= maxZ + 5;
        }
        return false;
      });
      setSelectedObject(clickedObject ? clickedObject.id : null);
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className="cursor-crosshair bg-white"
    >
      {/* Grid Pattern */}
      <defs>
        <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Render existing walls */}
      {sceneObjects.filter(obj => obj.type === 'wall').map(obj => {
        const wall = obj as Wall;
        const isSelected = wall.id === selectedObjectId;
        return (
          <line
            key={wall.id}
            x1={wall.start[0]}
            y1={wall.start[1]}
            x2={wall.end[0]}
            y2={wall.end[1]}
            stroke={isSelected ? 'blue' : 'black'}
            strokeWidth={wall.thickness / 2}
            strokeLinecap="round"
            className="pointer-events-none"
          />
        );
      })}

      {/* Render wall being drawn */}
      {drawingWall && (
        <line
          x1={drawingWall[0]}
          y1={drawingWall[1]}
          x2={mousePos[0]}
          y2={mousePos[1]}
          stroke="rgba(0,0,255,0.5)"
          strokeWidth="5"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  );
};

export default Canvas2D;
