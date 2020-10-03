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
const Store = require("electron-store");
const store = new Store({ accessPropertiesByDotNotation: false });
if (localStorage.theme && !store.store.nameArray) {
  importData(exportDataOld());
  let csstemp = localStorage.css;
  localStorage.clear();
  localStorage.css = csstemp;
}
//暗色模式CSS常量定义
var darktheme =
  "*{--background:#252829;--darkback:#1A1C1D;--vscrollbar:#1A1C1D60;--selection:#fff2;--unfocusedselection:#252525;--active:#eee;--line: #222;--scroll:#666;--com:#fff1;--shadow:rgba(255,255,255,.3);--lighter:1.3;--darker:0.7;}";
//亮色模式CSS常量定义
var lighttheme =
  "*{--background:#f8f8f8;--darkback:#EEE;--vscrollbar:#EEE6;--selection:#A8DCEDA0;--unfocusedselection:#E5E5E5;--active:#333;--line: #ddd;--scroll:#aaa;--com:#0001;--shadow:rgba(0,0,0,.2);--lighter:1.1;--darker:0.9;}";

if (store.has("theme"))
  if (store.store.theme == 0) {
    //如果之前存过亮色/暗色模式
    //0表示亮色模式
    document.getElementById("control").innerHTML = lighttheme;
    document.getElementById("theme").innerHTML = LIGHT;
    document.getElementById("preload_logo").src = "./files/prelogo-light.svg";
  } else if (store.store.theme == 1) {
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
  store.set("theme", 0);
  document.getElementById("control").innerHTML = lighttheme;
  document.getElementById("theme").innerHTML = LIGHT;
}

var nameArray = [];
if (store.has("nameArray")) {
  nameArray = store.store.nameArray;
} else {
  store.set("nameArray", nameArray);
}

window.onstorage = () => {
  $("#css_ctrl").html(localStorage.css);
};

if (store.store.disable_animation == 1) {
  document.getElementById("advanced_control").innerHTML =
    "*,*:after,*:before,*::-webkit-slider-thumb{transition:none !important;animation:none !important}";
}

