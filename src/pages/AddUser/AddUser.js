import React from "react";

const AddUser = () => {
  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large ">
        <div className="addTeamHeading">
          <h3>Add User</h3>
        </div>
        <div className="addTeaBox">
          <div className="addTeamBox">
            <div className="formwrp">
              <form autoComplete="off">
                <div className="uk-grid uk-grid-small" uk-grid="">
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="userName">User Name</label>
                      <input
                        type="text"
                        placeholder="Please enter user name"
                        className="uk-input"
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="userEmail">User Email</label>
                      <input
                        type="email"
                        placeholder="Please enter user email"
                        className="uk-input"
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="userPhone">User Phone</label>
                      <input
                        type="tel"
                        placeholder="Please enter user phone"
                        className="uk-input"
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="userName">Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        className="uk-input"
                      />
                    </div>
                  </div>
                  {/* <div className="uk-width-1-2">
            <div className="formInput">
              <label htmlFor="userType">User Type</label>
              <select
                name="userType"
                className="uk-select"
                {...register("userType", { required: "User type is required" })}
              >
                <option value="" disabled>Select user type</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
              {errors.userType && <div className="formErrors">{errors.userType.message}</div>}
            </div>
          </div> */}
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        placeholder="Please enter password"
                        className="uk-input"
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Please confirm password"
                        className="uk-input"
                      />
                    </div>
                  </div>

                  <div className="uk-width-1-1">
                    <div className="formInput">
                      <label>Upload Profile Pic (PNG, JPG File Only)</label>
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
                      Add User
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

export default AddUser;
