## 一.项目介绍  
 * 项目框架管理类  
 * 作者：掌游技术部  
 * 时间：2020-08-07
 * [版本号：v1.0.0]  
 * 封装内容：
* 本代码包含弹窗管理类（游戏通关，游戏失败，游戏复活，签到，皮肤商店，获得奖励，游戏导出等）、各平台广告管理类（微信，QQ，字节跳动，vivo，oppo等）、工具类（后台系统，数组方法，音乐管理，laya的一些通用方法等）

* v1.0.1新增百度小游戏管理类，优化管理类逻辑，去除无用代码、游戏业务逻辑
* 时间 2020-08-11

## 二.使用说明
### 1.弹窗管理类  
**所有弹窗继承BaseDialogSc.js** 具体要实现的抽象方法和定义的通用方法看代码注释
*Activeity*弹窗管理类文件夹  
*Activeity->Scripts*弹窗管理类脚本
* BxDialog.js 宝箱脚本  ---`opPass()`方法为成功调用方法
* CheckInDialog.js 签到脚本  
* ExprotBoxDialog.js 导出盒子页面脚本  
* ExprotBox2Dialog.js 导出盒子页面2脚本  
* ExprotBox3Dialog.js 导出盒子页面3脚本  
* ExprotListDialog.js 导出列表页脚本  
* FailDialog.js 游戏失败脚本  
* HomeDialog.js 游戏首页脚本  
* LevelDialog.js 关卡控制脚本  
* MentDialog.js 控制开关脚本  
* PassCoinDialog.js 游戏通关获得奖励脚本  
* PassDialog.js 游戏通关脚本  
* ResuDialog.js 复活弹窗脚本  
* ShopDialog.js 商店脚本  
* TLDialog.js 体力脚本  
* TryEndDialog.js 通关获得皮肤试用脚本  
* TryFailDialog.js 失败试用皮肤脚本  
* RankDialog.js 排行榜脚本  
*Runtimes->BaseDialogRT.js*弹窗通用runtime,每个弹窗必须引用，主要用到打开弹窗时传递参数的方法`onOpened()`，_（只有在runtime里面才能读取到）_  
*Activeity->BaseDialogSc.js*弹窗基类，里面包含弹窗的一些通用方法

### 2.Data文件夹（游戏常用数据）  
* *ActivityUrls.js*里面包含了所有页面链接地址
* *ConfigData.js*游戏配置文件里面包含了游戏的一些储存名称以及经常调用的参数具体看里面注释  

### 3.EventSystem文件（游戏接听方法，方便管理游戏逻辑）  
* `on` 注册事件
* `removeListener` 移除事件
* `emit` 广播事件

### 3.Game文件夹（游戏逻辑文件夹，里面主要写游戏核心逻辑，以及一些通用的管理类）  
* Game->Script->LoadingScene.js 游戏加载页脚本，基本可以通用 包含 *资源预加载*、*分包加载* 、*数据初始化*  
* Game->GameMg 游戏管理文件夹
* *GameMg.js* 游戏核心接口必须实现 Interfaces下面的GameState接口方便游戏管理 具体用法开注释
* LGAniMgr.js 龙骨管理 集成龙骨地址
* gameData.js 游戏数据里面放一些关卡数据，签到数据，背景数据，游戏进度记录等静态属性，具体看注释
* PowerMg.js 体力管理类，可以通用
* PublicMg.js Laya通用的一些方法以及日常积累的一些通用js方法具体用法看里面注释  

### 4.Manages文件夹（游戏插件管理）  
* *AldMg.js* 阿拉丁统计管理类具体用法看注释 阿拉丁帮助文档(http://doc.aldwx.com/mini-program)  
* *UmMg.js* 友盟统计 （https://developer.umeng.com/docs/147615/detail/147619）  
* *HttpMg.js* 游戏后台统计管理具体用法看注释  
* *LeadOutMg.js* 游戏导出管理类（获取导出数据储存方便管理）  
* **LoadDataMg.js** 游戏加载初始化集中管理类（把游戏必须初始化，或者加载的资源，集中处理）  

### 5.Platform文件夹（平台管理，包含微信，QQ，字节跳动，百度,vivo，oppo，Web测试）  
#### **AdMg.js** 广告管理类集合（集成了微信，QQ，字节跳动，百度,vivo，oppo视频广告、banner广告管理 ）  
* `showVideo()`视频播放  
* `showBanner()`显示banner广告  
* `hideBanner()`关闭banner广告  


#### *Platform ->Wx* Wx管理类  
* WxbannerAd.js 微信banner广告管理类  
* WxMusicUtil.js 微信背景音乐管理（主要为了适配iphone6，7，8）
* WxShare.js 微信分享管理类  
* WxVideoUtil.js 微信视频管理类

#### *Platform ->Qq* QQ管理类下面文件同微信  

#### *Platform ->Tt* 头条管理类  
* recorderMgr.js 头条录屏管理类  

#### *Platform ->Bd* 头条管理类  

#### 各平台管理  
* *PlatformMg.js* 平台管理控制
* DebugPlatform.js Web测试用  
* WxAdUtil.js 微信广告管理  
* QqAdUtil.js QQ广告管理  
* TtAdUtil.js 字节跳动广告管理  
* BdAdUtil.js 百度广告管理  
* OppoAdUtil.js Oppo广告管理  
* VivoAdUtil.js Vivo广告管理  
* LeadOut5Spr.js 自定义banner


### 6.Prefabs通用预制体脚本  
* BottomBoxControl.js 底部滚动导出脚本  
* CheckInBoxlog.js 签到脚本  
* CoinControl.js 金币脚本  
* TopDcBoxMg.js 头部滚动导出脚本  
* ExprotBox.js 导出盒子脚本  
* ExProtDrawerMgr.js 导出抽屉  
* ExprotTcList.js 弹窗页导出盒子预制体  
* retrunHomeMg.js 返回首页  
* TlMg.js 体力脚本  

### 6.Utils工具管理类（具体用法看注释）  
* AnimUtil.js 帧动画管理类  
* ArrUtil.js 数组工具类  
* SoundUtils.js 声音播放工具  
* TipsUtils.js 提示工具  
* LocalStorageUtil.js 本地储存工具  
* *其他文件看内部注释*  

## 如有不明白的地方可以邮件咨询 `178673069@qq.com`
 







