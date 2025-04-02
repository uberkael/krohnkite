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

class dockSurfaceCfg {
  public outputName: string;
  public activityId: string;
  public vDesktopName: string;
  public cfg: IDockCfg;

  constructor(
    outputName: string,
    activityId: string,
    vDesktopName: string,
    cfg: IDockCfg
  ) {
    this.outputName = outputName;
    this.activityId = activityId;
    this.vDesktopName = vDesktopName;
    this.cfg = cfg;
  }
  public isFit(srf: ISurface): boolean {
    return (
      (this.outputName === "" || this.outputName === srf.output.name) &&
      (this.vDesktopName === "" || this.vDesktopName === srf.desktop.name) &&
      (this.activityId === "" || this.activityId === srf.activity)
    );
  }
  public toString(): string {
    return `dockSurface: Output Name: ${this.outputName}, Activity ID: ${this.activityId}, Virtual Desktop Name: ${this.vDesktopName} cfg: ${this.cfg}`;
  }
}
