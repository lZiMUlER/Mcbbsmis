# Mcbbsmis
[![BiliBili](https://img.shields.io/badge/BiliBili-Mcbbsmis%20開發者B站-red?logo=bilibili)](https://b23.tv/ymEtPO)
[![Npm](https://img.shields.io/npm/v/mcbbsmis.svg?label=Npm&logo=npm)](https://www.npmjs.com/package/mcbbsmis)
[![Snyk](https://snyk.io/advisor/npm-package/mcbbsmis/badge.svg?label=Package%20Health)](https://snyk.io/advisor/npm-package/mcbbsmis)
[![Github](https://img.shields.io/github/issues/lZiMUl/Mcbbsmis?label=Issues&logo=github)](https://github.com/lZiMUl/Mcbbsmis/issues)
[![Github](https://img.shields.io/github/forks/lZiMUl/Mcbbsmis?label=Forks&logo=github)](https://github.com/lZiMUl/Mcbbsmis/network/members)
[![Github](https://img.shields.io/github/stars/lZiMUl/Mcbbsmis?label=Stars&logo=github)](https://github.com/lZiMUl/Mcbbsmis/stargazers)
[![Github](https://img.shields.io/github/license/lZiMUl/Mcbbsmis?label=License&logo=github)](https://github.com/lZiMUl/Mcbbsmis/blob/main/License)
</Br>

## 特別鳴謝所有測試人員
* [![BiliBili](https://img.shields.io/badge/BiliBili-骥翼志-FF8C00?logo=bilibili)](https://b23.tv/lPZ0gr)
* [![BiliBili](https://img.shields.io/badge/BiliBili-教科书式帕琪-FF8C00?logo=bilibili)](https://b23.tv/rTsY3K)
* [![BiliBili](https://img.shields.io/badge/BiliBili-咸鸡嘎吱脆-FF8C00?logo=bilibili)](https://b23.tv/yEq6b1)
* [![BiliBili](https://img.shields.io/badge/BiliBili---星陌雪---FF8C00?logo=bilibili)](https://b23.tv/7HliLl)
* [![BiliBili](https://img.shields.io/badge/BiliBili-F小冷-FF8C00?logo=bilibili)](https://b23.tv/ukCYSs)
* [![BiliBili](https://img.shields.io/badge/BiliBili-二书子-FF8C00?logo=bilibili)](https://b23.tv/hmzHVh)
#### 期待您的加入測試
</Br>

### 使用教程
* 1.打開設備文件管理器找到 [Mcbbsmis] 項目文件夾並進入 [Configs] 配置文件夾。
* 2.配置 [ServiceConfigs.INI] 服務屬性值 ([配置教學傳送門](https://b23.tv/ymEtPO) 私聊我即可)。
* 3.終端輸入 [termux-wake-lock && cd /storage/emulated/0/ && node Mcbbsmis] 來啟動 Mcbbsmis 服務，複製輸出消息 [請複製這個連接命令:] 下面的連接命令。
* 4.進入 [Minecraft] 進入存檔 (前提: 必須打開作弊功能) 打開聊天欄粘貼連接命令回車。
* 5.輸入發送彈幕命令 [$Send: 消息]。
* 6.打開BiliBili並進入您的直播間查看彈幕即可。
* 7.如有錯誤，請在Github上提出問題即可 [報告問題傳送門](https://github.com/lZiMUl/Mcbbsmis/issues)。
* 8.教程完畢。
</Br>

## 這個版本內容
### 新內容
* 1.新增ListenerStatus配置，語法 $Configs: ListenerStatus 佈爾值
* 2.Windows 系統可以運行此項目了
* 3.新增Plugins載入器 (你們可以開發 Mcbbsmis 插件了，開發教程訪問我的B站主頁私信給我)
* 4.優化插件載入器執行方法,新增17個API接口
* 5.支持PN自動標識輸出
</Br>

### 基本命令
* 1.幫助助手命令: $Help 幫助
* 2.發送彈幕命令: $Send: 消息
* 3.設定配置命令: $Configs: 選項
* 4.關鍵詞語命令: $Keywords: 關鍵詞
* 5.公開插件命令: $Plugins: 選項
* 6.運行Node命令: 新增命令 $Node: JavaScript Code
</Br>