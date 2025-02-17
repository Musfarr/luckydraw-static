import React from "react";

const RefreshModal = () => {
  return (
    <div
      className="customModal ModalStyle uk-flex-top uk-open uk-flex uk-flex uk-open"
      uk-modal="esc-close: false; bg-close: false"
    >
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="filterModalContent">
          <div className="modalHeading">
            <span>Disconnected</span>
          </div>
          <div className="modalForm">
            <div className="dltModalTxt">
              <p>You're disconnected! Hit refresh to reconnect!</p>
            </div>
            <div className="btnwrp">
              <button
                type="button"
                className="btn-2 deleteBtn "
                onClick={() => {
                  window.location.reload();
                }}
                // disabled={!navigator.onLine}
              >
                Click to Reconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefreshModal;
