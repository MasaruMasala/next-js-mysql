# Next.js MySQL example
Next.jsでmysqlを用いてデータの入出力を行う

## Usage
### dockerの実行  
試験環境  
 ```bash
 NEXT_APP_ENV=development docker-compose up -d
 ```
本番環境  
 ```bash
 NEXT_APP_ENV=production docker-compose up -d
 ```
### データ登録
デバイスID,気温,湿度,緯度,経度をPOSTしmysqlデータベースへ登録する  
cmd
```
curl -X POST http://localhost/app/api/weather -H "x-device-id:12345678" -H "Content-Type: application/json" -d "{\"temperature\":25.0,\"humidity\":50.0,\"longitude\":35.0,\"latitude\":135.0}"
```
powershell
```
curl.exe -X POST http://localhost/app/api/weather -H "x-device-id:12345678" -H "Content-Type: application/json" -d '{\"temperature\":25.0,\"humidity\":50.0,\"longitude\":35.0,\"latitude\":135.0}'
```
bash
```
curl -X POST http://localhost/app/api/weather -H "x-device-id:12345678" -H "Content-Type: application/json" -d '{"temperature":25.0,"humidity":50.0,"longitude":35.0,"latitude":135.0}'
```
### アクセス確認  
http://localhost/app/graph/device1

## Requirement
Docker,docker-compose

