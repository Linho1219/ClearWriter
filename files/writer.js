var package = require("./package.json");
var VERSION = package.version;
var cover_cnt = -1;
var CHAR_WIDTH = 14.56;
var PADDING_WIDTH;
var filename = "";
var local = false;
const WRITER = true;
const fs = window.require("fs");
const { Octokit } = require("@octokit/core");
const { remote, shell } = require("electron");
const { nativeTheme, systemPreferences, BrowserWindow } = remote;
const CURRENT_WINDOW = remote.getCurrentWindow();
const ipc = require("electron").ipcRenderer;

//暗色模式CSS常量定义
var darktheme =
  "*{--background:#252829;--darkback:#1A1C1D;--vscrollbar:#1A1C1D60;--selection:#fff2;--unfocusedselection:#252525;--active:#eee;--line: #222;--scroll:#666;--com:#fff1;--shadow:rgba(255,255,255,.3);--lighter:1.3;--darker:0.7;}";
//亮色模式CSS常量定义
var lighttheme =
  "*{--background:#f8f8f8;--darkback:#EEE;--vscrollbar:#EEE6;--selection:#A8DCEDA0;--unfocusedselection:#E5E5E5;--active:#333;--line: #ddd;--scroll:#aaa;--com:#0001;--shadow:rgba(0,0,0,.2);--lighter:1.1;--darker:0.9;}";

if (localStorage.theme != null)
  if (localStorage.theme == 0) {
    //如果之前存过亮色/暗色模式
    //0表示亮色模式
    document.getElementById("control").innerHTML = lighttheme;
    document.getElementById("theme").innerHTML = LIGHT;
    document.getElementById("preload_logo").src = "./files/prelogo-light.svg";
  } else if (localStorage.theme == 1) {
    //1表示暗色模式
    document.getElementById("control").innerHTML = darktheme;
    document.getElementById("theme").innerHTML = DARK;
    document.getElementById("preload_logo").src = "./files/prelogo-dark.svg";
  } else {
    document.getElementById("theme").innerHTML = AUTO;
    if (nativeTheme.shouldUseDarkColors) {
      document.getElementById("control").innerHTML = darktheme;
      document.getElementById("preload_logo").src = "./files/prelogo-dark.svg";
    } else {
      document.getElementById("control").innerHTML = lighttheme;
      document.getElementById("preload_logo").src = "./files/prelogo-light.svg";
    }
  }
else {
  //没有存过，默认为亮色模式
  localStorage.theme = 0;
  document.getElementById("control").innerHTML = lighttheme;
  document.getElementById("theme").innerHTML = LIGHT;
}

var nameArray = [];
if (localStorage.nameArray != null) {
  nameArray = JSON.parse(localStorage.nameArray);
} else {
  localStorage.nameArray = JSON.stringify(nameArray);
}

window.onstorage = () => {
  $("#css_ctrl").html(localStorage.css);
};

if (localStorage.disable_animation == 1) {
  document.getElementById("advanced_control").innerHTML =
    "*,*:after,*:before,*::-webkit-slider-thumb{transition:none !important;animation:none !important}";
}

const default_text =
  "# Welcome to Clear Writer，这是一个沉浸式 Markdown 写作软件。\n\n## 为什么编写 Clear Writer\n\n我开了我自己的博客之后，一直苦于 Windows 端没有我喜欢的 Markdown 编辑器。\n\n> 其实写作，最需要的并不是很好很强大的工具，而是一个不易让人分心的环境。\n\nMac上的 iA Writer 固然能很好地做到这一点，但作为一个初二学生，我确实也没有那个经济实力去买正版。我也不打算用盗版。我找到了一个类似的软件，叫做 [4Me 写字板](http://write4Me.sinaapp.com/)。它基于 CodeMirror。但是，它和 iA Writer 的差距未免有点大……\n\n但这却给了我一个启发：为什么不自己动手试着用 CodeMirror 制作一个 Markdown 编辑器呢？\n\n于是我征求了原作者同意之后，借着这次因新冠疫情宅家的时间，尝试自己以 4Me 写字板为蓝本，制作自己的写作工具。于是我做出了这个 Markdown 编辑器 —— Clear Writer，意味着希望人们使用它时，可以让人理清自己的思维。\n\n另外，Clear Writer 的一个很重要的一点是它支持实时 Markdown 语法。很多的所谓实时 Markdown，我都不是很喜欢——因为它们会把 Markdown 格式标记隐去。我不喜欢这样，我喜欢让格式牢牢掌控在使用者的手里。\n\n## Clear Writer 的特点\n- 全自动保存；\n- 所见即所得的实时 MarkDown，以及标题悬挂；\n- 支持亮色 / 暗色模式；\n- 漂亮的隐藏式滚动条；\n- 支持简体中文 / 繁体中文 / 英文三种语言；\n- 支持开启 / 关闭行号；\n- 高亮当前段落；\n- 漂亮的光标闪动和跳动效果；\n- 界面自适应；\n- 内容全部在本地缓存，完全隐私保护；\n- 支持导出 `.txt`、`.md`、`.doc`、`.html`、带 CSS 的 `html` 5 种格式；\n- 平滑滚动；\n- 可让你立即进入状态的”闪念“功能（v1.7+）。\n\n## 使用技巧\n\n- 点击顶栏上的全屏按钮或按下 `F11`（或 `Fn + F11`）切入全屏，安心写作；\n- 鼠标移动至顶部时显示顶栏，其中可以切换亮/暗色模式、行号、语言等；\n- 点击顶栏上的图钉 `📌` 按钮可以固定顶栏，使其不自动隐藏；\n- 右上角有 `另存为...` 按钮，点击可以将文字导出为其他格式文本；\n- 点击左上角的 `Clear Writer` 会在侧边栏显示你现在正在看的这段文字，再次点击 `Clear Writer` 隐藏侧边栏；\n- 可撤销最近的 2000 次操作，无惧修改；\n- Clear Writer 全自动保存，正常情况下每 3 分钟自动保存一次，在关闭的时候也会再次自动保存一次。实在不放心，还可以 `Ctrl + S` 手动保存；\n- 查找：`Ctrl + F`；\n- 查找下一个：`Ctrl + G`；\n- 查找上一个：`Shift + Ctrl + G`；\n- 替换：`Shift + Ctrl + F`；\n- 替换全部：`Shift + Ctrl + R`。\n\n## 兼容性\n\nWindows 7 及以上。\n\n## 关于\n\nClear Writer 使用 GNU General Public License 3.0 进行许可。\n\n编码工具：Visual Studio & Visual Studio Code\n安装包制作工具：NSIS\n\n### Clear Writer 的诞生离不开：\n\n- 西文字体：NeverMind（SIL Open Font License 1.1）；\n- 中文字体：思源黑体（SIL Open Font License 1.1）；\n- 编辑器基础：CodeMirror（MIT License）；\n- Markdown 渲染：editor.md（MIT License）；\n- 构建基础：Electron（MIT License）；\n- 蓝本：4Me Writer，无协议状态，但已经开发者口头许可。\n\n衷心感谢所有为本项目提供支持与帮助的人。";
//手搓i18n
var cur_num;
var quicknote = 0; //闪念模式
var stick = 0; //固定顶栏
var about = 0; //“关于”栏
var settings = 0; //设置栏
var DARK,
  LIGHT,
  ON,
  OFF,
  SAVED_AT,
  AUTO_SAVED_AT,
  CHOOSE_FILE,
  NEW,
  ENSURE_DEL,
  YES,
  FNAME,
  FBLINK = "https://support.qq.com/products/174144",
  SEARCH,
  REPLACE,
  SEARCHTIP,
  RWITH,
  CREATE_FROM_FILE,
  RELSE_MOUSE,
  DRAG_HERE,
  SUCCEED,
  ALL,
  CANCEL,
  SKIP,
  PREVIEW,
  OR,
  CLICK_TO_UPLOAD,
  COUNT,
  WORD,
  CHAR,
  TIME,
  WITH_SPACE,
  SAVE_AS,
  CHOOSE_MAIN_COLOR,
  DIY_COLOR,
  SET_TO_DEFALT,
  AUTO,
  WITH_STYLE,
  QUICK_NOTE,
  TERM,
  DEFALT,
  THIS_IS_A_BACKUP,
  FILE_LIST_TITLE,
  NOTHING_TO_COUNT,
  MAXMIZE,
  RESTORE,
  NEW_VER,
  UPDATE_NOW,
  SHOW_NEXT_TIME,
  DONT_SHOW_AGAIN,
  REPLACE_CURR_DATA,
  IMPORT_CANCELED,
  COLLECTING_DATA,
  SENDING_DATA,
  SEND_SUCCEEDED,
  NET_ERR,
  PULLING_LIST,
  CHOOSE_BACKUP,
  DOWNLOADING_DATA,
  PARSING_DATA,
  NEWEST;

