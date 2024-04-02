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
import { IConfig, ILayout, ILayoutClass } from "@src/common";
import { DEBUG, debug } from "@src/util/debug";
import { TileLayout } from "@src/layouts/tilelayout";
import { MonocleLayout } from "@src/layouts/monoclelayout";
import { ThreeColumnLayout } from "@src/layouts/threecolumnlayout";
import { SpreadLayout } from "@src/layouts/spreadlayout";
import { StairLayout } from "@src/layouts/stairlayout";
import { SpiralLayout } from "@src/layouts/spirallayout";
import { QuarterLayout } from "@src/layouts/quarterlayout";
import { FloatingLayout } from "@src/layouts/floatinglayout";
import { CascadeLayout } from "@src/layouts/cascadelayout";

export class KWinConfig implements IConfig {
  //#region Layout
  public layoutOrder: string[];
  public layoutFactories: { [key: string]: () => ILayout };
  public maximizeSoleTile: boolean;
  public monocleMaximize: boolean;
  public monocleMinimizeRest: boolean; // kwin.specific
  //#endregion

  //#region Features
  public adjustLayout: boolean;
  public adjustLayoutLive: boolean;
  public keepFloatAbove: boolean;
  public noTileBorder: boolean;
  public limitTileWidthRatio: number;
  //#endregion

  //#region Gap
  public screenGapBottom: number;
  public screenGapLeft: number;
  public screenGapRight: number;
  public screenGapTop: number;
  public tileLayoutGap: number;
  //#endregion

  //#region Behavior
  public directionalKeyMode: "dwm" | "focus";
  public newWindowAsMaster: boolean;
  //#endregion

  //#region kwin.specific
  public layoutPerActivity: boolean;
  public layoutPerDesktop: boolean;
  public preventMinimize: boolean;
  public preventProtrusion: boolean;
  public pollMouseXdotool: boolean;
  //#endregion

  //#region kwin.specific Rules
  public floatUtility: boolean;

  public floatingClass: string[];
  public floatingTitle: string[];
  public ignoreClass: string[];
  public ignoreTitle: string[];
  public ignoreRole: string[];

  public ignoreActivity: string[];
  public ignoreScreen: string[];
  //#endregion

  constructor() {
    function commaSeparate(str: string): string[] {
      if (!str || typeof str !== "string") return [];
      return str.split(",").map((part) => part.trim());
    }

    DEBUG.enabled = DEBUG.enabled || kwin.readConfig("debug", false);

    this.layoutOrder = [];
    this.layoutFactories = {};
    (
      [
        ["enableTileLayout", true, TileLayout],
        ["enableMonocleLayout", true, MonocleLayout],
        ["enableThreeColumnLayout", true, ThreeColumnLayout],
        ["enableSpreadLayout", true, SpreadLayout],
        ["enableStairLayout", true, StairLayout],
        ["enableSpiralLayout", true, SpiralLayout],
        ["enableQuarterLayout", false, QuarterLayout],
        ["enableFloatingLayout", false, FloatingLayout],
        ["enableCascadeLayout", false, CascadeLayout], // TODO: add config
      ] as Array<[string, boolean, ILayoutClass]>
    ).forEach(([configKey, defaultValue, layoutClass]) => {
      if (kwin.readConfig(configKey, defaultValue))
        this.layoutOrder.push(layoutClass.id);
      this.layoutFactories[layoutClass.id] = () => new layoutClass();
    });

    this.maximizeSoleTile = kwin.readConfig("maximizeSoleTile", false);
    this.monocleMaximize = kwin.readConfig("monocleMaximize", true);
    this.monocleMinimizeRest = kwin.readConfig("monocleMinimizeRest", false);

    this.adjustLayout = kwin.readConfig("adjustLayout", true);
    this.adjustLayoutLive = kwin.readConfig("adjustLayoutLive", true);
    this.keepFloatAbove = kwin.readConfig("keepFloatAbove", true);
    this.noTileBorder = kwin.readConfig("noTileBorder", false);

    this.limitTileWidthRatio = 0;
    if (kwin.readConfig("limitTileWidth", false))
      this.limitTileWidthRatio = kwin.readConfig("limitTileWidthRatio", 1.6);

    this.screenGapBottom = kwin.readConfig("screenGapBottom", 0);
    this.screenGapLeft = kwin.readConfig("screenGapLeft", 0);
    this.screenGapRight = kwin.readConfig("screenGapRight", 0);
    this.screenGapTop = kwin.readConfig("screenGapTop", 0);
    this.tileLayoutGap = kwin.readConfig("tileLayoutGap", 0);

    const directionalKeyDwm = kwin.readConfig("directionalKeyDwm", true);
    const directionalKeyFocus = kwin.readConfig("directionalKeyFocus", false);
    this.directionalKeyMode = directionalKeyDwm ? "dwm" : "focus";
    this.newWindowAsMaster = kwin.readConfig("newWindowAsMaster", false);

    this.layoutPerActivity = kwin.readConfig("layoutPerActivity", true);
    this.layoutPerDesktop = kwin.readConfig("layoutPerDesktop", true);
    this.floatUtility = kwin.readConfig("floatUtility", true);
    this.preventMinimize = kwin.readConfig("preventMinimize", false);
    this.preventProtrusion = kwin.readConfig("preventProtrusion", true);
    this.pollMouseXdotool = kwin.readConfig("pollMouseXdotool", false);

    this.floatingClass = commaSeparate(kwin.readConfig("floatingClass", ""));
    this.floatingTitle = commaSeparate(kwin.readConfig("floatingTitle", ""));
    this.ignoreActivity = commaSeparate(kwin.readConfig("ignoreActivity", ""));
    this.ignoreClass = commaSeparate(
      kwin.readConfig("ignoreClass", "krunner,yakuake,spectacle,kded5")
    );
    this.ignoreRole = commaSeparate(kwin.readConfig("ignoreRole", "quake"));

    this.ignoreScreen = commaSeparate(kwin.readConfig("ignoreScreen", ""));
    this.ignoreTitle = commaSeparate(kwin.readConfig("ignoreTitle", ""));

    if (this.preventMinimize && this.monocleMinimizeRest) {
      debug(
        () => "preventMinimize is disabled because of monocleMinimizeRest."
      );
      this.preventMinimize = false;
    }
  }

  public toString(): string {
    return "Config(" + JSON.stringify(this, undefined, 2) + ")";
  }
}

// /* HACK: save casting */
// export var KWINCONFIG: KWinConfig;
