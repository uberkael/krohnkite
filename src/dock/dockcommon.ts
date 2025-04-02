// Copyright (c) 2025 Vjatcheslav V. Kolchkov <akl334@protonmail.ch>
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

const DockPosition = {
  left: 1,
  right: 2,
  top: 3,
  bottom: 4,
} as const;
type DockPosition = (typeof DockPosition)[keyof typeof DockPosition];

const HDockAlignment = {
  center: 1,
  left: 2,
  right: 3,
} as const;
type HDockAlignment = (typeof HDockAlignment)[keyof typeof HDockAlignment];

const VDockAlignment = {
  center: 1,
  top: 2,
  bottom: 3,
} as const;
type VDockAlignment = (typeof VDockAlignment)[keyof typeof VDockAlignment];

const EdgeAlignment = {
  outside: 1,
  middle: 2,
  inside: 3,
} as const;
type EdgeAlignment = (typeof EdgeAlignment)[keyof typeof EdgeAlignment];

interface IDockCfg {
  hHeight: number;
  hWide: number;
  hEdgeGap: number;
  hGap: number;
  hAlignment: HDockAlignment;
  hEdgeAlignment: EdgeAlignment;
  vHeight: number;
  vWide: number;
  vEdgeGap: number;
  vGap: number;
  vEdgeAlignment: VDockAlignment;
  vAlignment: VDockAlignment;
}

interface IDock {
  renderedOutputId: string;
  renderedTime: number | null;
  priority: number;
  position: DockPosition | null;
  cfg: IDockCfg;
  clone(): IDock;
}

interface IDockEntry {}

interface IDockStore {
  render(srf: ISurface, win: WindowClass[], workingArea: Rect): Rect;
}
