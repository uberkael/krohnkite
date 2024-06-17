// Copyright (c) 2024 Vjatcheslav V. Kolchkov <akl334@protonmail.ch>
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

type BTreeLayoutPart = HalfSplitLayoutPart<
  BTreeLayoutPart | FillLayoutPart,
  BTreeLayoutPart | FillLayoutPart
>;

class BTreeLayout implements ILayout {
  public static readonly id = "StackedLayout";

  public readonly classID = BTreeLayout.id;
  private level: number;
  private tiles_len: number;

  public get description(): string {
    return "BTree";
  }

  private parts: BTreeLayoutPart;

  constructor() {
    this.level = 1;
    this.tiles_len = 2;
    this.parts = new HalfSplitLayoutPart(
      new FillLayoutPart(),
      new FillLayoutPart()
    );
    this.parts.angle = 0;
    this.parts.gap = CONFIG.tileLayoutGap;
  }

  // public adjust(
  //   area: Rect,
  //   tiles: WindowClass[],
  //   basis: WindowClass,
  //   delta: RectDelta
  // ) {
  //   this.parts.adjust(area, tiles, basis, delta);
  // }

  public apply(ctx: EngineContext, tileables: WindowClass[], area: Rect): void {
    tileables.forEach((tileable) => (tileable.state = WindowState.Tiled));

    // print(">>>Parts before:" + this.parts);
    this.bore(tileables.length);
    // print(">>>Parts after:" + this.parts);

    let rectangles = this.parts.apply(area, tileables);

    // print("Rectangles:" + rectangles);

    rectangles.forEach((geometry, i) => {
      tileables[i].geometry = geometry;
    });

    // this.parts.apply(area, tileables).forEach((geometry, i) => {
    //   tileables[i].geometry = geometry;
    // });
  }
  private bore(tiles_len: number): void {
    function build_btree(
      head: BTreeLayoutPart,
      max_level: number,
      current_level: number,
      tiles_len: number
    ): void {
      if (current_level <= max_level) {
        if (head.primarySize > 1) {
          let primary = new HalfSplitLayoutPart(
            new FillLayoutPart(),
            new FillLayoutPart()
          );
          primary.primarySize = Math.floor(head.primarySize / 2);
          primary.gap = CONFIG.tileLayoutGap;
          primary.angle = current_level % 2 ? 0 : 90;
          head.primary = primary;
          build_btree(primary, max_level, current_level + 1, head.primarySize);
        }
        if (tiles_len - head.primarySize > 1) {
          let secondary = new HalfSplitLayoutPart(
            new FillLayoutPart(),
            new FillLayoutPart()
          );
          secondary.primarySize = Math.floor(
            (tiles_len - head.primarySize) / 2
          );
          secondary.gap = CONFIG.tileLayoutGap;
          secondary.angle = current_level % 2 ? 0 : 90;
          head.secondary = secondary;
          build_btree(
            secondary,
            max_level,
            current_level + 1,
            tiles_len - head.primarySize
          );
        }
      }
    }
    let head = this.get_head();
    head.angle = 0;
    head.gap = CONFIG.tileLayoutGap;
    if (tiles_len > 2) {
      // es5 has not the log2 function, so I use natural log
      let level = Math.ceil(Math.log(tiles_len) * 1.442695);
      let level_capacity = 2 ** (level - 1);
      let half_level_capacity = 2 ** (level - 2);

      if (tiles_len > level_capacity + half_level_capacity) {
        head.primarySize = tiles_len - level_capacity;
      } else {
        head.primarySize = half_level_capacity;
      }
      build_btree(head, level, 2, tiles_len);
    }
    this.parts = head;
  }

  private get_head(): HalfSplitLayoutPart<FillLayoutPart, FillLayoutPart> {
    return new HalfSplitLayoutPart(new FillLayoutPart(), new FillLayoutPart());
  }

  public clone(): ILayout {
    const other = new StackedLayout();
    return other;
  }

  public toString(): string {
    return "BTreeLayout()";
  }
}