const default_text =
  "# Welcome to Clear Writer，这是一个沉浸式 Markdown 写作软件。\n\n## 为什么编写 Clear Writer\n\n我开了我自己的博客之后，一直苦于 Windows 端没有我喜欢的 Markdown 编辑器。\n\n> 其实写作，最需要的并不是很好很强大的工具，而是一个不易让人分心的环境。\n\nMac上的 iA Writer 固然能很好地做到这一点，但作为一个初二学生，我确实也没有那个经济实力去买正版。我也不打算用盗版。我找到了一个类似的软件，叫做 [4Me 写字板](http://write4Me.sinaapp.com/)。它基于 CodeMirror。但是，它和 iA Writer 的差距未免有点大……\n\n但这却给了我一个启发：为什么不自己动手试着用 CodeMirror 制作一个 Markdown 编辑器呢？\n\n于是我征求了原作者同意之后，借着这次因新冠疫情宅家的时间，尝试自己以 4Me 写字板为蓝本，制作自己的写作工具。于是我做出了这个 Markdown 编辑器 —— Clear Writer，意味着希望人们使用它时，可以让人理清自己的思维。\n\n另外，Clear Writer 的一个很重要的一点是它支持实时 Markdown 语法。很多的所谓实时 Markdown，我都不是很喜欢——因为它们会把 Markdown 格式标记隐去。我不喜欢这样，我喜欢让格式牢牢掌控在使用者的手里。\n\n## Clear Writer 的特点\n- 全自动保存；\n- 所见即所得的实时 MarkDown，以及标题悬挂；\n- 支持亮色 / 暗色模式；\n- 漂亮的隐藏式滚动条；\n- 支持简体中文 / 繁体中文 / 英文三种语言；\n- 支持开启 / 关闭行号；\n- 高亮当前段落；\n- 漂亮的光标闪动和跳动效果；\n- 界面自适应；\n- 内容全部在本地缓存，完全隐私保护；\n- 支持导出 `.txt`、`.md`、`.doc`、`.html`、带 CSS 的 `html` 5 种格式；\n- 平滑滚动；\n- 可让你立即进入状态的”闪念“功能（v1.7+）。\n\n## 使用技巧\n\n- 点击顶栏上的全屏按钮或按下 `F11`（或 `Fn + F11`）切入全屏，安心写作；\n- 鼠标移动至顶部时显示顶栏，其中可以切换亮/暗色模式、行号、语言等；\n- 点击顶栏上的图钉 `📌` 按钮可以固定顶栏，使其不自动隐藏；\n- 右上角有 `另存为...` 按钮，点击可以将文字导出为其他格式文本；\n- 点击左上角的 `Clear Writer` 会在侧边栏显示你现在正在看的这段文字，再次点击 `Clear Writer` 隐藏侧边栏；\n- 可撤销最近的 2000 次操作，无惧修改；\n- Clear Writer 全自动保存，正常情况下每 3 分钟自动保存一次，在关闭的时候也会再次自动保存一次。实在不放心，还可以 `Ctrl + S` 手动保存；\n- 查找：`Ctrl + F`；\n- 查找下一个：`Ctrl + G`；\n- 查找上一个：`Shift + Ctrl + G`；\n- 替换：`Shift + Ctrl + F`；\n- 替换全部：`Shift + Ctrl + R`。\n\n## 兼容性\n\nWindows 7 及以上。\n\n## 关于\n\nClear Writer 使用 GNU General Public License 3.0 进行许可。\n\n编码工具：Visual Studio & Visual Studio Code\n安装包制作工具：NSIS\n\n### Clear Writer 的诞生离不开：\n\n- 西文字体：NeverMind（SIL Open Font License 1.1）；\n- 中文字体：思源黑体（SIL Open Font License 1.1）；\n- 编辑器基础：CodeMirror（MIT License）；\n- Markdown 渲染：editor.md（MIT License）；\n- 构建基础：Electron（MIT License）；\n- 蓝本：4Me Writer，无协议状态，但已经开发者口头许可。\n\n衷心感谢所有为本项目提供支持与帮助的人。";
document.body.className = store.store.font == 1 ? "term" : "";
CHAR_WIDTH = store.store.font == 1 ? 10 : 14.56;
if (store.has("lang")) set_lang_to(store.store.lang);
//如果之前选过，直接使用
else {
  //否则从浏览器获取当前语言
  switch (navigator.language.toLowerCase()) {
    case "zh-tw":
    case "zh-hk":
      store.set("lang", "zh-hk");
      set_lang_to("zh-hk");
      break;
    case "en":
    case "en-us":
      store.set("lang", "en");
      set_lang_to("en");
      break;
    case "en-uk":
      store.set("lang", "en-uk");
      set_lang_to("en-uk");
      break;
    case "zh-cn":
    case "zh":
      store.set("lang", "zh-cn");
      set_lang_to("zh-cn");
      break;
    default:
      store.set("lang", "en"); //语言默认为英文
      set_lang_to("en");
      break;
  }
}
$("#css_ctrl").html(localStorage.css);
var octokit;
const syncDiv = document.getElementById("sync_dashboard");
const giteeSyncDiv = document.getElementById("gitee_sync_dashboard");
if (store.store.uid) {
  syncDiv.className = "connected";
  document.getElementById(
    "avatar"
  ).src = `https://avatars0.githubusercontent.com/u/${store.store.uid}?s=40v=4`;
  document.getElementById("username_span").innerHTML = store.store.username;
  octokit = new Octokit({ auth: store.store.token });
}
if (store.store.giteeUsername) {
  giteeSyncDiv.className = "connected";
  document.getElementById("gitee_avatar").src = store.store.giteeAvatar;
  document.getElementById("gitee_username_span").innerHTML =
    store.store.giteeUsername;
}

