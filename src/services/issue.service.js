import BaseApi from "./base.service";

import axios from 'axios';

export default class IssueApi extends BaseApi {
    baseApiurl = this.baseApiurl;
   // baseApiurl = "http://35.240.214.18:5001/"
    //baseApiurl = "http://localhost:52670/"


    getIssueAsync = async (page, perPage, sort, dir) => {
        try {
            let url = `${this.baseApiurl}api/Web/Issue/${page}/${perPage}/${sort}/${dir}`;
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
}