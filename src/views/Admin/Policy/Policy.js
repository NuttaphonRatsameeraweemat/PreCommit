import React, { useState, useEffect } from 'react';
import moment from 'moment'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Button,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
import DataTable from 'react-data-table-component';
//import {InputMoment, BigInputMoment, DatePicker, TimePicker} from 'react-input-moment';
import PolicyApi from './../../../services/policy.service'
//import'./../Policy/input-moment.min.css'


const DataTableDisplay = (props) => {
    const columns = [
        {
            name: 'id',
            selector: 'id',
            sortable: true,
            wrap: true
        },
        {
            name: 'fullCarPlate',
            selector: 'fullCarPlate',
            sortable: true,
            wrap: true
        },
        {
            name: 'isActive',
            selector: 'isActive',
            sortable: true,
            wrap: true,
            format: row => {
                if (row && row.isActive) return 'true'
                if (row && !row.isActive) return 'false'
            },
        },
        {
            name: 'policyNo',
            selector: 'policyNo',
            sortable: true,
            wrap: true
        },
        {
            name: 'policyStartDate',
            selector: 'policyStartDate',
            sortable: true,
            wrap: true,
            format: row => {
                if (row && row.policyStartDate) return moment(row.policyStartDate).format('DD/MM/YYYY HH:mm:ss')
            },
        },
        {
            name: 'policyExpireDate',
            selector: 'policyExpireDate',
            sortable: true,
            wrap: true,
            format: row => {
                if (row && row.policyExpireDate) return moment(row.policyExpireDate).format('DD/MM/YYYY HH:mm:ss')
            },
        },
    ];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [sort, setSort] = useState({ dir: 'asc', sortField: 'id' });
    const policyApi = new PolicyApi();
    const fetchUsers = async page => {
        setLoading(true);
        const response = await policyApi.getPolicyAsync(page, perPage, sort.sortField, sort.dir)

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        fetchUsers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await policyApi.getPolicyAsync(page, perPage, sort.sortField, sort.dir)

        setData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    const handleSort = (column, sortDirection) => {
        console.log('column', column.name);
        console.log('sortDirection', sortDirection);
        setLoading(true);
        setSort({ dir: sortDirection, sortField: column.name })
        setTimeout(() => {
            fetchUsersWithSort(1, column.name, sortDirection)
            setLoading(false);
        }, 100);

    };
 
    const fetchUsersWithSort = async (page, sort, dir) => {
        setLoading(true);
        const response = await policyApi.getPolicyAsync(page, perPage, sort, dir)
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(1);
    },[]);
    return (<DataTable
        title="Policy"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
       
        onSort={handleSort}
        sortServer
        className="border"
    />
    );
}
const Search = (props) => {

    return (<div>
        
        <button className="btn btn-primary" onClick={props.clickAdd} >Add</button>
    </div>)
}