function set_lang_to(lang) {
  //用于初始化语言的函数
  switch (lang) {
    case "en":
      DARK = "Dark";
      LIGHT = "Light";
      ON = "On";
      OFF = "Off";
      SAVED_AT = "Saved at ";
      AUTO_SAVED_AT = "Automatically saved at ";
      CHOOSE_FILE = "Choose an essay";
      NEW = "New";
      ENSURE_DEL = "Are you sure? It is IRREVERSIBLE.";
      YES = "Yes";
      FNAME = "Rename";
      SEARCH = "Search";
      REPLACE = "Replace";
      SEARCHTIP = "Use /re/ syntax for regex search. <br />Press Esc to Exit.";
      RWITH = "With";
      RELSE_MOUSE = "release the mouse button";
      DRAG_HERE = "Drag your file here";
      CREATE_FROM_FILE = "Create an essay from a local file...";
      SUCCEED = "Your file has uploaded successfully";
      ALL = "All";
      CANCEL = "Cancel";
      SKIP = "Skip";
      PREVIEW = "Preview";
      OR = "or";
      CLICK_TO_UPLOAD = "Click to choose a file";
      COUNT = "Count";
      WORD = "Words";
      CHAR = "Chars";
      TIME = "Expected reading time";
      WITH_SPACE = " (with spaces)";
      NO_WHEN_MSGBOX = "Commands can not be executed when a dialog is open";
      SAVE_AS = "Save as...";
      CHOOSE_MAIN_COLOR = "Choose your main color";
      DIY_COLOR = "Pick a color...";
      SET_TO_DEFALT = "Set to defalt";
      AUTO = "Follow the OS";
      WITH_STYLE = " (with styles)";
      QUICK_NOTE = "Quick note";
      TERM = "Monospaced font";
      DEFALT = "Normal font";
      THIS_IS_A_BACKUP =
        "This is a backup file of Clear Writer, including all the user's all passages and settings except the user's account data. You can learn more about it on [the website of Clear Writer](https://henrylin666.gitee.io/clearwriter/). This backup file was created by Clear Writer version ${VERSION} on ${date}.";
      FILE_LIST_TITLE = "Essay List";
      NOTHING_TO_COUNT = "There is nothing to count";
      MAXMIZE = "Maxmize";
      RESTORE = "Restore";
      NEW_VER = "A New Version Detected - ";
      UPDATE_NOW = "Update now";
      SHOW_NEXT_TIME = "Show me next time";
      DONT_SHOW_AGAIN = "Do not prompt this version again";
      REPLACE_CURR_DATA =
        "Would you like to replace all current data with this backup?";
      IMPORT_CANCELED = "Import canceled";
      COLLECTING_DATA = "Collecting data";
      SENDING_DATA = "Sending data";
      SEND_SUCCEEDED = "Data sending succeeded";
      NET_ERR = "Network exception, please try again";
      PULLING_LIST = "Pulling backup list";
      CHOOSE_BACKUP = "Choose a backup";
      DOWNLOADING_DATA = "Downloading data";
      PARSING_DATA = "Parsing data";
      NEWEST = "The current version is the latest version";
      $("#title_of_theme").html("Theme");
      $("#title_of_num").html("Line numbers");
      $("#title_of_lang").html("Language");
      $("#lang").html("English (US)");
      $("#save_btn").html("Save as...");
      $("#about").html(
        '<h1 id="h1-welcome-to-clear-writer-an-immersive-markdown-writing-software-"><a name="Welcome to Clear Writer, an immersive Markdown writing software." class="reference-link"></a><span class="header-link octicon octicon-link"></span>Welcome to Clear Writer, an immersive Markdown writing software.</h1><h2 id="h2-why-to-write-clear-writer"><a name="Why to write Clear Writer" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Why to write Clear Writer</h2><p>After starting my own blog, I’ve been struggling with the lack of a Markdown editor on the Windows that I like.</p><blockquote><p>Actually, we don’t need a very powerful tool for writing. All we need is an environment that can make us not easily distracted.</p></blockquote><p>iA Writer certainly does this well, but as a student, I really didn’t have the means to buy the software. And I don’t plan to use piracy either. I found a silimar software called <a href="http://write4Me.sinaapp.com/">4Me Writer</a>. It is based on CodeMirror, but the difference between it and iA Writer is a bit large….</p><p>But it did inspire me: why not try making a Markdown editor with CodeMirror myself?</p><p>So after asking the original author’s permission, I took the time to try to make my own writing tool using the 4Me writing board as a model. So I made this Markdown editor — Clear Writer — meaning that I wanted people to use it so that they could clear their minds.</p><p>Also, a very important thing about Clear Writer is that it supports real-time Markdown preview. A lot of the so-called real-time Markdowns, I’m not a big fan of - because they hide the Markdown format markup. I don’t like that, I like to keep the format firmly in the hands of the user.</p><h2 id="h2-features-of-clear-writer"><a name="Features of Clear Writer" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Features of Clear Writer</h2><ul><li>Fully automated preservation.</li><li>Real-time MarkDown for WYSIWYG, and title hanging.</li><li>Support bright/dark mode.</li><li>Nice scroll bar.</li><li>Support Simplified Chinese / Traditional Chinese / English.</li><li>Support for turning line numbers on/off.</li><li>Highlight the current paragraph.</li><li>Beautiful cursor flickering and jumping effects.</li><li>Interface adaptation.</li><li>All content is cached locally, with full privacy protection.</li><li>Support for exporting <code>.txt</code>, <code>.md</code>, <code>.doc</code>, <code>.html</code>, <code>html (with CSS)</code> in 5 formats.</li><li>Smooth rolling.</li><li>Quick note (v1.7+) that puts you in a writing state immediately.</li></ul><h2 id="h2-tips-for-using"><a name="Tips for using" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Tips for using</h2><ul><li>Writing with peace of mind by clicking the full screen button on the title bar or by pressing <code>F11</code> (or <code>Fn + F11</code>) to go full screen.</li><li>The top bar is displayed when the mouse is moved to the top, where it is possible to switch between light/dark modes, line numbers, language, etc.</li><li>The top bar can be fixed so that it is not automatically hidden by clicking the <code>📌</code> button on the top bar.</li><li>The upper right corner has the <code>Save as...</code> button, which allows the text to be exported to other text formats.</li><li>Clicking on <code>Clear Writer</code> in the upper left corner will display the text you are reading right now — this article — in the sidebar, and clicking on <code>Clear Writer</code> again will hide the sidebar.</li><li>The last 2000 operations can be revoked without fear of modification.</li><li>Clear Writer saves automatically, normally every 3 minutes, and again when it is closed. If you are not sure, you can also save it manually by <code>Ctrl + S</code>.</li><li>Search: <code>Ctrl + F</code>.</li><li>Find the next one: <code>Ctrl + G</code>.</li><li>Find previous: <code>Shift + Ctrl + G</code>.</li><li>Replace: <code>Shift + Ctrl + F</code>.</li><li>Replace all: <code>Shift + Ctrl + R</code>.</li></ul><h2 id="h2-compatibility"><a name="Compatibility" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Compatibility</h2><p>Windows 7+.</p><h2 id="h2-about-"><a name="About." class="reference-link"></a><span class="header-link octicon octicon-link"></span>About.</h2><p>Clear Writer is licensed under the GNU General Public License 3.0.</p><p>Coding tool: Visual Studio & Visual Studio Code<br>Installer creation tool: NSIS</p><h3 id="h3-clear-writer-was-born-from-"><a name="Clear Writer was born from." class="reference-link"></a><span class="header-link octicon octicon-link"></span>Clear Writer was born from:</h3><ul><li>Font: NeverMind (SIL Open Font License 1.1), Sarasa Gothic (SIL Open Font License 1.1).</li><li>Editor base: CodeMirror (MIT License).</li><li>Markdown rendering: editor.md (MIT License).</li><li>Building blocks: Electron (MIT License).</li><li>Icons: Font Awsome (Font Awesome Free License).</li><li>Blueprint: 4Me Writer, no agreement status, but has been orally licensed by the developer.</li></ul><p>Thanks to all those who have supported and helped with this project.</p>'
      );
      $("#copy").html("Copy");
      $("#paste").html("Paste");
      $("#cut").html("Cut");
      $("#selectall").html("Select all");
      $("#bold").html("Bold");
      $("#italic").html("Italic");
      $("#linethrough").html("Strike through");
      $("#hyperlink").html("Hyper link");
      $("#undo").html("Undo");
      $("#redo").html("Redo");
      $("#title_of_main_color").html("Main color");
      $("#fold").html("Fold");
      $("#advance").html("Advanced");
      $("#title_of_disable_animation").html("Disable animations");
      $("#title_of_settings").html("Settings");
      $("#title_of_look").html("Appearance");
      $("#set_main_color").html("Set...");
      $("#title_of_font").html("Font");
      $("#experiment").html("Experiments");
      $("#experiment-warning").html(
        "WARNING: EXPERIMENTAL FEATURES AHEAD! By enabling these features, Clear Writer may be instable."
      );
      $("#title_of_acrylic").html("Enable arylic (Win10 1803+)");
      $("#title_of_opacity").html("Background opacity");
      $("#title_of_dev").html("Dev tools");
      $("#dev_tools").html("Open");
      $("#backup_and_sync").html("Backup & Sync");
      $("#import_from_file").html("Import data");
      $("#export_to_file").html("Export data");
      $("#sync_start_btn").html("Sign in with a Github account");
      $("#sync_upload").html("Upload data");
      $("#sync_download").html("Download data");
      $("#title_of_css").html("Custom CSS");
      $("#css_btn").html("Edit...");
      $("#title_of_update").html("Updates");
      $("#update").html("Check for updates");
      $("#current_vertion").html(`Current Version: ${VERSION}`);
      $("#open").attr("title", "Open an essay【Ctrl + O】");
      $("#feedback").attr("title", "Give feedback");
      $("#open_settings").attr("title", "Open settings");
      $("#topbar_undo").attr("title", "Undo【Ctrl + Z】");
      $("#topbar_redo").attr("title", "Redo【Ctrl + Y or Ctrl + Shift + Z】");
      $("#topbar_bold").attr(
        "title",
        '#Bold#Use a pair of "**" or a pair of "__" to wrap the bold text【Ctrl + B】'
      );
      $("#topbar_italic").attr(
        "title",
        '#Italic#Use a pair of "*" or a pair of "_" to wrap the italic text【Ctrl + I】'
      );
      $("#topbar_strikethrough").attr(
        "title",
        '#Strike through#Use a pair of "~~" to wrap the text you want to strike through【Ctrl + I】'
      );
      $("#topbar_link").attr(
        "title",
        'Hyper link#Use a pair of "[" and "]" to wrap the text, following by a URL wrapped with "(" and ")"【Ctrl + I】'
      );
      $("#find").attr("title", "Search【Ctrl + F】");
      $("#replace").attr("title", "Replace【Ctrl + H or Ctrl + Shift + F】");
      $("#preview").attr("title", "Preview");
      $("#counter").attr("title", "Counter");
      $("#title").attr("title", "About");
      $("#save_btn").attr("title", "#Save as#Save the essay as a file.");
      $("#minimize").attr("title", "Minimize");
      $("#maxmize").attr("title", "Maximize");
      $("#fullscreen").attr("title", "Fullscreen");
      $("#close").attr("title", "Close");

      break;
    case "en_uk":
      set_lang_to("en");
      CHOOSE_MAIN_COLOR = "Choose your main colour";
      DIY_COLOR = "Pick a colour...";
      IMPORT_CANCELED = "Import cancelled";
      $("#title_of_main_color").html("Main colour");
      $("#lang").html("English (UK)");
      $("#about").html(
        '<h1 id="h1-welcome-to-clear-writer-an-immersive-markdown-writing-software-"><a name="Welcome to Clear Writer, an immersive Markdown writing software." class="reference-link"></a><span class="header-link octicon octicon-link"></span>Welcome to Clear Writer, an immersive Markdown writing software.</h1><h2 id="h2-why-to-write-clear-writer"><a name="Why to write Clear Writer" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Why to write Clear Writer</h2><p>After starting my own blog, I’voe been struggling with the lack of a Markdown editor on the Windows that I like.</p><blockquote><p>Actually, we don’t need a very powerful tool for writing. All we need is an environment that can make us not easily distracted.</p></blockquote><p>iA Writer certainly does this well, but as a student, I really didn’t have the means to buy the software. And I don’t plan to use piracy either. I found a silimar software called <a href="http://write4Me.sinaapp.com/">4Me Writer</a>. It is based on CodeMirror, but the difference between it and iA Writer is a bit large….</p><p>But it did inspire me: why not try making a Markdown editor with CodeMirror myself?</p><p>So after asking the original author’s permission, I took the time to try to make my own writing tool using the 4Me writing board as a model. So I made this Markdown editor — Clear Writer — meaning that I wanted people to use it so that they could clear their minds.</p><p>Also, a very important thing about Clear Writer is that it supports real-time Markdown preview. A lot of the so-called real-time Markdowns, I’m not a big fan of - because they hide the Markdown format markup. I don’t like that, I like to keep the format firmly in the hands of the user.</p><h2 id="h2-features-of-clear-writer"><a name="Features of Clear Writer" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Features of Clear Writer</h2><ul><li>Fully automated preservation.</li><li>Real-time MarkDown for WYSIWYG, and title hanging.</li><li>Support bright/dark mode.</li><li>Nice scroll bar.</li><li>Support Simplified Chinese / Traditional Chinese / English.</li><li>Support for turning line numbers on/off.</li><li>Highlight the current paragraph.</li><li>Beautiful cursor flickering and jumping effects.</li><li>Interface adaptation.</li><li>All content is cached locally, with full privacy protection.</li><li>Support for exporting <code>.txt</code>, <code>.md</code>, <code>.doc</code>, <code>.html</code>, <code>html (with CSS)</code> in 5 formats.</li><li>Smooth rolling.</li><li>Quick note (v1.7+) that puts you in a writing state immediately.</li></ul><h2 id="h2-tips-for-using"><a name="Tips for using" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Tips for using</h2><ul><li>Writing with peace of mind by clicking the full screen button on the title bar or by pressing <code>F11</code> (or <code>Fn + F11</code>) to go full screen.</li><li>The top bar is displayed when the mouse is moved to the top, where it is possible to switch between light/dark modes, line numbers, language, etc.</li><li>The top bar can be fixed so that it is not automatically hidden by clicking the <code>📌</code> button on the top bar.</li><li>The upper right corner has the <code>Save as...</code> button, which allows the text to be exported to other text formats.</li><li>Clicking on <code>Clear Writer</code> in the upper left corner will display the text you are reading right now — this article — in the sidebar, and clicking on <code>Clear Writer</code> again will hide the sidebar.</li><li>The last 2000 operations can be revoked without fear of modification.</li><li>Clear Writer saves automatically, normally every 3 minutes, and again when it is closed. If you are not sure, you can also save it manually by <code>Ctrl + S</code>.</li><li>Search: <code>Ctrl + F</code>.</li><li>Find the next one: <code>Ctrl + G</code>.</li><li>Find previous: <code>Shift + Ctrl + G</code>.</li><li>Replace: <code>Shift + Ctrl + F</code>.</li><li>Replace all: <code>Shift + Ctrl + R</code>.</li></ul><h2 id="h2-compatibility"><a name="Compatibility" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Compatibility</h2><p>Windows 7+.</p><h2 id="h2-about-"><a name="About." class="reference-link"></a><span class="header-link octicon octicon-link"></span>About.</h2><p>Clear Writer is licenced under the GNU General Public Licence 3.0.</p><p>Coding tool: Visual Studio & Visual Studio Code<br>Installer creation tool: NSIS</p><h3 id="h3-clear-writer-was-born-from-"><a name="Clear Writer was born from." class="reference-link"></a><span class="header-link octicon octicon-link"></span>Clear Writer was born from:</h3><ul><li>Font: NeverMind (SIL Open Font Licence 1.1), Sarasa Gothic (SIL Open Font Licence 1.1).</li><li>Editor base: CodeMirror (MIT Licence).</li><li>Markdown rendering: editor.md (MIT Licence).</li><li>Building blocks: Electron (MIT Licence).</li><li>Icons: Font Awsome (Font Awesome Free Licence).</li><li>Blueprint: 4Me Writer, no agreement status, but has been orally licenced by the developer.</li></ul><p>Thanks to all those who have supported and helped with this project.</p>'
      );
      break;
    case "zh-hk":
      ON = "開";
      OFF = "關";
      SAVED_AT = "已存儲於 ";
      AUTO_SAVED_AT = "已自動存儲於 ";
      CHOOSE_FILE = "選擇隨筆";
      NEW = "新建";
      ENSURE_DEL = "確定永久删除？此操作不可撤銷。";
      YES = "確定";
      SEARCH = "蒐索";
      REPLACE = "替換";
      SEARCHTIP = "使用 /re/ 語法以使用規則運算式蒐索，<br />按下 Esc 以退出";
      RWITH = "替換為";
      CREATE_FROM_FILE = "從檔案新建...";
      RELSE_MOUSE = "放開滑鼠";
      DRAG_HERE = "將檔案拖到此處";
      SUCCEED = "讀取成功";
      SKIP = "跳過";
      PREVIEW = "預覽";
      DARK = "暗";
      LIGHT = "亮";
      FNAME = "重命名";
      ALL = "全部";
      CANCEL = "取消";
      OR = "或";
      CLICK_TO_UPLOAD = "點此打開隨筆";
      COUNT = "統計";
      WORD = "字詞數";
      CHAR = "字元數";
      TIME = "預期閱讀時間";
      WITH_SPACE = " (包含空格)";
      NO_WHEN_MSGBOX = "對話方塊打開時無法執行命令";
      SAVE_AS = "另存為...";
      CHOOSE_MAIN_COLOR = "選擇主題色";
      DIY_COLOR = "選擇顏色...";
      SET_TO_DEFALT = "設為預設值";
      AUTO = "跟隨系統";
      WITH_STYLE = "（帶有樣式）";
      QUICK_NOTE = "速記";
      TERM = "等寬字體";
      DEFALT = "預設字體";
      THIS_IS_A_BACKUP =
        "這是 Clear Writer 編輯器的資料備份檔案，其中包含了用戶除登入資訊外的所有文章和用戶設置。你可以在 [Clear Writer 的官方網站](https://henrylin666.gitee.io/clearwriter/)瞭解到更多資訊。此備份由 Clear Writer 版本 ${VERSION} 創建於 ${date}。";
      FILE_LIST_TITLE = "隨筆清單";
      NOTHING_TO_COUNT = "沒有可供統計的文字";
      MAXMIZE = "最大化";
      RESTORE = "還原";
      NEW_VER = "檢測到新版本 - ";
      UPDATE_NOW = "立即更新";
      SHOW_NEXT_TIME = "下次一定";
      DONT_SHOW_AGAIN = "此版本不再提示";
      REPLACE_CURR_DATA = "確定覆蓋當前數據？";
      IMPORT_CANCELED = "導入已取消";
      COLLECTING_DATA = "正在準備數據";
      SENDING_DATA = "正在發送數據";
      SEND_SUCCEEDED = "已成功備份至雲端";
      NET_ERR = "網絡异常，請重試";
      PULLING_LIST = "正在拉取備份清單";
      CHOOSE_BACKUP = "選擇一個備份";
      DOWNLOADING_DATA = "正在下載數據";
      PARSING_DATA = "正在解析數據";
      NEWEST = "當前已是最新版本";
      $("#title_of_theme").html("主題");
      $("#title_of_num").html("行號");
      $("#title_of_lang").html("語言");
      $("#lang").html("繁體中文");
      $("#save_btn").html("另存為...");
      $("#about").html(
        '<h1 id="h1-welcome-to-clear-writer-markdown-"><a name="Welcome to Clear Writer，這是一個沉浸式 Markdown 寫作軟件。" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Welcome to Clear Writer，這是一個沉浸式 Markdown 寫作軟件。</h1><h2 id="h2--clear-writer"><a name="為什麼編寫 Clear Writer" class="reference-link"></a><span class="header-link octicon octicon-link"></span>為什麼編寫 Clear Writer</h2><p>我開了我自己的部落格之後，一直苦於Windows端沒有我喜歡的Markdown編輯器。</p><blockquote><p>其實寫作，最需要的並不是很好很强大的工具，而是一個不易讓人分心的環境。</p></blockquote><p>Mac上的iA Writer固然能很好地做到這一點，但作為一個初二學生，我確實也沒有那個經濟實力去買正版。我也不打算用盜版。我找到了一個類似的軟件，叫做 <a href="http://write4Me.sinaapp.com/">4Me寫字板</a>。它基於CodeMirror。但是，它和 iA Writer的差距未免有點大……</p><p>但這卻給了我一個啟發：為什麼不自己動手試著用CodeMirror製作一個Markdown編輯器呢？</p><p>於是我徵求了原作者同意之後，借著這次因新冠疫情宅家的時間，嘗試自己以4Me寫字板為藍本，製作自己的寫作工具。於是我做出了這個Markdown編輯器——Clear Writer，意味著希望人們使用它時，可以讓人理清自己的思維。</p><p>另外，Clear Writer的一個很重要的一點是它支持實时Markdown語法。很多的所謂實时Markdown，我都不是很喜歡——因為它們會把Markdown格式標記隱去。我不喜歡這樣，我喜歡讓格式牢牢掌控在使用者的手裡。</p><h2 id="h2-clear-writer-"><a name="Clear Writer 的特點" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Clear Writer 的特點</h2><ul><li>全自動保存；</li><li>所見即所得的實时MarkDown，以及標題懸掛；<br>-支持亮色/暗色模式；<br>-漂亮的隱藏式滾動條；<br>-支持簡體中文/繁體中文/英文三種語言；<br>-支持開啟/關閉行號；<br>-高亮當前段落；<br>-漂亮的光標閃動和跳動效果；<br>-介面自我調整；<br>-內容全部在本地緩存，完全隱私保護；<br>-支持匯出<code>.txt</code>、<code>.md</code>、<code>.doc</code>、<code>.html</code>、帶CSS的<code>html</code> 5種格式；<br>-平滑滾動；<br>-可讓你立即進入狀態的”閃念“功能（v1.7+）</li></ul><h2 id="h2-u4F7Fu7528u6280u5DE7"><a name="使用技巧" class="reference-link"></a><span class="header-link octicon octicon-link"></span>使用技巧</h2><ul><li>點擊頂欄上的全屏按鈕或按下<code>F11</code>（或<code>Fn + F11</code>）切入全屏，安心寫作；</li><li>滑鼠移動至頂部時顯示頂欄，其中可以切換亮/暗色模式、行號、語言等；</li><li>點擊頂欄上的圖釘<code>📌</code>按鈕可以固定頂欄，使其不自動隱藏；</li><li>右上角有<code>另存為…</code>按鈕，點擊可以將文字匯出為其他格式文字；</li><li>點擊左上角的<code>Clear Writer</code>會在側邊欄顯示你現在正在看的這段文字，再次點擊<code>Clear Writer</code>隱藏側邊欄；</li><li>可撤銷最近的2000次操作，無懼修改；</li><li>Clear Writer全自動保存，正常情况下每3分鐘自動保存一次，在關閉的時候也會再次自動保存一次。實在不放心，還可以<code>Ctrl + S</code>手動保存；<br>-查找：<code>Ctrl + F</code>；<br>-查找下一個：<code>Ctrl + G</code>；<br>-查找上一個：<code>Shift + Ctrl + G</code>；<br>-替換：<code>Shift + Ctrl + F</code>；<br>-替換全部：<code>Shift + Ctrl + R</code>。</li></ul><h2 id="h2-u76F8u5BB9u6027"><a name="相容性" class="reference-link"></a><span class="header-link octicon octicon-link"></span>相容性</h2><p>Windows 7及以上。</p><h2 id="h2-u95DCu65BC"><a name="關於" class="reference-link"></a><span class="header-link octicon octicon-link"></span>關於</h2><p>Clear Writer使用GNU General Public License 3.0進行許可。</p><p>編碼工具：Visual Studio & Visual Studio Code<br>安裝包製作工具：NSIS</p><h3 id="h3-clear-writer-"><a name="Clear Writer的誕生離不開：" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Clear Writer的誕生離不開：</h3><ul><li>西文字體：NeverMind（SIL Open Font License 1.1）；</li><li>中文&等距字體：更紗黑體（SIL Open Font License 1.1）；</li><li>編輯器基礎：CodeMirror（MIT License）；</li><li>Markdown渲染：editor.md（MIT License）；</li><li>構建基礎：Electron（MIT License）；</li><li>图标：Font Awsome (Font Awesome Free License)；</li><li>藍本：4Me Writer，無協定狀態，但已經開發者口頭許可。</li></ul><p>衷心感謝所有為本項目提供支援與幫助的人。</p>'
      );
      $("#cut").html("剪切");
      $("#copy").html("複製");
      $("#paste").html("粘貼");
      $("#selectall").html("全選");
      $("#bold").html("粗體");
      $("#italic").html("斜體");
      $("#linethrough").html("删除線");
      $("#hyperlink").html("超連結");
      $("#undo").html("撤銷");
      $("#title_of_main_color").html("主題色");
      $("#fold").html("折疊");
      $("#redo").html("重做");
      $("#advance").html("高級");
      $("#title_of_disable_animation").html("禁用動效");
      $("#title_of_settings").html("設定");
      $("#title_of_look").html("外觀");
      $("#set_main_color").html("設定...");
      $("#title_of_font").html("字體");
      $("#experiment").html("實驗性功能");
      $("#experiment-warning").html(
        "警告: 以下為實驗性功能！啟用這些選項可能導致程式崩潰或卡頓。"
      );
      $("#title_of_acrylic").html("啟用亞克力效果（Win10 1803+）");
      $("#title_of_opacity").html("視窗背景不透明度");
      $("#title_of_dev").html("開發人員工具");
      $("#dev_tools").html("開啟");
      $("#backup_and_sync").html("備份與同步");
      $("#import_from_file").html("從檔案導入數據");
      $("#export_to_file").html("匯出數據到檔案");
      $("#sync_start_btn").html("使用 Github 帳戶登入");
      $("#sync_upload").html("備份數據到雲端");
      $("#sync_download").html("下載數據到本地");
      $("#title_of_css").html("自定義 CSS");
      $("#css_btn").html("編輯...");
      $("#title_of_update").html("更新");
      $("#update").html("檢查更新");
      $("#current_vertion").html(`當前版本：${VERSION}`);
      $("#open").attr("title", "打開隨筆【Ctrl + O】");
      $("#feedback").attr("title", "提供迴響");
      $("#open_settings").attr("title", "打開設定");
      $("#topbar_undo").attr("title", "撤銷【Ctrl + Z】");
      $("#topbar_redo").attr("title", "重做【Ctrl + Y 或 Ctrl + Shift + Z】");
      $("#topbar_bold").attr(
        "title",
        "#加粗#使用一對“**”或一對“__”來包裹被加粗的文字【Ctrl + B】"
      );
      $("#topbar_italic").attr(
        "title",
        "#斜體#使用一對“*”或一對“_”來包裹斜體的文字【Ctrl + I】"
      );
      $("#topbar_strikethrough").attr(
        "title",
        "#删除線#使用一對“~~”來包裹添加删除線的文字"
      );
      $("#topbar_link").attr(
        "title",
        "#超連結#使用一對“[”“]”來包裹超連結的顯示文字,其後緊跟用“(”“)”包裹的URL【Ctrl + K】"
      );
      $("#find").attr("title", "查找【Ctrl + F】");
      $("#replace").attr("title", "替換【Ctrl + H 或 Ctrl + Shift + F】");
      $("#preview").attr("title", "預覽");
      $("#counter").attr("title", "文字計數器");
      $("#title").attr(
        "title",
        "#關於#點擊查看Clear Writer的開發歷程和更新日誌"
      );
      $("#save_btn").attr(
        "title",
        "#另存為#將隨筆另存為 .md、.txt、.doc、.html 等格式"
      );
      $("#minimize").attr("title", "最小化");
      $("#maxmize").attr("title", "最大化");
      $("#fullscreen").attr("title", "全屏");
      $("#close").attr("title", "關閉");
      break;
    case "zh-cn":
      DARK = "暗"; //暗色模式的显示名称
      LIGHT = "亮"; //亮色模式的显示名称
      ON = "开"; //开启状态的显示名称
      OFF = "关"; //关闭状态的显示名称
      SAVED_AT = "已保存于 "; //手动保存时在右上角的显示名称
      AUTO_SAVED_AT = "已自动保存于 "; //自动保存时在右上角的显示名称
      CHOOSE_FILE = "选择随笔";
      NEW = "新建";
      ENSURE_DEL = "确定永久删除？此操作不可撤销。";
      YES = "确定";
      FNAME = "重命名";
      SEARCH = "查找";
      REPLACE = "替换";
      SEARCHTIP = "使用 /re/ 语法以使用正则表达式搜索，<br />按下 Esc 以退出";
      RWITH = "替换为";
      CREATE_FROM_FILE = "从文件新建...";
      RELSE_MOUSE = "请放开鼠标";
      DRAG_HERE = "请将文件拖拽至此";
      SUCCEED = "读取成功";
      ALL = "全部";
      CANCEL = "取消";
      SKIP = "跳过";
      PREVIEW = "预览";
      COUNT = "统计";
      WORD = "字词数";
      CHAR = "字符数";
      TIME = "预计阅读时长";
      WITH_SPACE = " (包含空格)";
      SAVE_AS = "另存为...";
      CHOOSE_MAIN_COLOR = "选择主题色";
      DIY_COLOR = "选择颜色...";
      SET_TO_DEFALT = "设为默认值";
      AUTO = "跟随系统";
      WITH_STYLE = "（带样式）";
      QUICK_NOTE = "闪念";
      TERM = "等距字体";
      DEFALT = "默认字体";
      OR = "或";
      CLICK_TO_UPLOAD = "点击此处打开文件";
      THIS_IS_A_BACKUP =
        "这是 Clear Writer 编辑器的数据备份文件，其中包含了用户除登录信息外的所有文章和用户设置。你可以在 [Clear Writer 的官网](https://henrylin666.gitee.io/clearwriter/)了解到更多信息。此备份由 Clear Writer 版本 ${VERSION} 创建于 ${date}。";
      FILE_LIST_TITLE = "随笔列表";
      NOTHING_TO_COUNT = "没有可供统计的文本";
      MAXMIZE = "最大化";
      RESTORE = "还原";
      NEW_VER = "检测到新版本 - ";
      UPDATE_NOW = "立即更新";
      SHOW_NEXT_TIME = "下次一定";
      DONT_SHOW_AGAIN = "此版本不再提示";
      REPLACE_CURR_DATA = "确定覆盖当前数据？";
      IMPORT_CANCELED = "导入已取消";
      COLLECTING_DATA = "正在准备数据";
      SENDING_DATA = "正在发送数据";
      SEND_SUCCEEDED = "已成功备份至云端";
      NET_ERR = "网络异常，请重试";
      PULLING_LIST = "正在拉取备份列表";
      CHOOSE_BACKUP = "选择一个备份";
      DOWNLOADING_DATA = "正在下载数据";
      PARSING_DATA = "正在解析数据";
      NEWEST = "当前已是最新版本";
      $("#title_of_theme").html("主题");
      $("#title_of_num").html("行号");
      $("#title_of_lang").html("语言");
      $("#lang").html("简体中文");
      $("#save_btn").html("另存为...");
      $("#about").html(
        '<h1 id="h1-welcome-to-clear-writer-markdown-"><a name="Welcome to Clear Writer，这是一个沉浸式 Markdown 写作软件。" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Welcome to Clear Writer，这是一个沉浸式 Markdown 写作软件。</h1><h2 id="h2--clear-writer"><a name="为什么编写 Clear Writer" class="reference-link"></a><span class="header-link octicon octicon-link"></span>为什么编写 Clear Writer</h2><p>我开了我自己的博客之后，一直苦于 Windows 端没有我喜欢的 Markdown 编辑器。</p><blockquote><p>其实写作，最需要的并不是很好很强大的工具，而是一个不易让人分心的环境。</p></blockquote><p>Mac上的 iA Writer 固然能很好地做到这一点，但作为一个初二学生，我确实也没有那个经济实力去买正版。我也不打算用盗版。我找到了一个类似的软件，叫做 <a href="http://write4Me.sinaapp.com/">4Me 写字板</a>。它基于 CodeMirror。但是，它和 iA Writer 的差距未免有点大……</p><p>但这却给了我一个启发：为什么不自己动手试着用 CodeMirror 制作一个 Markdown 编辑器呢？</p><p>于是我征求了原作者同意之后，借着这次因新冠疫情宅家的时间，尝试自己以 4Me 写字板为蓝本，制作自己的写作工具。于是我做出了这个 Markdown 编辑器 —— Clear Writer，意味着希望人们使用它时，可以让人理清自己的思维。</p><p>另外，Clear Writer 的一个很重要的一点是它支持实时 Markdown 语法。很多的所谓实时 Markdown，我都不是很喜欢——因为它们会把 Markdown 格式标记隐去。我不喜欢这样，我喜欢让格式牢牢掌控在使用者的手里。</p><h2 id="h2-clear-writer-"><a name="Clear Writer 的特点" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Clear Writer 的特点</h2><ul><li>全自动保存；</li><li>所见即所得的实时 MarkDown，以及标题悬挂；</li><li>支持亮色 / 暗色模式；</li><li>漂亮的隐藏式滚动条；</li><li>支持简体中文 / 繁体中文 / 英文三种语言；</li><li>支持开启 / 关闭行号；</li><li>高亮当前段落；</li><li>漂亮的光标闪动和跳动效果；</li><li>界面自适应；</li><li>内容全部在本地缓存，完全隐私保护；</li><li>支持导出 <code>.txt</code>、<code>.md</code>、<code>.doc</code>、<code>.html</code>、带 CSS 的 <code>html</code> 5 种格式；</li><li>平滑滚动；</li><li>可让你立即进入状态的”闪念“功能（v1.7+）。</li></ul><h2 id="h2-u4F7Fu7528u6280u5DE7"><a name="使用技巧" class="reference-link"></a><span class="header-link octicon octicon-link"></span>使用技巧</h2><ul><li>点击顶栏上的全屏按钮或按下 <code>F11</code>（或 <code>Fn + F11</code>）切入全屏，安心写作；</li><li>鼠标移动至顶部时显示顶栏，其中可以切换亮/暗色模式、行号、语言等；</li><li>点击顶栏上的图钉 <code>📌</code> 按钮可以固定顶栏，使其不自动隐藏；</li><li>右上角有 <code>另存为...</code> 按钮，点击可以将文字导出为其他格式文本；</li><li>点击左上角的 <code>Clear Writer</code> 会在侧边栏显示你现在正在看的这段文字，再次点击 <code>Clear Writer</code> 隐藏侧边栏；</li><li>可撤销最近的 2000 次操作，无惧修改；</li><li>Clear Writer 全自动保存，正常情况下每 3 分钟自动保存一次，在关闭的时候也会再次自动保存一次。实在不放心，还可以 <code>Ctrl + S</code> 手动保存；</li><li>查找：<code>Ctrl + F</code>；</li><li>查找下一个：<code>Ctrl + G</code>；</li><li>查找上一个：<code>Shift + Ctrl + G</code>；</li><li>替换：<code>Shift + Ctrl + F</code>；</li><li>替换全部：<code>Shift + Ctrl + R</code>。</li></ul><h2 id="h2-u517Cu5BB9u6027"><a name="兼容性" class="reference-link"></a><span class="header-link octicon octicon-link"></span>兼容性</h2><p>Windows 7 及以上。</p><h2 id="h2-u5173u4E8E"><a name="关于" class="reference-link"></a><span class="header-link octicon octicon-link"></span>关于</h2><p>Clear Writer 使用 GNU General Public License 3.0 进行许可。</p><p>编码工具：Visual Studio & Visual Studio Code<br>安装包制作工具：NSIS</p><h3 id="h3-clear-writer-"><a name="Clear Writer 的诞生离不开：" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Clear Writer 的诞生离不开：</h3><ul><li>西文字体：NeverMind（SIL Open Font License 1.1）；</li><li>中文&等宽字体：更纱黑体（SIL Open Font License 1.1）；</li><li>编辑器基础：CodeMirror（MIT License）；</li><li>Markdown 渲染：editor.md（MIT License）；</li><li>构建基础：Electron（MIT License）；</li><li>图标: Font Awsome（Font Awesome Free License）；</li><li>蓝本：4Me Writer，无协议状态，但已经开发者口头许可。</li></ul><p>衷心感谢所有为本项目提供支持与帮助的人。</p><h2 id="h2-u66F4u65B0u65E5u5FD7"><a name="更新日志" class="reference-link"></a><span class="header-link octicon octicon-link"></span>更新日志</h2>   <h3 id="h3-v2-0" title=""><a name="v2.0" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v2.0</h3><ul><li title="">新增亚克力效果选项（需要在“设置”中手动开启，仅支持 Win10 1803+，不支持全屏模式）；</li><li title="">弃用思源黑体，将内置默认字体改为更纱黑体 UI SC（仍基于思源黑体），提升字体渲染效果及字库大小；</li><li title="">全面支持多光标输入（按下 Ctrl 并左键单击可以新建光标）；</li><li title="">修复默认字体下输入代码块需要等待一会儿才能加载出等距字体的问题</li><li title="">上线全新反馈社区；</li><li title="">修复了使用微软拼音 IME 输入时拼音采用等距字体显示的问题；</li><li title="">修复了使用微软拼音 IME 输入时选字框遮挡当前拼音的问题；</li><li title="">修复了语言为英语时预览功能异常的问题；</li><li title="">优化了一些动画效果的速度曲线；</li><li title="">新增开发人员工具入口，方便使用时定位 bug；</li><li title="">优化程序图标显示，解决圆角部分的锯齿现象；</li><li title="">新增替换快捷键 <code>Ctrl+H</code>；</li><li>实现响应式 UI，优化在小窗口下的体验；</li><li>优化打开超长文件名的文件时标题栏的显示；</li><li>颠倒暗色模式的主背景色和副背景色，优化体验，同时进行了按钮样式的微调；</li><li>修复了选中多行文本的时候选中部分色块在左侧会溢出的状况；</li><li>修复了选中多行文本的时候出现色块堆积的状况；</li><li>新增右键菜单项目图标；</li><li>新增删除文件时的确认动画；</li><li>修复了启动时加载 logo 无法使用主题色的情况；</li><li>优化替换时的工具栏，使其与查找工具栏统一，同时在替换的时候增加高亮；</li><li>新增双色图标；</li><li>修复了使用微软拼音 IME 时，选字框会遮挡文字的情况；</li><li>新增英文下的自动括号匹配；</li><li>实现在文件资源管理器中双击 <code>.md</code> 文件后直接用 Clear Writer 打开；</li><li>修复了在暗色模式下删除线显示不明显的问题；</li><li>新增开启行号时，当前行行号高亮效果；</li><li>新增自定义 CSS 功能，允许用户自己定义 Clear Writer 的 CSS 代码；</li><li>修改字体存储方式，缩小程序大小，提高渲染速度；</li><li>优化打开右键菜单时的动画；</li><li>优化预览窗口内容样式，增强可读性；</li><li>优化预览中 To-do 列表复选框的样式；</li><li>优化弹窗关闭按钮的样式；</li><li>新增按钮鼠标悬浮提示；</li><li>优化左侧栏的动画效果；</li><li>修复顶栏左侧的彩色按钮在 Win 7 下显示为黑白的情况；</li><li>加入自动检查更新的组件；</li><li>新增设置面板中的图标；</li><li>实现利用 Github Gist 同步文件和设置；</li><li>新增语言：英语（英国）</li></ul><p>另外由于开发者初三了，所以未来的一年里可能不会再有任何更新了，如果有遇到 bug 或者想提供一些新点子，可以在 Clear Writer 反馈论坛里面发帖。中考之后，如果还有时间的话，我会继续尝试将 Clear Writer 做得更好。由于跨域访问限制的存在，而我又租不起服务器，Clear Writer Online 已经搁浅，未来做成微信小程序的可能性更大，特此说明。</p><p>2020 年 8 月<br>Henrylin666</p><h3 id="h3-clear-writer-v1-8-"><a name="Clear Writer v1.8 更新日志" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.8</h3><ul><li>引入等距更纱黑体作为等宽字体；</li><li>新增统一的设置面板；</li><li>支持在全局使用等宽字体；</li><li>新增查找时的工具条；</li><li>优化超长随笔名的显示；</li><li>优化启动时长；</li><li>顶栏改版，使用图标代替文字，取消标签页</li></ul>   <h3 id="h3-v1-7"><a name="v1.7" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.7</h3><ul><li>新增新建随笔时的回车快捷确认；</li><li>修复标题中插入 HTML 标签时的异常；</li><li>新增禁用动画选项，以保证能在低配置环境下运行；</li><li>新增查找栏的动画效果；</li><li>修复程序体积过大的问题；</li><li>大幅缩短程序加载时长；</li><li>新增 <code>html</code> 和 <code>带 CSS 的 html</code> 的随笔另存支持。</li></ul><h3 id="h3-v1-6"><a name="v1.6" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.6</h3><ul><li>优化主题色选择，支持直接跟随系统主题色（仅 Windows 10）；</li><li>优化亮色/暗色模式适配，支持跟随系统亮色/暗色模式（仅 Windows 10）；</li><li>新增全新的开始屏幕磁贴（仅 Windows 10）；</li><li>修复“预览”窗格中 HTML 代码块未被正常高亮的问题；</li><li>在正文编辑的代码块中使用等宽字体 Consolas，带来原汁原味的代码风；</li><li>新增对 Python、PHP、ruby 和 go 语言的代码块高亮支持；</li></ul><h3 id="h3-v1-5"><a name="v1.5" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.5</h3><ul><li>修复两个弹窗并行时的一个 BUG；</li><li>修复“折叠”“剪切”按钮未翻译的问题；</li><li>修复了全屏模式下点击最大化/还原按钮无反应的 BUG；</li><li>新增打开、切换随笔时标题栏的切换动画；</li><li>新增“另存为”格式：.md、.doc；</li><li>新增预览时的代码块高亮；</li><li>新增删除随笔时的“取消”按钮；</li><li>新增覆盖输入模式下（按Insert键进入）的特有光标，以和插入模式区别开来</li></ul><h3 id="h3-v1-4"><a name="v1.4" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.4</h3><ul><li>修复了在重命名随笔之后随笔内容丢失的 BUG； </li><li>修复了在切换随笔后快捷键定义重复现象的 BUG；</li><li>抛弃系统自带的标题栏，自己做了一个更漂亮的；</li><li>新增统计功能（统计的是最终生成的文本，不包含 Markdown 语法字符）。</li></ul><h3 id="h3-v1-3"><a name="v1.3" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.3</h3><ul><li>更新内核为 Chromium 82；</li><li>支持更改主题色（”主题“组下），自定义你的 Clear Writer；</li><li>标题栏优化：鼠标悬停在组标题上时才显示按钮；</li><li>大幅缩短切换随笔、切换语言的用时；</li><li>优化语言切换方式；</li><li>增加右键菜单项目，现支持 11 种操作，如加粗、斜体等，解救鼠标党；</li><li>在标题栏的”工具“组下新增”查找“”查找下一个“”替换“按钮，解救鼠标党；</li><li>新增 Markdown 标题段落折叠。</li></ul><h3 id="h3-v1-2"><a name="v1.2" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.2</h3><ul><li>新图标；</li><li>新增预览窗口。</li></ul><h3 id="h3-v1-1"><a name="v1.1" class="reference-link"></a><span class="header-link octicon octicon-link"></span>v1.1</h3><ul><li>新增右键菜单；</li><li>新增“从文件新建”功能。</li></ul>'
      );
      $("#copy").html("复制");
      $("#paste").html("粘贴");
      $("#cut").html("剪切");
      $("#selectall").html("全选");
      $("#bold").html("粗体");
      $("#italic").html("斜体");
      $("#linethrough").html("删除线");
      $("#hyperlink").html("超链接");
      $("#undo").html("撤销");
      $("#redo").html("重做");
      $("#title_of_main_color").html("主题色");
      $("#fold").html("折叠");
      $("#advance").html("高级");
      $("#title_of_disable_animation").html("禁用动画");
      $("#title_of_settings").html("设置");
      $("#title_of_look").html("外观");
      $("#set_main_color").html("设置...");
      $("#title_of_font").html("字体");
      $("#experiment").html("实验性功能");
      $("#experiment-warning").html(
        "警告: 以下为实验性功能！启用这些选项可能导致程序崩溃或卡顿。"
      );
      $("#title_of_acrylic").html("启用亚克力效果（Win10 1803+）");
      $("#title_of_opacity").html("窗口背景不透明度");
      $("#title_of_dev").html("开发人员工具");
      $("#dev_tools").html("打开");
      $("#backup_and_sync").html("备份与同步");
      $("#import_from_file").html("从文件导入数据");
      $("#export_to_file").html("导出数据到文件");
      $("#sync_start_btn").html("使用 Github 账户登录");
      $("#sync_upload").html("备份数据到云端");
      $("#sync_download").html("下载数据到本地");
      $("#title_of_css").html("自定义 CSS");
      $("#css_btn").html("编辑...");
      $("#title_of_update").html("更新");
      $("#update").html("检查更新");
      $("#current_vertion").html(`当前版本：${VERSION}`);
      $("#open").attr("title", "打开随笔【Ctrl + O】");
      $("#feedback").attr("title", "提供反馈");
      $("#open_settings").attr("title", "打开设置");
      $("#topbar_undo").attr("title", "撤销【Ctrl + Z】");
      $("#topbar_redo").attr("title", "重做【Ctrl + Y 或 Ctrl + Shift + Z】");
      $("#topbar_bold").attr(
        "title",
        "#加粗#使用一对“**”或一对“__”来包裹被加粗的文本【Ctrl + B】"
      );
      $("#topbar_italic").attr(
        "title",
        "#斜体#使用一对“*”或一对“_”来包裹斜体的文本【Ctrl + I】"
      );
      $("#topbar_strikethrough").attr(
        "title",
        "#删除线#使用一对“~~”来包裹添加删除线的文本"
      );
      $("#topbar_link").attr(
        "title",
        "#超链接#使用一对“[”“]”来包裹超链接的显示文本，其后紧跟用“(”“)”包裹的 URL【Ctrl + K】"
      );
      $("#find").attr("title", "查找【Ctrl + F】");
      $("#replace").attr("title", "替换【Ctrl + H 或 Ctrl + Shift + F】");
      $("#preview").attr("title", "预览");
      $("#counter").attr("title", "文本计数器");
      $("#title").attr(
        "title",
        "#关于#点击查看 Clear Writer 的开发历程和更新日志"
      );
      $("#save_btn").attr(
        "title",
        "#另存为#将随笔另存为 .md、.txt、.doc、.html 等格式"
      );
      $("#minimize").attr("title", "最小化");
      $("#maxmize").attr("title", "最大化");
      $("#fullscreen").attr("title", "全屏");
      $("#close").attr("title", "关闭");
      break;
  }
  reset_switch();
}
document.body.className = localStorage.font == 1 ? "term" : "";
CHAR_WIDTH = localStorage.font == 1 ? 10 : 14.56;
if (localStorage.lang != null) set_lang_to(localStorage.lang);
//如果之前选过，直接使用
else {
  //否则从浏览器获取当前语言
  switch (navigator.language.toLowerCase()) {
    case "zh-tw":
    case "zh-hk":
      localStorage.lang = "zh-hk";
      set_lang_to("zh-hk");
      break;
    case "en":
      localStorage.lang = "en";
      set_lang_to("en");
      break;
    case "zh-cn":
    case "zh":
      localStorage.lang = "zh-cn";
      set_lang_to("zh-cn");
      break;
    default:
      localStorage.lang = "en"; //语言默认为英文
      set_lang_to("en");
      break;
  }
}
$("#css_ctrl").html(localStorage.css);
var octokit;
const syncDiv = document.getElementById("sync_dashboard");
if (localStorage.uid) {
  syncDiv.className = "connected";
  document.getElementById(
    "avartar"
  ).src = `https://avatars0.githubusercontent.com/u/${localStorage.uid}?s=40v=4`;
  document.getElementById("username_span").innerHTML = localStorage.username;
  octokit = new Octokit({ auth: localStorage.token });
}