if (!store.has("acrylic")) {
  //没有存过，默认没有毛玻璃
  store.set("acrylic", 0);
}

var slider = document.getElementById("opacity");

slider.value = store.store.opacity * 100;

$("#opacity_label").html(slider.value + "%");

if (!store.store.opacity) store.set("opacity", 0.7);

if (store.store.acrylic == 1)
  if (document.getElementById("control").innerHTML == darktheme)
    $("#window-background").html(
      `html{background:rgba(26, 28, 29, ${store.store.opacity})}`
    );
  else
    $("#window-background").html(
      `html{background:rgba(248, 248, 248, ${store.store.opacity})}`
    );
else {
  $("#window-background").html("html{background:var(--background);");
  slider.disabled = true;
}

if (!store.has("line_num")) {
  //没有存过，默认不显示行号
  store.set("line_num", 0);
}
document.getElementById("num").className =
  store.store.line_num == 1 ? "on" : "off";

if (!store.has("disable_animation")) {
  //没有存过，默认不禁用动画
  store.set("disable_animation", 0);
}
document.getElementById("disable_animation").className =
  store.store.disable_animation == 1 ? "on" : "off";

document.getElementById("acrylic").className =
  store.store.acrylic == 1 ? "on" : "off";

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  //获得行号设置，开始生成CodeMirror
  lineNumbers: store.store.line_num * 1, //有行号为1，无行号为0，乘以1（字符转数字）
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
  allowDropFileTypes: ["text/plain", "text/markdown"],
});
if (store.store.line_num == 1) {
  editor.setOption("gutters", [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
  ]);
  $("#linenum_control").html("");
} else {
  editor.setOption("gutters", "");
  $("#linenum_control").html(".CodeMirror-activeline-gutter{display:none;}");
}

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

if (store.store.maincolor) {
  if (store.store.maincolor == "auto") {
    document.getElementById(
      "main_color_control"
    ).innerHTML = `* {--main:#${systemPreferences.getAccentColor()}}`;
  } else
    document.getElementById(
      "main_color_control"
    ).innerHTML = `* {--main:${store.store.maincolor}}`;
} else {
  store.set("maincolor", "#00baff");
}
var encoding;
window.onload = function () {
  document.getElementById("preload").style.opacity = 0;
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
  topbar.style.opacity = 0;
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
  if (store.get(filename)) editor.setValue(store.get(filename));
  else editor.setValue(default_text);
  changeTitleBar(filename);
  editor.setOption("styleActiveLine", { nonEmpty: true });
  editor.focus();
  editor.clearHistory();
  if (quicknote) {
    if (store.store.maincolor == "auto") {
      document.getElementById("main_color_control").innerHTML =
        "* {--main:#" + systemPreferences.getAccentColor() + "}";
    } else
      document.getElementById("main_color_control").innerHTML =
        "* {--main:" + store.store.maincolor + "}";
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
  store.set("nameArray", nameArray);
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
    store.set("nameArray", nameArray);
    choose_file(0);
    editor.setValue(f_cont);
    close_msgbox();
  }
}
function validateForm(num) {
  if (
    document.getElementById("fname_box" + num).value == "" ||
    store.get(document.getElementById("fname_box" + num).value)
  ) {
    document.getElementById("fname_box" + num).style.background =
      "rgba(255,0,0,.2)";
  } else {
    nameArray.unshift(document.getElementById("fname_box0").value);
    store.set("nameArray", nameArray);
    choose_file(0);
    close_msgbox();
  }
}