const ModalAdd = (props) => {
    const policyApi = new PolicyApi();
    const defaultState = {
        policyNo: '',
        frontCarPlate: '',
        backCarPlate: '',
        province: '',
        policyStartDate: '',
        policyExpireDate: '',
        isActive: false
    };
    const defaultStateValidate = {
        isValidPolicyNo: true,
        isValidFrontCarPlate: true,
        isValidBackCarPlate: true,
        isValidProvince: true,
        isValidPolicyStartDate: true,
        isValidPolicyExpireDate: true,
    };
    const defaultStateServerError = {
        isOpen: false,
        msg: ''
    };
    const [data, setData] = useState(defaultState);
    const [validate, setValidate] = useState(defaultStateValidate);
    const [serverError, setServerError] = useState(defaultStateServerError);
    const handleOnChange = event => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };
    const handleOnChangeCheckbox = event => {
        setData({ ...data, [event.target.name]: event.target.checked });
    };
    const toggle = () => {
        setData(defaultState);
        setValidate(defaultStateValidate);
        setServerError(defaultStateServerError);
        props.toggle();
    }
    const addData = async () => {
        console.log('<<=before Add validate =>> ', validate)
        let isValid = await validateData(data);
        if (isValid) {
            let obj = {
                ...data,
                policyStartDate: moment(data.policyStartDate).toISOString(),
                policyExpireDate: moment(data.policyExpireDate).toISOString()
            }
            console.log('Modal Add obj =>> ', obj)
            let result = await policyApi.creatPolicy(obj);
            if (result.status === 200) {
                toggle()
                props.add();
            } else {

                console.log('resultresultresult', result.data.message)
                setServerError({
                    isOpen: true,
                    msg: result.data.message
                })
               
            }
        }
    }
    const validateData = async (obj) => {
        let _validate = validate;
        if (obj.policyNo.length > 0 && obj.policyNo.length < 50) {

            console.log("passss")
            _validate = { ..._validate, isValidPolicyNo: true }
        } else {
            console.log(" not passss")

            _validate = { ..._validate, isValidPolicyNo: false }
            setValidate(_validate)
            return false;
        }

        if (obj.frontCarPlate.length > 0 && obj.frontCarPlate.length < 50) {

            _validate = { ..._validate, isValidFrontCarPlate: true }
           

        } else {
            _validate = { ..._validate, isValidFrontCarPlate: false }
            setValidate(_validate)
            return false;
        }

        if (obj.backCarPlate.length > 0 && obj.backCarPlate.length < 50) {
            _validate = { ..._validate, isValidBackCarPlate: true }
            

        } else {
            _validate = { ..._validate, isValidBackCarPlate: false }
            setValidate(_validate)
            return false;
        }

        if (obj.province.length > 0 && obj.province.length < 50) {
            _validate = { ..._validate, isValidProvince: true }
           

        } else {
            _validate = { ..._validate, isValidProvince: false }
            setValidate(_validate)
            return false;
        }

        if (obj.policyStartDate.length > 0) {
            _validate = { ..._validate, isValidPolicyStartDate: true }
        } else {
            _validate = { ..._validate, isValidPolicyStartDate: false }
            setValidate(_validate)
            return false;
        }

        if (obj.policyExpireDate.length > 0) {
            _validate = { ..._validate, isValidPolicyExpireDate: true }
        } else {
            _validate = { ..._validate, isValidPolicyExpireDate: false }
            setValidate(_validate)
            return false;
        }

        setValidate(_validate)
        return true;

    }
    return (<div>
        <Modal isOpen={props.modal} toggle={toggle} className={props.className}>
            <ModalHeader toggle={toggle}>Add Policy</ModalHeader>
            <ModalBody>
                <Alert isOpen={serverError.isOpen} color="danger">
                    {serverError.msg}
                </Alert>
                <Row>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        <FormGroup row>
                            <Col md="12">
                                <Label htmlFor="policyNo" className="col-form-label">Policy No</Label>
                            </Col>
                            <Col xs="12" md="12" size="lg">
                                <Input invalid={!validate.isValidPolicyNo} type="text" name="policyNo" id="policyNo" bsSize="md" value={data.policyNo} onChange={handleOnChange}>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        <FormGroup row>
                            <Col md="12">
                                <Label htmlFor="frontCarPlate" className="col-form-label">ทะเบียนหน้า</Label>
                            </Col>
                            <Col xs="12" md="12" size="lg">
                                <Input invalid={!validate.isValidFrontCarPlate} type="text" name="frontCarPlate" id="frontCarPlate" bsSize="md" value={data.frontCarPlate} onChange={handleOnChange} >
                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        <FormGroup row>
                            <Col md="12">
                                <Label htmlFor="backCarPlate" className="col-form-label">ทะเบียนหลัง</Label>
                            </Col>
                            <Col xs="12" md="12" size="lg">
                                <Input invalid={!validate.isValidBackCarPlate} type="text" name="backCarPlate" id="backCarPlate" bsSize="md" value={data.backCarPlate} onChange={handleOnChange} >

                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        <FormGroup row>
                            <Col md="12">
                                <Label htmlFor="province" className="col-form-label">จังหวัด</Label>
                            </Col>
                            <Col xs="12" md="12" size="lg">
                                <Input invalid={!validate.isValidProvince} type="text" name="province" id="province" bsSize="md" value={data.province} onChange={handleOnChange}>

                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        <FormGroup row>
                            <Col md="12">
                                <Label htmlFor="policyStartDate" className="col-form-label">Start</Label>
                            </Col>
                            <Col xs="12" md="12" size="lg">
                                <Input invalid={!validate.isValidPolicyStartDate} type="date" name="policyStartDate" id="policyStartDate" bsSize="md" value={data.policyStartDate} onChange={handleOnChange}>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        <FormGroup row>
                            <Col md="12">
                                <Label htmlFor="policyExpireDate" className="col-form-label">Expire</Label>
                            </Col>
                            <Col xs="12" md="12" size="lg">
                                <Input invalid={!validate.isValidPolicyExpireDate} type="date" name="policyExpireDate" id="policyExpireDate" bsSize="md" value={data.policyExpireDate} onChange={handleOnChange}>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input name="isActive" type="checkbox" id="isActive" checked={data.isActive} onChange={handleOnChangeCheckbox} />{' '}
                                Active
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={addData}>Add</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </div>
    )
}

const Policy = (props) => {
    const [addModalStatus, setAddModalStatus] = useState(false);

    //////// add Modal
    const openAdd = () => {
        setAddModalStatus(true)
        console.log("click Add")
    }
    const toggleAdd = () => {
        setAddModalStatus(false)
        console.log("toggleAdd")
    }
    const addData = () => {
       
        console.log("addData")
    }
    return (
        <div>
            <Row>
                <Col xs="12" lg="12">
                    <Card>
                        <CardHeader>
                            
                        </CardHeader>
                        <CardBody>
                            <Search clickAdd={openAdd}>
                            </Search>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs="12" lg="12">
                    <Card>
                        <CardHeader>
                            Policy
                    </CardHeader>
                        <CardBody>
                            <DataTableDisplay></DataTableDisplay>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ModalAdd
                modal={addModalStatus}
                toggle={toggleAdd}
                add={addData}
            >
            </ModalAdd>
        </div>
    );
}
export default Policy;
