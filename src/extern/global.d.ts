// Copyright (c) 2018 Eon S. Jeon <esjeon@hyunmu.am>
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

/* KWin global objects */
import { Options } from "kwin-api";
import { Workspace, KWin } from "kwin-api/qml";
import { KWinConfig } from "@src/driver/kwin/kwinconfig";

declare global {
  var workspace: Workspace;
  var options: Options;
  var kwin: KWin;
  interface Api {
    workspace: Workspace;
    options: Options;
    kwin: KWin;
  }
  var KWINCONFIG: KWinConfig;
  var CONFIG: KWinConfig;
  /* QML objects */
  var activityInfo: Plasma.TaskManager.ActivityInfo;
  var mousePoller: Plasma.PlasmaCore.DataSource;
  var scriptRoot: object;

  interface PopupDialog {
    show(text: string): void;
  }
  var popupDialog: PopupDialog;

  /* Common Javascript globals */
  let console: any;
  let setTimeout: any;
}
