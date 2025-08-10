import useStore from "@/lib/store";
import Canvas2D from "./Canvas2D";
import Canvas3D from "./Canvas3D";

const MainCanvas = () => {
  const currentMode = useStore((state) => state.currentMode);

  return (
    <div className="w-full h-full bg-gray-200 relative">
      {currentMode === '2D' ? <Canvas2D /> : <Canvas3D />}
    </div>
  );
};

export default MainCanvas;
