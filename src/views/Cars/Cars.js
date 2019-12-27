import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import CarApi from './../../services/car.service';
import InfoApi from '../../services/info.service';
import DataTable from 'react-data-table-component';
import moment from 'moment'
import BlockUi from 'react-block-ui';
class Cars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocking: false,
            dataIntable: [],
            companies: [{
                name: 'ทั้งหมด',
                id: 0,
                isSelected: true
            }],
            listofCompanyid: [],
            listAllStatus: ["STARTING", "READY", "RUNNING", "IDLE", "STOPPING", null],
            listLiveStatus: ["STARTING", "READY", "RUNNING"],
            listTrackingStatus: ["IDLE", "STOPPING"],
            listStopStatus: [null, ""],
        }
        this.carApi = new CarApi();
        this.infoApi = new InfoApi();
        this.goToDetail = this.goToDetail.bind(this)
        this.searchClick = this.searchClick.bind(this);
        this.toggleBlocking = this.toggleBlocking.bind(this);
        this.checktimeout = this.checktimeout.bind(this);
    }
    async componentWillMount() {
        await this.checktimeout();
    }
    async componentDidMount() {

        this.setState({ blocking: true });
        await this.checktimeout();
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
        var payload = {
            companyId: this.state.listofCompanyid,
            carplate: "",
            province: "",
            policyNo: "",
            status: this.state.listAllStatus
        };
        //var data = await this.carApi.getCarsAsync(payload);
        //console.log('data :', data)
        //this.setState(
        //   {
        //      dataIntable: data
        //    }
        // )
        this.setState({ blocking: false });
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


    searchClick = async (data) => {
        this.setState({ blocking: true });
        console.log('searchClick', data)

        var payload = {
            carplate: data.carplate,
            province: data.province,
            policyNo: data.policyNo,
            status: ""
        };

        if (data.companySelected === "0") {
            payload.companyId = this.state.listofCompanyid
        } else {
            payload.companyId = [parseInt(data.companySelected)]
        }

        if (data.statusSelected === "0") {
            payload.status = this.state.listAllStatus
        } else if (data.statusSelected === "1") {
            payload.status = this.state.listLiveStatus
        } else if (data.statusSelected === "2") {
            payload.status = this.state.listTrackingStatus
        }
        else if (data.statusSelected === "3") {
            payload.status = this.state.listStopStatus
        }

        var resp = await this.carApi.getCarsAsync(payload);
        console.log('data :', resp)
        this.setState(
            {
                dataIntable: resp
            }
        )
        this.setState({ blocking: false });
    }

    goToDetail(data) {
        this.props.history.push('/cars/' + data.id);
    }

    toggleBlocking() {
        this.setState({ blocking: !this.state.blocking });
    }
    render() {
        return (<div className="animated fadeIn">
            <BlockUi tag="div" blocking={this.state.blocking}>
                {/* <Row>
                    <Col xs="12" sm="12" lg="12" lg="12" >
                        <Card>
                            <CardHeader>
                                <i className="fa fa-search"></i>Search
                            </CardHeader>
                            <CardBody >

                            </CardBody>
                        </Card>
                    </Col>
                </Row> */}
                <Row>
                    <Col xs="12" sm="12" lg="12" lg="12" >
                        <Card>
                            <CardHeader>
                                <i className="fa fa-car"></i>Cars
                        </CardHeader>
                            <CardBody >
                                <AdvancedPaginationTable
                                    goToDetail={this.goToDetail}
                                    companies={this.state.companies}
                                    listofCompanyid={this.state.listofCompanyid}
                                // searchClick={this.searchClick}
                                >

                                </AdvancedPaginationTable >
                                {/* <Search
                                    companies={this.state.companies}
                                    SearchClick={this.searchClick}
                                /> */}
                                {/* <MyComponent data={this.state.dataIntable} goToDetail={this.goToDetail}  ></MyComponent> */}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </BlockUi></div>);
    }

}
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companySelectedOption: "0",
            statusSelectedOption: "0",
            carplate: "",
            policyNo: "",
            province: "",
        }
        this.handleChangeCompany = this.handleChangeCompany.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchClick = this.searchClick.bind(this)
    }

    handleChangeCompany(event) {
        console.log("Event.target.value is", event.target.value);
        this.setState({ companySelectedOption: event.target.value });
    }

    handleChangeStatus(event) {
        console.log("Event.target.value is", event.target.value);
        this.setState({ statusSelectedOption: event.target.value });
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    searchClick() {
        var data = {
            statusSelected: this.state.statusSelectedOption,
            status: "",
            companySelected: this.state.companySelectedOption,
            company: [],
            carplate: this.state.carplate,
            province: this.state.province,
            policyNo: this.state.policyNo
        }
        this.props.SearchClick(data);
    }
    render() {
        const companies = this.props.companies.map((item, key) => {
            return <option value={item.id} key={item.id}>{item.companyName}</option>
        });


        return (<div>
            <Row>
                <div className=" col-xs-12  col-sm-12 col-md-12 col-lg-6 col-xl-2dot4" >
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
                </div>
                <div className=" col-xs-12  col-sm-12 col-md-12 col-lg-6 col-xl-2dot4" >
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="status" className="col-form-label">สถานะ</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="select" name="status" id="status" bsSize="md" value={this.state.statusSelectedOption} onChange={this.handleChangeStatus}>
                                <option value="0" >ทั้งหมด</option>
                                <option value="1" >Live</option>
                                <option value="2" >Tracking</option>
                                <option value="3" >Offline</option>
                            </Input>
                        </Col>
                    </FormGroup>
                </div>
                <div className=" col-xs-12  col-sm-12 col-md-12 col-lg-6 col-xl-2dot4" >
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="carplate" className="col-form-label">เลขทะเบียน</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="text" id="carplate" name="carplate" bsSize="md" value={this.state.carPlate} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                </div>
                <div className=" col-xs-12  col-sm-12 col-md-12 col-lg-6 col-xl-2dot4 d-none" >
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="province" className="col-form-label">จังหวัด</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="text" id="province" bsSize="md" name="province" value={this.state.province} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                </div>
                <div className=" col-xs-12  col-sm-12 col-md-12 col-lg-6 col-xl-2dot4" >
                    <FormGroup row>
                        <Col md="12">
                            <Label htmlFor="policyNo" className="col-form-label">เลขกรมธรรม์</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Input type="text" id="policyNo" bsSize="md" name="policyNo" value={this.state.policyNo} onChange={this.handleChange} />

                        </Col>
                    </FormGroup>
                </div>

                <div className=" col-xs-12  col-sm-12 col-md-12 col-lg-12 col-xl-2dot4" >
                    <FormGroup row>
                        <Col className="d-none d-lg-block d-xl-block">
                            <Label htmlFor="radius" className="col-form-label">&nbsp; &nbsp;</Label>
                        </Col>
                        <Col xs="12" md="12" size="lg">
                            <Button block color="primary" onClick={() => this.searchClick()}>
                                ค้นหา
                            </Button>
                        </Col>
                    </FormGroup>
                </div>
            </Row>
        </div>);
    }
}

