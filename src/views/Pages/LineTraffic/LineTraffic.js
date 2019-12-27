/* eslint-disable react/jsx-pascal-case */
import React, { Component } from "react";
import PinImg from "../../../assets/marker/marker.png";
import PinImgGreen from "../../../assets/marker/marker-green.png";
import PinImgRed from "../../../assets/marker/marker-red.png";
import mqtt from "mqtt";
import GoogleMapReact from "google-map-react";
import { Player } from "video-react";
import Hls from "hls.js";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const liff = window.liff;
const AnyReactComponent_currentUser = ({ text }) => (
  <div>
    <i className="fa fa-map-marker fa-3x  text-warning"></i>
    {text}
  </div>
);

function LoadingMessage() {
  return (
    <div className="splash-screen">
      <div className="loading-dot" />
    </div>
  );
}

class ClientPinOnMap extends Component {
  render() {
    if (
      this.props.car.status === "IDLE" ||
      this.props.car.status === "STOPPING"
    ) {
      return (
        <div onClick={() => this.props.onClickCar(this.props.car.id)}>
          <img src={PinImgRed} width="26" height="35" alt="Red Pin"></img>
        </div>
      );
    } else if (this.props.car.isSelect) {
      return (
        <div onClick={() => this.props.onClickCar(this.props.car.id)}>
          <img src={PinImgGreen} width="26" height="35" alt="Green Pin"></img>
        </div>
      );
    } else {
      return (
        <div onClick={() => this.props.onClickCar(this.props.car.id)}>
          <img src={PinImg} width="26" height="35" alt="Blue Pin"></img>
        </div>
      );
    }
  }
}
class Streaming extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let id = this.props.car.id;
    let url = "http://111.223.48.201:1935/claimdi/" + id + "/playlist.m3u8";
    return (
      <div className="text-center" key={id}>
        <Player playsInline fluid={false} width={"auto"} height={272}>
          <HLSSource isVideoChild src={url} />
        </Player>
      </div>
    );
  }
}
class HLSSource extends Component {
  constructor(props, context) {
    super(props, context);
    this.hls = new Hls({ enableWorker: false });
  }
  componentDidMount() {
    const { src, video } = this.props;
    if (Hls.isSupported()) {
      this.hls.loadSource(src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {});
    }
  }
  componentWillUnmount() {
    // destroy hls video source
    if (this.hls) {
      this.hls.destroy();
    }
  }
  render() {
    return (
      <source
        src={this.props.src}
        type={this.props.type || "application/x-mpegURL"}
      />
    );
  }
}

class Map extends Component {
  render() {
    const clientLocation = this.props.car.map((item, key) => {
      return (
        <ClientPinOnMap
          key={item.id}
          lat={item.lat}
          lng={item.lng}
          car={item}
          onClickCar={this.props.onClickpin}
        />
      );
    });
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          center={this.props.center}
          bootstrapURLKeys={{ key: "AIzaSyBb-wQxRCIuQgkX_qYzFm5n8D4qnSg0p7w" }}
          defaultCenter={this.props.defaultCenter}
          defaultZoom={this.props.mapZoom}
        >
          <AnyReactComponent_currentUser
            lat={this.props.center.lat}
            lng={this.props.center.lng}
            text=""
          />
          {clientLocation}
        </GoogleMapReact>
      </div>
    );
  }
}

