import BaseApi from "./base.service";

import axios from 'axios';

export default class PolicyApi extends BaseApi {

    //baseApiurl = this.baseApiurl;
   // baseApiurl = "http://localhost:5000/"
    baseApiurl = this.baseApiurl;

    getPolicyAsync = async (page, perPage, sort, dir) => {
        try {
            let url = `${this.baseApiurl}api/Web/Policy/${page}/${perPage}/${sort}/${dir}`;
            let token = await this.getTokenAsync();
            const response = await axios({
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                url: url,
            });
            console.log('response', response);
            return response;
        } catch (error) {
            //console.error('error',error);
            console.log('info error', error)
            return error.response;
        }

    }

    creatPolicy = async (data) => {
        try {
            let url = `${this.baseApiurl}api/Web/Policy`;
            let token = await this.getTokenAsync();
            const response = await axios({
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                url: url,
                data : data
            });
            console.log('response', response);
            return response;
        } catch (error) {
            //console.error('error',error);
            console.log('info error', error)
            return error.response;
        }

    }
}