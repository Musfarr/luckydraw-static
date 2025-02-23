import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../Utils/apiServices";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthProvider";

const AddUser = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      name: "",
      password: "",
      password_confirmation: "",
      user_type: auth.user.user_type === 'admin' ? 'agent' : '',
      photo: ''
    }
  });

  const password = watch("password");

  const onSubmit = (data) => {
    setIsSubmitting(true);

    const onSuccess = (response) => {
      setIsSubmitting(false);
      toast.success("User added successfully!");
      navigate("/agent-list");
    };

    const onFailure = (error) => {
      setIsSubmitting(false);
      toast.error(error?.response?.data?.message || "Failed to add user");
    };

    apiPost("/auth/register", onSuccess, onFailure, data);
  };

  return (
    <div className="addTeamWrp">
      <div className="uk-container uk-container-large ">
        <div className="addTeamHeading">
          <h3>Add User</h3>
        </div>
        <div className="addTeaBox">
          <div className="addTeamBox">
            <div className="formwrp">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div className="uk-grid uk-grid-small" uk-grid="">
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="username">User Name</label>
                      <input
                        type="email"
                        placeholder="ie: userName@gmail.com"
                        className={`uk-input ${errors.username ? 'uk-form-danger' : ''}`}
                        {...register("username", {
                          required: "Username is required",
                          pattern: {
                            // value: /^[a-zA-Z0-9_]+$/,
                            message: "Username has to be in email format "
                          }
                        })}
                      />
                      {errors.username && <div className="formErrors">{errors.username.message}</div>}
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="email">User Email</label>
                      <input
                        type="email"
                        placeholder="ie: userName@gmail.com"
                        className={`uk-input ${errors.email ? 'uk-form-danger' : ''}`}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                      {errors.email && <div className="formErrors">{errors.email.message}</div>}
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="phone">User Phone</label>
                      <input
                        type="number"
                        placeholder="Please enter user phone"
                        className={`uk-input ${errors.phone ? 'uk-form-danger' : ''}`}
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{11}$/,
                            message: "Phone number must be 11 digits"
                          }
                        })}
                      />
                      {errors.phone && <div className="formErrors">{errors.phone.message}</div>}
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        className={`uk-input ${errors.name ? 'uk-form-danger' : ''}`}
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 3,
                            message: "Name must be at least 3 characters"
                          }
                        })}
                      />
                      {errors.name && <div className="formErrors">{errors.name.message}</div>}
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        placeholder="Please enter password"
                        className={`uk-input ${errors.password ? 'uk-form-danger' : ''}`}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                          }
                        })}
                      />
                      {errors.password && <div className="formErrors">{errors.password.message}</div>}
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div className="formInput">
                      <label htmlFor="password_confirmation">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Please confirm password"
                        className={`uk-input ${errors.password_confirmation ? 'uk-form-danger' : ''}`}
                        {...register("password_confirmation", {
                          required: "Please confirm password",
                          validate: value => value === password || "Passwords do not match"
                        })}
                      />
                      {errors.password_confirmation && <div className="formErrors">{errors.password_confirmation.message}</div>}
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
                            {...register("photo")}
                          />
                          <span className="uk-link">Upload file</span>
                        </div>
                      </div>
                    </div>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div uk-spinner=""></div>
                      ) : (
                        'Add User'
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

export default AddUser;