function set_theme() {
  if (store.store.theme == 0) {
    //亮色模式转暗色模式
    document.getElementById("control").innerHTML = darktheme;
    document.getElementById("theme").innerHTML = DARK;
    store.set("theme", 1);
  } else if (store.store.theme == 1) {
    //暗色模式转跟随系统
    document.getElementById("theme").innerHTML = AUTO;
    if (nativeTheme.shouldUseDarkColors)
      document.getElementById("control").innerHTML = darktheme;
    else document.getElementById("control").innerHTML = lighttheme;
    store.set("theme", "auto");
  } else {
    //跟随系统转亮色模式
    document.getElementById("control").innerHTML = lighttheme;
    document.getElementById("theme").innerHTML = LIGHT;
    store.set("theme", 0);
  }
  //窗口背景颜色
  if (store.store.acrylic == 1)
    if (document.getElementById("control").innerHTML == darktheme)
      $("#window-background").html(
        `html{background:rgba(26, 28, 29, ${store.store.opacity})}`
      );
    else
      $("#window-background").html(
        `html{background:rgba(248, 248, 248, ${store.store.opacity})}`
      );
}

function set_line_num() {
  //切换行号的可见性
  store.set("line_num", store.store.line_num == 1 ? 0 : 1);
  editor.setOption("lineNumbers", store.store.line_num == 1 ? true : false);
  if (store.store.line_num == 1) {
    editor.setOption("gutters", [
      "CodeMirror-linenumbers",
      "CodeMirror-foldgutter",
    ]);
    $("#linenum_control").html("");
  } else {
    editor.setOption("gutters", "");
    $("#linenum_control").html(".CodeMirror-activeline-gutter{display:none;}");
  }
  document.getElementById("num").className =
    store.store.line_num == 1 ? "on" : "off";
}

function set_font() {
  //切换字体
  store.set("font", store.store.font == 1 ? 0 : 1);
  document.body.className = store.store.font == 1 ? "term" : "";
  document.getElementById("font").innerHTML =
    store.store.font == 1 ? TERM : DEFALT;
}

function set_acrylic() {
  store.set("acrylic", store.store.acrylic == 1 ? 0 : 1);
  document.getElementById("acrylic").className =
    store.store.acrylic == 1 ? "on" : "off";

  setTimeout(
    () => {
      if (store.store.acrylic == 1) {
        if (document.getElementById("control").innerHTML == darktheme)
          $("#window-background").html(
            `html{background:rgba(26, 28, 29, ${store.store.opacity})}`
          );
        else
          $("#window-background").html(
            `html{background:rgba(248, 248, 248, ${store.store.opacity})}`
          );
        slider.disabled = false;
      } else {
        $("#window-background").html("html{background:var(--background);");
        slider.disabled = true;
      }
    },
    store.store.acrylic == 1 ? 100 : 0
  );
  setTimeout(
    () => {
      ipc.send("toogle-acrylic");
    },
    store.store.acrylic == 1 ? 0 : 300
  );
}

