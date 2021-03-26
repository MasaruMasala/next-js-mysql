import { excuteQuery } from "~/lib/mysql";

// デバイス情報の取得
export async function selectDeviceData(serial?: string): Promise<any> {
  return excuteQuery(
    `SELECT id FROM devices
    WHERE serial=?`,
    [serial]
  );
}

// IoTセンサーデータの取得
export async function selectIoTData(
  device_name?: string,
  start_date?: Date,
  end_date?: Date
): Promise<any> {
  
  // 未設定の場合 1970-01-01T00:00:00.000Z
  start_date = start_date ?? new Date(0);
  // 未設定の場合 現在時間
  end_date = end_date ?? new Date(Date.now());
  
  return excuteQuery(
    `SELECT m.* 
     FROM iot_data as m 
     INNER JOIN devices as d ON m.device_id = d.id
     WHERE d.name=? AND m.updated_at>? AND m.updated_at<=?
     ORDER BY m.updated_at`,
    [device_name, start_date.toISOString(), end_date.toISOString()]
  );
}

// IoTセンサーデータの登録
export async function insertIoTData(
  device_id: number,
  temperature: number,
  humidity: number,
  longitude: number,
  latitude: number
): Promise<any> {
  return excuteQuery(
    `INSERT INTO iot_data 
    (device_id,temperature,humidity,longitude,latitude)
    VALUES (?,?,?,?,?)`,
    [device_id, temperature, humidity, longitude, latitude]
  );
}

