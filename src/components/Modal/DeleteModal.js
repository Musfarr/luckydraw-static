import React from "react";

const DeleteModal = ({
  closeModal,
  dltModalTxt,
  deleteTeam,
  dltLoader,
  heading,
}) => {
  return (
    <div
      className="customModal ModalStyle uk-flex-top uk-open uk-flex uk-flex uk-open"
      uk-modal="esc-close: false; bg-close: false"
    >
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="filterModalContent">
          <div className="modalHeading">
            <span>{heading}</span>
          </div>
          <div className="modalForm">
            <div className="dltModalTxt">
              <p>{dltModalTxt}</p>
            </div>
            <div className="btnwrp">
              <button type="button" className="btn-1" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-2 deleteBtn w-90"
                onClick={deleteTeam}
              >
                {dltLoader ? (
                  <div uk-spinner="" className="loader"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
