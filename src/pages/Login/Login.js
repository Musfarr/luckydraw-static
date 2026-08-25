import React, { useState } from "react";
import { View, ViewOff } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { apiPost } from "../../Utils/apiServices";
import { useAuth } from "../../Context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please enter email and password' });
      return;
    }
    setLoading(true);
    apiPost(
      '/api/login',
      (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.userData));
        setAuth({
          token: response.token,
          user: response.userData || {},
        });
        setLoading(false);
        navigate('/home');
      },
      (error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error?.response?.data?.message || 'Invalid email or password',
        });
      },
      { email: user.email, password: user.password }
    );
  };

  return (
    <>
      <div className="loginWrp">
        <div uk-grid="" className="uk-grid">
          <div className="uk-width-expand">
            <div className="imgwrp uk-flex uk-flex-center uk-flex-middle" >
              <img src={`/assets/images/convexlogowhite.png`} alt="" />
            </div>
          </div>

          <div className="uk-width-1-3">
            
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
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
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
                  {/* <div className="term-service-text">
                    <a>Privacy Policy</a> and <a>Terms of Service</a> apply.
                  </div> */}
                  <div className="uk-width-1-1">
                    <div className="fbInstaBtn">
                    <div className="loginBtn">
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
