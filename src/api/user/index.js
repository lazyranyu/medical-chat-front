
// 将类改为对象，使其可以直接被导入使用
import {INBOX_SESSION_ID} from "@/const/session";
import apiClient from "@/api/apiClient";

export const userService = {
    login : async (credentials) => {
        const response = await apiClient.post('/user/login', credentials);
        return response.data.data;
    },

    register : async (credentials) => {
        const response = await apiClient.post('/user/register', credentials);
        return response.data.data;
    },
    registerCode : async (email) => {
        const response = await apiClient.get(`/user/register/code/${email}`);
        return response.data;
    },
    loginCode : async (email) => {
        const response = await apiClient.get(`/user/login/code/${email}`);
        return response.data;
    },
    verifyToken: async(token) =>{
        if (!token) {
            return false;
        }
        const response = await apiClient.get(`/user/verify/${token}`);
        return response.data.data;
    }
};