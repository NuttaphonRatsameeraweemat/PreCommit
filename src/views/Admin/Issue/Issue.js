import React, { useState, useEffect } from 'react';
import moment from 'moment'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
} from 'reactstrap';
import DataTable from 'react-data-table-component';

import IssueApi from'./../../../services/issue.service'
const columns = [
    {
        name: 'id',
        selector: 'id',
        sortable: true,
        wrap:true
    },
    {
        name: 'appVersion',
        selector: 'appVersion',
        sortable: true,
        wrap:true
    },
    {
        name: 'carId',
        selector: 'carId',
        sortable: true,
        wrap:true
    },
    {
        name: 'deviceId',
        selector: 'deviceId',
        sortable: true,
        wrap:true
    },
    {
        name: 'deviceType',
        selector: 'deviceType',
        sortable: true,
        wrap:true
    },
    {
        name: 'driverId',
        selector: 'driverId',
        sortable: true,
        wrap:true
    },
    {
        name: 'detail',
        selector: 'detail',
        sortable: true,
        wrap:true
    },
    {
        name: 'createDate',
        selector: 'createDate',
        sortable: true,
        format: row => {
            if (row && row.createDate) return moment(row.createDate).format('DD/MM/YYYY HH:mm:ss')
        },
        wrap:true
    },
];

const Issue = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [sort, setSort] = useState({ dir: 'asc', sortField: 'id' });
    const issueApi = new IssueApi();
    const fetchUsers = async page => {
        setLoading(true);
        const response = await issueApi.getIssueAsync(page,perPage,sort.sortField,sort.dir)

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        fetchUsers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await issueApi.getIssueAsync(page,perPage,sort.sortField,sort.dir)

        setData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    const handleSort = (column, sortDirection) => {
        console.log('column',column.name);
        console.log('sortDirection',sortDirection);
        setLoading(true);
        setSort({ dir: sortDirection, sortField: column.name })
        setTimeout(() => {
            fetchUsersWithSort(1, column.name, sortDirection)
             setLoading(false);
        }, 100);

    };


    const fetchUsersWithSort = async (page,sort, dir ) => {
        setLoading(true);
        const response = await issueApi.getIssueAsync(page,perPage,sort,dir)
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(1);

    }, []);

    return (
        <Row>
            <Col xs="12" lg="12">
                <Card>
                    <CardHeader>
                        Issue
                    </CardHeader>
                    <CardBody>
                        <DataTable
                            title="Users"
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
                    </CardBody>
                </Card>

            </Col>
        </Row>

    );
}
export default Issue;
