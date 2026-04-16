import { useRef } from "react";
import { Grid } from "./components/Grid";
import { PathfindingProvider } from "./context/PathfindingContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { Nav } from "./components/Nav";

function App() {
  const isVisualizationRunningRef = useRef(false);

  return (
    <PathfindingProvider>
      <TileProvider>
        <SpeedProvider>
          {/* 🔥 UPDATED BACKGROUND */}
          <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
            
            <Nav isVisualizationRunningRef={isVisualizationRunningRef} />
            
            <Grid isVisualizationRunningRef={isVisualizationRunningRef} />

          </div>
        </SpeedProvider>
      </TileProvider>
    </PathfindingProvider>
  );
}

export default App;