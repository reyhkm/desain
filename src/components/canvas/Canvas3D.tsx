import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import useStore from '@/lib/store';
import { Wall, SceneObject } from '@/lib/types';
import WallWithOpenings from '../core/WallWithOpenings';
import Furniture from '../core/Furniture';

const Scene = () => {
  const sceneObjects = useStore((state) => state.sceneObjects);

  const walls = sceneObjects.filter(obj => obj.type === 'wall') as Wall[];
  const otherObjects = sceneObjects.filter(obj => obj.type !== 'wall');

  return (
    <>
      {walls.map(wall => {
        const openings = otherObjects.filter(obj => (obj.type === 'door' || obj.type === 'window') && obj.wallId === wall.id);
        return <WallWithOpenings key={wall.id} wall={wall} openings={openings} />;
      })}

      {otherObjects.map(obj => {
        if (obj.type === 'furniture') {
          return <Furniture key={obj.id} object={obj} />;
        }
        // Doors and windows are handled by WallWithOpenings
        return null;
      })}
    </>
  );
};

const Canvas3D = () => {
  return (
    <Canvas shadows camera={{ position: [50, 50, 50], fov: 50 }}>
      <color attach="background" args={['#f0f0f0']} />
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[10, 20, 5]}
        intensity={1.5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Grid infiniteGrid position={[0, -0.01, 0]} cellSize={1} sectionSize={10} />
      <Scene />
      <OrbitControls makeDefault />
      <Environment preset="city" />
    </Canvas>
  );
};

export default Canvas3D;
