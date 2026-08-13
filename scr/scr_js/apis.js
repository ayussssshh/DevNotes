import axios from "axios";
import { notify } from "./notification"




// creating the axios instance

const data_api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
})



const page_api = axios.create({
    baseURL: import.meta.env.VITE_FILE_URL,
    timeout: 10000,
    withCredentials: true,
})


// interceptor for checking the error code in responce from the server 

// fix the bug that keeps call the /rotateRtoken in loop on faulty 401

data_api.interceptors.response.use(
    async (response) => {
        

        return response;
    },
    async (error) => {

        if (error.response.status == 401 && error.response.data.massage == "invalid token") {

            await data_api.get('/rotateRtoken')
            
            console.log('invalid token')
            
            return data_api(error.config)
        }

        if (error.response.status == 401 && error.response.data.massage == "token expire") {

            await data_api.get('/rotateRtoken')
            
            console.log('rotetion started')
            
            return data_api(error.config)

        }

        if (error.response.status == 401 && error.response.data.massage == "token not found") {

            await data_api.get('/rotateRtoken')
            
            console.log('token not found')
        
            return data_api(error.config)
        }

        if(error.response.status == 500) {
            notify(error.response.data.message, "error")
        }

        return Promise.reject(error);

    }
)

export {data_api, page_api};