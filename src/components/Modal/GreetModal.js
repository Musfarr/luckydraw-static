import React from "react";
import greet from "../../../src/assets/images/greet.png";
import tickmark from "../../../src/assets/images/tickmark.png";
import { Close } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";

const GreetModal = () => {
  const navigate = useNavigate();
  return (
    <div
      className="customModal greetmodal ModalStyle uk-flex-top uk-open uk-flex uk-flex uk-open"
      uk-modal="esc-close: false; bg-close: false"
    >
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button
          className="uk-modal-close-default"
          type="button"
          onClick={() => {
            localStorage.clear("");
            navigate(`/`, {
              replace: true,
            });
            // window.location.href  ='/'
          }}
        >
          <Close />
        </button>

        <span>
          <img src={greet} />
          <img className="tick" src={tickmark} />
        </span>
        <div className="container">
          <div className="heading">Congratulations</div>
          <div className="para">
            You have been successfully registered. Kindly check your email
            address for your credentials
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetModal;
