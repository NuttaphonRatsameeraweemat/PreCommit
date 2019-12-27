import React, { Component, Fragment, useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Modal, Table, ModalFooter, ModalBody, ModalHeader, Card, CardBody, CardHeader, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import CarApi from './../../services/car.service'
import DefenceApi from './../../services/defence.service'
import { Player } from 'video-react';
import Hls from 'hls.js';
import moment from 'moment'

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import DataTable from 'react-data-table-component';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import  { Range } from 'rc-slider';
class Car extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            id: "",
            activeTab: new Array(2).fill('1'),
            drivers: [],
            streams: [],
            defence: [],
            modal: false,
            dataModal: { endpointPlayback: "" },
            startTime: "",
            endTime: "",
            cantdownLoad: true,
            blocking: true,
            info: {},
            driverModal: false,
            driverDataModal: {}
        };
        this.carApi = new CarApi();
        this.defenceApi = new DefenceApi();

        this.toggleModal = this.toggleModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.downLoadFile = this.downLoadFile.bind(this);
        this.updateDownloadTime = this.updateDownloadTime.bind(this);
        this.validateDownload = this.validateDownload.bind(this)
        this.checktimeout = this.checktimeout.bind(this)
        this.driverToggleModal = this.driverToggleModal.bind(this)
        this.openDriverModal = this.openDriverModal.bind(this);
        this.updateBlockUI = this.updateBlockUI.bind(this);
        this.updateDownloadTime_Slider = this.updateDownloadTime_Slider.bind(this);
    }
    async componentDidMount() {
        
        this.setState({ blocking: true });
        await this.checktimeout();
        var id = this.props.match.params.id;
        this.setState({ id: id });

        var drivers = await this.carApi.getDriversAsync(id);
        //console.log('drivers', drivers)
        this.setState({ drivers: drivers });

        var streams_ = await this.carApi.getStreamsAsync(id);
        //console.log('streams', streams_);
        this.setState({ streams: streams_ });

        var defence = await this.defenceApi.getStreamlist(id);

        if (defence) {
            this.setState({ defence: defence.sourceList });
        }
        this.setState({ blocking: false });
        var info = await this.carApi.getCarInfoAsync(id);
        if (info) {
            this.setState({ info: info });
        }

    }
    async componentWillMount() {
        await this.checktimeout();
    }
    toggle(tabPane, tab) {
        const newArray = this.state.activeTab.slice()
        newArray[tabPane] = tab
        this.setState({
            activeTab: newArray,
        });
    }
    tabPane() {
        return (
            <>
                <TabPane tabId="1">
                    {/* <Driver data={this.state.drivers} openModal={this.openDriverModal} >
                    </Driver> */}
                    <DiverTable data={this.state.drivers} openModal={this.openDriverModal}>
                    </DiverTable>
                </TabPane>
                <TabPane tabId="2">
                    <StreamTable data={this.state.streams} defence={this.state.defence} openModal={this.openModal}>
                    </StreamTable>
                    {/* <Defence data={this.state.defence} openModal={this.openModal}>
                    </Defence>
                    <StreamLog data={this.state.streams} defence={this.state.defence} openModal={this.openModal} /> */}
                </TabPane>
            </>
        );
    }
    openModal(data) {
        //console.log('data====>>>>>', data)
        this.setState({ modal: true, dataModal: data })
    }
    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal,
            startTime: "",
            endTime: "",
            cantdownLoad: true
        }));
    }
    async downLoadFile() {
        //console.log('downloadFile', this.state)
        this.setState({ blocking: true });
        let id = this.state.id;
        let start = this.state.startTime;
        let end = this.state.endTime;

        // console.log('start',start)
        // console.log('end',end)
        let defence = await this.defenceApi.cutStream(id, start, end);
        //console.log('downloadFile : ', defence)
        await this.defenceApi.download(defence.endpoint);
        this.setState({ blocking: false });
        this.toggleModal()
    }
    updateDownloadTime(name, data) {
        //console.log('name : ', name)
        //console.log('data : ', data)
        if (name === "startTime") {
            this.setState({ startTime: data })
            this.validateDownload(data, this.state.endTime);
        }

        if (name === "endTime") {
            this.setState({ endTime: data })
            this.validateDownload(this.state.startTime, data);
        }
    }
    updateDownloadTime_Slider(start, end) {
       // console.log('start', start)
        //console.log('end', end)
        this.setState({ startTime: start })
        this.setState({ endTime: end })

        var starttime = moment(start);

        var endtime = moment(end);
        var duration = moment.duration(endtime.diff(starttime));
        var seconds = duration.asSeconds();
        if (seconds > 0 && seconds <= 120) {
            this.setState({ cantdownLoad: false })
        } else {
            this.setState({ cantdownLoad: true })
        }
    }
    validateDownload(start, end) {
        let _start = moment(start);
        let _end = moment(end);
        let originalStart = this.state.dataModal.startTime;
        let _originalStart = moment(originalStart);
        if (_start.isValid() && _end.isValid() && (_start < _end) && (_start > _originalStart && _end > _originalStart)) {

            this.setState({ cantdownLoad: false })
        } else {
            this.setState({ cantdownLoad: true })
        }



    }
    checktimeout = async () => {
        var refresh_token = localStorage.getItem("refresh_token");
        var tokenStartTime = localStorage.getItem('token_start_time');
        var currenttime = new Date();
        var tokenStartTime_date = new Date(tokenStartTime);
        var diff = Math.round((((currenttime - tokenStartTime_date) % 86400000) % 3600000) / 60000);
        // console.log('token diff route', diff)
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
                <BlockUi tag="div" blocking={this.state.blocking}>
                    <Row>
                        <Col xs="12" md="12">
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-file"></i>Info
                            </CardHeader>
                                <CardBody >
                                    <CarInfo data={this.state.info} />
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" md="12">
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-file"></i>Detail
                            </CardHeader>
                                <CardBody >
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                active={this.state.activeTab[0] === '1'}
                                                onClick={() => { this.toggle(0, '1'); }}
                                            >
                                                <i className="fa fa-drivers-license"></i> Driver
                                </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                active={this.state.activeTab[0] === '2'}
                                                onClick={() => { this.toggle(0, '2'); }}
                                            >
                                                <i className="fa fa-file-video-o"></i>  Stream
                                </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab[0]}>
                                        {this.tabPane()}
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {/* cut stream modal */}
                    <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                        <ModalHeader toggle={this.toggleModal}>VDO</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col xs='12'>
                                    <Streaming data={this.state.dataModal}></Streaming>
                                </Col>
                            </Row>
                            {/* <TimeInput data={this.state.dataModal} updateTime={this.updateDownloadTime} >
                            </TimeInput> */}
                            <RangeSlider data={this.state.dataModal} updateTime={this.updateDownloadTime_Slider}></RangeSlider>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                onClick={this.downLoadFile}
                                disabled={this.state.cantdownLoad}
                            >Download</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    {/*  driver modal */}
                    <Modal size="lg" isOpen={this.state.driverModal} toggle={this.driverToggleModal} className={this.props.className}>
                        <ModalHeader toggle={this.driverToggleModal}>Driver license</ModalHeader>
                        <ModalBody className="text-center">
                            <Image data={this.state.driverDataModal} blockingUi={this.updateBlockUI}></Image>
                        </ModalBody>
                    </Modal>
                </BlockUi>
            </div>
        );
    }
    driverToggleModal() {
        this.setState(prevState => ({
            driverModal: !prevState.driverModal,
        }));
    }
    async openDriverModal(data) {
        this.setState({ blocking: true });
        var image = await this.carApi.getImage(data.webImageUrl)
        data.rawImg = image
        this.setState({ driverModal: true, driverDataModal: data })
        this.setState({ blocking: false });
    }
    updateBlockUI(input) {
        this.setState({ blocking: input });
    }
}

