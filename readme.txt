「YT playlist的隨機播放，不知為什麼很常播某幾首歌…」想playlist會播些很久沒播的歌，所以索性自己做個

會儲存playlist裡所有歌上一次在本地播放的時間，每次選歌時會在5首最久沒播的歌裡，隨機選一首播

現在只做了基本功能，會播歌，播完會按上面的要求切下一首，沒了…

管理歌單的功能也未做好，所以只有我宮下遊還有hoyomix的歌單，不錯聽

-------------------------------

設好run.bat裡，src/server/core/run.js的路徑

裝好node js，執行run.bat，去localhost:8888就用到

裝好Python還有pytube package
    pip install pytube

有用到ffmpeg和yt-dlp
但github不給上傳，貌似是執行檔過大，所以要自己下載好放在src/server/plugin
ffmpeg: https://ffmpeg.org/download.html
yt-dlp: https://github.com/yt-dlp
檔案命名分別是ffmpeg.exe和yt-dlp.exe

-------------------------------

pytube用來拿playlist的資料
yt-dlp是個不錯用的youtube影片下載器
