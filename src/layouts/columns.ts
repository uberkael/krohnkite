type positionType = "single" | "left" | "middle" | "right";

class ColumnLayout implements ILayout {
  public static readonly id = "Column";
  public readonly classID = ColumnLayout.id;
  public position: positionType;

  private parts: StackLayoutPart;

  public get description(): string {
    return "Column";
  }
  constructor(position: positionType) {
    this.position = position;
    this.parts = new StackLayoutPart();
    this.parts.gap = CONFIG.tileLayoutGap;
  }
  public apply(ctx: EngineContext, tileables: WindowClass[], area: Rect): void {
    this.parts.apply(area, tileables).forEach((geometry, i) => {
      tileables[i].geometry = geometry;
    });
  }
  public adjust(
    area: Rect,
    tiles: WindowClass[],
    basis: WindowClass,
    delta: RectDelta
  ) {
    this.parts.adjust(area, tiles, basis, delta);
  }
}

class ColumnsLayout implements ILayout {
  public static readonly id = "Columns";

  public readonly classID = ColumnsLayout.id;

  public get description(): string {
    return "Columns";
  }

  public parts: ColumnLayout[];

  constructor() {
    this.parts = [new ColumnLayout("single")];
  }
  public adjust(
    area: Rect,
    tiles: WindowClass[],
    basis: WindowClass,
    delta: RectDelta
  ) {
    this.parts[0].adjust(area, tiles, basis, delta);
  }

  public apply(ctx: EngineContext, tileables: WindowClass[], area: Rect): void {
    tileables.forEach((tileable) => (tileable.state = WindowState.Tiled));
    let columnWidth = area.width / this.parts.length;
    for (var idx = 0; idx < this.parts.length; idx++) {
      var columnArea = new Rect(
        area.x + columnWidth * idx,
        area.y,
        columnWidth,
        area.height
      );
      this.parts[idx].apply(ctx, tileables, columnArea);
    }
  }
  private applyColumnsPosition() {
    const length = this.parts.length;
    if (length === 1) {
      this.parts[0].position = "single";
    } else if (length > 1) {
      this.parts[0].position = "left";
      this.parts[length - 1].position = "right";
      for (let i = 1; i < length - 1; i++) {
        this.parts[i].position = "middle";
      }
    }
  }
  private insertColumn(index: number) {
    this.parts.splice(index, 0, new ColumnLayout("single"));
    this.applyColumnsPosition();
  }
}