var slider = document.getElementById("opacity");

slider.value = localStorage.opacity * 100;

$("#opacity_label").html(slider.value + "%");

if (!localStorage.opacity) localStorage.opacity = 0.7;

if (localStorage.acrylic == "1")
  if (document.getElementById("control").innerHTML == darktheme)
    $("#window-background").html(
      `html{background:rgba(26, 28, 29, ${localStorage.opacity})}`
    );
  else
    $("#window-background").html(
      `html{background:rgba(248, 248, 248, ${localStorage.opacity})}`
    );
else {
  $("#window-background").html("html{background:var(--background);");
  slider.disabled = true;
}

if (localStorage.line_num != null)
  //如果之前有存过行号设置
  document.getElementById("num").className =
    localStorage.line_num == 1 ? "on" : "off";
else {
  //没有存过，默认不显示行号
  localStorage.line_num = 0;
  document.getElementById("num").className =
    localStorage.line_num == 1 ? "on" : "off";
}

if (localStorage.disable_animation != null)
  //如果之前有禁用动画
  document.getElementById("disable_animation").className =
    localStorage.disable_animation == 1 ? "on" : "off";
else {
  //没有存过，默认不禁用动画
  localStorage.disable_animation = 0;
  document.getElementById("disable_animation").className =
    localStorage.disable_animation == 1 ? "on" : "off";
}

