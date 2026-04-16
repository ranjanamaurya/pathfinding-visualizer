import { MutableRefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import {
  EXTENDED_SLEEP_TIME,
  MAZES,
  PATHFINDING_ALGORITHMS,
  SLEEP_TIME,
  SPEEDS,
} from "../utils/constants";
import { resetGrid } from "../utils/resetGrid";
import { AlgorithmType, MazeType, SpeedType } from "../utils/types";
import { Select } from "./Select";
import { useSpeed } from "../hooks/useSpeed";
import { runMazeAlgorithm } from "../utils/runMazeAlgorithm";
import { PlayButton } from "./PlayButton";
import { runPathfindingAlgorithm } from "../utils/runPathfindingAlgorithm";
import { animatePath } from "../utils/animatePath";

export function Nav({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: MutableRefObject<boolean>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    maze,
    setMaze,
    grid,
    setGrid,
    isGraphVisualized,
    setIsGraphVisualized,
    algorithm,
    setAlgorithm,
  } = usePathfinding();

  const { startTile, endTile } = useTile();
  const { speed, setSpeed } = useSpeed();

  // 🔥 Clear Board
  const handleClearBoard = () => {
    resetGrid({ grid, startTile, endTile });
    setIsGraphVisualized(false);
    setGrid(grid.slice());
  };

  const handleGenerateMaze = (maze: MazeType) => {
    if (maze === "NONE") {
      setMaze(maze);
      resetGrid({ grid, startTile, endTile });
      return;
    }

    setMaze(maze);
    setIsDisabled(true);

    runMazeAlgorithm({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });

    setGrid(grid.slice());
    setIsGraphVisualized(false);
  };

  const handlerRunVisualizer = () => {
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      resetGrid({ grid: grid.slice(), startTile, endTile });
      return;
    }

    const { traversedTiles, path } = runPathfindingAlgorithm({
      algorithm,
      grid,
      startTile,
      endTile,
    });

    animatePath(traversedTiles, path, startTile, endTile, speed);

    setIsDisabled(true);
    isVisualizationRunningRef.current = true;

    setTimeout(() => {
      setGrid(grid.slice());
      setIsGraphVisualized(true);
      setIsDisabled(false);
      isVisualizationRunningRef.current = false;
    },
      SLEEP_TIME * (traversedTiles.length + SLEEP_TIME * 2) +
      EXTENDED_SLEEP_TIME * (path.length + 60) *
      SPEEDS.find((s) => s.value === speed)!.value
    );
  };

  return (
    <div  className="flex flex-col items-center border-b border-white/10 bg-white/5 backdrop-blur-md px-3 py-2">

      {/* 🔥 TOP BAR */}
      <div className="flex items-center justify-between w-full max-w-5xl">

        <h1 className="text-2xl font-bold tracking-wide hidden lg:block">
          Pathfinding Visualizer
        </h1>

        <div className="flex flex-wrap items-center gap-3 justify-center">

          <Select
            label="Maze"
            value={maze}
            options={MAZES}
            isDisabled={isDisabled}
            onChange={(e) => handleGenerateMaze(e.target.value as MazeType)}
          />

          <Select
            label="Graph"
            value={algorithm}
            isDisabled={isDisabled}
            options={PATHFINDING_ALGORITHMS}
            onChange={(e) =>
              setAlgorithm(e.target.value as AlgorithmType)
            }
          />

          <Select
            label="Speed"
            value={speed}
            options={SPEEDS}
            isDisabled={isDisabled}
            onChange={(e) =>
              setSpeed(parseInt(e.target.value) as SpeedType)
            }
          />

          <PlayButton
            isDisabled={isDisabled}
            isGraphVisualized={isGraphVisualized}
            handlerRunVisualizer={handlerRunVisualizer}
          />

          <button
            onClick={handleClearBoard}
            disabled={isDisabled}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Clear
          </button>

        </div>
      </div>

      {/* 🔥 LEGEND */}
      <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Start</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>End</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span>Visited</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Path</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black rounded"></div>
          <span>Wall</span>
        </div>

      </div>
    </div>
  );
}