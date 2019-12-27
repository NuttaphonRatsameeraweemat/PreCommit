import React, { Component } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import mqtt from 'mqtt';
import GoogleMapReact from 'google-map-react';
import { Player } from 'video-react';
import Hls from 'hls.js';
import PinImg from '../../assets/marker/marker.png'
import PinImgGreen from '../../assets/marker/marker-green.png'
import PinImgRed from '../../assets/marker/marker-red.png'

import InfoApi from '../../services/info.service'
const AnyReactComponentCurrentUser = ({ text }) => <div><i className="fa fa-map-marker fa-3x  text-warning"></i>{text}</div>;

class ClientPinOnMap extends Component {
    render() {
        if (this.props.car.status === "IDLE" || this.props.car.status === "STOPPING") {
            return (

                <div onClick={() => this.props.onClickCar(this.props.car.id)}><img src={PinImgRed} width="26" height="35" alt="Red Pin"></img></div>
            );
        } else if (this.props.car.isSelect) {
            return (
                <div onClick={() => this.props.onClickCar(this.props.car.id)}><img src={PinImgGreen} width="26" height="35" alt="Green Pin"></img></div>
            );
        } else {
            return (
                <div onClick={() => this.props.onClickCar(this.props.car.id)}><img src={PinImg} width="26" height="35" alt="Blue Pin"></img></div>
            );
        }

    }
}
class Map extends Component {
    render() {
        const clientLocation = this.props.car.map((item, key) => {
            return <ClientPinOnMap
                key={item.id}
                lat={item.lat}
                lng={item.lng}
                car={item}
                //text="My Marker"
                onClickCar={this.props.onClickpin}
            />
        });
        return (
            <div style={{ height: '78vh', width: '100%' }}>
                <GoogleMapReact
                    center={this.props.center}
                    bootstrapURLKeys={{ key: 'AIzaSyCbnybXPD-lHvregxlxOGNLINCRIyHJuW8' }}
                    defaultCenter={this.props.defaultCenter}
                    defaultZoom={this.props.mapZoom}
                >
                    <AnyReactComponentCurrentUser
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
class Detail extends Component {
    render() {
        // console.log("detailcar", this.props.car)
        let status = '';
        if (this.props.car.status === '') {

            status = '';
        }
        else if (this.props.car.status === 'IDLE' || this.props.car.status === 'STOPPING') {

            status = 'หยุด';
        }
        else if (this.props.car.status === 'STARTING' || this.props.car.status === 'READY' || this.props.car.status === 'RUNNING') {
            status = 'ถ่ายทอดสด';
        }
        return (
            <div>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <FormGroup row>
                        <Col md="3">
                            <Label>บริษัท</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{this.props.car.company}</p>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="3">
                            <Label>เลขทะเบียน</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{this.props.car.carPlate}</p>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="3">
                            <Label>เลขกรมธรรม์</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{this.props.car.policyNo}</p>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="3">
                            <Label>ชื่อผู้ขับขี่</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{this.props.car.name}</p>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="3">
                            <Label>ความเร็ว</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{this.props.car.speed}</p>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="3">
                            <Label>เวลาที่อัพเดทล่าสุด</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{this.props.car.date}</p>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="3">
                            <Label>สถานะ</Label>
                        </Col>
                        <Col xs="12" md="9">
                            <p className="form-control-static">{status}</p>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}
class Streaming extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let id = this.props.car.id;
        let baseStream = process.env.REACT_APP_API_DEFENCE_BASE_STREAM_URL
        let url = baseStream + id + "/playlist.m3u8";
        return (<div className="text-center" key={id}>
            <Player playsInline fluid={false} width={"auto"} height={272} >
                <HLSSource
                    isVideoChild
                    src={url}
                />
            </Player>
        </div>);
    }
}
class HLSSource extends Component {
    constructor(props, context) {
        super(props, context);
        this.hls = new Hls({ enableWorker: false, });

    }
    componentDidMount() {
        // `src` is the property get from this component
        // `video` is the property insert from `Video` component
        // `video` is the html5 video element
        const { src, video } = this.props;
        // load hls video source base on hls.js
        if (Hls.isSupported()) {
            this.hls.loadSource(src);
            this.hls.attachMedia(video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // video.play();
            });
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
                type={this.props.type || 'application/x-mpegURL'}
            />
        );
    }
}
class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapZoom: 10,
            canGetmap: false,
            defaultCenter: {
                lat: 13.850016,
                lng: 100.527341,
            },
            currentUser: {
                lat: 13.850016,
                lng: 100.527341,
            },
            selectedCar: {
                id: '',
                lat: 13.7685175,
                lng: 101.5808732,
                carPlate: '',
                name: '',
                policyNo: '',
                company: '',
                companyId: 0,
                speed: '',
                status: '',
                isSelect: false
            },
            cars: [
            ],
            MqttLst: [],
            companies: [{
                name: 'ทั้งหมด',
                id: 0,
                isSelected: true
            }],
            listofCompanyid: [],
            selectedCompany: 0,
            selectedStatus: 0,
            carPlate_search: "",
            mqttConfig: {
                username: "",
                password: ""
            }
        };
        this.getMyLocation = this.getMyLocation.bind(this);
        this.changeCurrentUser = this.changeCurrentUser.bind(this);
        this.selectCar = this.selectCar.bind(this);
        this.mqtt = this.mqtt.bind(this);
        this.selectCompany = this.selectCompany.bind(this);
        this.selectStatus = this.selectStatus.bind(this);
        this.updateCarsfromMqttObj = this.updateCarsfromMqttObj.bind(this);
        this.searchClicked = this.searchClicked.bind(this);
        this.infoApi = new InfoApi();
        this.checktimeout = this.checktimeout.bind(this);
        this.client = null;
    }
    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    currentUser: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                });
            })
        }
    }
    mqtt(url,opt,topic) {
       this. client = mqtt.connect(url, opt);
        var _topic = topic;
        this.client.on('connect', () => {
            console.log('mqtt connection');
            this.client.subscribe(_topic);
            this.client.publish(_topic, 'test send msg');
        });

        this.client.on('message', (_topic, payload) => {
            var payloadString = payload.toString();
            console.log('payloadString : ', payloadString);
            if (IsJsonString(payloadString)) {
                var json = JSON.parse(payloadString);
                console.log('payloadJson : ', json);

                /////////// check status //////////////
                var filter_status = this.state.selectedStatus;
                var passStatusFilter = false;
                if (filter_status == 1) {
                    console.log("filter_status : live")
                    if (json.status === "STARTING" || json.status === "READY" || json.status === 'RUNNING') {
                        console.log('json.status', json.status)
                        passStatusFilter = true;
                    } else {
                        passStatusFilter = false;
                    }
                } else if (filter_status == 2) {
                    console.log("filter_status : stop")
                    if (json.status === "IDLE" || json.status === "STOPPING") {
                        passStatusFilter = true;
                    } else {
                        passStatusFilter = false;
                    }
                } else {
                    console.log("filter_status : All")
                    passStatusFilter = true;
                }

                ///////// check company  ////////////////
                var filter_company = this.state.selectedCompany;
                var passCompanyFilter = false;
                if (filter_company != 0) {
                    console.log("filter_company_id : " + filter_company)
                    if (json.companyId == filter_company) {
                        passCompanyFilter = true;
                    } else {
                        passCompanyFilter = false
                    }
                } else if (filter_company == 0) {
                    console.log("filter_company_id : All")
                    var listofCompanyid = this.state.listofCompanyid;
                    if (listofCompanyid != null && listofCompanyid.length > 0) {
                        var obj = listofCompanyid.filter(d => d == json.companyId);
                        if (obj.length > 0) {
                            passCompanyFilter = true;
                        } else {
                            passCompanyFilter = false;
                        }
                    } else {
                        passCompanyFilter = false;
                    }
                }

                var filter_carplate = this.state.carPlate_search;
                var passcarPlateFilterfalse = false;
                if (filter_carplate === "") {
                    passcarPlateFilterfalse = true;
                } else {
                    passcarPlateFilterfalse = json.carPlate.includes(filter_carplate);
                }

                /// update state
                if (passStatusFilter && passCompanyFilter && passcarPlateFilterfalse) {

                    console.log('passStatusFilter :', passStatusFilter)
                    this.updateCarsfromMqttObj(json);
                }
            }
        });
        this.client.on('error', er => {
            console.log('mqtt error', er);
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

        var mqttlst = this.state.MqttLst;
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
        this.setState({ MqttLst: mqttlst, cars: mqttlst });

    }
    async componentDidMount() {
        await this.checktimeout();
        this.getMyLocation();
        var mqtt = await this.infoApi.getMqttAsync();
        let url = 'wss://'+mqtt.url +':'+mqtt.portWS;
        this.mqtt(url,{
                username: mqtt.username,
                password: mqtt.password,
                clientId: "Client_" + Math.random().toString(16).substr(2, 8),
            },mqtt.topic);

        var info = await this.infoApi.getInfoAsync();

        if (info != null && info.company && info.company.length > 0) {
            info.company.unshift({
                companyName: 'ทั้งหมด',
                id: 0,
                isSelected: true
            });
            this.setState({
                companies: info.company,
                listofCompanyid: info.company.map(d => d.id)
            });
        }
    }
    async componentWillMount() {
        await this.checktimeout();
    }

    componentWillUnmount() {
        if( this.client!==null){
            this.client.end();
        }
    }
    changeCurrentUser() {
        this.setState({
            currentUser: {
                lat: 13.7685175,
                lng: 103.5408732,
            },
        });
    }
    selectCar(id) {
        let car = this.state.cars.filter(d => d.id === id);
        this.setState({
            selectedCar: car[0]
        });
        let cars = this.state.cars;

        var indexofselectold = cars.findIndex(obj => obj.isSelect === true);
        if (indexofselectold != -1) {
            cars[indexofselectold].isSelect = false;
        }
        var index = cars.findIndex(obj => obj.id === id);
        if (index != -1) {
            cars[index].isSelect = true;
        }
        this.setState({ cars: cars });
    }
    selectCompany(id) {
        this.setState({ selectedCompany: id })
        this.resetCarsState()
    }
    selectStatus(id) {
        this.setState({ selectedStatus: id })
        this.resetCarsState()
    }
    searchClicked(data) {
        //console.log('clickkkkkk', data)
        this.setState({ MqttLst: [], cars: [] });
        this.setState({ selectedCompany: data.company })
        this.setState({ selectedStatus: data.status })
        this.setState({ carPlate_search: data.carPlate })
    }
    checktimeout = async () => {
        var refresh_token = localStorage.getItem("refresh_token");
        var tokenStartTime = localStorage.getItem('token_start_time');
        var currenttime = new Date();
        var tokenStartTime_date = new Date(tokenStartTime);
        var diff = Math.round((((currenttime - tokenStartTime_date) % 86400000) % 3600000) / 60000);
        console.log('token diff route', diff)
        if (!refresh_token) {
            this.props.history.push('/logout');
        } else
            if (refresh_token
                && (diff > 30)) {
                this.props.history.push('/logout');
            }
    }
    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" lg="12" lg="12" >
                        <Card>
                            <CardHeader>
                                <i className="fa fa-search"></i>Search

                            </CardHeader>
                            <CardBody >
                                <Search
                                    companies={this.state.companies}
                                    SelectingCompany={this.selectCompany}
                                    SelectingStatus={this.selectStatus}
                                    SearchClick={this.searchClicked}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row >
                    <Col xs="12" sm="12" md="6" lg="6" xl="6">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-map"></i>Map
                            </CardHeader>
                            <CardBody >
                                <Map
                                    center={this.state.currentUser}
                                    defaultCenter={this.state.defaultCenter}
                                    mapZoom={this.state.mapZoom}
                                    car={this.state.cars}
                                    onClickpin={this.selectCar}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="12" md="6" lg="6" xl="6" >
                        <Card>
                            <CardHeader>
                                <i className="fa fa-video-camera"></i>Stream {this.state.selectedCar.carPlate}
                            </CardHeader>
                            <CardBody>
                                <Streaming car={this.state.selectedCar} />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-file-text"></i>Detail
                            </CardHeader>
                            <CardBody>
                                <Detail car={this.state.selectedCar}></Detail>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companySelectedOption: "0",
            statusSelectedOption: "0",
            carlate: ""
        }
        this.handleChangeCompany = this.handleChangeCompany.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleChangeCarPlate = this.handleChangeCarPlate.bind(this);
        this.searchClick = this.searchClick.bind(this)
    }

    handleChangeCompany(event) {
        console.log("Event.target.value is", event.target.value);
        this.setState({ companySelectedOption: event.target.value });
        // this.props.SelectingCompany(event.target.value)
    }

    handleChangeStatus(event) {
        console.log("Event.target.value is", event.target.value);
        this.setState({ statusSelectedOption: event.target.value });
        //this.props.SelectingStatus(event.target.value)
    }
    handleChangeCarPlate(event) {
        this.setState({ carlate: event.target.value });
    }

    searchClick() {
        var data = {
            status: this.state.statusSelectedOption,
            company: this.state.companySelectedOption,
            carPlate: this.state.carlate
        }
        this.props.SearchClick(data);
        //this.props.SelectingStatus(event.target.value)
        //this.props.SelectingCompany(event.target.value)
    }
    render() {
        const companies = this.props.companies.map((item, key) => {
            return <option value={item.id} key={item.id}>{item.companyName}</option>
        });


        return (<div>
            <Row>
                <Col xs="12" sm="12" md="12" lg="6" xl="3">
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="company" className="col-form-label">บริษัท</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="select" name="company" id="company" bsSize="md" value={this.state.companySelectedOption} onChange={this.handleChangeCompany}>
                                {companies}
                            </Input>
                        </Col>
                    </FormGroup>
                </Col>
                <Col xs="12" sm="12" md="12" lg="6" xl="3">
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="status" className="col-form-label">สถานะ</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="select" name="status" id="status" bsSize="md" value={this.state.statusSelectedOption} onChange={this.handleChangeStatus}>
                                <option value="0" >ทั้งหมด</option>
                                <option value="1" >Live</option>
                                <option value="2" >Tracking</option>
                            </Input>
                        </Col>
                    </FormGroup>
                </Col>
                <Col xs="12" sm="12" md="12" lg="6" xl="3">
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="radius" className="col-form-label">เลขทะเบียน</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="text" name="radius" id="radius" bsSize="md" value={this.state.carPlate} onChange={this.handleChangeCarPlate}>

                            </Input>
                        </Col>
                    </FormGroup>
                </Col>

                <Col xs="12" sm="12" md="12" lg="12" xl="2">
                    <FormGroup row>
                        <Col className="d-none d-xl-block" md="12">
                            <Label htmlFor="radius" className="col-form-label">&nbsp; &nbsp;</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Button block color="primary" onClick={() => this.searchClick()}>
                                ค้นหา
                    </Button>
                        </Col>
                    </FormGroup>

                    {/* <FormGroup row>
                        <Col md="3">
                            <Label htmlFor="status" className="col-form-label">Status</Label>
                        </Col>
                        <Col xs="12" md="9" size="lg">
                            <Input type="select" name="status" id="status" bsSize="md" value={this.state.statusSelectedOption} onChange={this.handleChangeStatus}>
                                <option value="0" >ทั้งหมด</option>
                                <option value="1" >ถ่ายทอดสด</option>
                                <option value="2" >หยุด</option>
                            </Input>
                        </Col>
                    </FormGroup> */}
                </Col>
            </Row>
        </div>);
    }
}

export default MainPage;