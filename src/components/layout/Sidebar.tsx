import useStore from "@/lib/store";
import { ActiveTool } from "@/lib/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MousePointer, PenSquare, DoorOpen, RectangleHorizontal, Sofa, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const tools: { name: ActiveTool; icon: React.ReactNode }[] = [
  { name: 'select', icon: <MousePointer /> },
  { name: 'wall', icon: <PenSquare /> },
  { name: 'door', icon: <DoorOpen /> },
  { name: 'window', icon: <RectangleHorizontal /> },
  { name: 'furniture', icon: <Sofa /> },
];

const Sidebar = () => {
  const { activeTool, setTool, selectedObjectId, sceneObjects, removeObject, setSelectedObject } = useStore();
  const selectedObject = sceneObjects.find(obj => obj.id === selectedObjectId);

  const handleDelete = () => {
    if (selectedObjectId) {
      removeObject(selectedObjectId);
      setSelectedObject(null); // Deselect after deleting
    }
  };

  return (
    <aside className="w-72 bg-card border-r p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={activeTool}
            onValueChange={(value) => value && setTool(value as ActiveTool)}
            className="grid grid-cols-3 gap-2"
          >
            {tools.map(tool => (
              <ToggleGroupItem key={tool.name} value={tool.name} aria-label={tool.name} className="flex flex-col h-16">
                {tool.icon}
                <span className="text-xs mt-1 capitalize">{tool.name}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Separator />

      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
          <CardTitle>Properties</CardTitle>
          {selectedObject && (
            <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Delete object">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {selectedObject ? (
            <div>
              <p><span className="font-bold">ID:</span> {selectedObject.id.substring(0, 8)}</p>
              <p><span className="font-bold">Type:</span> {selectedObject.type}</p>
              {'position' in selectedObject && selectedObject.position && (
                <p><span className="font-bold">Position:</span> {JSON.stringify(selectedObject.position)}</p>
              )}
              {/* Add more specific properties here based on object type */}
            </div>
          ) : (
            <p className="text-muted-foreground">Select an object to see its properties.</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;
