import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment-timezone";

 type GraphProps = {
  device_name: string;
  graph_data: {
    temperature: {};
    humidity: {};
  };
};

export class Graph extends React.Component<GraphProps> {
  private internalChart!: Highcharts.Chart; // グラフのインスタンス
  // コンストラクタ
  constructor(props: GraphProps) {
    super(props);
    // グラフインスタンス格納用
    this.afterChartCreated = this.afterChartCreated.bind(this);
  }
  // グラフインスタンスを格納
  afterChartCreated(chart: Highcharts.Chart) {
    this.internalChart = chart;
    this.forceUpdate();
  }
  // 再レンダリング
  componentDidUpdate() {
    this.internalChart.reflow();
  }
  // 更新データ追加
  addData(newdata: any) {
    newdata.temperature.map((value:any) => {this.internalChart.series[0].addPoint(value)})
    newdata.humidity.map((value:any) => {this.internalChart.series[1].addPoint(value)})
  }

  render() {
    // グラフ表示オプション
    const chartOptions = {
      chart: {
        type: "scatter", // 散布図
        zoomType: "xy",
      },
      time: {
        getTimezoneOffset: () => {
          const zone = "Asia/Tokyo";
          return -moment().tz(zone).utcOffset(); // 表示上の日時を日本時間にオフセットする 日本の場合:-(9*60)
        },
      },
      plotOptions: {
        scatter: {
          lineWidth: 2, // ポイント間に線を引く
          // ポイントマウスオーバー時の表示
          tooltip: {
            headerFormat: "<b>{series.name}</b><br>",
            shared: true,
            pointFormat: `<span style="color:{series.color}">
                <b>{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y}</b>
                </span><br/>`,
          },
        },
      },
      xAxis: {
        title: { text: "日時" },
        type: "datetime",
      },
      yAxis: [
        {
          labels: { format: "{value}℃" },
          title: { text: "気温" },
        },
        {
          labels: { format: "{value}%" },
          title: { text: "湿度" },
          opposite: true,
        },
      ],
      title: {
        text: "Fig. " + this.props.device_name,
      },
      series: [
        {
          name: "温度",
          data: this.props.graph_data.temperature,
          tooltip: {
            valueSuffix: " ℃", // 単位
            valueDecimals: 1, // 表示桁
          },
          yAxis: 0, // 第1軸
        },
        {
          name: "湿度",
          data: this.props.graph_data.humidity,
          tooltip: {
            valueSuffix: " %", // 単位
            valueDecimals: 1, // 表示桁
          },
          yAxis: 1, // 第2軸
        },
      ],
    }
    return (
      <>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          callback={this.afterChartCreated}
        />
      </>
    );
  }
}
