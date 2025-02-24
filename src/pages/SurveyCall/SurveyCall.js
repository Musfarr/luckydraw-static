import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../../Utils/apiServices";
import Swal from "sweetalert2";

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
import { toast } from "react-toastify";

// SurveyCall component
const SurveyCall = () => {
  // Router and navigation hooks
  const location = useLocation();
  const isviewmode = location.pathname.includes('view');
  const { id } = useParams();
  const navigate = useNavigate();

  // Component state management
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [callData, setCallData] = useState(null);
  const [CurrentTime, setCurrentTime] = useState('00:00:00');
  const [time, setTime] = useState(0);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callstatus, setCallStatus] = useState('');
  const [ispaused, setIsPaused] = useState(false);

  // Calculate elapsed time since call started
  const calculateElapsedTime = (callTime) => {
    const startTime = new Date(callTime);
    const currentTime = new Date();
    return Math.floor((currentTime - startTime) / 1000); // Convert to seconds
  };

  useEffect(() => {
    if (callstatus === "active" && callData?.call_time) {
      setIsPaused(true);
      // Set initial time to elapsed time
      const elapsedTime = calculateElapsedTime(callData.call_time);
      setTime(elapsedTime);
      // Start timer from elapsed time
      StartCallTimer();
    } else {
      setIsPaused(false);
    }
  }, [callstatus, callData?.call_time]);

  // Initial survey data state
  const [surveyData, setSurveyData] = useState({
    name: "",
    city: "",
    location: "",
    duration: time,
    status: "completed",
    responses: []
  });

  // Emoji images configuration for mood selection
  const images = [
    { id: 1, grey: excitedGrey, color: excitedColor },
    { id: 2, grey: HappyGrey, color: HappyColor },
    { id: 3, grey: neutralGrey, color: neutralColor },
    { id: 4, grey: upsetGrey, color: upsetColor },
    { id: 5, grey: angryGrey, color: angryColor }
  ];

  /**
   * Formats seconds into HH:MM:SS string format
   * @param {number} totalSeconds - Total seconds to format
   * @returns {string} Formatted time string
   */
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

  /**
   * Starts the call timer and updates time state
   * @returns {number} Timer ID for cleanup
   */
  const StartCallTimer = () => {
    setIsPaused(true);
    const timer = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime + 1;
        setSurveyData(prev => ({ ...prev, duration: newTime }));
        return newTime;
      });
    }, 1000);
    setTimerId(timer);
    return timer;
  }

  /**
   * Fetches call data on component mount
   */
  useEffect(() => {
    const fetchCallData = () => {
      setIsLoading(true);
      
      const onSuccess = (response) => {
        setCallData(response.data);
        setCallStatus(response.data.status);
        setIsLoading(false);
      };

      const onFailure = (error) => {
        setIsLoading(false);
      };

      // Different API endpoints for view and edit modes
      !isviewmode ? apiPost(`/calls/${id}`, onSuccess, onFailure) :
                    apiGet(`/calls/${id}/view`, onSuccess, onFailure)
    };

    if (id) {
      fetchCallData();
    }
  }, [id]);






  /**
   * Saves answers to survey questions
   * @param {string} Q_ID - Question ID
   * @param {string} answer - Answer value
   */
  const SaveAnswers = (Q_ID, answer) => {
    setSelectedEmojis(prev => ({ ...prev, [Q_ID]: answer }));
    setSurveyData(prev => {
      const existingResponses = [...prev.responses];
      const existingIndex = existingResponses.findIndex(r => r.question_id === Q_ID);
      
      if (existingIndex !== -1) {
        existingResponses[existingIndex] = { question_id: Q_ID, answer: answer };
      } else {
        existingResponses.push({ question_id: Q_ID, answer: answer });
      }
      
      return {
        ...prev,
        responses: existingResponses
      };
    });
  }

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    navigate(`/dashboard`);
  };

  /**
   * Formats date string to time string in HH:MM:SS format
   * Handles invalid or null dates
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted time string or '--:--:--' if invalid
   */
  const formatTimeFromDate = (dateString) => {
    if (!dateString) return '--:--:--';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '--:--:--';

      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return '--:--:--';
    }
  };

  /**
   * Gets only the time portion from a datetime string
   * @param {string} datetime - Datetime string
   * @returns {string} Time portion or '--:--:--' if invalid
   */
  const getTimeFromDateTime = (datetime) => {
    if (!datetime) return '--:--:--';
    try {
      const date = new Date(datetime);
      if (isNaN(date.getTime())) return '--:--:--';
      
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return '--:--:--';
    }
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Stop timer immediately
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }

    const finalData = {
      ...surveyData,
      duration: formatTime(time),
      status: "completed"
    };
    
    const onSuccess = (response) => {
      if (response.code === 200) {
        
        setCallData(prev => ({ ...prev, status: "completed" }));
        setIsPaused(false);
        setIsSubmitting(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Survey submitted successfully',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate(`/survey-calls/view/${id}`);
        });
      } 
    };
    const onFailure = (error) => {
      setIsSubmitting(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    };

    apiPost(`/calls/${id}/update`, onSuccess, onFailure, finalData);
  };

  /**
   * Starts a new call and initializes timer
   */
  const StartCall = () => {
    setIsCallLoading(true);

    // Prepare form data for API
    var formData = new FormData();
    formData.append("status", 'active');

    const CallonSuccess = (response) => {
      const now = new Date();
      const currentTimeFormatted = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      setCurrentTime(currentTimeFormatted);
      StartCallTimer();
      setIsCallLoading(false);
    };

    const CallonFailure = (error) => {
      setIsCallLoading(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    };

    apiPost(`/calls/${id}/update-call-time`, CallonSuccess, CallonFailure, formData);
  }

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

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
                      <p>Phone</p>
                      <span>{callData?.phone_no}</span>
                    </div>
                    <div className="dataBox">
                      <p>Call Duration</p>
                      <span>{ isviewmode ? callData.duration  : formatTime(time)   }</span>
                    </div>
                    <div className="dataBox">
                      <p>Call Start Time</p>
                      <span>{isviewmode ? getTimeFromDateTime(callData?.call_time) : callstatus === 'active' ? new Date(callData?.call_time).toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : CurrentTime}</span>
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
                        <button 
                          className="pause-btn" 
                          type="button" 
                          disabled={ispaused || isCallLoading}  
                          onClick={StartCall}
                        >
                          {isCallLoading ? (
                            <div uk-spinner=""></div>
                          ) : (
                            ispaused ? 'Call in progress' : 'Start Call'
                          )}
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
                          onChange={(e) => !isviewmode && setSurveyData({ ...surveyData, name: e.target.value })}
                          disabled={isviewmode}
                        />
                      </div>
                    </div>



                    <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q2, What is your city ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter City"
                          className="uk-input"
                          value={isviewmode ? callData.city : surveyData.city}
                          onChange={(e) => !isviewmode && setSurveyData({ ...surveyData, city: e.target.value })}
                          disabled={isviewmode}
                        />
                      </div>
                    </div>
                        

                    <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q3, What is your Location ?
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Location"
                          className="uk-input"
                          value={isviewmode ? callData.location : surveyData.location}
                          onChange={(e) => !isviewmode && setSurveyData({ ...surveyData, location: e.target.value })}
                          disabled={isviewmode}
                        />
                      </div>
                    </div>

                    {callData?.survey?.questions?.map((question , index) => (
                     
                     question.type === "input" ? (

                      <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userName">
                          Q{index + 4}, {question.question}
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          className="uk-input"
                          value={isviewmode ? question.answer : surveyData.responses.find(response => response.question_id === question.id)?.answer || ''}
                          onChange={(e) => !isviewmode && SaveAnswers(question.id, e.target.value)}
                          disabled={isviewmode}
                        />
                      </div>
                    </div>
                      
                     ) : question.type === "textarea" ? (
                      <div className="uk-width-1-2">
                        <div className="formInput">
                          <label htmlFor="userEmail">Q{index + 4}{question.question}</label>
                          <textarea 
                            name="" 
                            className="uk-textarea"
                            value={isviewmode ? question.answer : surveyData.responses.find(response => response.question_id === question.id)?.answer || ''}
                            onChange={(e) => !isviewmode && SaveAnswers(question.id, e.target.value)}
                            disabled={isviewmode}
                          ></textarea>
                        </div>
                      </div>
                      
                     ) :  (
                      <div className="uk-width-1-2">
                      <div className="formInput">
                        <label htmlFor="userEmail">
                        Q{index + 4} {question.question}
                        </label>
                        <div className="radio-wrapper">
                          {images.map((img) => {
                            const answer = isviewmode ? question.answer : selectedEmojis[question.id];
                            const isSelected = answer === img.id.toString();
                            
                            return (
                              <div key={img.id}>
                                <input
                                  type="radio"
                                  id={`${question.id}_${img.id}`}
                                  name={`question_${question.id}`}
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={() => !isviewmode && SaveAnswers(question.id, img.id.toString())}
                                  disabled={isviewmode}
                                />
                                <label className="radio-label" htmlFor={`${question.id}_${img.id}`}>
                                  <img
                                    src={isSelected ? img.color : img.grey}
                                    alt={img.id}
                                  />
                                </label>
                              </div>
                            );
                          })}
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
                    <button 
                      type="submit" 
                      className="btn-2" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div uk-spinner=""></div>
                      ) : 'Submit'}
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
