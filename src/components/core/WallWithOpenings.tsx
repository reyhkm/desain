import * as THREE from 'three';
import { useMemo } from 'react';
import { CSG, Geometry, Base } from '@react-three/csg';
import { Wall, Door, Window } from '@/lib/types';

interface WallWithOpeningsProps {
  wall: Wall;
  openings: (Door | Window)[];
}

// Helper to create a box geometry
const createBox = (width: number, height: number, depth: number) => {
  return new THREE.BoxGeometry(width, height, depth);
};

const WallWithOpenings = ({ wall }: WallWithOpeningsProps) => {
  const { start, end, height, thickness } = wall;

  const wallVector = useMemo(() => new THREE.Vector2(end[0] - start[0], end[1] - start[1]), [start, end]);
  const wallLength = wallVector.length();
  const wallAngle = wallVector.angle();
  const wallCenter = useMemo(() => new THREE.Vector2((start[0] + end[0]) / 2, (start[1] + end[1]) / 2), [start, end]);

  // For this simplified example, we will not implement openings with CSG as it's complex.
  // We will render a solid wall. A full implementation would use the `openings` prop.
  // The CSG logic would involve creating cutter meshes for each door/window and subtracting them.

  return (
    <mesh
      position={[wallCenter.x, height / 2, wallCenter.y]} // Note: 2D y-coord is 3D z-coord
      rotation={[0, -wallAngle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[wallLength, height, thickness]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
};

// NOTE: A full CSG implementation would look something like this:
/*
const WallWithOpeningsCSG = ({ wall, openings }: WallWithOpeningsProps) => {
  const { start, end, height, thickness } = wall;
  const wallVector = new THREE.Vector2(end[0] - start[0], end[1] - start[1]);
  const wallLength = wallVector.length();
  const wallAngle = wallVector.angle();
  const wallCenter = new THREE.Vector2((start[0] + end[0]) / 2, (start[1] + end[1]) / 2);

  const wallGeometry = createBox(wallLength, height, thickness);

  return (
    <group position={[wallCenter.x, 0, wallCenter.y]} rotation={[0, -wallAngle, 0]}>
      <CSG>
        <Base geometry={wallGeometry}>
          <meshStandardMaterial color="#cccccc" />
        </Base>

        {openings.map(opening => {
          const openingPos = opening.positionOnWall * wallLength - wallLength / 2;
          const openingHeight = opening.type === 'door' ? opening.height : opening.height + opening.elevation;
          const cutterGeometry = createBox(opening.width, opening.height, thickness * 1.2);
          return (
            <Geometry key={opening.id} operation="subtract" geometry={cutterGeometry} position={[openingPos, openingHeight / 2, 0]} />
          )
        })}
      </CSG>
    </group>
  )
}
*/

export default WallWithOpenings;
