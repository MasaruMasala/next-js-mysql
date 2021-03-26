import React, { useCallback } from "react";
import { Graph } from "~/components/graph";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { selectIoTData } from "~/lib/db_nextapp";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const basepath = publicRuntimeConfig.basePath || ""; // サブディレクトリ名

// サーバサイドでの処理
export async function getServerSideProps(context: any) {
  const { device_name } = context.query; // デバイス名
  const start_date = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000); // データの範囲開始
  let end_date = new Date(Date.now() - 0 * 24 * 60 * 60 * 1000); // データの範囲終了
  // 初期表示データの取得
  return selectIoTData(device_name, start_date, end_date).then(
    (response: any) => {
      const sensor_data = parseData(response);
      if (response.length > 0) { end_date = new Date(response.slice(-1)[0].updated_at) }
      return {
        props: {
          device_name: device_name,
          start_date: start_date.toISOString(),
          end_date: end_date.toISOString(),
          sensor_data: sensor_data,
        },
      };
    }
  );
}
// 更新データの取得
const fetch_data = (device_name: string, startDate: Date, endDate: Date) => {
  return fetch(basepath + "/api/weather", {
    method: "GET",
    cache: "no-cache",
    headers: {
      "x-device-name": device_name,
      "x-device-startdate": startDate.toISOString(),
      "x-device-enddate": endDate.toISOString(),
    },
  }).then((response) => {
    if (!response.ok) {
      return [];
    } else {
      return response.json();
    }
  });
};
// データを辞書形式に変換
function parseData(
  array_data: [],
  init_data = { temperature: [], humidity: [], gps: [] }
) {

  return array_data.reduce(
    (pre: any, cur: any) => {
      pre.temperature.push([Date.parse(cur.updated_at), cur.temperature]);
      pre.humidity.push([Date.parse(cur.updated_at), cur.humidity]);
      pre.gps.push([
        Date.parse(cur.updated_at),
        [cur.longitude, cur.latitude],
      ]);

      return pre;
    },
    {
      temperature: init_data.temperature,
      humidity: init_data.humidity,
      gps: init_data.gps,
    }
  );
}

// グラフ、マップを表示
export default function DisplayData(props: any) {
  const GraphComponent = React.useRef<Graph>(null);
  const MapComponent = React.useRef<any>(null);

  const [endDate, setEndDate] = React.useState(new Date(props.end_date));
  const updatedata = () => {
    let now = new Date(Date.now());
    fetch_data(props.device_name, endDate, now).then((response) => {
      // データをグラフへ追加
      const newdata = parseData(response);
      GraphComponent.current?.addData(newdata);
      if (response.length > 0) {
        setEndDate(new Date(response.slice(-1)[0].updated_at)); // 時間を更新
      }
    });
  };

  // Mapコンポーネント
  const Map: any = dynamic(() => import("../../components/map"), {
    ssr: false,
  });
  // Mapのマーカクリック時イベント
  const onMarkerSelected = useCallback((e) => { console.log("select device callback, ", e); }, []);

  return (
    <>
      <button type="button" onClick={updatedata}>更新</button>
      <Graph
        device_name={props.device_name}
        graph_data={props.sensor_data}
        ref={GraphComponent}
      />
      <Map device_name={props.device_name} device_gps={props.sensor_data.gps} onMarkerSelected={onMarkerSelected} ref={MapComponent} />
    </>
  );
}
//
//
