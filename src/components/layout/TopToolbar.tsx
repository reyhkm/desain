import useStore from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Scan, Undo, Redo, Save, FolderOpen, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const TopToolbar = () => {
  const { currentMode, setMode, undo, redo, saveState, loadState } = useStore();

  return (
    <header className="h-16 flex items-center px-4 border-b bg-card z-10 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Spacio</h1>
      </div>
      <div className="mx-auto flex items-center gap-2">
        <ToggleGroup type="single" value={currentMode} onValueChange={(value) => value && setMode(value as '2D' | '3D')}>
          <ToggleGroupItem value="2D" aria-label="2D Mode">
            <span className="mr-2">2D</span>
            <Scan className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="3D" aria-label="3D Mode">
            <span className="mr-2">3D</span>
            <Scan className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Button variant="ghost" size="icon" onClick={undo}><Undo className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={redo}><Redo className="h-4 w-4" /></Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Placeholder for zoom/reset controls */}
        <Button variant="ghost" size="icon"><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><ZoomOut className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><RotateCcw className="h-4 w-4" /></Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={loadState}><FolderOpen className="mr-2 h-4 w-4"/> Load</Button>
        <Button onClick={saveState}><Save className="mr-2 h-4 w-4"/> Save</Button>
      </div>
    </header>
  );
};

export default TopToolbar;
