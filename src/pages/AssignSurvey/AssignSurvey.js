import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from '../../Utils/apiServices';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthProvider';
import Spinner from '../../reusables/Spinner';
import Swal from 'sweetalert2';

const AssignSurvey = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [surveys, setSurveys] = useState([]);
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [csvFile, setCsvFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const fetchData = () => {
        setIsLoading(true);
        
        apiGet('/survey', 
            (response) => {
                setSurveys(response.data);
            },
            (error) => {
                toast.error('Failed to fetch surveys');
            }
        );

        apiGet('/agent-list',
            (response) => {
                setAgents(response.data);
                setIsLoading(false);
            },
            (error) => {
                toast.error('Failed to fetch agents');
                setIsLoading(false);
            }
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = (data) => {
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('survey_id', data.survey_id);
        formData.append('userid', data.agent_id);
        formData.append('csv_file', csvFile);

        apiPost('/assign-survey', 
            (response) => {
                toast.success(response.message || 'Survey assigned successfully');
                setIsSubmitting(false);

                
            },
            (error) => {
                toast.error(error?.response?.data?.message || 'Failed to assign survey') ;
                setIsSubmitting(false);
            },
            formData
        );
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
        } else {
            toast.error('Please select a valid CSV file');
            e.target.value = '';
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="addTeamWrp">
            <div className="uk-container uk-container-large ">
                <div className="addTeamHeading">
                    <h3>Assign Survey</h3>
                </div>
                <div className="addTeaBox">
                    <div className="addTeamBox">
                        <div className="formwrp">
                            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                <div className="uk-grid uk-grid-small" uk-grid="">
                                    <div className="uk-width-1-2">
                                        <div className="formInput">
                                            <label htmlFor="survey">Surveys</label>
                                            <select 
                                                className="uk-select" 
                                                {...register('survey_id', { required: true })}
                                                disabled={isLoading}
                                            >
                                                <option value="">Select Survey</option>
                                                {surveys.map(survey => (
                                                    <option key={survey.id} value={survey.id}>{survey.name}</option>
                                                ))}
                                            </select>
                                            {errors.survey_id && <span className="error">This field is required</span>}
                                        </div>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <div className="formInput">
                                            <label htmlFor="agent">Agents</label>
                                            <select 
                                                className="uk-select" 
                                                {...register('agent_id', { required: true })}
                                                disabled={isLoading}
                                            >
                                                <option value="">Select Agent</option>
                                                {agents.map(agent => (
                                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                                ))}
                                            </select>
                                            {errors.agent_id && <span className="error">This field is required</span>}
                                        </div>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <div className="formInput">
                                            <label>Upload Numbers (.CSV File Only)</label>
                                            <div className="js-upload uk-placeholder uk-text-center uk-margin-remove">
                                                <span uk-icon="icon: cloud-upload"></span>
                                                <div uk-form-custom="">
                                                    <input
                                                        type="file"
                                                        aria-label="Custom controls"
                                                        accept=".csv"
                                                        onChange={handleFileChange}
                                                        required
                                                    />
                                                    <span className="uk-link">{csvFile ? csvFile.name : 'Upload file'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='uk-width-1-2'>
                                    </div>

                                    <div className="btnwrp">
                                        <button 
                                            className="btn-1" 
                                            type="button" 
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="btn-2" 
                                            type="submit"
                                            disabled={isSubmitting || isLoading || !csvFile}
                                        >
                                            {isSubmitting ? (
                                                <div uk-spinner="ratio: 0.5"></div>
                                            ) : (
                                                'Assign Survey'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignSurvey;