import { Add, TrashCan } from "@carbon/icons-react";
import React, { useState } from "react";

const CreateSurvey = () => {
  const [fields, setFields] = useState([
    { type: "Text", label: "", placeholder: "", required: false },
  ]);

  const handleAddField = () => {
    setFields([
      ...fields,
      { type: "Text", label: "", placeholder: "", required: false },
    ]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    if (fields.length > 1) {
      const updatedFields = fields.filter((_, i) => i !== index);
      setFields(updatedFields);
    }
  };


  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large ">
        <div className="addTeamHeading">
          <h3>Create Survey</h3>
        </div>
        <div className="addTeaBox">
          <div className="addTeamBox">
            <div className="formwrp">
              <form autoComplete="off">
                <div className="uk-grid uk-grid-small" uk-grid="">
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="userName">Survey Name</label>
                      <input
                        type="text"
                        placeholder="Enter Survey name"
                        className="uk-input"
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="userEmail">User Email</label>
                      <select name="" className="uk-select">
                        <option value="">Mudassir</option>
                      </select>
                    </div>
                  </div>
                  <div className="uk-width-1-1">
                    <div className="formSubHeading">
                      <h3>Pre Survey Forms Fiels</h3>
                    </div>
                  </div>
                  {fields.map((field, index) => (
                    <div className="uk-width-1-1">
                      <div className="addFieldWrp">
                        <div className="formInput">
                          <label htmlFor="userName">Type</label>
                          <select
                            name=""
                            className="uk-select"
                            value={field.type}
                            onChange={(e) =>
                              handleFieldChange(index, "type", e.target.value)
                            }
                          >
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Email">Email</option>
                          </select>
                        </div>
                        <div className="formInput">
                          <label htmlFor="userName">Label</label>
                          <input
                            type="text"
                            placeholder="Enter Label"
                            className="uk-input"
                            value={field.label}
                            onChange={(e) =>
                              handleFieldChange(index, "label", e.target.value)
                            }
                          />
                        </div>
                        <div className="formInput">
                          <label htmlFor="userName">Placeholder</label>
                          <input
                            type="text"
                            placeholder="Enter your Question"
                            className="uk-input"
                            value={field.placeholder}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "placeholder",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="formCheckbox">
                          <label htmlFor="userName">Required</label>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "required",
                                e.target.checked
                              )
                            }
                          />
                        </div>
                        <div className="formDltBtn">
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleRemoveField(index)}
                            disabled={fields.length === 1}
                          >
                            <TrashCan />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="uk-width-1-1">
                    <div className="addFieldBtn">
                      <button type="button" onClick={handleAddField}>
                        <Add /> Add Field
                      </button>
                    </div>
                  </div>
                  <div className="uk-width-1-1">
                    <div className="uk-margin-top uk-margin-bottom">
                      <hr />
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
                            accept=".png,.jpg,.jpeg"
                          />
                          <span className="uk-link">Upload file</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label>Upload Logo (.jpg, .png File Only)</label>
                      <div className="js-upload uk-placeholder uk-text-center uk-margin-remove">
                        <span uk-icon="icon: cloud-upload"></span>
                        <div uk-form-custom="">
                          <input
                            type="file"
                            aria-label="Custom controls"
                            accept=".png,.jpg,.jpeg"
                          />
                          <span className="uk-link">Upload file</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btnwrp">
                    <button className="btn-1" type="button">
                      Cancel
                    </button>
                    <button className="btn-2" type="submit">
                      Submit Survey
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

export default CreateSurvey;
