// Copyright (c) 2018-2019 Eon S. Jeon <esjeon@hyunmu.am>
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

class QuarterLayout implements ILayout {
  public static readonly MAX_PROPORTION = 0.8;
  public static readonly id = "QuarterLayout";

  public readonly classID = QuarterLayout.id;
  public readonly description = "Quarter";

  public get capacity(): number {
    return 4;
  }

  private lhsplit: number;
  private rhsplit: number;
  private vsplit: number;
  private prevTileCount: number; // Track the last number of tiles

  public constructor() {
    this.lhsplit = 0.5;
    this.rhsplit = 0.5;
    this.vsplit = 0.5;
    this.prevTileCount = 0;
  }

  // Resets the splits to their default values.
  private resetSplits(): void {
    this.lhsplit = 0.5;
    this.rhsplit = 0.5;
    this.vsplit = 0.5;
  }

  public adjust(
    area: Rect,
    tiles: WindowClass[],
    basis: WindowClass,
    delta: RectDelta
  ) {
    if (tiles.length <= 1 || tiles.length > 4) return;

    const idx = tiles.indexOf(basis);
    if (idx < 0) return;

    /* vertical split */
    if ((idx === 0 || idx === 3) && delta.east !== 0)
      this.vsplit =
        ((area.width * this.vsplit) + delta.east) / area.width;
    else if ((idx === 1 || idx === 2) && delta.west !== 0)
      this.vsplit =
        ((area.width * this.vsplit) - delta.west) / area.width;

    /* left-side horizontal split */
    if (tiles.length === 4) {
      if (idx === 0 && delta.south !== 0)
        this.lhsplit =
          ((area.height * this.lhsplit) + delta.south) / area.height;
      if (idx === 3 && delta.north !== 0)
        this.lhsplit =
          ((area.height * this.lhsplit) - delta.north) / area.height;
    }

    /* right-side horizontal split */
    if (tiles.length >= 3) {
      if (idx === 1 && delta.south !== 0)
        this.rhsplit =
          ((area.height * this.rhsplit) + delta.south) / area.height;
      if (idx === 2 && delta.north !== 0)
        this.rhsplit =
          ((area.height * this.rhsplit) - delta.north) / area.height;
    }

    /* clipping */
    this.vsplit = clip(
      this.vsplit,
      1 - QuarterLayout.MAX_PROPORTION,
      QuarterLayout.MAX_PROPORTION
    );
    this.lhsplit = clip(
      this.lhsplit,
      1 - QuarterLayout.MAX_PROPORTION,
      QuarterLayout.MAX_PROPORTION
    );
    this.rhsplit = clip(
      this.rhsplit,
      1 - QuarterLayout.MAX_PROPORTION,
      QuarterLayout.MAX_PROPORTION
    );
  }

  public clone(): ILayout {
    const other = new QuarterLayout();
    other.lhsplit = this.lhsplit;
    other.rhsplit = this.rhsplit;
    other.vsplit = this.vsplit;
    other.prevTileCount = this.prevTileCount;
    return other;
  }

  public apply(ctx: EngineContext, tileables: WindowClass[], area: Rect): void {
    // Reset splits if a window was closed (i.e. tile count decreased)
    if (tileables.length < this.prevTileCount) {
      this.resetSplits();
    }
    // Update the stored count for next time
    this.prevTileCount = tileables.length;

    for (let i = 0; i < 4 && i < tileables.length; i++)
      tileables[i].state = WindowState.Tiled;

    if (tileables.length > 4)
      tileables
        .slice(4)
        .forEach((tile) => (tile.state = WindowState.TiledAfloat));

    if (tileables.length === 1) {
      tileables[0].geometry = area;
      return;
    }

    const gap1 = (CONFIG.tileLayoutGap / 2);
    const gap2 = CONFIG.tileLayoutGap - gap1;

    const leftWidth = (area.width * this.vsplit);
    const rightWidth = area.width - leftWidth;
    const rightX = area.x + leftWidth;
    if (tileables.length === 2) {
      tileables[0].geometry = new Rect(
        area.x,
        area.y,
        leftWidth,
        area.height
      ).gap(0, gap1, 0, 0);
      tileables[1].geometry = new Rect(
        rightX,
        area.y,
        rightWidth,
        area.height
      ).gap(gap2, 0, 0, 0);
      return;
    }

    const rightTopHeight = (area.height * this.rhsplit);
    const rightBottomHeight = area.height - rightTopHeight;
    const rightBottomY = area.y + rightTopHeight;
    if (tileables.length === 3) {
      tileables[0].geometry = new Rect(
        area.x,
        area.y,
        leftWidth,
        area.height
      ).gap(0, gap1, 0, 0);
      tileables[1].geometry = new Rect(
        rightX,
        area.y,
        rightWidth,
        rightTopHeight
      ).gap(gap2, 0, 0, gap1);
      tileables[2].geometry = new Rect(
        rightX,
        rightBottomY,
        rightWidth,
        rightBottomHeight
      ).gap(gap2, 0, gap2, 0);
      return;
    }

    const leftTopHeight = (area.height * this.lhsplit);
    const leftBottomHeight = area.height - leftTopHeight;
    const leftBottomY = area.y + leftTopHeight;
    if (tileables.length >= 4) {
      tileables[0].geometry = new Rect(
        area.x,
        area.y,
        leftWidth,
        leftTopHeight
      ).gap(0, gap1, 0, gap1);
      tileables[1].geometry = new Rect(
        rightX,
        area.y,
        rightWidth,
        rightTopHeight
      ).gap(gap2, 0, 0, gap1);
      tileables[2].geometry = new Rect(
        rightX,
        rightBottomY,
        rightWidth,
        rightBottomHeight
      ).gap(gap2, 0, gap2, 0);
      tileables[3].geometry = new Rect(
        area.x,
        leftBottomY,
        leftWidth,
        leftBottomHeight
      ).gap(0, gap2, gap2, 0);
    }
  }

  public toString(): string {
    return "QuarterLayout()";
  }
}
