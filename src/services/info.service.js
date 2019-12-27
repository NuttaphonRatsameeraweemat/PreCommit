import BaseApi from "./base.service";

import axios from 'axios';
export default class InfoApi extends BaseApi {
  //  baseApiurl = "http://35.240.214.18:5001/"
    //baseApiurl = "http://localhost:52670/"
    baseApiurl = this.baseApiurl;
    
    getInfoAsync = async () => {
          try {
            var token = await this.getTokenAsync();
            console.log('token : '+token);
            const response = await axios({
              method: 'get',
              headers: {
               // "Access-Control-Allow-Origin": "*",
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization':'Bearer '+ token
              },
              url: this.baseApiurl + 'api/Web/Info',
            //  data: qs.stringify(payload),
            });
           // console.log('response', response);

           if(response.status ===200){
            console.log("response >>>>>>>>>>",response);
            
            localStorage.setItem('role', response.data.role);
           }
            return response.data;
            // if (response.status === 200) {
            //   localStorage.setItem('access_token', response.data.access_token);
            //   localStorage.setItem('refresh_token', response.data.refresh_token);
            //   localStorage.setItem('expires_in', response.data.expires_in);
            //   localStorage.setItem('token_start_time', new Date());
            //   console.log("Login successfull");
            //   return response;
            // }
          } catch (error) {
            //console.error('error',error);
            console.log('info error',error)
            return error.response;
          }

    }
        
    getMqttAsync = async () => {
      try {
        var token = await this.getTokenAsync();
        const response = await axios({
          method: 'get',
          headers: {
           // "Access-Control-Allow-Origin": "*",
            //'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':'Bearer '+ token,
            'apiKey':'Claimdi360'
          },
          url: this.baseApiurl + 'api/Car/Mqtt/active',
        //  data: qs.stringify(payload),
        });
        console.log('response', response);
        return response.data;
        // if (response.status === 200) {
        //   localStorage.setItem('access_token', response.data.access_token);
        //   localStorage.setItem('refresh_token', response.data.refresh_token);
        //   localStorage.setItem('expires_in', response.data.expires_in);
        //   localStorage.setItem('token_start_time', new Date());
        //   console.log("Login successfull");
        //   return response;
        // }
      } catch (error) {
        //console.error('error',error);
        console.log('info error',error)
        return error.response;
      }

}

}