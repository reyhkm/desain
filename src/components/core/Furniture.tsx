import { useGLTF } from '@react-three/drei';
import { Furniture as FurnitureType } from '@/lib/types';

interface FurnitureProps {
  object: FurnitureType;
}

const Furniture = ({ object }: FurnitureProps) => {
  // For this example, all furniture uses the same chair model.
  // A real app would use `object.model` to load different models.
  const { scene } = useGLTF('/models/chair.glb');

  return (
    <primitive
      object={scene}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
    />
  );
};

// Preload the model for better performance
useGLTF.preload('/models/chair.glb');

export default Furniture;
