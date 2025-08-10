# Spacio - Interactive Home Designer

Spacio is a sophisticated, client-side web application for intuitive 2D and 3D home design. It allows users to draw floor plans in a 2D top-down view and instantly visualize them in an interactive 3D mode.

## Tech Stack

- **Framework:** React (Vite) + TypeScript
- **3D Rendering:** Three.js & React Three Fiber (R3F)
- **3D Helpers:** Drei
- **UI & Styling:** Tailwind CSS & Shadcn/ui (emulated)
- **State Management:** Zustand

## Features

- **Dual Mode View:** Seamlessly toggle between 2D drawing and 3D visualization.
- **2D Canvas:** Draw walls, and drag-and-drop objects like doors and furniture.
- **Real-time 3D Rendering:** All changes in the 2D plan are reflected instantly in the 3D view.
- **Object Interaction:** Select, move, and inspect properties of design elements.
- **State Persistence:** Save and load your designs using browser `localStorage`.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd SpacioInteractiveHomeDesigner
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

- `src/components/layout/`: Components for the main application layout (Sidebar, Toolbar).
- `src/components/canvas/`: Components for the 2D and 3D rendering areas.
- `src/components/core/`: 3D components for scene objects (Wall, Furniture).
- `src/components/ui/`: Reusable UI components inspired by Shadcn/ui.
- `src/lib/`: Core logic, state management (Zustand), and type definitions.
- `public/models/`: Contains 3D models (`.glb` files).
