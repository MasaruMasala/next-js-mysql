import React from "react";
import moment from "moment-timezone";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
L.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/images/";

// マーカーアイコン
const icon_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><g>
<path style="fill:#110813;fill-opacity:1;stroke:none;stroke-width:0;paint-order:stroke markers fill;opacity:0.2"
  d="M 139.7,149.75416 C 116.96503,165.17518 75,180 75,180 75,180 68.909729,147.77475 86.254172,126.47083 118.25,87.170833 153.02059,81.355459 171.5729,95.779165 194.43564,113.55406 166.15833,131.8076 139.7,149.75416 Z"/>
<path style="fill:{mapIconColor};stroke:none;stroke-width:0;paint-order:stroke markers fill"
  d="m 150,75 c 3.23187,39.04997 -49.99817,58.00164 -75,105 C 50.003052,133.00291 0,116.42136 0,75 0,33.578644 33.578644,0 75,0 c 41.42136,0 71.76813,35.950028 75,75 z" />
</g></svg>`;

const icons = {
  selected_device: L.divIcon({
    className: "leaflet-data-marker",
    html: L.Util.template(icon_svg, {mapIconColor: "#4169e1"}),
    iconSize: [40, 40],
    iconAnchor: [16.5, 42.5], // 表示位置補正
    popupAnchor: [0, -36],    // ポップアップ表示位置補正
    tooltipAnchor: [18, -28], // ツールチップ表示位置補正
  }),
};

type MapProps = {
  device_name: string;
  device_gps: [];
  onMarkerSelected: Function;
};

export default class Map extends React.Component<MapProps> {
  private center_position!: any;
  constructor(props: MapProps) {
    super(props);
    this.center_position =
      props.device_gps.length > 0
        ? props.device_gps.slice(-1)[0]
        : [0, [0, 0]];
  }
  render() {
    return (
      <>
        <MapContainer
          center={this.center_position[1]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "450px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            icon={icons.selected_device}
            position={this.center_position[1]}
            eventHandlers={{
              click: (e: any) => { this.props.onMarkerSelected(e) }
            }}
          >
            <Popup>
              {this.props.device_name}
              <br />
              {moment(this.center_position[0]).format("YYYY-MM-DD HH:mm:ss")}
            </Popup>
            <Tooltip>test1 {this.props.device_name}</Tooltip>
          </Marker>
        </MapContainer>

        <style jsx>
          {`
            .map-root {
              height: 100%;
            }
            .leaflet-container {
              height: 500px !important;
              width: 80%;
              margin: 0 auto;
            }
          `}
        </style>
      </>
    );
  }
}
