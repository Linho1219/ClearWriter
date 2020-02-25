# Welcome to Clear Writer，这是一个沉浸式 Markdown 写作软件。

## 为什么编写 Clear Writer
> 其实写作，最需要的并不是很好很强大的工具，而是一个不易让人分心的环境。

Mac上的 iA Writer 固然能很好地做到这一点，但作为一个初二学生，我确实也没有那个闲钱去买正版（毕竟 Win 端一百多块，Mac 端两百多块）。我找到了一个类似的软件，叫做 4Me 写字板，[原链接，现已失效](write.4meapp.com)。但是，它和 iA Writer 的差距未免有点大……

4Me 写字板基于 CodeMirror，很方便自定义。

于是我征求了原作者同意之后，借着这次因武汉肺炎疫情宅家的时间，尝试自己以 4Me 写字板为基础加以改进。反正经历了一通大修大改，我做出了这个很像 iA Writer 的文本编辑器 —— Clear Writer，意味着希望人们使用它时，可以让人“Clear”自己的思维。

## 使用技巧
- 按 `F11` （或 `Fn+F11` ）切入全屏，安心写作；
- `Ctrl + F` 搜索全文；
- 鼠标移动至顶部时显示顶栏，其中可以切换亮/暗色模式、行号、语言等；
- 点击顶栏上的图钉 `📌` 按钮可以固定顶栏，使其不自动隐藏；
- 右上角有 `另存为...` 按钮，点击可以将文字导出为 `.txt` 格式文本
- 点击左上角的 `Clear Writer` 会在侧边栏显示你现在正在看的这段文字，再次点击 `Clear Writer` 隐藏侧边栏。

## 兼容性
- ✔ Chrome
- ✔ Firefox
- ✔ Edge
- ❌ IE

**注意：不再兼容 Internet Exporler 浏览器 —— 原因很简单，第一，用 IE 写作的人的头脑大概率不会“Clear”；第二，兼容古老的IE真的很痛苦……**

## Clear Writer 和 4Me 写字板的区别
- 加入可选的暗色模式；
- 加入可选的行号；
- 加入半隐藏的滚动条；
- 优化了光标的观感（为此还特意修改了一下 CodeMirror.js）；
- 加入了一个隐藏式的顶栏（当然也可以选择不隐藏）；
- 把“保存到电脑”按钮挪到了右上角；
- 实现了布局自适应。

暂时就这么多，以后再慢慢优化。

## Clear Writer 和 iA Writer 的区别
- iA Writer 可以实现高亮当前句子或段落，而 Clear Writer 只能高亮当前段落，而且是必选的；
- Clear Writer 不具备 iA Writer 的语法高亮，如果真的有需要，可以试一试这个 Chrome 扩展[English Syntax Hightlighter](https://chrome.google.com/webstore/detail/ikdjjgioalkbdihbhcfffjnanhnilipa)；
- Clear Writer 不具备 iA Writer 统计单词数量和阅读所需时间的功能；

其实我觉得虽然没有这些功能，Clear Writer 也算还行吧。反正，以后有时间慢慢加吧。

## 关于隐私
**声明** 你在这个页面上输入的任何东西都保存在浏览器的 **本地缓存** ，一个字符都不会上传！如果你不放心，可以前往这个项目在[Github](https://github.com/Henrylin666/ClearWriter)上，自行阅读源码。