const Defence = (props) => {
    if (!props.data || props.data === null || props.data.length === 0) return (<div className="d-none"></div>);

    let body = props.data.map((item, index) => {
        return (<tr key={index}>
            <td>
                {moment(item.startTime).format('DD/MM/YYYY HH:mm:ss')}

            </td>
            <td>
                {moment(item.endTime).format('DD/MM/YYYY HH:mm:ss')}

            </td>
            <td>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => props.openModal(item)} ><i className="fa fa-play"></i></button>
            </td>
        </tr>);
    });


    return (<div>
        <div>
            <h3>
                Streams From Last 2 Day
                   </h3>
        </div>
        <Table responsive>
            <thead>
                <tr>
                    <th>เวลาเริ่มต้น</th>
                    <th>เวลาสิ้นสุด</th>
                    <th>VDO</th>
                </tr>
            </thead>
            <tbody>
                {body}
            </tbody>
        </Table>
    </div>
    );
}
const StreamLog = (props) => {
    //console.log('Stream Log props =>', props)

    if (!props.data.length > 0) return (<div className="d-none"></div>);
    let data = props.data;



    let body = data.map((item) => {
        var _status = '';
        if (item && item.status && (item.status === 'STARTING' || item.status === 'READY' || item.status === 'RUNNING')) _status = 'Live';
        if (item && item.status && (item.status === 'IDLE' || item.status === 'STOPPING')) _status = 'Tracking';


        return (<tr key={item.id}>
            <td>
                {item.id}
            </td>
            <td>
                {_status}

            </td>

            <td>
                {item.driverName}
            </td>
            <td>
                {moment(item.lastUpdateDate).format('DD/MM/YYYY HH:mm:ss')}
            </td>
            <td>
                {/* <button type="button" className="btn btn-primary btn-sm" onClick={() => props.openModal(_defence)} ><i className="fa fa-play"></i></button> */}
            </td>

        </tr>);
    });

    return (
        <div>
            <div>
                <h2>
                    Stream log
                </h2>
            </div>
            <Table responsive key="stream">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>สถานะ</th>
                        <th>ชื่อ-นามสกุลผู้ขับขี่</th>
                        <th>เวลาอัพเดทล่าสุด</th>
                        <th>tool</th>
                    </tr>
                </thead>
                <tbody key="stream-tablebody">
                    {body}
                </tbody>
            </Table>
        </div>
    );
}
class Streaming extends Component {