class MyComponent extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                selector: "companyName",
                name: "บริษัท",
                className: "",
                align: "left",
                sortable: true,
                wrap: true
            },
            {
                selector: "fullCarplate",
                name: "เลขทะเบียน",
                className: "",
                align: "left",
                sortable: true,
                wrap: true
            },
            {
                selector: "province",
                name: "จังหวัด",
                className: "",
                align: "left",
                sortable: true,
                wrap: true
            },
            {
                selector: "policyNo",
                name: "เลขกรมธรรม์",
                className: "",
                sortable: true,
                align: "left",
                wrap: true
            },
            {
                selector: "displayStatus",
                name: "สถานะ",
                className: "",
                sortable: true,
                align: "left",
                wrap: true,
            },
            {
                selector: "update",
                name: "เวลาอัพเดทล่าสุด",
                className: "",
                sortable: true,
                align: "left",
                wrap: true,
                format: row => {
                    if (row && row.update) return moment(row.update).format('DD/MM/YYYY HH:mm:ss')

                }
            },
            {
                selector: "action",
                name: "รายละเอียด",
                wrap: true,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.goToDetail(record)}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-search"></i>
                            </button>

                        </Fragment>
                    );
                }
            }
        ];
        this.state = {
            searchText: ""
        };
        this.search = this.search.bind(this)
        this.goToDetail = this.goToDetail.bind(this)
    }
    goToDetail(data) {
        console.log(this.props)
        this.props.goToDetail(data)
    }
    search(e) {
        this.setState({ searchText: e.target.value });
    }
    render() {

        return (
            <DataTable
                columns={this.columns}
                data={this.props.data}
                pagination
                // striped
                responsive
                highlightOnHover
                className="border"
            // subHeader
            // subHeaderComponent={<input type="text" name="searchText" id="searchText" value={this.state.searchText}  />}
            />
        )
    }
}

