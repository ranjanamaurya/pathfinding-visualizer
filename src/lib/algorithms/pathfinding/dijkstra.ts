import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
import { dropFromQueue, isEqual } from "../../../utils/helpers";
import { GridType, TileType } from "../../../utils/types";

export const dijkstra = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
) => {
  const traversedTiles: TileType[] = [];

  const base = grid[startTile.row][startTile.col];
  base.distance = 0;

  const untraversedTiles: TileType[] = [base];

  while (untraversedTiles.length > 0) {
    untraversedTiles.sort((a, b) => a.distance - b.distance);
    const currentTile = untraversedTiles.shift();

    if (!currentTile) continue;

    if (currentTile.isWall) continue;
    if (currentTile.distance === Infinity) break;

    // ✅ push BEFORE marking
    traversedTiles.push(currentTile);

    if (isEqual(currentTile, endTile)) break;

    const neighbors = getUntraversedNeighbors(grid, currentTile);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (currentTile.distance + 1 < neighbor.distance) {
        dropFromQueue(neighbor, untraversedTiles);
        neighbor.distance = currentTile.distance + 1;
        neighbor.parent = currentTile;

        untraversedTiles.push(neighbor);
      }
    }
  }

  // 🔥 PATH BUILD (clean)
  const path: TileType[] = [];
  let current: TileType | null = grid[endTile.row][endTile.col];

  while (current !== null) {
    path.unshift(current);
    current = current.parent!;
  }

  return { traversedTiles, path };
};