    render() {
        // console.log('video.prop', this.props)
        let url = this.props.data.endpointPlayback
        return (<div className="text-center">
            <Player playsInline fluid={false} width={"auto"} height={272} >
                <HLSSource
                    isVideoChild
                    src={url}
                />
            </Player>
        </div>);
    }
}
class TimeInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start: "00:00:00",
            end: "00:00:00",
            start_hh: 0,
            start_mm: 0,
            start_ss: 0,
            end_hh: 0,
            end_mm: 0,
            end_ss: 0,
        }
        this.changestart_hh = this.changestart_hh.bind(this)
        this.changestart_mm = this.changestart_mm.bind(this)
        this.changestart_ss = this.changestart_ss.bind(this)

        this.changeend_hh = this.changeend_hh.bind(this)
        this.changeend_mm = this.changeend_mm.bind(this)
        this.changeend_ss = this.changeend_ss.bind(this)
    }
    changestart_hh(evt) {
        //console.log('Changestart_hh')

        let hh = evt.target.value;
        let mm = this.state.start_mm;
        let ss = this.state.start_ss;
        let start = moment(this.props.data.startTime);
        let end = moment(this.props.data.endTime);
        let newStart = start.add(parseInt(ss), 'seconds').add(parseInt(mm), 'minutes').add(parseInt(hh), 'hours')
        if (start >= newStart && newStart <= end && parseInt(hh) <= 23) {
            this.setState({ start_hh: evt.target.value })
            this.props.updateTime("startTime", newStart.toISOString())
        }
    }
    changestart_mm(evt) {
        // console.log('Changestart_mm')

        let hh = this.state.start_hh;
        let mm = evt.target.value;
        let ss = this.state.start_ss;
        let start = moment(this.props.data.startTime);
        let end = moment(this.props.data.endTime);
        let newStart = start.add(parseInt(ss), 'seconds').add(parseInt(mm), 'minutes').add(parseInt(hh), 'hours')
        if (start >= newStart && newStart <= end && parseInt(mm) <= 59) {
            this.setState({ start_mm: evt.target.value })
            this.props.updateTime("startTime", newStart.toISOString())
        }
    }
    changestart_ss(evt) {
        // console.log('changestart_ss')
        let hh = this.state.start_hh;
        let mm = this.state.start_mm;
        let ss = evt.target.value;
        let start = moment(this.props.data.startTime);
        let end = moment(this.props.data.endTime);
        let newStart = start.add(parseInt(ss), 'seconds').add(parseInt(mm), 'minutes').add(parseInt(hh), 'hours')

        console.log('sssssssssssssssss', parseInt(ss))
        if (start >= newStart && newStart <= end && parseInt(ss) <= 59) {
            this.setState({ start_ss: evt.target.value })

            this.props.updateTime("startTime", newStart.toISOString())
        }
    }


    changeend_hh(evt) {
        //console.log('changeend_hh')
        let hh = evt.target.value;
        let hhInt = parseInt(hh);
        if (hhInt > 23 || hhInt < 0) {

            //  console.log('dddddddddddddddddddd')
        }

        let mm = this.state.end_mm;
        let ss = this.state.end_ss;
        let start = moment(this.props.data.startTime);
        let end = moment(this.props.data.endTime);
        let newStart_end = start.add(parseInt(ss), 'seconds').add(parseInt(mm), 'minutes').add(parseInt(hh), 'hours')
        if (start >= newStart_end && newStart_end <= end && parseInt(hh) <= 23) {
            this.setState({ end_hh: evt.target.value })
            this.props.updateTime("endTime", newStart_end.toISOString())

        }
    }
    changeend_mm(evt) {
        //console.log('changeend_mm')

        let hh = this.state.end_hh;
        let mm = evt.target.value;
        let ss = this.state.end_ss;
        let start = moment(this.props.data.startTime);
        let end = moment(this.props.data.endTime);
        let newStart_end = start.add(parseInt(ss), 'seconds').add(parseInt(mm), 'minutes').add(parseInt(hh), 'hours')
        if (start >= newStart_end && newStart_end <= end && parseInt(mm) <= 59) {
            this.setState({ end_mm: evt.target.value })

            this.props.updateTime("endTime", newStart_end.toISOString())
        }
    }
    changeend_ss(evt) {
        //console.log('changeend_ss')
        let hh = this.state.end_hh;
        let mm = this.state.end_mm;
        let ss = evt.target.value;
        let start = moment(this.props.data.startTime);
        let end = moment(this.props.data.endTime);
        let newStart_end = start.add(parseInt(ss), 'seconds').add(parseInt(mm), 'minutes').add(parseInt(hh), 'hours')
        if (start >= newStart_end && newStart_end <= end && parseInt(ss) <= 59) {
            this.setState({ end_ss: evt.target.value })
            this.props.updateTime("endTime", newStart_end.toISOString())
        }
    }

    render() {
        return (
            <div>
                {/* <Row className="pt-2">
                    <Col xs="6" className="text-center">
                        <FormGroup>
                            <Label for="strat">Strat Time</Label>
                            <Input
                                type="time"
                                name="start"
                                id="start"
                                step="1"
                                placeholder="start Time"
                                value={this.state.start}
                                onChange={this.changesStart}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="6" className="text-center">
                        <FormGroup>
                            <Label for="end">End Time</Label>
                            <Input
                                type="time"
                                name="end"
                                id="end"
                                step="1"
                                placeholder="End Time"
                                value={this.state.end}
                                onChange={this.changesEnd}
                            />
                        </FormGroup>
                    </Col>
                </Row> */}
                <Row className="pt-2">
                    <Col xs="6" className="text-center">
                        เวลาเริ่มต้นที่ต้องการ
                        <Row>
                            <Col xs="4" className="text-center pr-1">
                                <FormGroup>
                                    <Label for="strat">ชั่วโมง</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={this.state.start_hh}
                                        onChange={this.changestart_hh}
                                        name="start_hh"
                                        id="start_hh"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="4" className="text-center px-1">
                                <FormGroup>
                                    <Label for="strat">นาที</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={this.state.start_mm}
                                        onChange={this.changestart_mm}
                                        name="start_mm"
                                        id="start_mm"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="4" className="text-center pl-1">
                                <FormGroup>
                                    <Label for="strat">วินาที</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={this.state.start_ss}
                                        onChange={this.changestart_ss}
                                        name="start_ss"
                                        id="start_ss"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs="6" className="text-center">
                        เวลาที่สุดสิ้นที่ต้องการ
                        <Row>
                            <Col xs="4" className="text-center pr-1">
                                <FormGroup>
                                    <Label for="strat">ชั่วโมง</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={this.state.end_hh}
                                        onChange={this.changeend_hh}
                                        name="end_hh"
                                        id="end_hh"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="4" className="text-center px-1">
                                <FormGroup>
                                    <Label for="strat">นาที</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={this.state.end_mm}
                                        onChange={this.changeend_mm}
                                        name="end_mm"
                                        id="end_mm"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="4" className="text-center pl-1">
                                <FormGroup>
                                    <Label for="strat">วินาที</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={this.state.end_ss}
                                        onChange={this.changeend_ss}
                                        name="end_ss"
                                        id="end_ss"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>

                </Row>
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
        // `src` is the property get from this component
        // `video` is the property insert from `Video` component
        // `video` is the html5 video element
        const { src, video } = this.props;
        // load hls video source base on hls.js
        if (Hls.isSupported()) {
            //console.log("src",src)
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
const CarInfo = (props) => {
    let companyName = "";
    if (props.data.companies && props.data.companies.length > 0) {
        //console.log('havecompanyyyyyyyyyyyyyyy')
        companyName = props.data.companies[0].companyName
    }
    let startDate = '';
    if (props.data && props.data.startDate) {
        startDate = moment(props.data.startDate).format('DD/MM/YYYY HH:mm:ss')
    }

    return (<div>
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
            <FormGroup row>
                <Col xs="12" sm="6" md="3" lg="3" xl="2">
                    <Row>
                        <Col xs="12" >
                            <Label><b>บริษัท</b></Label>
                        </Col>
                        <Col xs="12">
                            <p className="form-control-static">{companyName}</p>
                            {/* <p className="form-control-static">company</p> */}
                        </Col>
                    </Row>
                </Col>

                <Col xs="12" sm="6" md="3" lg="3" xl="2">
                    <Row>
                        <Col xs="12" >
                            <Label><b>เลขกรมธรรม์</b></Label>
                        </Col>
                        <Col xs="12">
                            <p className="form-control-static">{props.data.policyNo}</p>
                            {/* <p className="form-control-static">company</p> */}
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" sm="6" md="3" lg="3" xl="2">
                    <Row>
                        <Col xs="12" >
                            <Label><b>เลขทะเบียน</b></Label>
                        </Col>
                        <Col xs="12">
                            <p className="form-control-static">{props.data.fullCarPlate}</p>
                            {/* <p className="form-control-static">company</p> */}
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" sm="6" md="3" lg="3" xl="2">
                    <Row>
                        <Col xs="12" >
                            <Label><b>จังหวัด</b></Label>
                        </Col>
                        <Col xs="12">
                            <p className="form-control-static">{props.data.province}</p>
                            {/* <p className="form-control-static">company</p> */}
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" sm="6" md="3" lg="3" xl="2">
                    <Row>
                        <Col xs="12" >
                            <Label><b>วันเริ่มต้น</b></Label>
                        </Col>
                        <Col xs="12">
                            <p className="form-control-static">{startDate}</p>
                            {/* <p className="form-control-static">company</p> */}
                        </Col>
                    </Row>
                </Col>
                {/* <Col xs="12" sm="6" md="3" lg="3" xl="2">
                    <Row>
                        <Col xs="12" >
                            <Label><b>รหัสเครื่อง</b></Label>
                        </Col>
                        <Col xs="12">
                            <p className="form-control-static">{props.data.deviceId}</p>
                           
                        </Col>
                    </Row>
                </Col> */}
            </FormGroup>
        </Form>
    </div>);
}
class Image extends Component {

    constructor(props) {
        super(props);
        this.state = { source: null };
    }
    async  componentDidMount() {
        this.setState({ source: this.props.data.rawImg });
    }

    render() {
        return <img
            className="img-fluid"
            src={this.state.source}
            height="auto"
            width="300"
        />;
    }
}

const Driver = (props) => {
    //console.log('Driver props =>', props)
    if (!props.data.length > 0) return (<div className="d-none"></div>);
    let data = props.data;

    let body = data.map((item) => {
        return (<tr key={item.id}>
            <td>
                {item.id}
            </td>
            <td>
                {item.fullname}
            </td>
            <td>
                {item.tel}
            </td>
            <td>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => props.openModal(item)} ><i className="fa fa-photo"></i></button>
                {/* {item.webImageUrl} */}
                {/* <img src={props.getImage(item.webImageUrl)}>
                </img> */}
            </td>
        </tr>);
    });
    return (
        <div>

            <Table responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>เบอร์โทรศัพท์</th>
                        <th>รูปใบขับขี่</th>
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </Table>
        </div>
    );
};
const DiverTable = (props) => {
    const columns = [
        {
            name: 'ชื่อ-นามสกุล',
            selector: 'fullname',
            sortable: true,
        },
        {
            name: 'เบอร์โทรศัพท์',
            selector: 'tel',
            sortable: true,
        },
        {
            name: 'รูปใบขับขี่',
            selector: 'year',
            //sortable: true,
            cell: record => {
                return (
                    <Fragment>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => props.openModal(record)}
                            style={{ marginRight: '5px' }}>
                            <i className="fa  fa-photo"></i>
                        </button>

                    </Fragment>
                );
            }
        },
    ];
    const data = props.data;


    return (
        <DataTable
            columns={columns}
            data={data}
            pagination
            className="border"
        />
    );
}
const StreamTable = (props) => {
    const data = props.data;
    const defence = props.defence
    const columns = [
        {
            name: 'ชื่อ-นามสกุลผู้ขับขี่',
            selector: 'driverName',
            sortable: true,
        },
        {
            name: 'เวลาที่เริ่มต้น',
            selector: 'startDate',
            cell: record => {
                let def = defence.filter((defItem) => {
                    if (defItem.streamId === record.defenceId) {
                        return defItem
                    } else {
                        return null;
                    }
                });
                if (def.length !== 0 && def[0] != null) {
                    return (<div>{
                        moment(def[0].startTime).format('DD/MM/YYYY HH:mm:ss')
                    }
                    </div>);
                } else {
                    return (<div>

                    </div>);
                }
            }
        },
        {
            name: 'เวลาที่สิ้นสุด',
            selector: 'lastUpdateDate',
            cell: record => {
                let def = defence.filter((defItem) => {
                    if (defItem.streamId === record.defenceId) {
                        return defItem
                    } else {
                        return null;
                    }
                });
                if (def.length !== 0 && def[0] != null) {
                    return (<div>{
                        moment(def[0].endTime).format('DD/MM/YYYY HH:mm:ss')
                        // startTime
                        // endTime
                    }
                    </div>);
                } else {
                    return (<div>

                    </div>);
                }
            }
        },
        {
            name: 'VDO',
            selector: 'defenceId',
            cell: record => {

                let def = defence.filter((defItem) => {
                    if (defItem.streamId === record.defenceId) {
                        return defItem
                    } else {
                        return null;
                    }
                });

                if (def.length !== 0) {

                    return (
                        <Fragment>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => props.openModal(def[0])}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-play"></i>
                            </button>

                        </Fragment>
                    );
                } else {
                    return (<div>

                    </div>);
                }

            }
        },
    ];



    return (
        <DataTable
            columns={columns}
            data={data}
            pagination
            className="border"
        />
    );
}

