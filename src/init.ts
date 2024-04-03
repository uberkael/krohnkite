// import { Options } from "kwin-api";
// import { Workspace, KWin } from "kwin-api/qml";
import { KWinDriver } from "@kwin/kwindriver";
// import { IShortcuts } from "./common";

// export var workspace: Workspace;
// export var options: Options;
// export var kwin: KWin;
// export var shortcuts: IShortcuts;

export function init(api: Api): void {
  workspace = api.workspace;
  options = api.options;
  kwin = api.kwin;
  shortcuts = api.shortcuts;

  new KWinDriver().main();
}