function set_opacity() {
  $("#opacity_label").html(slider.value + "%");
  store.set("opacity", slider.value / 100);
  if (store.store.acrylic == 1)
    if (document.getElementById("control").innerHTML == darktheme)
      $("#window-background").html(
        `html{background:rgba(26, 28, 29, ${store.store.opacity})}`
      );
    else
      $("#window-background").html(
        `html{background:rgba(248, 248, 248, ${store.store.opacity})}`
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
  store.set("lang", lang);
  reset_switch();
  close_msgbox();
  save_content();
}

function reset_switch() {
  $("#theme").html(
    store.store.theme == 1 ? DARK : store.store.theme == 0 ? LIGHT : AUTO
  );
  $("#font").html(store.store.font == 1 ? TERM : DEFALT);
}

function set_about() {
  //设置“关于”栏的开/关
  if (settings != 0) set_settings();
  if (about == 0) {
    //开起来
    document.getElementById("about").style.display = "block";
    cover("set_about()"); //激活遮罩，onclick设为'set_about()'
    setTimeout(() => {
      document.getElementById("about").style.left = 0;
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
      document.getElementById("settings").style.left = 0;
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
  if (store.store.disable_animation == 1) {
    document.getElementById("advanced_control").innerHTML = "";
    store.set("disable_animation", 0);
  } else {
    document.getElementById("advanced_control").innerHTML =
      "*,*:after,*:before,*::-webkit-slider-thumb{transition:none !important;animation:none !important}";
    store.set("disable_animation", 1);
  }
  document.getElementById("disable_animation").className =
    store.store.disable_animation == 1 ? "on" : "off";
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
    if (store.store.disable_animation == 1) box.parentNode.removeChild(box);
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
  coverdiv.style.opacity = 1;
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
  if (store.store.disable_animation == 1) document.body.removeChild(coverdiv);
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
    if (store.store.disable_animation == 1) document.body.removeChild(tip);
    else
      tip.onanimationend = (event) => {
        document.body.removeChild(event.target);
      };
  }
}

function set_stick() {
  //设置顶栏是否钉住
  if (stick == 0) {
    document.getElementById("topbar").style.opacity = 1;
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
  store.delete(nameArray[num]); //删除这个板子的内容
  nameArray.splice(num, 1); //从随笔列表里面删掉这个元素
  store.set("nameArray", nameArray); //将随笔列表同步到存储里面
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
  if (des == "" || (nameArray[num] != des && store.get(des))) {
    document.getElementById("fname_box" + num).style.background =
      "rgba(255,0,0,.2)";
  } else {
    var content = store.get(nameArray[num]);
    store.set(des, content);
    store.delete(nameArray[num]);
    nameArray[num] = des;
    store.set("nameArray", nameArray);
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
    store.set(filename, fileContent);
  }
  var d = new Date();
  var time =
    d.getHours() + ":" + (d.getMinutes() < 10 ? 0 : "") + d.getMinutes(); //在顶栏显示一下提示
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
      "#header{opacity:0;box-shadow:none !important;-webkit-app-region: no-drag;}#header:hover{opacity:1 !important;}#header ~ .sidebar{height:100%;top:0;}#header:hover ~ .sidebar{height:calc(100% - 40px);top:40px;}html{background:var(--background) !important;}body{top:10vh !important;}"
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
  var name;
  if (!local) name = nameArray[cur_num];
  else {
    let arr = filename.split("\\");
    name = arr[arr.length - 1].replace(/.[^.]+$/);
  }
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
      if (type == "html_css") {
        var data = res.replace(/<[^>]+>/g, "");
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
      }
      res = `<title>${name}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${
        type == "html_css" ? `<div id="counter">${TIME}: ${time}min</div>` : ""
      }${res}${
        type == "html_css" ? `<div id="footer">${GENERATE}</div>` : ""
      }</body></html>`;
      console.log(res);
      if (type == "html_css")
        res = `<style>:root{font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;}html{background:#f8f8f8}h1,h2,h3,h4,h5,h6,a[href]{color:${
          store.store.maincolor == "auto"
            ? "#" + systemPreferences.getAccentColor()
            : store.store.maincolor
        }}body{max-width:800px;width:100%;margin:60px auto 100px auto;background:#fff;padding:30px 80px;box-shadow:rgba(0,0,0,.2) 0 10px 30px;border-radius:10px;position:relative}body:after{content:'END';display:block;margin-right:30px;padding-left:8px;height:8px;font-size:15px;color:#aaa;line-height:8px;white-space:nowrap;position:absolute;right:0}img{border-radius:4px;box-shadow:rgba(0,0,0,.2) 0 5px 15px;margin:20px 15px;max-width:calc(100% - 30px)}a[href]{text-shadow:rgba(0,0,0,.2) 0 1px 5px;transition:all .3s;text-decoration:none}a[href]:hover{opacity:.8;text-shadow:rgba(0,0,0,.5) 0 5px 10px}.emoji{width:18px;height:18px;box-shadow:none;border-radius:0;margin:0}code{background:rgba(0,0,0,.08);border-radius:3px;padding:0 7px}.prettyprint.linenums.prettyprinted{padding:20px !important;box-shadow:rgba(0,0,0,.2) 0 10px 20px;margin:20px 0;background:#eee;overflow:auto}.linenums code *{font-family:Consolas,monospace !important}.linenums code{background:0}.kwd,.tag{color:#dc3939;font-weight:bold}.lit{color:#46a609}.pun{color:var(--active)}.com,.atn{color:#21a366;font-weight:bold}.str,.atv{color:#d68f29}h1,h2,h3,h4,h5,h6{text-shadow:rgba(0,0,0,.2) 0 1px 5px;font-weight:bold;transition:all .3s;line-height:40px}h1{font-size:35px;margin-top:50px;line-height:60px}h1 a{transition:all .3s}h2{font-size:28px}h3{font-size:26px}h4{font-size:24px;margin:20px 0}h5{font-size:22px;margin:15px 0}h6{font-size:20px;margin:10px 0}blockquote p{border-left:var(--shadow) 4px solid;padding-left:10px}*{max-width:100%}img{border-radius:4px;box-shadow:#0003 0 5px 15px;margin:20px 15px;max-width:calc(100% - 30px)}.emoji{width:18px;height:18px;box-shadow:none;border-radius:0;margin:0}.linenums{overflow:auto}a[href] img{margin:0 !important}pre.linenums{box-shadow:#0003 0 5px 15px;background:var(--background);padding:6px;border-radius:5px}ol.linenums{list-style:none;counter-reset:sectioncounter;margin:0;padding:0;padding:14px}ol.linenums::-webkit-scrollbar{height:6px}ol.linenums::-webkit-scrollbar-thumb{background:#8883}ol.linenums::-webkit-scrollbar-thumb:hover{background:#8885}ol.linenums::-webkit-scrollbar-thumb:active{background:#8882}ol.linenums li:before{content:counter(sectioncounter);counter-increment:sectioncounter;display:inline-block;width:20px;text-align:right;padding:0 10px 0 0;font-family:TERM;opacity:.8}:root{font-size:17px;line-height:30px;color:var(--active);padding:0 25px}blockquote{color:#888;border-left:#aaa solid 5px;margin-left:20px}h1,h2,h3,h4,h5,h6{position:relative}h1:before,h2:before,h3:before,h4:before,h5:before,h6:before{content:"H1";position:absolute;left:-25px;font-size:14px;opacity:0;transform:translateX(15px) scale(0.7);transition:all .3s}h1:hover:before,h2:hover:before,h3:hover:before,h4:hover:before,h5:hover:before,h6:hover:before{opacity:1;transform:none}h1:before{content:"H1"}h2:before{content:"H2"}h3:before{content:"H3"}h4:before{content:"H4"}h5:before{content:"H5"}h6:before{content:"H6"}ul,ol{padding-left:25px}.task-list-li{margin-left:-1/5px}input[type="checkbox"]{margin-left:-27px;-webkit-appearance:none;width:18px;height:18px;background:var(--background);border-radius:2px;position:relative;top:6px;box-shadow:#0003 0 3px 8px}input[type="checkbox"]:before,input[type="checkbox"]:after{content:"";position:absolute;background:var(--main)}input[type="checkbox"]:checked:disabled:before{width:2px;height:6px;transform:rotate(-45deg);top:8px;left:4px}input[type="checkbox"]:checked:disabled:after{width:2px;height:12px;transform:rotate(45deg);top:3px;left:10px}#counter{color:#999;position:absolute;top:-40px;right:10px;}#footer{opacity:.5;position:absolute;bottom:-50px;width:100%;left:0;text-align:center;transition:opacity .3s;user-select: none;}#footer:hover{opacity:1;}body{margin:60px auto 100px auto;}@media screen and (max-width:920px){html{margin:0;padding:0 !important;background:#FFFFFF}body{margin:0 !important;padding:20px!important;width:calc(100vw - 40px) !important;box-shadow: none;font-size:15px;line-height:1.8}h1:before,h2:before,h3:before,h4:before,h5:before,h6:before{opacity:1;transform:translate(10px,-25px) !important}h1{font-size:28px;line-height: 1.5;}h2{font-size:25px}h3{font-size:23px}h4{font-size:21px}h5{font-size:19px}h6{font-size:17px}#footer{opacity:.5;bottom:-60px;padding: 30px 0;}}</style>${res}`;
      console.log(res);
      res = '<!DOCTYPE html><html><head><meta charset="utf-8" />' + res;
      console.log(res);
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
          window.URL.revokeObjectURL(blob2);
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
      oBox.style.opacity = 0;
    }, 200);
    oBox.style.opacity = 1;
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
      des.innerHTML = DRAG_HERE;
      tips(FILE_BROKEN);
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
  if (store.store.disable_animation == 1) {
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
  store.set("maincolor", "#00BAFF");
  document.getElementById("main_color_control").innerHTML =
    "* {--main:#00BAFF}";
  close_msgbox();
}
function auto_color() {
  store.set("maincolor", "auto");
  document.getElementById("main_color_control").innerHTML =
    "* {--main:#" + systemPreferences.getAccentColor() + "}";
  close_msgbox();
}

document.getElementById("real_main_color").onchange = function () {
  store.set("maincolor", this.value);
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
  if (store.store.theme == "auto")
    if (nativeTheme.shouldUseDarkColors)
      document.getElementById("control").innerHTML = darktheme;
    else document.getElementById("control").innerHTML = lighttheme;
});

function showToolBar() {
  document.getElementById("tool_bar").style.display = "block";
}

function hideToolBar() {
  if (document.getElementById("tool_bar").style.display == "block") {
    var toolbar = document.getElementById("tool_bar");
    toolbar.style.animationName = "fadeOutRight";
    if (store.store.disable_animation == 1) {
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
    backgroundColor: "#252526",
    frame: false,
    title: "Custom CSS",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  cssWin.loadFile("./css-editor.html");
  //cssWin.webContents.openDevTools();
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
          try {
            importData(reader.result);
          } catch {
            tips(FILE_BROKEN);
          }
        }
      } else tips(IMPORT_CANCELED);
    };
    reader.readAsText(input.files[0]);
  };
  element.click();
}

