import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../../Utils/apiServices";

import Spinner from "../../reusables/Spinner";
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


  const location = useLocation();
  const isviewmode = location.pathname.includes('view');
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [callData, setCallData] = useState(null);
  const [ispaused , setIsPaused] = useState(false)
  const [time, setTime] = useState(0)

  const [surveyData, setSurveyData] = useState({
    name: "",
    city: "",
    location: "",
    duration: time,
    status: "completed",
    responses: []
  });

  const images = [
    { id: "angryGrey", grey: angryGrey, color: angryColor },
    { id: "upsetGrey", grey: upsetGrey, color: upsetColor },
    { id: "neutralGrey", grey: neutralGrey, color: neutralColor },
    { id: "HappyGrey", grey: HappyGrey, color: HappyColor },
    { id: "excitedGrey", grey: excitedGrey, color: excitedColor },
  ];

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };


  // call duration timer
  useEffect(() => {

    if(!ispaused){
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
    }
  }, [ispaused]);

  useEffect(() => {
    const fetchCallData = () => {
      setIsLoading(true);
      
      const onSuccess = (response) => {
        setCallData(response.data);
        setIsLoading(false);
      };

      const onFailure = (error) => {
        setIsLoading(false);
      };

      !isviewmode ? apiPost(`/calls/${id}`, onSuccess, onFailure) :
                    apiGet(`/calls/${id}/view`, onSuccess, onFailure)
    };

    if (id) {
      fetchCallData();
    }
  }, [id]);

  const handleCancel = () => {
    navigate('/audit-survey');
  };


  const formatTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large">
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
                      <span>{callData?.phone_no}</span>
                    </div>
                    <div className="dataBox">
                      <p>Call Duration</p>

                      
                      <span>{ isviewmode ? formatTimeFromDate(callData.duration) :formatTime(time)   }</span>
                    </div>
                    <div className="dataBox">
                      <p>Call Time</p>
                      <span>{callData.call_time}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="dataBox">
                      <p>Call status</p>
                      <span>{callData.status}</span>
                    </div>
                    <div className="dataBtn">

                      {
                        !isviewmode &&
                        (
                      <div>
                        <button className="pause-btn" type="button"  onClick={() => setIsPaused(!ispaused)}>
                          {!ispaused ? 'Call in progress' : 'Start Call'}
                        </button>
                      </div>
                        )
                      }


                      {/* <div>
                        <button className="pause-btn" type="button" onClick={() => setIsPaused(!ispaused)}>
                          {ispaused ? 'Resume' : 'Pause'}
                        </button>
                      </div>
                      <div>
                        <button className="end-btn" type="button">
                          End
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>



                
              
                <div className="uk-width-1-1">
                  <div className="uk-grid uk-grid-small" uk-grid="">
                  <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your name ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                          value={isviewmode ? callData.name : surveyData.name}
                          onChange={(e) => setSurveyData({ ...surveyData, name: e.target.value })}
                          
                        />
                      </div>
                    </div>
                    <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your city ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                          value={isviewmode ? callData.city : surveyData.city}
                          onChange={(e) => setSurveyData({ ...surveyData, city: e.target.value })}
                        />
                      </div>
                    </div>


                    <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q1, What is your Location ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                          value={isviewmode ? callData.location : surveyData.location}
                          onChange={(e) => setSurveyData({ ...surveyData, location: e.target.value })}
                        />
                      </div>
                    </div>

                    {callData?.survey?.questions?.map((question) => (
                     
                     question.type === "input" ? (

                      <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          {question.question}
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                          value={ isviewmode ? question.answer :''}
                        />
                      </div>
                    </div>
                      
                     ) : question.type === "textarea" ? (
                      <div className="uk-width-1-2">
                        <div className="formInput">
                          <label htmlFor="userEmail">User Email</label>
                          <textarea name="" className="uk-textarea"></textarea>
                        </div>
                      </div>
                      
                     ) :  (
                      <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userEmail">
                          {question.question}
                        </label>
                        <div className="radio-wrapper">
                          {images.reverse().map((img) => (
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
                     )
                     
                    ))}
                    



                  </div>
                </div>
                
               


              
              { !isviewmode && (
                <div className="uk-width-1-1">
                  <div className="btnwrp">
                    <button type="button" className="btn-1" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-2" >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyCall;
