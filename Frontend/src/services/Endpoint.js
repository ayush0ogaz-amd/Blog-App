import axios from "axios";

const API = axios.create({

    baseURL:"http://localhost:5000",

    withCredentials:true

});
export const get = (url)=>API.get(url);

export const post = (url,data)=>API.post(url,data);