function exportData(one_line) {
  save_content(false);
  var ret = one_line ? "" : "\n";
  var tab = one_line ? "" : "\t";
  var c = `,${ret}${tab}`;
  var string = `{${ret}${tab}`;
  for (let i in store.store) {
    var key = i;
    var data = store.get(i);
    key = key.replace(/"/g, '\\"');
    key = key.replace(/\t/g, "\\t");
    if (key != "token" || key != "uid" || key != "username")
      if (key == "nameArray")
        string += `"nameArray":${JSON.stringify(data)}${c}`;
      else {
        if (typeof data == "string") {
          data = data.replace(/\\/g, "\\\\");
          data = data.replace(/\n/g, "\\n");
          data = data.replace(/\r/g, "\\r");
          data = data.replace(/"/g, '\\"');
          data = data.replace(/\t/g, "\\t");
        }
        string += `"${key}":"${data}"${c}`;
      }
  }
  string += `"version":"${VERSION}"${c}`;
  if (one_line) string = string.replace(/,$/, "");
  else string = string.replace(/,\n\t$/, "");
  string += `${ret}}`;
  return string;
}

function exportDataOld(one_line) {
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
  var obj = JSON.parse(backup),
    i,
    token = store.store.token,
    username = store.store.username,
    uid = store.store.uid,
    giteeUsername = store.store.giteeUsername,
    giteeAvatar = store.store.giteeAvatar,
    giteeToken = store.store.giteeToken,
    giteeRefreshToken = store.store.giteeRefreshToken,
    acrylic = store.store.acrylic;
  store.clear();
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
    store.set(key, data);
  }
  if (token) store.set("token", token);
  if (username) store.set("username", username);
  if (uid) store.set("uid", uid);
  if (giteeUsername) store.set("giteeUsername", giteeUsername);
  if (giteeAvatar) store.set("giteeAvatar", giteeAvatar);
  if (giteeToken) store.set("giteeToken", giteeToken);
  if (giteeRefreshToken) store.set("giteeRefreshToken", giteeRefreshToken);
  var l = obj.nameArray.length;
  for (let i = 0; i < l; i++) {
    obj.nameArray[i] = obj.nameArray[i].replace("\uFFFD", '"');
  }
  store.set("nameArray", obj.nameArray);
  if (acrylic != obj.acrylic) {
    store.set("acrylic", obj.acrylic);
    ipc.send("toogle-acrylic");
    window.location.reload();
  } else {
    store.set("acrylic", obj.acrylic);
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
      ele.title = "";
      var showEle = $("<div></div>", {
        class: "showTitleBox",
      })
        .css({
          position: "fixed",
          top: showTop + 40,
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
        showEle.css({ left: "", right: 0 });
    }
  } else {
    if (!flag && type == "mouseout" && oldTitle != null) ele.title = oldTitle;
    var currShow = $(".showTitleBox");
    currShow.css("opacity", 0);
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
      if (store.store.dontShow == updateObj.version && !force) return;
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
          `<div id="change_log"><textarea>${updateObj.changeLog}</textarea></div><button id="update_now" onclick="shell.openExternal('${updateObj.url}');close_msgbox();">${UPDATE_NOW}</button><button id="next_time" onclick="close_msgbox()">${SHOW_NEXT_TIME}</button><button id="dont_show_again" onclick="store.store.dontShow='${updateObj.version}';close_msgbox();">${DONT_SHOW_AGAIN}</button>`,
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
      if (force) tips(NET_ERR);
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

function insert_spacing(str) {
  var p1 = /([A-Za-z_])([\u4e00-\u9fa5]+)/gi;
  var p2 = /([\u4e00-\u9fa5]+)([A-Za-z_])/gi;
  return str.replace(p1, "$1 $2").replace(p2, "$1 $2");
}

if (store.has("giteeUsername")) {
  gitee.refreshToken();
  var tokenRefresher = setInterval(() => {
    gitee.refreshToken();
  }, 8640000);
}

function livePreview() {
  var pBox = document.getElementById("live_preview_box");
  pBox.style.display = "";
  editor.on("cursorActivity", () => {
    var val = editor.getValue();
    var cur = editor.getCursor();
    val = val.split("\n");
    val[cur.line] =
      val[cur.line].slice(0, cur.ch) + "\uFFFF" + val[cur.line].slice(cur.ch);
    val = val.join("\n");
    var pBox = document.getElementById("live_preview_box");
    pBox.innerHTML = "<textarea>" + val + "</textarea>";
    editormd.markdownToHTML("live_preview_box", {
      htmlDecode: "style,script,iframe",
      emoji: true,
      taskList: true,
    });
    pBox.innerHTML = pBox.innerHTML.replace(
      /\uFFFF/g,
      '<span class="cursor"></span>'
    );
  });
}

console.log(
  "  oooooooo8   ooooo         ooooooooooo        o        oooooooooo\no888     88    888           888    88        888        888    888\n888            888           888ooo8         8  88       888oooo88\n888o     oo    888      o    888    oo      8oooo88      888  88o\n 888oooo88    o888ooooo88   o888ooo8888   o88o  o888o   o888o  88o8\n\noooo     oooo oooooooooo  ooooo ooooooooooo ooooooooooo oooooooooo\n 88   88  88   888    888  888  88  888  88  888    88   888    888\n  88 888 88    888oooo88   888      888      888ooo8     888oooo88\n   888 888     888  88o    888      888      888    oo   888  88o\n    8   8     o888o  88o8 o888o    o888o    o888ooo8888 o888o  88o8\n"
);
