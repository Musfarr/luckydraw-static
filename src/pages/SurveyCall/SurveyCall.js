import React, { useState } from "react";
import angryGrey from "../../assets/images/icons/angry-grey.svg";
import angryColor from "../../assets/images/icons/angry-color.svg";
import upsetColor from "../../assets/images/icons/upset-color.svg";
import upsetGrey from "../../assets/images/icons/upset-grey.svg";
import neutralColor from "../../assets/images/icons/neutral-color.svg";
import neutralGrey from "../../assets/images/icons/neutral-grey.svg";
import HappyGrey from "../../assets/images/icons/happy-grey.svg";
import HappyColor from "../../assets/images/icons/happy-color.svg";
import excitedGrey from "../../assets/images/icons/excited-grey.svg";
import excitedColor from "../../assets/images/icons/excited-color.svg";

const SurveyCall = () => {
  const [selected, setSelected] = useState("");

  const images = [
    { id: "angryGrey", grey: angryGrey, color: angryColor },
    { id: "upsetGrey", grey: upsetGrey, color: upsetColor },
    { id: "neutralGrey", grey: neutralGrey, color: neutralColor },
    { id: "HappyGrey", grey: HappyGrey, color: HappyColor },
    { id: "excitedGrey", grey: excitedGrey, color: excitedColor },
  ];

  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large ">
        <div className="addTeamHeading">
          <h3>Survey call</h3>
        </div>
        <div className="addTeamBox">
          <div className="formwrp">
            <form autoComplete="off">
              <div className="uk-grid uk-grid-small" uk-grid="">
                <div className="uk-width-1-1">
                  <div className="formDataWrp">
                    <div className="dataBox">
                      <p>Call</p>
                      <span>033352490736</span>
                    </div>
                    <div className="dataBox">
                      <p>Call Duration</p>
                      <span>00:15:30</span>
                    </div>
                    <div className="dataBox">
                      <p>Call Time</p>
                      <span>16:54:10</span>
                    </div>
                    <div className="divider"></div>
                    <div className="dataBox">
                      <p>Call status</p>
                      <span>Active</span>
                    </div>
                    <div className="dataBtn">
                      <div>
                        <button className="pause-btn" type="button">
                          Pause
                        </button>
                      </div>
                      <div>
                        <button className="end-btn" type="button">
                          End
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="userEmail">User Email</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="uk-input"
                    />
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="userEmail">User Email</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="uk-input"
                    />
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="uk-grid uk-grid-small" uk-grid="">
                    <div className="uk-width-1-1">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your name ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                        />
                      </div>
                    </div>
                    <div className="uk-width-1-1">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your name ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                        />
                      </div>
                    </div>
                    <div className="uk-width-1-1">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your name ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                        />
                      </div>
                    </div>
                    <div className="uk-width-1-1">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your name ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-2">
                  <div className="formInput">
                    <label htmlFor="userEmail">User Email</label>
                    <textarea name="" className="uk-textarea"></textarea>
                  </div>
                </div>
                <div className="uk-width-1-1">
                  <div class="formInput">
                    <label htmlFor="userEmail">
                      Q7, You purchase unilever product. How about your
                      experience ?
                    </label>
                    <div className="radio-wrapper">
                      {images.map((img) => (
                        <div key={img.id}>
                          <input
                            type="radio"
                            id={img.id}
                            name="img-radio"
                            className="hidden"
                            onChange={() => setSelected(img.id)}
                          />
                          <label className="radio-label" htmlFor={img.id}>
                            <img
                              src={selected === img.id ? img.color : img.grey}
                              alt={img.id}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-1">
                  <div className="btnwrp">
                    <button type="button" className="btn-1">
                      Cancel
                    </button>
                    <button type="submit" className="btn-2">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyCall;
