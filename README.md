# 4Me Writer

## 为什么制作 4Me Writer
> 其实写作，最需要的并不是很好很强大的工具，而是一个不易让人分心的环境。

Mac上的 iA Writer 固然能很好地做到这一点，但作为一个初二学生，我确实也没有那个闲钱去买正版（毕竟Win端一百多块，Mac端两百多块）。我找到了一个类似的软件，叫做 4Me 写字板，[原链接，现已失效](write.4meapp.com)。但是，它和 iA Writer的差距未免也太大了……

4Me 写字板基于 CodeMirror，很方便自定义。

我最近在尝试联系原作者，本来想问一下有没有挂版权什么的。不过貌似现在的这个 4Me 写字板是一个镜像，[链接在此](http://write4me.sinaapp.com) 。页面上虽然有写 4Me 设计出品，但点击之后跳转出来的是一个不存在的页面。原作者可能无力维护服务器了，于是现在将其托管在新浪云上。

于是我借着这次因武汉肺炎疫情宅家的事件，尝试自己以 4Me 写字板为基础加以改进。反正经历了一通大修大改，我做出了这个至少长得很像 iA Writer 的文本编辑器。
我不知道应该取一个什么名字，于是就把“写字板”三个字改成了“Writer”，取名为 “4Me Writer”，也算是对原作者的一个尊重了。我将这个项目开源在 Github 上面，如果原作者有看到，不希望开源，可以联系我邮箱 [邮箱](linhongping1219@163.com) 。

## 4Me Writer 和原来的 4Me 写字板的区别

- 加入可选的暗色模式；
- 加入可选的行号；
- 加入半隐藏的滚动条（4Me 写字板本来是直接去掉滚动条的（overflow: hidden），但牺牲了用户体验）；
- 优化了光标的观感（为此还特意修改了一下 CodeMirror.js）；
- 加入了一个隐藏式的顶栏（当然也可以选择不隐藏）；
- 把“保存到电脑”按钮挪到了右上角；
- 实现了布局自适应（不过对移动端还是不太友好）。

暂时就这么多，以后再慢慢优化。

## 4Me Writer 和 iA Writer 的区别

- iA Writer 可以实现高亮当前句子或段落，而 4Me Writer 只能高亮当前段落，而且是必选的；
- 4Me Writer 不具备 iA Writer 的语法高亮，如果真的有需要，可以试一试这个 Chrome 扩展[English Syntax Hightlighter](https://chrome.google.com/webstore/detail/ikdjjgioalkbdihbhcfffjnanhnilipa)；
- 4Me Writer 不具备 iA Writer 统计单词数量和阅读所需时间的功能。

其实我觉得虽然没有这些功能，4Me Writer 也算还行吧。反正，以后有时间慢慢加吧。
