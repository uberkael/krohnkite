import { Options } from "kwin-api";
import { Workspace, KWin } from "kwin-api/qml";
import { KWinDriver } from "./driver/kwin/kwindriver";

export var workspace: Workspace;
export var options: Options;
export var kwin: KWin;

function init(api: Api): void {
  workspace = api.workspace;
  options = api.options;
  kwin = api.kwin;

  new KWinDriver().main();
}
