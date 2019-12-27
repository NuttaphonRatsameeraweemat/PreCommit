
import axios from 'axios';
import qs from 'qs';
export default class BaseApi {
    apiBaseAuthUrl = process.env.REACT_APP_API_AUTH;
    baseApiurl = process.env.REACT_APP_API_ENDPOINT;


    
    getTokenAsync = async () => {
        var accessToken = localStorage.getItem('access_token');
      // var expiresIn = localStorage.getItem('expires_in');
        var tokenStartTime = localStorage.getItem('token_start_time');
        var currenttime = new Date();
        var tokenStartTime_date = new Date(tokenStartTime);
        var diff = Math.round((((currenttime - tokenStartTime_date) % 86400000) % 3600000) / 60000);
        console.log('token diff',diff)
        if (accessToken
            && (diff < 15)) {
            console.log('no refresh');
            return accessToken;
        }
        
        await this.RefreshtokenAsync();
        accessToken = localStorage.getItem('access_token');
        return accessToken;
    }

    RefreshtokenAsync = async () => {
        var refresh_token = localStorage.getItem('refresh_token');
        var payload = {
            grant_type: "refresh_token",
            client_id: "SPAClient",
            client_secret: "secret",
            refresh_token: refresh_token
        };
        try {
            const response = await axios({
                method: 'post',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                url: this.apiBaseAuthUrl + 'connect/token',
                data: qs.stringify(payload),
            });
            console.log('response', response);
            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('expires_in', response.data.expires_in);
                localStorage.setItem('token_start_time', new Date());
                console.log("refresh successfull");
                return response;
            }
        } catch (error) {
            console.log('response', error.response.data.error)
            return error.response;
        }
    }
}