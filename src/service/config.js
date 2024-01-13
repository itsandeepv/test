import axios from 'axios';

export const ServiceCall = async (url, formData, config) => {
    try {
        const response = await axios.post(url, formData, config ? config : null);
        console.log("response>>", response);
        return response.data; // You may want to return some data to the caller
    } catch (error) {
        console.error("error>>", error);
        // throw error; // Rethrow the error to allow the calling code to handle it
    } finally {
        // always executed
    }
};

export const NewServiceCall = async (config) => {
    try {
        const response = await axios.request(config)
        .then((response)=>{
            return response
        })
        .catch((error)=>{
            console.log(error)
            return error
        })
        console.log("response NewServiceCall>>", response);
        return response; // You may want to return some data to the caller
    } catch (error) {
        console.error("error>>", error);
        throw error; // Rethrow the error to allow the calling code to handle it
    } finally {
        // always executed
    }
}
