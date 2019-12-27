import qs from 'qs';
import axios from 'axios';
import https from 'https';
import InfoApi from './info.service'

export default class LoginApi {
  //apiBaseAuthUrl = "http://35.240.214.18:5000/";
  //apiBaseAuthUrl = "https://34.87.47.33/";
  apiBaseAuthUrl = process.env.REACT_APP_API_AUTH;
  infoApi = new InfoApi();
  GetTokenAsync = async (username, password) => {
    var payload = {
      username: username,
      password: password,
      scope: "ClaimDi360Api offline_access",
      grant_type: "password",
      client_id: "SPAClient",
      client_secret: "secret",
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
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      console.log('response', response);
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('expires_in', response.data.expires_in);
        localStorage.setItem('token_start_time', new Date());
        console.log("Login successfull");


       await this.infoApi.getInfoAsync();
        return response;
      }
    } catch (error) {
      //console.error('error',error);
      console.log('error', error.response)

      return error.response;
    }
  }
  GetToken(username, password) {
    var payload = {
      username: username,
      password: password,
      scope: "ClaimDi360Api offline_access",
      grant_type: "password",
      client_id: "MobileClient",
      client_secret: "secret",
    };
    axios({
      method: 'post',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: this.apiBaseAuthUrl + 'connect/token',
      data: qs.stringify(payload),
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Login successfull");
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('expires_in', response.data.expires_in);
          localStorage.setItem('token_start_time', new Date());
        }
      })
      .catch(function (error) {
        console.log(error.response.data.error_description)
      });
  };
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
  Refreshtoken() {
    var refresh_token = localStorage.getItem('refresh_token');
    var payload = {
      grant_type: "refresh_token",
      client_id: "MobileClient",
      client_secret: "secret",
      refresh_token: refresh_token
    };
    axios({
      method: 'post',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: this.apiBaseAuthUrl + 'connect/token',
      data: qs.stringify(payload),
    })
      .then(function (response) {
        console.log('callServiceRefreshtoken', response);
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('expires_in', response.data.expires_in);
          localStorage.setItem('token_start_time', new Date());

        }
      })
      .catch(function (error) {
        console.log(error.response.data.error_description)
      });
  }
  Logout() {
    localStorage.clear();
    console.log("logout successfull");
  }
}
