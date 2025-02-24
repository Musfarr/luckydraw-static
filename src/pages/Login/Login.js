import React, { useState, useEffect } from "react";
// import mainLogo from "../../assets/images/mainLogo.svg";
import mainLogo from "../../assets/images/loginimage.png";
import { View, ViewOff } from "@carbon/icons-react";
import axios from "axios";
import { toast } from "react-toastify";
import { ValidateEmail } from "../../Utils/regexFunctions";
import { useAuth } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASEURL;

const Login = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Move auth check into useEffect to ensure auth context is ready
  useEffect(() => {
    if (auth?.token && auth?.user?.user_type) {
      const route = auth.user.user_type === "admin" ? "/admin-home" : "/dashboard";
      navigate(route);
    }
  }, [auth, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [errorEnable, setErrorEnable] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    setErrorEnable(true);
    e.preventDefault();
    setLoading(true);

    if (user.email && user.password && emailError === "Valid Email Address") {
      try {
        const response = await axios({
          method: "POST",
          url: `${baseUrl}/auth/login`,
          data: {
            username: user.email,
            password: user.password,
          },
        });

        if (response.status === 200) {
          const { token, user: userData } = response.data.data;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          setLoading(false);
          toast.success("Login successful", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 800,
          });

          // Use React Router navigation instead of window.location
          setTimeout(() => {
            const route = userData.user_type === "admin" ? "/admin-home" : "/dashboard";
            navigate(route);
          }, 1000);

          setErrorEnable(false);
        }
      } catch (error) {
        handleLoginError(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleLoginError = (error) => {
    console.log(error);

    if (error.response.status === 401) {
      toast.error("Invalid Credentials", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }

    setErrorEnable(false);
  };

  const handleEmailValidation = (e) => {
    const email = ValidateEmail(e.target.value);
    if (email === "Invalid Email") {
      setEmailError("Invalid Email Address");
    } else {
      setEmailError("Valid Email Address");
    }
  };

  return (
    <>
      <div className="loginWrp">
        <div uk-grid="" className="uk-grid">
          <div className="uk-width-1-2">
            <div className="imgwrp">
              <img src={mainLogo} alt="" />
            </div>
          </div>
          <div className="uk-width-1-2">
            <div className="formwrp">
              <form onSubmit={handleLogin}>
                <div className="loginHeading">
                  <h2>Login</h2>
                </div>
                <div uk-gird="">
                  <div className="uk-width-1-1">
                    <div className="inputField">
                      <input
                        type="text"
                        id="loginEmailInput"
                        placeholder="Email Address"
                        autoComplete="off"
                        onChange={(e) => {
                          setUser({ ...user, email: e.target.value });
                          handleEmailValidation(e);
                        }}
                      />

                      {user.email === "" && errorEnable && (
                        <div className="errors">Email is Required</div>
                      )}
                      {user.email !== "" &&
                        emailError !== "Valid Email Address" && (
                          <div className="errors">Invalid Email Address</div>
                        )}
                    </div>
                  </div>
                  <div className="uk-width-1-1">
                    <div className="inputField">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        id="loginPasswordInput"
                        autoComplete="off"
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                      />
                      {user.password &&
                        (showPassword ? (
                          <View
                            className="viewIcon"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <ViewOff
                            className="viewIcon"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ))}
                    </div>
                  </div>
                  {user.password === "" && errorEnable && (
                    <div className="uk-width-1-1 errors">
                      Password is Required
                    </div>
                  )}
                  <div className="term-service-text">
                    <a>Privacy Policy</a> and <a>Terms of Service</a> apply.
                  </div>
                  <div className="uk-width-1-1">
                    <div className="fbInstaBtn">
                      <button type="submit" className="login">
                        {loading ? (
                          <div uk-spinner="" className="loader"></div>
                        ) : (
                          "Log in"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
