import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const handleLogout = () => {
    // setLoader(true);
    // let data = {
    //   accessToken: auth.token,
    //   userPublicId: decryptedValue(auth.publicId),
    // };
    // apiPost(`/auth/logout`, onSuccess, onFailure, data);
    localStorage.clear();
    window.location.href ="/"
    // navigate("/", { replace: true });
  };
  const onSuccess = (response) => {
    setTimeout(() => {
      setLoader(false);
      localStorage.clear("");
      // navigate("/", { replace: true });
      window.location.href = "/";
    }, 1000);
  };
  const onFailure = (error) => {
    console.log(error);
    setLoader(false);
  };
  return (
    <div
      className="customModal ModalStyle uk-flex-top uk-open uk-flex uk-flex uk-open"
      uk-modal="esc-close: false; bg-close: false"
    >
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="filterModalContent">
          <div className="modalHeading">
            <span>Log out</span>
          </div>
          <div className="modalForm">
            <div className="dltModalTxt">
              <p>Do you really want to log out?</p>
            </div>
            <div className="btnwrp">
              <button type="button" className="btn-1" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-2 deleteBtn w-90"
                onClick={handleLogout}
              >
                {loader ? (
                  <div uk-spinner="" className="loader"></div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
