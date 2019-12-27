
import axios from 'axios';
import https from 'https';
export default class DefenceApi {
    apiBaseUrl = process.env.REACT_APP_API_DEFENCE;
    basicAuth = 'Basic ' + btoa(process.env.REACT_APP_API_DEFENCE_USER + ':' + process.env.REACT_APP_API_DEFENCE_PWD);
    
    getStreamlist  = async (id) => {
        try {

            const response = await axios({
                method: 'get',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    'Authorization': this.basicAuth
                },
                url: this.apiBaseUrl + '/source/' + id,
            });
            console.log('responsesssssss', response);
            return response.data

        } catch (error) {
            console.log('error response', error)

        }
    }

    cutStream = async (id, start, end) => {
        try {
            const response = await axios({
                method: 'get',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    'Authorization': this.basicAuth
                },
                url: this.apiBaseUrl + '/source/' + id + "/" + start + "/" + end,
            });
            console.log('responsesssssss', response);
            return response.data

        } catch (error) {
            console.log('error response', error)

        }
    }
    download = async (url) => {
        try {
            axios({
                url: url,
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    'Authorization': this.basicAuth
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                var filename = new Date().toISOString();
                link.setAttribute('download', filename + '.mp4');
                document.body.appendChild(link);
                link.click();
            });
        } catch (error) {
            console.log('error response', error)

        }
    }


    blalsas = async (id) => {

        // // At instance level
        // const instance = axios.create({
        //     httpsAgent: new https.Agent({
        //         rejectUnauthorized: false
        //     })
        // });
        // instance.get('https://something.com/foo');

        // // At request level
        // const agent = new https.Agent({
        //     rejectUnauthorized: false
        // });
        // axios.get('https://something.com/foo', { httpsAgent: agent });



        try {

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            const response = await axios({
                method: 'get',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    'Authorization': this.basicAuth
                },
                url: this.apiBaseUrl + '/source/' + id,
                httpsAgent: agent  
            });
            console.log('responsesssssss', response);
            return response.data

        } catch (error) {
            console.log('error response', error)

        }
    }
}