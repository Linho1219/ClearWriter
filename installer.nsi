; 安装程序初始定义常量
!define PRODUCT_NAME "Clear Writer"
!define PRODUCT_VERSION "1.7"
!define PRODUCT_PUBLISHER "林洪平"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\clear_writer.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

SetCompressor lzma

; ------ MUI 现代界面定义 (1.67 版本以上兼容) ------
!include "MUI.nsh"
!include "WinMessages.nsh"


; MUI 预定义常量
!define MUI_ABORTWARNING
!define MUI_ICON "icon.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

!define MUI_WELCOMEFINISHPAGE_BITMAP "brand.bmp"
!define MUI_WELCOMEPAGE_TITLE "\r\n　　　$(^NameDA) 安装程序"
!define MUI_WELCOMEPAGE_TEXT "Clear Writer 是一款简洁的 Markdown 写作软件，力求创造一个安静的写作环境\r\n\r\n作者：林洪平\r\n\r\n$_CLICK"

; 语言选择窗口常量设置
!define MUI_LANGDLL_REGISTRY_ROOT "${PRODUCT_UNINST_ROOT_KEY}"
!define MUI_LANGDLL_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_LANGDLL_REGISTRY_VALUENAME "NSIS:Language"


; 欢迎页面
!define MUI_PAGE_CUSTOMFUNCTION_SHOW ChangeFont
!insertmacro MUI_PAGE_WELCOME
; 许可协议页面
!define MUI_LICENSEPAGE_CHECKBOX

!define MUI_PAGE_CUSTOMFUNCTION_SHOW ChangeFont
!insertmacro MUI_PAGE_LICENSE "description.txt"

; 安装目录选择页面
!define MUI_PAGE_CUSTOMFUNCTION_SHOW ChangeFont
!insertmacro MUI_PAGE_DIRECTORY
; 安装过程页面
!insertmacro MUI_PAGE_INSTFILES
; 安装完成页面
!define MUI_FINISHPAGE_RUN "$INSTDIR\clear_writer.exe"
!insertmacro MUI_PAGE_FINISH

; 安装卸载过程页面
!insertmacro MUI_UNPAGE_INSTFILES

; 安装界面包含的语言设置
!insertmacro MUI_LANGUAGE "SimpChinese"

; 安装预释放文件
!insertmacro MUI_RESERVEFILE_LANGDLL
!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS

; ------ MUI 现代界面定义结束 ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "${PRODUCT_NAME}_${PRODUCT_VERSION}_setup.exe"
InstallDir "$PROGRAMFILES\Clear Writer"
InstallDirRegKey HKLM "${PRODUCT_UNINST_KEY}" "UninstallString"
ShowInstDetails show
ShowUnInstDetails show
BrandingText "Simple. Beautiful. Powerful."

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  File /r "OutApp\clear_writer-win32-x64\*.*"
  
  CreateShortCut "$SMPROGRAMS\Clear Writer.lnk" "$INSTDIR\clear_writer.exe"
  CreateShortCut "$DESKTOP\Clear Writer.lnk" "$INSTDIR\clear_writer.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\clear_writer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\clear_writer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

#-- 根据 NSIS 脚本编辑规则，所有 Function 区段必须放置在 Section 区段之后编写，以避免安装程序出现未可预知的问题。--#

Function .onInit
  System::Call 'SHCore::SetProcessDpiAwareness(i 1)i.R0'
  !insertmacro MUI_LANGDLL_DISPLAY
FunctionEnd

Function ChangeFont
	FindWindow $0 "#32770" "" $HWNDPARENT ;$0 保存主窗口句柄

	GetDlgItem $R0 $0 1006
	CreateFont $R1 "微软雅黑" 9 0 ;安装目录选择页面 字体
	SendMessage $R0 ${WM_SETFONT} $R1 0

FunctionEnd

/******************************
 *  以下是安装程序的卸载部分  *
 ******************************/

Section Uninstall
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\clear_writer.exe"

  Delete "$DESKTOP\Clear Writer.lnk"
  Delete "$SMPROGRAMS\Clear Writer.lnk"

  RMDir "$SMPROGRAMS\Clear Writer"

  RMDir /r "$INSTDIR\swiftshader"
  RMDir /r "$INSTDIR\resources"
  RMDir /r "$INSTDIR\locales"

  RMDir "$INSTDIR"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd

#-- 根据 NSIS 脚本编辑规则，所有 Function 区段必须放置在 Section 区段之后编写，以避免安装程序出现未可预知的问题。--#

Function un.onInit
	System::Call 'SHCore::SetProcessDpiAwareness(i 1)i.R0'
	!insertmacro MUI_UNGETLANGUAGE
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "您确实要完全卸载 $(^Name) ？" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) 已成功地从您的计算机移除。期待与你的下次见面。"
FunctionEnd
