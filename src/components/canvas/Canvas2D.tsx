import React, { useState, useRef } from 'react';
import useStore from '@/lib/store';
import { Wall } from '@/lib/types';

const GRID_SIZE = 20;
const SNAP_THRESHOLD = 10; // pixels for snapping

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
    return [svgP.x, svgP.y];
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    let [x, z] = getSvgCoordinates(e);

    if (drawingWall) {
      // Check for horizontal/vertical snap from start point
      const [startX, startZ] = drawingWall;
      if (Math.abs(x - startX) < SNAP_THRESHOLD) {
        x = startX; // Snap vertically
      }
      if (Math.abs(z - startZ) < SNAP_THRESHOLD) {
        z = startZ; // Snap horizontally
      }
    }

    // Always snap to grid as the final step
    const finalX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const finalZ = Math.round(z / GRID_SIZE) * GRID_SIZE;

    setMousePos([finalX, finalZ]);
  };

  const handleClick = () => {
    // Use the already-snapped mousePos for the click action
    const [x, z] = mousePos;

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
        };
        // Avoid creating zero-length walls
        if (drawingWall[0] !== x || drawingWall[1] !== z) {
          addObject(newWall);
        }
        setDrawingWall(null);
      }
    } else if (activeTool === 'select') {
      // Deselect if clicking on the background
      setSelectedObject(null);
    }
  };

  const renderSnapGuide = () => {
    if (!drawingWall) return null;

    const [startX, startZ] = drawingWall;
    const [currentX, currentZ] = mousePos;

    // If perfectly aligned (due to snapping), show a guide
    if (startX === currentX && startZ !== currentZ) {
      return <line x1={startX} y1={startZ} x2={currentX} y2={currentZ} stroke="rgba(255, 0, 255, 0.7)" strokeWidth="1" strokeDasharray="3,3" className="pointer-events-none" />;
    }
    if (startZ === currentZ && startX !== currentX) {
      return <line x1={startX} y1={startZ} x2={currentX} y2={currentZ} stroke="rgba(255, 0, 255, 0.7)" strokeWidth="1" strokeDasharray="3,3" className="pointer-events-none" />;
    }
    return null;
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setDrawingWall(null)} // Cancel drawing if mouse leaves
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
            onClick={(e) => {
              if (activeTool === 'select') {
                e.stopPropagation(); // Prevent svg click handler from deselecting
                setSelectedObject(wall.id);
              }
            }}
            className={activeTool === 'select' ? 'cursor-pointer' : 'pointer-events-none'}
          />
        );
      })}

      {/* Render Snap Guide */}
      {renderSnapGuide()}

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
          className="pointer-events-none"
        />
      )}
    </svg>
  );
};

export default Canvas2D;
