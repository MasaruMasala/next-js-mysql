import { NextApiRequest, NextApiResponse } from "next";
import {
  insertIoTData,
  selectIoTData,
  selectDeviceData,
} from "~/lib/db_nextapp";
//import crypto from "crypto"; // SORACOM 事前共有鍵 を使用する場合

export default async function userlist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // IoTセンサーデータ登録
    switch (req.method) {
      case 'POST': {
        const headers = req.headers;
        let serial = headers["x-device-id"];
        if (Array.isArray(serial)) { serial = undefined; }
        return selectDeviceData(serial)
          .then((response: any) => {
            if (response.length == 1) {
              const device_id = response[0].id;
              /*
              // SORACOM 事前共有鍵 を使用する場合
              //https://dev.soracom.io/jp/beam/send-data-using-beam/#signature
              const secret_key = "secret_key";
              var string_to_sign = Object.entries(headers)
                //.filter(([k, _]) => k.search(/x-soracom-(?!signature)|x-soracom-signature-version/) > -1) // Air for Cellular
                .filter(([k, _]) => k.search(/x-soracom-sigfox-device-id|x-soracom-timestamp/) > -1)  // sigfox
                .map(([k, v]) => k + "=" + v)
                .sort((a: string, b: string) => {
                  if (a < b) return -1;
                  if (a > b) return 1;
                  return 0;
                })
                .join("");
              const hashvalue = crypto
                .createHash("sha256")
                .update(secret_key + string_to_sign)
                .digest("hex");
              // 事前共有鍵が一致
              if (hashvalue == headers["x-soracom-signature"]) {
                console.log("match secret key");
              }
              */
              const iotdata = JSON.parse(JSON.stringify(req.body));
              // データを登録
              return insertIoTData(
                device_id,
                iotdata.temperature,
                iotdata.humidity,
                iotdata.longitude,
                iotdata.latitude
              )
                .then((response) => {
                  console.log(response);
                  res.status(200).json({ statusCode: 200, message: "Registration has been completed." }); // データベース登録完了
                })
                .catch((error) => {
                  res
                    .status(500)
                    .json({ statusCode: 500, message: error.message }); // データベース登録エラーメッセージ
                });
            }
            res.status(500).json({ statusCode: 500, message: "No matching device." }); // マッチするデバイスなし
          })
          .catch((error) => {
            res.status(500).json({ statusCode: 500, message: error.message }); // データベース検索エラー
          });
        // IoTセンサーデータ取得
      }
      case 'GET': {
        const device_name = req.headers["x-device-name"]?.toString();
        const start_date = req.headers["x-device-startdate"] ? new Date(req.headers["x-device-startdate"].toString()) : undefined;
        const end_date = req.headers["x-device-enddate"] ? new Date(req.headers["x-device-enddate"].toString()) : undefined;

        return selectIoTData(device_name, start_date, end_date)
          .then((response: any) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response));
          })
          .catch((error: any) => {
            res.status(200).json({ statusCode: 500, message: error.message });
          });
      }
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message }); // その他エラー時のメッセージ
  }
}
