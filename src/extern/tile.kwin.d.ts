interface TileManager {
  readonly rootTile: Tile;

  tileRemoved: QSignal;

  bestTileForPosition(x: number, y: number): Tile;
}

interface Tile {
  readonly absoluteGeometry: QRect;
  readonly absoluteGeometryInScreen: QRect;
  readonly positionInLayout: number;
  readonly parent: Tile;
  readonly tiles: Tile[];
  readonly windows: Window[];
  readonly isLayout: boolean;
  readonly canBeRemoved: boolean;
}
