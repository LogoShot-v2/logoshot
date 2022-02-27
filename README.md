
### 後端開啟:
* 到 weiwei 上使用 metadragons 帳號登入。
* 到後端目錄，開啟 byobu 後執行 app.py。
```
cd /home/metadragons/backend 
byobu
python3 app.py
```

### 前端開啟: 
* 如沒有 yarn 或 npm 等專案管理套件請事先下載好(以下使用 yarn)
* 到 frontend 目錄下載好前端套件
```
cd frontend
yarn install
```
###### 執行前端
* 執行前端
```
yarn add expo-cli
yarn start
```
* 此時若之前沒有裝過 expo，會跳出錯誤碼，請依錯誤碼指示安裝 expo (安裝在 global 比較保險)。安裝完 expo 後重新 yarn start 應該就可以跑了。

###### 使用 expo 看測試檔
* 在手機上下載 expo (google play就有，iphone在app store上應該也有)
* 前端執行起來後，會出現一個 http://localhost:19002 的網址，使用瀏覽器開啟。
* 將左下角的 connection 從 lan 改為 tunnel。
* 使用 expo 掃描 connection 下的 QR code
hopefully前端即可開啟成功