const AdvancedPaginationTable = (props) => {
    const columns = [
        {
            selector: "companyName",
            name: "บริษัท",
            className: "",
            align: "left",
            sortable: true,
            wrap: true
        },
        {
            selector: "fullCarplate",
            name: "เลขทะเบียน",
            className: "",
            align: "left",
            sortable: true,
            wrap: true
        },
        {
            selector: "province",
            name: "จังหวัด",
            className: "",
            align: "left",
            sortable: true,
            wrap: true
        },
        {
            selector: "policyNo",
            name: "เลขกรมธรรม์",
            className: "",
            sortable: true,
            align: "left",
            wrap: true
        },
        {
            selector: "displayStatus",
            name: "สถานะ",
            className: "",
            sortable: true,
            align: "left",
            wrap: true,
        },
        {
            selector: "update",
            name: "เวลาอัพเดทล่าสุด",
            className: "",
            sortable: true,
            align: "left",
            wrap: true,
            format: row => {
                if (row && row.update) return moment(row.update).format('DD/MM/YYYY HH:mm:ss')

            }
        },
        {
            selector: "action",
            name: "รายละเอียด",
            wrap: true,
            cell: record => {
                return (
                    <Fragment>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => props.goToDetail(record)}
                            style={{ marginRight: '5px' }}>
                            <i className="fa fa-search"></i>
                        </button>

                    </Fragment>
                );
            }
        }
    ];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [sortdir, setSortdir] = useState({ sort: "update", dir: "desc" });

    const [key, setKey] = useState(1);
    let defaultSearch = {
        "companyId": [0],
        "carplate": "",
        "province": "",
        "policyNo": "",
        "status": ["All"]
    };
    // console.log('defaultSearch', defaultSearch);
    const [search, setSearch] = useState(defaultSearch);

    const carApi = new CarApi();
    const fetchUsers = async page => {
        setLoading(true);
        //console.log('search====>', search)
        const response = await carApi.getCarsPagingAsync(search, page, perPage, sortdir.sort, sortdir.dir)
        setData(response.data);
        setTotalRows(response.total);
        setLoading(false);
    };
    const handlePageChange = page => {
        fetchUsers(page);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        const response = await carApi.getCarsPagingAsync(search, page, perPage, sortdir.sort, sortdir.dir)
        setData(response.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    const searchClick = async (data) => {
        //console.log(data)
        let payload = {
            carplate: data.carplate,
            province: data.province,
            policyNo: data.policyNo,
            status: ""
        };
        if (data.companySelected === "0") {
            payload.companyId = props.listofCompanyid
        } else {
            payload.companyId = [parseInt(data.companySelected)]
        }
        if (data.statusSelected === "0") {
            payload.status = ["ALL"]
        } else if (data.statusSelected === "1") {
            payload.status = ["LIVE"]
        } else if (data.statusSelected === "2") {
            payload.status = ["TRACKING"]
        }
        else if (data.statusSelected === "3") {
            payload.status = ["OFFLINE"]
        }

        setSearch(payload)
        var ts = Math.round((new Date()).getTime() / 1000);
        setKey(ts)
    }
    const handleSort = (column, sortDirection) => {
        console.log('column', column.selector);
        console.log('sortDirection', sortDirection);
        setSortdir({sort:column.selector,dir:sortDirection})
    };

    useEffect(() => {
        console.log("componentwill")
        if (props.listofCompanyid.length != 0) {
            setSearch({ ...defaultSearch, companyId: props.listofCompanyid })
        }
    }, [props.listofCompanyid]);

    useEffect(() => {
        console.log("componentwill")

        handlePageChange(1);
    }, [sortdir,perPage,search]);

    return (<>
        <Search companies={props.companies}
            SearchClick={searchClick}>
        </Search>
        <DataTable key={key}
            title="Users"
            columns={columns}
            data={data}
            progressPending={loading}
            pagination={true}
            paginationServer={true}
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onSort={handleSort}
            sortServer={true}
            className="border"
        /></>
    );
};
export default Cars;