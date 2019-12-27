import BaseApi from "./base.service";

import axios from 'axios';
export default class CarApi extends BaseApi {
  //baseApiurl = "http://35.240.214.18:5001/"
  //baseApiurl = "http://localhost:5000/"
  baseApiurl = this.baseApiurl;

  getCarsAsync = async (data) => {
    try {
      var token = await this.getTokenAsync();
      const response = await axios({
        method: 'post',
        headers: {
          // "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        url: this.baseApiurl + 'api/Web/Car/search',
        data: data,
      });
      //console.log('response', response);
      return response.data;

    } catch (error) {
      //console.error('error',error);
      //console.log('info error', error)
      return [];
    }

  }

  getCarsPagingAsync = async ( data, index, limit, sort, dir) => {
    try {
      var token = await this.getTokenAsync();
      const response = await axios({
        method: 'post',
        headers: {
          // "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        url: this.baseApiurl + 'api/Web/Car/searchPaging/' + index + '/' + limit + '/' + sort + '/' + dir,
        data: data
      });
     // console.log('response', response);
      return response.data;

    } catch (error) {
     // console.log('info error', error)
      return [];
    }

  }


  getDriversAsync = async (id) => {
    try {
      var token = await this.getTokenAsync();
      const response = await axios({
        method: 'get',
        headers: {
          // "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        url: this.baseApiurl + 'api/Web/Car/Drivers/' + id,
        // data: data,
      });
     // console.log('response', response);
      return response.data;

    } catch (error) {
      //console.error('error',error);
      //console.log('info error', error)
      return [];
    }
  }

  getStreamsAsync = async (id) => {
    try {
      var token = await this.getTokenAsync();
      const response = await axios({
        method: 'get',
        headers: {
          // "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        url: this.baseApiurl + 'api/Web/Car/Streams/' + id,
        // data: data,
      });
     // console.log('response', response);
      return response.data;

    } catch (error) {
      //console.error('error',error);
      //console.log('info error', error)
      return [];
    }


  }

  getCarInfoAsync = async (id) => {
    try {
      var token = await this.getTokenAsync();
      const response = await axios({
        method: 'get',
        headers: {
          // "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        url: this.baseApiurl + 'api/Web/Car/' + id,
        // data: data,
      });
     // console.log('response', response);
      return response.data;

    } catch (error) {
      //console.log('info error', error)
      return [];
    }
  }

  getImage = async (url) => {
    try {
      var token = await this.getTokenAsync();
      const response = await axios({
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        url: this.baseApiurl + url,
        responseType: 'arraybuffer'
      });
      //console.log('responsesssssssssssssssssssssssssss', response);
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );

      return "data:;base64," + base64;

    } catch (error) {

     // console.log('info error', error)
      return [];
    }
  }

}