if (localStorage.acrylic != null)
  //如果之前有存过毛玻璃设置
  document.getElementById("acrylic").className =
    localStorage.acrylic == 1 ? "on" : "off";
if (localStorage.acrylic != 1) {
} else {
  //没有存过，默认不显示行号
  localStorage.line_num = 0;
  document.getElementById("acrylic").className =
    localStorage.acrylic == 1 ? "on" : "off";
}

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  //获得行号设置，开始生成CodeMirror
  lineNumbers: localStorage.line_num * 1, //有行号为1，无行号为0，乘以1（字符转数字）
  lineWrapping: true,
  indentUnit: 4,
  undoDepth: 2000,
  cursorBlinkRate: 800,
  styleActiveLine: true,
  foldGutter: true,
  spellcheck: true,
  autocapitalize: true,
  autoCloseTags: true,
  autoCloseBrackets: {
    pairs: "()[]{}**``''\"\"",
    closeBefore: ")]}*`'\":;>",
    triples: "",
    explode: "[]{}",
  },
  mode: "gfm",
  theme: "default",
  allowDropFileTypes: ["text/plain"],
});
if (localStorage.line_num == 1)
  editor.setOption("gutters", [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
  ]);
else editor.setOption("gutters", "");

function paddingChanger() {
  var cnt = 0;
  var value = editor.getValue();
  if (value.match(/(^|\n)#{6}\s/) != null) cnt = 6;
  else if (value.match(/(^|\n)#{5}\s/) != null) cnt = 5;
  else if (value.match(/(^|\n)#{4}\s/) != null) cnt = 4;
  else if (value.match(/(^|\n)#{3}\s/) != null) cnt = 3;
  else if (value.match(/(^|\n)#{2}\s/) != null) cnt = 2;
  else if (value.match(/(^|\n)#{1}\s/) != null) cnt = 1;
  PADDING_WIDTH = (cnt + 1) * CHAR_WIDTH + 5;
  document.getElementById("padding_control").innerHTML =
    ".CodeMirror pre.CodeMirror-line,CodeMirror pre.CodeMirror-line-like{padding-left:" +
    PADDING_WIDTH +
    "px !important}";
}

editor.on("focus", paddingChanger);
editor.on("change", paddingChanger);

if (localStorage.maincolor) {
  if (localStorage.maincolor == "auto") {
    document.getElementById("main_color_control").innerHTML =
      "* {--main:#" + systemPreferences.getAccentColor() + "}";
  } else
    document.getElementById("main_color_control").innerHTML =
      "* {--main:" + localStorage.maincolor + "}";
}
var encoding;
window.onload = function () {
  document.getElementById("preload").style.opacity = "0";
  setTimeout(function () {
    document.getElementById("preload").style.display = "none";
  }, 180);
  if (
    remote.process.argv.length == 2 &&
    remote.process.argv[0].match(/clear_writer.exe$/)
  ) {
    filename = remote.process.argv[1];
    var str = readTextFile(filename);
    editor.setValue(str);
    local = true;
    var arr = filename.split("\\");
    changeTitleBar(arr[arr.length - 1], true);
    start();
  } else {
    msgbox(CHOOSE_FILE + "...", build_list(), 35, 25, true);
    checkUpdate();
  }
};

ipc.on("openFile", (event, message) => {
  save_content();
  if (settings) set_settings();
  if (about) set_about();
  if (msgboxQuery.length > 0) msgboxQuery = [];
  if (msgbox) close_msgbox();
  if (first) start();
  first = 0;
  var arr = message.split("\\");
  changeTitleBar(arr[arr.length - 1], true);
  filename = message;
  local = true;
  var str = readTextFile(message);
  editor.setValue(str);
});

function readTextFile(filename) {
  var orgStr = fs.readFileSync(filename, { encoding: "UTF-8" });
  var str = "";
  if (orgStr != "") {
    var data = fs.readFileSync(filename);
    var encodingDetect = jschardet.detect(data, { minimumThreshold: 0 });
    if (!encodingDetect.encoding || !encodingDetect.confidence) {
      str = orgStr;
      encoding = "UTF-8";
    } else {
      const decoder = require("iconv-lite");
      str = decoder.decode(data, encodingDetect.encoding);
      encoding = encodingDetect.encoding;
    }
  } else {
    str = "";
    encoding = "UTF-8";
  }
  return str;
}

var pcon = document.getElementById("padding_control");

var first = 1;
function changeTitleBar(string, local) {
  $("head>title").html(string + " - Clear Writer");
  var topbar = document.getElementById("top_file_name");
  topbar.style.opacity = "0";
  topbar.style.transform = "translateY(-10px)";
  setTimeout(
    (topbar, local) => {
      topbar.style.transition = "none";
      topbar.style.transition = "";
      topbar.innerHTML = string;
      topbar.style.opacity = "";
      if (local) topbar.className = "local";
      else topbar.className = "";
      topbar.style.transform = "translateY(0px)";
    },
    280,
    topbar,
    local
  );
}
function choose_file(num) {
  cur_num = num;
  local = false;
  filename = nameArray[num];
  if (window.localStorage.getItem(filename))
    editor.setValue(window.localStorage.getItem(filename));
  else editor.setValue(default_text);
  changeTitleBar(filename);
  editor.setOption("styleActiveLine", { nonEmpty: true });
  editor.focus();
  editor.clearHistory();
  if (quicknote) {
    if (localStorage.maincolor == "auto") {
      document.getElementById("main_color_control").innerHTML =
        "* {--main:#" + systemPreferences.getAccentColor() + "}";
    } else
      document.getElementById("main_color_control").innerHTML =
        "* {--main:" + localStorage.maincolor + "}";
  }
  quicknote = 0;
  if (first) start();
  first = 0;
}

function start() {
  $(document)
    .keyup(function (e) {
      if (e.which == 17 || e.which == 224) {
        glvar_isCtrl = false;
      }
    })
    .keydown(function (e) {
      if (e.which == 27) {
        if (document.getElementById("msg_close")) close_msgbox();
        return false;
      }

      if (e.which == 17 || e.which == 224) {
        glvar_isCtrl = true;
        glvar_ctrlDownTime = Date.parse(new Date());
        return false;
      }

      if (glvar_isCtrl == true) {
        var curtime = Date.parse(new Date());
        var timedf = curtime - glvar_ctrlDownTime;
        if (timedf < 2000) {
          switch (e.which) {
            case 83: //s
              save_content(1);
              return false;
              break;
            case 66: //b
              editor.focus();
              editor.replaceSelection(" **" + editor.getSelection() + "** ");
              return false;
              break;
            case 73: //i
              editor.focus();
              editor.replaceSelection(" *" + editor.getSelection() + "* ");
              return false;
              break;
            case 75: //k
              editor.focus();
              editor.replaceSelection(
                " [" + editor.getSelection() + "](https://example.com/) "
              );
              editor.execCommand("goCharLeft");
              editor.execCommand("goCharLeft");
              return false;
              break;
            case 81: //q
              editor.focus();
              editor.foldCode(editor.getCursor());
              return false;
              break;
            case 79: //o
              save_content();
              msgbox(CHOOSE_FILE + "...", build_list(), 35, 25, false);
              break;
            case 78: //n
              save_content();
              msgbox(CHOOSE_FILE + "...", build_list(), 35, 25, false);
              new_file();
              break;
            case 72: //h
              editor.focus();
              editor.execCommand("replace");
              e.preventDefault();
              return false;
              break;
            default:
              break;
          }
        }
      }

      //F11 全屏，针对 Electron
      if (e.which == 122) {
        handleFullScreen();
        return false;
      }
    });
}

function rename_quick_note(callback) {
  if (document.getElementById("msgbox")) return;
  msgbox(
    FNAME + QUICK_NOTE,
    '<input type="text" name="fname" class="fname_box" id="fname_box0" onkeydown="changeInputlength(this,43,0);" onkeypress="check_enter();"><button id="fname_btn">' +
      FNAME +
      "</button>",
    35,
    10,
    true
  );
  setTimeout(() => {
    if (callback)
      document
        .getElementById("fname_btn")
        .addEventListener("click", validateForm(0, callback), false);
    else
      document
        .getElementById("fname_btn")
        .addEventListener("click", validateForm(0), false);
  }, 300);
}

function build_list() {
  var list;
  list = '<ul id="files_list">';
  list += '<li id="new" onclick="new_file()">+ ' + NEW + "...</li>";
  list +=
    '<li id="quick_note" onclick="quick_note()">+ ' + QUICK_NOTE + "...</li>";
  for (let i = 0; i < nameArray.length; i++) {
    list += `<li id="list_${i}" title="%WIDE%${nameArray[i]}"><span onclick="f_del(${i})">⛔</span><span onclick="f_rename(${i})">📝</span><a onclick="choose_file(${i});close_msgbox();">${nameArray[i]}</a></li>`;
  }
  return list;
}

function new_file() {
  $("#box_title").html(NEW + "...");
  var t = "";
  if (document.getElementById("fname_box0") != null) {
    t = document.getElementById("fname_box0").value;
  }
  document.getElementById("content").innerHTML =
    '<input type="text" name="fname" class="fname_box" id="fname_box0" onkeydown="changeInputlength(this,43,0);" onkeypress="check_enter();"><button onclick="validateForm(0)" id="fname_btn">' +
    NEW +
    '</button><p><button onclick="new_file_from_local()">' +
    CREATE_FROM_FILE +
    '</button><button onclick="cancel_creating()" style="background:var(--background);color: var(--active)">' +
    CANCEL +
    "</button></p>";
  document.getElementById("fname_box0").focus();
  if (t != "") {
    document.getElementById("fname_box0").value = t;
    changeInputlength(document.getElementById("fname_box0"), 43, 0);
  }
}

function quick_note() {
  var day = new Date();
  var time = day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
  var date =
    day.getFullYear() + "." + (day.getMonth() + 1) + "." + day.getDate();
  nameArray.unshift(QUICK_NOTE + " " + date + " " + time);
  localStorage.nameArray = JSON.stringify(nameArray);
  choose_file(0);
  close_msgbox();
  quicknote = 1;
  document.getElementById("main_color_control").innerHTML =
    "* {--main:#EA6725}";
  editor.setValue("");
}

function check_enter() {
  if (event.keyCode == 13) {
    validateForm(0);
  }
  return false;
}

function cancel_creating() {
  $("#content").html(build_list());
  $("#box_title").html(CHOOSE_FILE + "...");
}

var f_cont;
function new_file_from_local() {
  var t;
  t = document.getElementById("fname_box0").value;
  document.getElementById("content").innerHTML =
    '<input type="text" name="fname" class="fname_box" id="fname_box0" onkeydown="changeInputlength(this,43,0);" onkeypress="check_enter();"><span id="description">' +
    DRAG_HERE +
    '</span><div id="box">' +
    DRAG_HERE +
    '</div><input id="real_uploader" style="display:none;" type="file" accept=".txt,.text,.md,.markdown" onchange="openFile(event)"><a style="color:#999;font-size:16px;margin: 5px .6rem;user-select:none;">' +
    OR +
    '</a><button onclick="' +
    "$('#real_uploader').click();" +
    '">' +
    CLICK_TO_UPLOAD +
    '</button><br /><button onclick="submit_file()" id="fname_btn">' +
    YES +
    '</button><button onclick="new_file()" style="background:var(--background); color:var(--active)">' +
    CANCEL +
    "</button>";
  if (t != "") {
    document.getElementById("fname_box0").value = t;
    changeInputlength(document.getElementById("fname_box0"), 43, 0);
  }
  document.getElementById("fname_box0").focus();
  dragdrop();
}
function submit_file() {
  if (document.getElementById("fname_box0").value == "") {
    document.getElementById("fname_box0").style.background = "rgba(255,0,0,.2)";
  } else if (f_cont == null) {
    document.getElementById("description").style.color = "rgba(255,0,0,.5)";
  } else {
    nameArray.unshift(document.getElementById("fname_box0").value);
    localStorage.nameArray = JSON.stringify(nameArray);
    choose_file(0);
    editor.setValue(f_cont);
    close_msgbox();
  }
}
function validateForm(num) {
  if (
    document.getElementById("fname_box" + num).value == "" ||
    localStorage.getItem(document.getElementById("fname_box" + num).value)
  ) {
    document.getElementById("fname_box" + num).style.background =
      "rgba(255,0,0,.2)";
  } else {
    nameArray.unshift(document.getElementById("fname_box0").value);
    localStorage.nameArray = JSON.stringify(nameArray);
    choose_file(0);
    close_msgbox();
  }
}

function set_theme() {
  if (localStorage.theme == 0) {
    //亮色模式转暗色模式
    document.getElementById("control").innerHTML = darktheme;
    document.getElementById("theme").innerHTML = DARK;
    localStorage.theme = 1;
  } else if (localStorage.theme == 1) {
    //暗色模式转跟随系统
    document.getElementById("theme").innerHTML = AUTO;
    if (nativeTheme.shouldUseDarkColors)
      document.getElementById("control").innerHTML = darktheme;
    else document.getElementById("control").innerHTML = lighttheme;
    localStorage.theme = "auto";
  } else {
    //跟随系统转亮色模式
    document.getElementById("control").innerHTML = lighttheme;
    document.getElementById("theme").innerHTML = LIGHT;
    localStorage.theme = 0;
  }
  //窗口背景颜色
  if (localStorage.acrylic == "1")
    if (document.getElementById("control").innerHTML == darktheme)
      $("#window-background").html(
        `html{background:rgba(26, 28, 29, ${localStorage.opacity})}`
      );
    else
      $("#window-background").html(
        `html{background:rgba(248, 248, 248, ${localStorage.opacity})}`
      );
}

function set_line_num() {
  //切换行号的可见性
  localStorage.line_num = localStorage.line_num == 1 ? "0" : "1";
  editor.setOption("lineNumbers", localStorage.line_num == 1 ? true : false);
  if (localStorage.line_num == 1)
    editor.setOption("gutters", [
      "CodeMirror-linenumbers",
      "CodeMirror-foldgutter",
    ]);
  else editor.setOption("gutters", "");
  document.getElementById("num").className =
    localStorage.line_num == 1 ? "on" : "off";
}

function set_font() {
  //切换字体
  localStorage.font = localStorage.font == 1 ? "0" : "1";
  document.body.className = localStorage.font == 1 ? "term" : "";
  document.getElementById("font").innerHTML =
    localStorage.font == 1 ? TERM : DEFALT;
}

function set_acrylic() {
  if (confirm("更改后需要重启应用才能生效。确定吗？")) {
    localStorage.acrylic = localStorage.acrylic == 1 ? "0" : "1";
    document.getElementById("acrylic").className =
      localStorage.acrylic == 1 ? "on" : "off";
    ipc.send("toogle-acrylic");
  }
}

function set_opacity() {
  $("#opacity_label").html(slider.value + "%");
  localStorage.opacity = slider.value / 100;
  if (localStorage.acrylic == "1")
    if (document.getElementById("control").innerHTML == darktheme)
      $("#window-background").html(
        `html{background:rgba(26, 28, 29, ${localStorage.opacity})}`
      );
    else
      $("#window-background").html(
        `html{background:rgba(248, 248, 248, ${localStorage.opacity})}`
      );
}

function set_lang() {
  //切换语言
  var list = '<div class="choose"><ul>';
  list +=
    '<li onclick="' +
    "click_lang('zh-cn');" +
    '">' +
    '<span class="flag" id="cn"></span>' +
    "简体中文（中国大陆）" +
    "</li>";
  list +=
    '<li onclick="' +
    "click_lang('zh-hk');" +
    '">' +
    '<span class="flag" id="hk"></span>' +
    "繁體中文（中國香港/中國澳門/中國臺灣）" +
    "</li>";
  list +=
    '<li onclick="' +
    "click_lang('en');" +
    '">' +
    '<span class="flag" id="us"></span>' +
    "English (United States)" +
    "</li>";
  list +=
    '<li onclick="' +
    "click_lang('en_uk');" +
    '">' +
    '<span class="flag" id="uk"></span>' +
    "English (United Kingdom)" +
    "</li>";
  list += "</ul></div>";
  msgbox("语言 · 語言 · Language", list, 30, 20, false, 1001);
}

function click_lang(lang) {
  set_lang_to(lang);
  localStorage.lang = lang;
  reset_switch();
  close_msgbox();
  save_content();
}

function reset_switch() {
  $("#theme").html(
    localStorage.theme == 1 ? DARK : localStorage.theme == 0 ? LIGHT : AUTO
  );
  $("#font").html(localStorage.font == 1 ? TERM : DEFALT);
}

function set_about() {
  //设置“关于”栏的开/关
  if (settings != 0) set_settings();
  if (about == 0) {
    //开起来
    document.getElementById("about").style.display = "block";
    cover("set_about()"); //激活遮罩，onclick设为'set_about()'
    setTimeout(() => {
      document.getElementById("about").style.left = "0";
    }, 100);
    about = 1;
  } else {
    //关掉
    document.getElementById("about").style.left = "";
    close_cover();
    setTimeout(() => {
      document.getElementById("about").style.display = "";
    }, 320);
    about = 0;
  }
}

function set_settings() {
  //设置设置栏的开/关
  if (about != 0) set_settings();
  if (settings == 0) {
    //开起来
    document.getElementById("settings").style.display = "block";
    cover("set_settings()"); //激活遮罩，onclick设为'set_settings()'
    setTimeout(() => {
      document.getElementById("settings").style.left = "0";
    }, 100);
    settings = 1;
  } else {
    //关掉
    document.getElementById("settings").style.left = "";
    close_cover();
    setTimeout(() => {
      document.getElementById("settings").style.display = "";
    }, 320);
    settings = 0;
  }
}

function disable_animation() {
  if (localStorage.disable_animation == 1) {
    document.getElementById("advanced_control").innerHTML = "";
    localStorage.disable_animation = 0;
  } else {
    document.getElementById("advanced_control").innerHTML =
      "*,*:after,*:before,*::-webkit-slider-thumb{transition:none !important;animation:none !important}";
    localStorage.disable_animation = 1;
  }
  document.getElementById("disable_animation").className =
    localStorage.disable_animation == 1 ? "on" : "off";
}
var msgboxQuery = [];
function msgbox(title, content, width, height, disableClose, layer, markdown) {
  //弹窗函数，传入标题和内容
  if (document.getElementById("msgbox")) {
    msgboxQuery[msgboxQuery.length] = {
      title: title,
      content: content,
      width: width,
      height: height,
      disableClose: disableClose,
      layer: layer,
      markdown: markdown,
    };
    return;
  }
  cover(disableClose ? "" : "close_msgbox()", layer ? layer - 1 : false);
  var box = document.createElement("div");
  document.body.appendChild(box);
  box.id = "msgbox";
  box.className = "msgbox";
  box.style.width = width + "rem";
  box.style.height = height + "rem";
  if (layer) box.style["z-index"] = layer;
  box.innerHTML = `${
    disableClose ? "" : '<i id="msg_close" onclick="close_msgbox()"></i>'
  }<h1 id="box_title">${title}</h1><div id="content">${content}</div>`;
  if (markdown) {
    editormd.markdownToHTML(markdown, {
      htmlDecode: "style,script,iframe",
      emoji: true,
      taskList: true,
    });
    const links = document.querySelectorAll(`#${markdown} a[href^="http"]`);
    Array.prototype.forEach.call(links, (link) => {
      const url = link.getAttribute("href");
      if (url.indexOf("http") === 0) {
        link.onclick = (e) => {
          e.preventDefault();
          shell.openExternal(url);
        };
        var ico = document.createElement("i");
        ico.className = "fad fa-external-link";
        insertAfter(ico, link);
      }
    });
  }
}

function close_msgbox() {
  //关闭弹窗
  var box = document.getElementById("msgbox");
  if (box) {
    box.id = "msgbox_closed";
    if (localStorage.disable_animation == "1") box.parentNode.removeChild(box);
    else
      box.onanimationend = (event) => {
        event.target.parentNode.removeChild(event.target);
      };
    close_cover();
    if (msgboxQuery.length > 0) {
      msgbox(
        msgboxQuery[0].title,
        msgboxQuery[0].content,
        msgboxQuery[0].width,
        msgboxQuery[0].height,
        msgboxQuery[0].disableClose,
        msgboxQuery[0].layer,
        msgboxQuery[0].markdown
      );
      msgboxQuery.splice(0, 1);
    } else editor.focus();
  }
}

function cover(onclick, layer) {
  //遮罩激活函数
  cover_cnt += 1;
  var coverdiv = document.createElement("div");
  coverdiv.id = "cover_" + cover_cnt;
  coverdiv.className = "cover";
  coverdiv.style.opacity = "1";
  coverdiv.style.display = "block";
  if (layer) coverdiv.style["z-index"] = layer;
  coverdiv.setAttribute("onclick", onclick);
  document.body.appendChild(coverdiv);
}

function close_cover() {
  //遮罩隐藏函数
  var coverdiv = document.getElementById("cover_" + cover_cnt);
  cover_cnt -= 1;
  coverdiv.id = "cover_closed";
  if (localStorage.disable_animation == "1")
    document.body.removeChild(coverdiv);
  else
    coverdiv.onanimationend = (event) => {
      document.body.removeChild(event.target);
    };
}

function tips(content) {
  var tip = document.createElement("div");
  if (document.getElementById("tips")) close_tips();
  tip.innerHTML = content;
  tip.id = "tips";
  tip.className = "tips";
  tip.onclick = close_tips;
  document.body.appendChild(tip);
  setTimeout(close_tips, 4000, tip);
}

function close_tips(tip) {
  if (!tip) tip = document.getElementById("tips");
  if (tip) {
    tip.id = "tip_closed";
    if (localStorage.disable_animation == "1") document.body.removeChild(tip);
    else
      tip.onanimationend = (event) => {
        document.body.removeChild(event.target);
      };
  }
}

function set_stick() {
  //设置顶栏是否钉住
  if (stick == 0) {
    document.getElementById("topbar").style.opacity = "1";
    stick = 1;
    document.getElementById("stick").innerHTML = "📍";
  } else {
    document.getElementById("topbar").style.opacity = "";
    stick = 0;
    document.getElementById("stick").innerHTML = "📌";
  }
}

function changeInputlength(cursor, maxlenth, num) {
  var getText = document.getElementById("fname_box" + num);
  var len = getText.value.length == 0 ? 10 : getText.value.length + 3;
  cursor.size;
  if (len == 0) cursor.size = 10;
  else if (len > maxlenth) cursor.size = maxlenth + 3;
  else cursor.size = len + 3;
  getText.style.background = "var(--background)";
}

function f_del(num) {
  document.getElementById("list_" + num).innerHTML =
    '<span class="ensure_del">' +
    ENSURE_DEL +
    '</span><span style="color:var(--main);font-size:16px;opacity:1;" onclick="del(' +
    num +
    ')">' +
    YES +
    '</span><span style="color:#888;font-size:16px;opacity:1;" onclick="cancel_creating()">' +
    CANCEL +
    "</span>";
  document.getElementById("list_" + num).style = "font-size:16px";
}

function del(num) {
  if (num == cur_num) {
    cur_num = filename = null;
    if (document.getElementById("msg_close"))
      document.getElementById("msg_close").style.display = "none";
    document.getElementById("cover_" + cover_cnt).removeAttribute("onclick");
    $("head>title").html("Clear Writer");
  }
  window.localStorage.removeItem(nameArray[num]); //删除这个板子的内容
  nameArray.splice(num, 1); //从随笔列表里面删掉这个元素
  localStorage.nameArray = JSON.stringify(nameArray); //将随笔列表同步到存储里面
  document.getElementById("content").innerHTML = build_list();
}

function f_rename(num) {
  var li = document.getElementById("list_" + num);
  li.innerHTML =
    '<input type="text" name="fname" class="fname_box" id="fname_box' +
    num +
    '" onkeydown="changeInputlength(this,28,' +
    num +
    ');" value="' +
    nameArray[num] +
    '"><button onclick="rename(' +
    num +
    ",document.getElementById(" +
    "'fname_box" +
    num +
    "').value)" +
    '" id="fname_btn">' +
    FNAME +
    '</button><button onclick="cancel_creating();" style="background:var(--background);color: var(--active)">' +
    CANCEL +
    "</button>";
}

function rename(num, des) {
  if (des == "" || (nameArray[num] != des && localStorage.getItem(des))) {
    document.getElementById("fname_box" + num).style.background =
      "rgba(255,0,0,.2)";
  } else {
    var content = localStorage.getItem(nameArray[num]);
    localStorage.setItem(des, content);
    localStorage.removeItem(nameArray[num]);
    nameArray[num] = des;
    localStorage.nameArray = JSON.stringify(nameArray);
    document.getElementById("content").innerHTML = build_list();
  }
}

var local_save = setInterval(save_content, 60000);

var glvar_isCtrl = false;
var glvar_ctrlDownTime = 0;

function save_content(user) {
  //保存函数：命就在这里了
  if (!filename) return;
  var fileContent = editor.getValue();
  if (local) {
    try {
      fs.writeFileSync(filename, fileContent, { encoding: encoding });
    } catch {
      try {
        fs.writeFileSync(filename, fileContent, { encoding: "UTF-8" });
      } catch {
        tips("ERR_FILE_LOCKED");
        return false;
      }
    }
  } else {
    window.localStorage.setItem(filename, fileContent);
  }
  var d = new Date();
  var time =
    d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes(); //在顶栏显示一下提示
  var note;
  if (user == 1) {
    //手动保存
    note = SAVED_AT + time;
    tips(note);
  } //自动保存
  else note = AUTO_SAVED_AT + time;
  $("#save_info").html(note);
}

function handleFullScreen() {
  // 判断是否已经是全屏
  // 如果是全屏，退出
  if (CURRENT_WINDOW.isFullScreen()) {
    CURRENT_WINDOW.setFullScreen(false);
    document.getElementById("fullscreen").style.backgroundImage =
      "url('files/fullscreen.svg')";
    $("#header-control").html("");
  } else {
    // 否则，进入全屏
    CURRENT_WINDOW.setFullScreen(true);
    document.getElementById("fullscreen").style.backgroundImage =
      "url('files/close_fullscreen.svg')";
    $("#header-control").html(
      "#header{opacity:0;box-shadow:none !important;-webkit-app-region: no-drag;}#header:hover{opacity:1 !important;}#header ~ .sidebar{height:100%;top:0;}#header:hover ~ .sidebar{height:calc(100% - 40px);top:40px;}html{background:var(--background) !important;}"
    );
  }
}

function down_cur() {
  //“另存为”函数
  var list = '<div class="choose"><ul>';
  list +=
    '<li onclick="' +
    "download('txt');" +
    '">' +
    '<span class="file" style="background:#6A6A6A;color:#fff;">T</span>' +
    ".txt" +
    "</li>";
  list +=
    '<li onclick="' +
    "download('md');" +
    '">' +
    '<span class="file" style="background:#000;color:#fff;">M<a style="font-size:13px;display:inline-block;width:10px;text-align:center;">↓</a></span>' +
    ".md" +
    "</li>";
  list +=
    '<li onclick="' +
    "download('doc');" +
    '">' +
    '<span class="file" style="background:#1A73E8;color:#fff;">W</span>' +
    ".doc" +
    "</li>";
  list +=
    '<li onclick="' +
    "download('html');" +
    '">' +
    '<span class="file" style="background:#0095D7;color:#fff;">H</span>' +
    ".html" +
    "</li>";
  list +=
    '<li onclick="' +
    "download('html_css');" +
    '">' +
    '<span class="file" style="background:#EF6725;color:#fff;">H</span>' +
    ".html" +
    WITH_STYLE +
    "</li>";
  list += "</ul></div>";
  msgbox(SAVE_AS, list, 30, 20, false);

  //download(nameArray[cur_num] + '.txt', editor.getValue());
}

function download(type) {
  close_msgbox();
  var name = nameArray[cur_num];
  var content = editor.getValue();
  switch (type) {
    case "txt":
    case "md":
      var element = document.createElement("a");
      const blob1 = new Blob([content]);
      element.download = name + "." + type;
      element.style = "display: none";
      element.href = URL.createObjectURL(blob1);
      document.body.appendChild(element);
      element.click();

      setTimeout(
        (element) => {
          document.body.removeChild(element);
          window.URL.revokeObjectURL(blob1);
        },
        100,
        element
      );
      break;
    case "doc":
      make_html(content);
      $("#databox").wordExport(name);
      $("#calculate").html("");
      break;
    case "html":
    case "html_css":
      make_html(content);
      var res = document.getElementById("databox").innerHTML;
      res = "<title>" + name + "</title></head><body>" + res + "</body></html>";
      if (type == "html_css")
        res =
          "<style>html{color:#333;font-size:16px;background:#f8f8f8}body{max-width:880px;width:100%;margin:60px auto}img{border-radius:4px;box-shadow:rgba(0,0,0,.2) 0 5px 15px;margin:20px 15px;max-width:calc(100% - 30px)}.emoji{width:18px;height:18px;box-shadow:none;border-radius:0;margin:0}code{background:rgba(0,0,0,.08);border-radius:3px;padding:0 7px}.prettyprint.linenums.prettyprinted{padding: 20px !important;box-shadow: rgba(0, 0, 0, .2) 0 10px 20px;margin: 20px 0;background:#eee;overflow:auto}.linenums code *{font-family:Consolas,monospace !important}.linenums code{background:0}.kwd,.tag{color:#dc3939;font-weight:bold}.lit{color:#46a609}.pun{color:var(--active)}.com,.atn{color:#21a366;font-weight:bold}.str,.atv{color:#d68f29}h1,h2,h3,h4,h5,h6{color:" +
          localStorage.maincolor +
          ";text-shadow:rgba(0,0,0,.2) 0 1px 5px;font-weight:bold;transition:all .3s}h1{font-size:29px;margin-top:50px;line-height:50px}h1 a{transition:all .3s}h2{font-size:23px}h3{font-size:20px}h4{font-size:18px}h5{font-size:16px}h6{font-size:14px}blockquote p{border-left:var(--shadow) 4px solid;padding-left:10px}</style>" +
          res;
      res = '<!DOCTYPE html><html><head><meta charset="utf-8" />' + res;
      var element = document.createElement("a");
      const blob2 = new Blob([res]);
      element.download = name + ".html";
      element.style = "display: none";
      element.href = URL.createObjectURL(blob2);
      document.body.appendChild(element);
      element.click();

      setTimeout(
        (element) => {
          document.body.removeChild(element);
          window.URL.revokeObjectURL(blob1);
        },
        100,
        element
      );
      break;
  }
}

function feedback() {
  shell.openExternal(FBLINK);
}

function dragdrop() {
  var oBox = document.getElementById("box");
  var des = document.getElementById("description");
  var timer = null;
  document.ondragover = function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      oBox.style.opacity = "0";
    }, 200);
    oBox.style.opacity = "1";
  };
  //进入子集的时候 会触发ondragover 频繁触发 不给ondrop机会
  oBox.ondragenter = function () {
    oBox.innerHTML = RELSE_MOUSE;
    oBox.style.boxShadow = "var(--shadow) 0 15px 30px";
    oBox.style.color = "var(--main)";
  };
  oBox.ondragover = function () {
    return false;
  };
  oBox.ondragleave = function () {
    oBox.innerHTML = DRAG_HERE;
    oBox.style.boxShadow = "var(--shadow) 0 5px 20px";
    oBox.style.color = "var(--active)";
  };
  oBox.ondrop = function (ev) {
    var oFile = ev.dataTransfer.files[0];
    var reader = new FileReader();
    //读取成功
    reader.onload = function () {
      if (reader.result) {
        f_cont = reader.result;
        des.innerHTML = SUCCEED;
        des.style.color = "#999";
      }
    };
    reader.onerror = function () {
      alert(reader.error.code);
      des.innerHTML = DRAG_HERE;
    };
    reader.readAsText(oFile);
    return false;
  };
}

function openFile(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function () {
    if (reader.result) {
      //显示随笔内容
      f_cont = reader.result;
      $("#description").html(SUCCEED);
    }
  };
  reader.readAsText(input.files[0]);
}

var menu = document.getElementById("Rmenu");
var menuh = 428.8;
var context_open = false;

document.querySelector(".CodeMirror-scroll").oncontextmenu = function (ev) {
  if (context_open) {
    close_context();
    return;
  }
  menu.style.left = ev.clientX + "px";
  menu.style.display = "";
  menu.style.animationName = "";
  if (menuh + ev.clientY > $(window).height())
    if (ev.clientY - menuh < 0)
      menu.style.top = $(window).height() - menuh + "px";
    else menu.style.top = ev.clientY - menuh + "px";
  else menu.style.top = ev.clientY + "px";
  menu.style.display = "block";
  context_open = true;
  //阻止默认右键事件
  return false;
};

document.querySelector("html").addEventListener("click", () => {
  //click事件关闭右键菜单
  if (context_open) close_context();
});

document.querySelector("html").onkeydown = function () {
  //keydown事件关闭右键菜单
  if (context_open) close_context();
};

function close_context() {
  if (localStorage.disable_animation == "1") {
    menu.style.display = "";
    menu.style.animationName = "";
    context_open = false;
  } else {
    menu.style.animationName = "rmenu-out";
    menu.onanimationend = () => {
      menu.style.display = "";
      menu.style.animationName = "";
      menu.onanimationend = () => {};
      context_open = false;
    };
  }
}

function paste() {
  const clipboard = require("electron").clipboard;
  editor.focus();
  editor.replaceSelection(`${clipboard.readText()}`);
}

function previewer() {
  msgbox(
    PREVIEW,
    `<div id="preview_box"><textarea>${editor.getValue()}</textarea></div>`,
    50,
    30,
    false,
    false,
    "preview_box"
  );
}

function open(link) {
  shell.openExternal(link);
}

function count() {
  var source;
  if (editor.getSelection() == "") source = editor.getValue();
  else source = editor.getSelection();
  if (source == "") {
    tips(NOTHING_TO_COUNT);
    return;
  }

  var data = make_html(source);
  $("#calculate").html('<div id="databox"></div>');
  data = data.replace(/<[^>]+>/g, "");
  var chars_with_space = data.match(/[^\r\n]/g).length;
  var chars = data.match(/[^\s]/g).length;

  //先对回车换行符做特殊处理
  data = data.replace(/(\r\n+|\s+|　+)/g, "\uFFFF");
  //处理英文字符数字，连续字母、数字、英文符号视为一个单词
  data = data.replace(/[\x00-\xff]/g, "m");
  //合并字符m，连续字母、数字、英文符号视为一个单词
  data = data.replace(/m+/g, "*");
  //去掉回车换行符
  data = data.replace(/\uFFFF+/g, "");
  //返回字数
  var words = data.length;

  var time = (words / 430).toFixed(1);
  if (time < 1) time = "<1";
  var list =
    '<ul style="color:var(--active)">' +
    "<li><strong>" +
    WORD +
    ": </strong>" +
    words +
    "</li>" +
    "<li><strong>" +
    CHAR +
    ": </strong>" +
    chars +
    "</li>" +
    "<li><strong>" +
    CHAR +
    WITH_SPACE +
    ": </strong>" +
    chars_with_space +
    "</li>" +
    "<li><strong>" +
    TIME +
    ": </strong>" +
    time +
    "min. </li>" +
    "</ul>";
  msgbox(COUNT, list, 23, 20);
}

function make_html(source) {
  $("#calculate").html(
    '<div id="databox"><textarea id="data_area">' + source + "</textarea></div>"
  );
  editormd.markdownToHTML("databox", {
    htmlDecode: "style,script,iframe", //可以过滤标签解码
    emoji: true,
    taskList: true,
  });
  return document.getElementById("databox").innerHTML;
}

document.getElementById("set_main_color").onclick = function () {
  msgbox(
    CHOOSE_MAIN_COLOR,
    '<button onclick="diycolor()">' +
      DIY_COLOR +
      "</button><button onclick=set_to_defalt_color()>" +
      SET_TO_DEFALT +
      '</button><button onclick="auto_color()">' +
      AUTO +
      "</button>",
    35,
    3,
    false,
    1001
  );
};
function diycolor() {
  document.getElementById("real_main_color").click();
  close_msgbox();
}
function set_to_defalt_color() {
  localStorage.maincolor = "#00BAFF";
  document.getElementById("main_color_control").innerHTML =
    "* {--main:#00BAFF}";
  close_msgbox();
}
function auto_color() {
  localStorage.maincolor = "auto";
  document.getElementById("main_color_control").innerHTML =
    "* {--main:#" + systemPreferences.getAccentColor() + "}";
  close_msgbox();
}

document.getElementById("real_main_color").onchange = function () {
  localStorage.maincolor = this.value;
  document.getElementById("main_color_control").innerHTML =
    "* {--main:" + this.value + "}";
};

window.onblur = function () {
  this.document.getElementById("focus-control").innerHTML =
    "#top_file_name{color:#888 !important}";
  if (context_open) close_context();
};
window.onfocus = function () {
  this.document.getElementById("focus-control").innerHTML = "";
};

document.getElementById("maxmize").addEventListener("click", () => {
  if (CURRENT_WINDOW.isFullScreen()) handleFullScreen();
  if (CURRENT_WINDOW.isMaximized()) {
    CURRENT_WINDOW.restore();
  } else {
    CURRENT_WINDOW.maximize();
  }
});
document.getElementById("minimize").addEventListener("click", () => {
  CURRENT_WINDOW.minimize();
});
document.getElementById("close").addEventListener("click", () => {
  CURRENT_WINDOW.close();
});
function set_dev_tools() {
  ipc.send("dev");
  CURRENT_WINDOW.webContents.openDevTools();
}

CURRENT_WINDOW.addListener("maximize", () => {
  document.getElementById("maxmize").style.backgroundImage =
    'url("files/restore.svg")';
  document.getElementById("maxmize").style.backgroundSize = "13px 13px";
  document.getElementById("maxmize").title = RESTORE;
});
CURRENT_WINDOW.addListener("unmaximize", () => {
  document.getElementById("maxmize").style.backgroundImage = "";
  document.getElementById("maxmize").style.backgroundSize = "";
  document.getElementById("maxmize").title = MAXMIZE;
});

nativeTheme.on("updated", function () {
  if (localStorage.theme == "auto")
    if (nativeTheme.shouldUseDarkColors)
      ocument.getElementById("control").innerHTML = darktheme;
    else document.getElementById("control").innerHTML = lighttheme;
});

function showToolBar() {
  document.getElementById("tool_bar").style.display = "block";
}

function hideToolBar() {
  if (document.getElementById("tool_bar").style.display == "block") {
    var toolbar = document.getElementById("tool_bar");
    toolbar.style.animationName = "fadeOutRight";
    if (localStorage.disable_animation == "1") {
      var toolbar = document.getElementById("tool_bar");
      toolbar.style.display = "";
      toolbar.style.animationName = "";
    } else
      toolbar.onanimationend = () => {
        var toolbar = document.getElementById("tool_bar");
        toolbar.style.display = "";
        toolbar.style.animationName = "";
        toolbar.onanimationend = () => {};
      };
  }
}

function customCSS() {
  let cssWin = new BrowserWindow({
    width: 1000,
    height: 700,
    backgroundColor: "#2A2A2E",
    frame: false,
    title: "Custom CSS",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  cssWin.loadFile("./css-editor.html");
  //cssWin.webContents.openDevTools();
}

const CLIENT_ID = "32725b5fad841bcfafa6";
const REDIRECT_URL = "https://henrylin666.github.io/clearwriter/callback.html";
const CLIENT_SECRET = "b4e7f258cb2eff95cbc42f20419561cc48d3649d";
const AUTH_LINK =
  `https://github.com/login/oauth/authorize?` +
  `client_id=${CLIENT_ID}&scope=gist`;
const API_URL = "https://api.github.com";

function syncStart() {
  let authWin = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Sign in to Github · Github",
    skipTaskbar: true,
    parent: CURRENT_WINDOW,
    modal: true,
  });
  authWin.loadURL(AUTH_LINK);
  //authWin.webContents.openDevTools();
  authWin.webContents.addListener("did-navigate", (event, url) => {
    if (!url.match(/clearwriter\/callback.html/)) return;
    var code = url;
    var start = code.indexOf("?code=") + 6;
    var end =
      code.indexOf("&state") == -1 ? code.length : code.indexOf("&state");
    code = code.substring(start, end);
    $.ajax({
      type: "POST",
      url: "https://github.com/login/oauth/access_token",
      data: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      },
      success: (callback) => {
        var arr = callback.split("&");
        arr = arr[0].split("=");
        var token = arr[1];
        localStorage.token = token;
        const API_URL = "https://api.github.com";
        $.ajax({
          type: "GET",
          url: `${API_URL}/user`,
          headers: { Authorization: `token ${token}` },
          success: (data) => {
            localStorage.username = data.login;
            localStorage.uid = data.id;
            syncDiv.className = "connected";
            document.getElementById(
              "avartar"
            ).src = `https://avatars0.githubusercontent.com/u/${localStorage.uid}?s=40&v=4`;
            document.getElementById("username_span").innerHTML =
              localStorage.username;
            octokit = new Octokit({ auth: localStorage.token });
            authWin.close();
          },
          error: (data) => {
            authWin.close();
            alert(data);
          },
        });
      },
    });
  });
}
function signOut() {
  if (confirm("登出？")) {
    localStorage.removeItem("uid");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    syncDiv.className = "unconnected";
    const { session } = remote;

    // 查询所有 cookies。删除。
    session.defaultSession.cookies
      .get({})
      .then((cookies) => {
        cookies.forEach((cookie) => {
          let url = "";
          // get prefix, like https://www.
          url += cookie.secure ? "https://" : "http://";
          url += cookie.domain.charAt(0) === "." ? "www" : "";
          // append domain and path
          url += cookie.domain;
          url += cookie.path;
          session.defaultSession.cookies.remove(url, cookie.name, (error) => {
            if (error)
              console.log(`error removing cookie ${cookie.name}`, error);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function exportDataFile() {
  var content = exportData();
  var element = document.createElement("a");
  const blob1 = new Blob([content]);
  var day = new Date();
  var date =
    day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
  element.download = `clear-writer-backup@${date}.json`;
  element.style = "display: none";
  element.href = URL.createObjectURL(blob1);
  document.body.appendChild(element);
  element.click();

  setTimeout(
    (element) => {
      document.body.removeChild(element);
      window.URL.revokeObjectURL(blob1);
    },
    100,
    element
  );
}

function importDataFile() {
  var element = document.createElement("input");
  element.style.display = "none";
  element.type = "file";
  element.accept = ".json";
  element.onchange = (event) => {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        if (confirm(REPLACE_CURR_DATA)) {
          importData(reader.result);
        }
      } else tips(IMPORT_CANCELED);
    };
    reader.readAsText(input.files[0]);
  };
  element.click();
}
async function exportDataGist() {
  tips(COLLECTING_DATA + "...");
  var day = new Date();
  var date =
    day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
  var result = {};
  result["clear-writer-backup.json"] = { content: exportData(true) };
  var file_list = `# ${FILE_LIST_TITLE}\n\n${THIS_IS_A_BACKUP.replace(
    "${VERSION}",
    VERSION
  ).replace("${date}", date)}\n\n`;
  var l = nameArray.length;
  for (let i = 0; i < l; i++) {
    file_list += `- ${nameArray[i]}\n`;
  }
  result["ClearWriter_backup.md"] = { content: file_list };

  tips(SENDING_DATA + "...");

  try {
    await octokit.request("POST /gists", {
      files: result,
      description: `Clear_Writer_Backup_${date}`,
      public: false,
    });

    tips(SEND_SUCCEEDED);
  } catch {
    tips(NET_ERR);
  }
}

async function importDataGist() {
  tips(PULLING_LIST + "...");
  try {
    var arr = (await octokit.request("GET /gists")).data;
    var l = arr.length;
    var string = '<ul id="import_list">';
    for (let i = 0; i < l; i++) {
      if (!arr[i].files["clear-writer-backup.json"]) continue;
      string += `<li onclick=chooseGist('${arr[i].id}')>${arr[
        i
      ].description.replace(/^Clear_Writer_Backup_/, "")}</li>`;
    }
    string += "</ul>";
    msgbox(CHOOSE_BACKUP, string, 35, 25, false, 1001);
  } catch {
    tips(NET_ERR);
  }
}

async function chooseGist(id) {
  close_msgbox();
  tips(DOWNLOADING_DATA + "...");
  try {
    var gist = await octokit.request(`GET /gists/${id}`, {
      gist_id: id,
    });
    tips(PARSING_DATA + "...");
    var cont = gist.data.files["clear-writer-backup.json"].content;
    importData(cont);
  } catch {
    tips(NET_ERR);
  }
}

function exportData(one_line) {
  var ret = one_line ? "" : "\n";
  var tab = one_line ? "" : "\t";
  var c = `,${ret}${tab}`;
  var string = `{${ret}${tab}`;
  var l = localStorage.length;
  for (let i = 0; i < l; i++) {
    var key = localStorage.key(i);
    var data = localStorage.getItem(key);

    key = key.replace(/"/g, "\uFFFD");
    key = key.replace(/\t/g, "\uFFFC");
    if (key != "token" || key != "uid" || key != "username")
      if (key == "nameArray") string += `"${key}":${data}${c}`;
      else {
        data = data.replace(/\n/g, "\uFFFF");
        data = data.replace(/\r/g, "\uFFFE");
        data = data.replace(/"/g, "\uFFFD");
        data = data.replace(/\t/g, "\uFFFC");
        data = data.replace(/\\/g, "\uFFFB");

        string += `"${key}":"${data}"${c}`;
      }
  }
  string += `"version":"${VERSION}"${c}`;
  if (one_line) string = string.replace(/,$/, "");
  else string = string.replace(/,\n\t$/, "");
  string += `${ret}}`;
  return string;
}

function importData(backup) {
  var obj = JSON.parse(backup);
  var i;
  var token = localStorage.token;
  var username = localStorage.username;
  var uid = localStorage.uid;
  var acrylic = localStorage.acrylic;
  localStorage.clear();
  for (i in obj) {
    if (i == "nameArray" || i == "version" || i == "acrylic") continue;
    var data = obj[i];
    data = data.replace(/\uFFFF/g, "\n");
    data = data.replace(/\uFFFE/g, "\r");
    data = data.replace(/\uFFFD/g, '"');
    data = data.replace(/\uFFFC/g, "\t");
    data = data.replace(/\uFFFB/g, "\\");
    var key = i;
    key = key.replace(/"/g, "\uFFFD");
    key = key.replace(/\t/g, "\uFFFC");
    localStorage.setItem(key, data);
  }
  if (token) localStorage.token = token;
  if (username) localStorage.username = username;
  if (uid) localStorage.uid = uid;
  var l = obj.nameArray.length;
  for (let i = 0; i < l; i++) {
    obj.nameArray[i] = obj.nameArray[i].replace("\uFFFD", '"');
  }
  localStorage.nameArray = JSON.stringify(obj.nameArray);
  if (acrylic != obj.acrylic) {
    localStorage.acrylic = obj.acrylic;
    ipc.send("toogle-acrylic");
  } else {
    localStorage.acrylic = obj.acrylic;
    window.location.reload();
  }
}

var oldTitle = null;
var flag = false;
$(document).bind("mouseover mouseout mousedown", function (event) {
  var ele = event.target;
  var title = ele.title;
  var showLeft;
  var showTop;
  var type = event.originalEvent.type;
  if (type == "mouseover") {
    flag = false;
    oldTitle = title;
    let obj = ele.getBoundingClientRect();
    showLeft = obj.left;
    showTop = obj.top;
    if (title == "" || title == null || title == "null") {
      var parent = ele.parentNode;
      if (
        parent &&
        parent.title != "" &&
        parent.title != null &&
        parent.tagName != null
      ) {
        title = parent.title;
        let objp = parent.getBoundingClientRect();
        showLeft = objp.left;
        showTop = objp.top;
        flag = true;
      }
    }

    if (title != "" && title != null && title != "null") {
      ele.removeAttribute("title");
      var showEle = $("<div></div>", {
        class: "showTitleBox",
      })
        .css({
          position: "fixed",
          top: showTop,
          left: showLeft,
        })
        .html(
          title
            .replace(/^#/, "<strong>")
            .replace(/#/, "</strong>")
            .replace("【", "<span>")
            .replace("】", "</span>")
            .replace(/^%WIDE%/, "")
        );
      if (title.match(/^%WIDE%/)) {
        showEle.css("max-width", "31.5rem");
        showEle.css("margin-top", "15px");
      }
      showEle.appendTo("body");
      if (showEle.width() + showLeft >= $(window).width())
        showEle.css({ left: "", right: "0" });
    }
  } else {
    if (!flag && type == "mouseout" && oldTitle != null) ele.title = oldTitle;
    var currShow = $(".showTitleBox");
    currShow.css("opacity", "0");
    setTimeout(
      (currShow) => {
        currShow.remove();
      },
      280,
      currShow
    );
  }
});

function checkUpdate(force) {
  $.ajax({
    type: "GET",
    url:
      "https://gitee.com/Henrylin666/codes/ncyxbjp9k4uvs8doal15051/raw?blob_name=update.json",
    success: (callback) => {
      var newer = false;
      var updateObj = JSON.parse(callback);
      if (localStorage.dontShow == updateObj.version && !force) return;
      var currArr = VERSION.split(".");
      var newArr = updateObj.version.split(".");
      var l = currArr.length < newArr.length ? currArr.length : newArr.length;
      for (let i = 0; i < l; i++) {
        if (newArr[i] * 1 > currArr[i] * 1) {
          newer = true;
          break;
        } else if (newArr[i] * 1 < currArr[i] * 1) break;
      }
      if (newer) {
        msgbox(
          NEW_VER + updateObj.version,
          `<div id="change_log"><textarea>${updateObj.changeLog}</textarea></div><button id="update_now" onclick="shell.openExternal('${updateObj.url}');close_msgbox();">${UPDATE_NOW}</button><button id="next_time" onclick="close_msgbox()">${SHOW_NEXT_TIME}</button><button id="dont_show_again" onclick="localStorage.dontShow='${updateObj.version}';close_msgbox();">${DONT_SHOW_AGAIN}</button>`,
          35,
          25,
          true,
          1000,
          "change_log"
        );
      } else if (force) tips(NEWEST);
    },
    error: (err) => {
      console.error("更新检查失败！错误信息如下：");
      console.error(err);
      if (force) tips("NETWORK_ERR");
    },
  });
}

function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

console.log(
  "  oooooooo8   ooooo         ooooooooooo        o        oooooooooo\no888     88    888           888    88        888        888    888\n888            888           888ooo8         8  88       888oooo88\n888o     oo    888      o    888    oo      8oooo88      888  88o\n 888oooo88    o888ooooo88   o888ooo8888   o88o  o888o   o888o  88o8\n\noooo     oooo oooooooooo  ooooo ooooooooooo ooooooooooo oooooooooo\n 88   88  88   888    888  888  88  888  88  888    88   888    888\n  88 888 88    888oooo88   888      888      888ooo8     888oooo88\n   888 888     888  88o    888      888      888    oo   888  88o\n    8   8     o888o  88o8 o888o    o888o    o888ooo8888 o888o  88o8\n"
);
