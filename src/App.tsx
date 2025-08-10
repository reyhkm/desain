import Sidebar from "@/components/layout/Sidebar";
import TopToolbar from "@/components/layout/TopToolbar";
import MainCanvas from "@/components/canvas/MainCanvas";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-muted/40">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full">
          <MainCanvas />
        </main>
      </div>
    </div>
  );
}

export default App;