const RangeSlider = (props) => {
    const wrapperStyle = { width: "auto", marginRight: 50, marginLeft: 50 };
    const max = Math.trunc(props.data.duration)

    const handleChange = (sliderValues) => {
        var first = sliderValues[0];
        var second = sliderValues[1];
        var startdisplay = moment("1900-01-01 00:00:00").add(first, 'seconds').format("HH:mm:ss")
        setStart(startdisplay)

        var enddisplay = moment("1900-01-01 00:00:00").add(second, 'seconds').format("HH:mm:ss")
        setEnd(enddisplay)
        let start = moment(props.data.startTime);
        let _start = moment(props.data.startTime);
        let __start = moment(props.data.startTime);
        let newStart = _start.add(parseInt(first), 'seconds');
        let newEnd = __start.add(parseInt(second), 'seconds');
        setData(sliderValues)
        props.updateTime(newStart.toISOString(), newEnd.toISOString())
    };
    const defaultData = [0, max];
    const [data, setData] = useState(defaultData);
    const [start, setStart] = useState("00:00:00");
    const [end, setEnd] = useState("00:00:00");


    useEffect(()=>{
        handleChange(defaultData);
    },[]);
    return (
        <div className="row pt-2">
            <div className="col-12">
                <Row>
                    <div className="col-6 text-center">
                        เวลาเริ่มต้นที่ต้องการ
                        <Row>
                            <div className="col-12 text-center">
                                {start}
                            </div>
                        </Row>
                    </div>
                    <div className="col-6 text-center">
                        เวลาที่สุดสิ้นที่ต้องการ
                        <Row>
                            <div className="col-12 text-center">
                                {end}
                            </div>
                        </Row>
                    </div>
                </Row>
                <Row>
                    <div className="col-12">
                        <div style={wrapperStyle}>
                            <Range min={0}
                                max={max}
                                defaultValue={defaultData}
                                onChange={handleChange}
                                value={data}
                                pushable={1}
                                step={1}
                            />
                        </div>
                    </div>
                </Row>
            </div>
        </div>);

}

export default Car;
