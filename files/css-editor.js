var editor = CodeMirror.fromTextArea(document.getElementById("css_code"), {
  lineNumbers: true,
  lineWrapping: true,
  indentUnit: 4,
  indentWithTabs: true,
  undoDepth: 2000,
  cursorBlinkRate: 800,
  styleActiveLine: true,
  foldGutter: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  spellcheck: true,
  autoCloseBrackets: true,
  mode: "css",
  matchBrackets: true,
  showCursorWhenSelecting: true,
});

if (localStorage.css) editor.setValue(localStorage.css);

editor.on("change", () => {
  localStorage.setItem("css", editor.getValue());
});

window.onload = () => {
  setTimeout(() => {
    document.querySelector(".loading").style.opacity = "0";
  }, 300);

  setTimeout(() => {
    document.querySelector(".main").style.opacity = "";
    document.querySelector(".main").style.animation = "fadeInUp 0.5s";
    editor.focus();
  }, 500);
};

document.getElementById("close").onclick = () => {
  var { remote } = require("electron");
  var CURRENT_WINDOW = remote.getCurrentWindow();
  CURRENT_WINDOW.close();
};
