import axios from "axios";

let apiKey = process.env.REACT_APP_BASEURL;

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
