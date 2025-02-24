import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


let apiKey = process.env.REACT_APP_BASEURL;

let InterceptorSetup = false;


// INTERCEPTOR for Logging Out if token expires 
// This Function will be called in app.js to handle global errors

const SetupInterceptor = () => {

  
  
  if(InterceptorSetup) return;
  InterceptorSetup = true;

  axios.interceptors.response.use(
    response => response,
    async error => {
      const {code , message} = error.response.data;
      // Global  Error Handling for 401 ( Unauthenticated )
      if(code == 401){
        await Swal.fire({
          icon: 'warning',
          title: "Session Signed Out",
          showConfirmButton: true,
          timer: 3500
        })
        
          localStorage.clear();
          window.location.href = "/";
        
        return Promise.reject(error);
      }


      // Global  Error Handling for 422 ( Laravel Fomat Errors )
      else if (code === '422') {
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(field => {
        errors[field].forEach(message => {
          toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
          });
        });
      });

      return Promise.reject(error);
      }

      else  {
          // toast.error(message, {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 5000
          // });

      return Promise.reject(error);
      }
    }
  );
}









const jwt = async () => {
  try {
    const data = await localStorage.getItem("token");
    if (data !== null) {
      return data;
    }
  } catch (error) {}
};

export async function apiGet(endPoint, onSuccess, onFailure, custom ,params) {
  let token = await jwt();
  axios
    .get(custom === undefined ? apiKey + endPoint : endPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Access-Control-Allow-Origin": "*",
        // "Content-Type": "application/json",
      },
      params: params,
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error);
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
    });
}

export async function apiPost(endPoint, onSuccess, onFailure, body, custom) {
  let token = await jwt();
  axios
    .post(custom === undefined ? apiKey + endPoint : endPoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error);
    });
}

export async function apiPut(endPoint, onSuccess, onFailure, body, headers) {
  let token = await jwt();
  axios
    .put(apiKey + endPoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error);
    });
}

export async function apiDelete(endPoint, onSuccess, onFailure, headers) {
  let token = await jwt();

  axios
    .delete(apiKey + endPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error);
    });
}

export async function apiPatch(endPoint, onSuccess, onFailure, body, headers) {
  let token = await jwt();
  axios
    .patch(apiKey + endPoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error);
    });
}


export {SetupInterceptor}