class LineTraffic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      loading: true,
      mapZoom: 15,
      canGetmap: false,
      defaultCenter: {
        lat: 13.850016,
        lng: 100.527341
      },
      currentUser: {
        lat: 13.850016,
        lng: 100.527341
      },
      selectedCar: {
        id: "",
        lat: 13.7685175,
        lng: 101.5808732,
        carPlate: "",
        name: "",
        policyNo: "",
        company: "",
        companyId: 0,
        speed: "",
        status: "",
        isSelect: false
      },
      cars: [],
      MqttLst: []
    };
    this.getMyLocation = this.getMyLocation.bind(this);
    this.selectCar = this.selectCar.bind(this);
    this.mqtt = this.mqtt.bind(this);
    this.updateCarsfromMqttObj = this.updateCarsfromMqttObj.bind(this);
    this.toggle = this.toggle.bind(this);

    var opt = {
      username: "ugztftin",
      password: "JLGvbvRILhRs",
      clientId:
        "Client_" +
        Math.random()
          .toString(16)
          .substr(2, 8)
    };
    this.client = mqtt.connect("wss://m12.cloudmqtt.com:35401", opt);
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  getMyLocation() {
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition(position => {
        this.setState({
          currentUser: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      });
    }
  }
  mqtt() {
    var _topic = "xtest";
    this.client.on("connect", () => {
      this.client.subscribe(_topic);
      this.client.publish(_topic, "test send msg");
    });

    this.client.on("message", (_topic, payload) => {
      var payloadString = payload.toString();
      if (IsJsonString(payloadString)) {
        var json = JSON.parse(payloadString);

        /////////// check status //////////////
        var passStatusFilter = false;
        if (
          json.status === "STARTING" ||
          json.status === "READY" ||
          json.status === "RUNNING"
        ) {
          passStatusFilter = true;
        } else {
          passStatusFilter = false;
        }

        /// update state
        if (passStatusFilter) {
          this.updateCarsfromMqttObj(json);
        }
      }
    });
    this.client.on("error", er => {
      console.log("mqtt error", er);
    });

    function IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
  }
  updateCarsfromMqttObj(json) {
    var select = this.state.selectedCar;
    if (select.id === json.id) {
      json.isSelect = true;
      this.setState({ selectedCar: json });
    }

    var mqttlst = this.state.cars;
    var index = mqttlst.findIndex(obj => obj.id === json.id);
    if (index != -1) {
      mqttlst[index].lat = json.lat;
      mqttlst[index].lng = json.lng;
      mqttlst[index].status = json.status;
      mqttlst[index].date = json.date;
      mqttlst[index].carPlate = json.carPlate;
      mqttlst[index].name = json.name;
      mqttlst[index].policyNo = json.policyNo;
      mqttlst[index].company = json.company;
      mqttlst[index].companyId = json.companyId;
      mqttlst[index].speed = json.speed;
    } else {
      mqttlst.push(json);
    }
    this.setState({ cars: mqttlst });
  }
  initializeLiff() {
    liff.init(
      async data => {
        let profile = await liff.getProfile();
      },
      err => {
        alert(err);
      }
    );
  }
  async componentDidMount() {
    this.initializeLiff();
    this.getMyLocation();
    this.mqtt();
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 3000);
  }

  componentWillUnmount() {
    this.client.end();
  }
  selectCar(id) {
    let car = this.state.cars.filter(d => d.id === id);
    this.setState({
      selectedCar: car[0]
    });
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    console.log("selected=>", car);
    return (
      <div>
        <Streaming car={car}></Streaming>
      </div>
    );
  }
  selectCompany(id) {
    this.setState({ selectedCompany: id });
    this.resetCarsState();
  }
  selectStatus(id) {
    this.setState({ selectedStatus: id });
    this.resetCarsState();
  }
  searchClicked(data) {
    this.setState({ MqttLst: [], cars: [] });
    this.setState({ selectedCompany: data.company });
    this.setState({ selectedStatus: data.status });
    this.setState({ carPlate_search: data.carPlate });
  }
  checktimeout = async () => {
    var refresh_token = localStorage.getItem("refresh_token");
    var tokenStartTime = localStorage.getItem("token_start_time");
    var currenttime = new Date();
    var tokenStartTime_date = new Date(tokenStartTime);
    var diff = Math.round(
      (((currenttime - tokenStartTime_date) % 86400000) % 3600000) / 60000
    );
    if (!refresh_token) {
      this.props.history.push("/logout");
    } else if (refresh_token && diff > 30) {
      this.props.history.push("/logout");
    }
  };
  render() {
    if (this.state.loading) return LoadingMessage();
    return (
      <div className="animated fadeIn">
        <Map
          center={this.state.currentUser}
          defaultCenter={this.state.defaultCenter}
          mapZoom={this.state.mapZoom}
          car={this.state.cars}
          onClickpin={this.selectCar}
        />
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <Streaming car={this.state.selectedCar}></Streaming>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default LineTraffic;
