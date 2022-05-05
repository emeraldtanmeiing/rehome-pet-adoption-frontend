import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import AuthContext from "../../context/authContext";

import { Form, Button, Input } from "antd";
import { login } from "../../services/auth.services.js";
import "./login.scss";
import toaster from "../../components/toaster/toaster.js";

// loading={loadings[0]}
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const Auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (value) => {
    setIsLoading(true);

    const res = await login(value);

    if (res?.error) {
      toaster("error", res.error.description);
      setIsLoading(false);
    } else {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("type");
      Cookies.remove("accountID");

      Auth.setAuth({ type: res.type, accountID: res.accountID });

      Cookies.set("accessToken", res.accessToken);
      Cookies.set("refreshToken", res.refreshToken);
      Cookies.set("type", res.type);
      Cookies.set("accountID", res.accountID);

      if (res.type == "adopter") {
        navigate("/");
      } else if (res.type == "rescuer") {
        navigate("/rescuer/pets");
      } else if (res.type == "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(-1);
      }
    }
  };

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 21 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
    },
  };

  const handleOnClick = () => {
    navigate("/signup");
  };

  return (
    <div className="login">
      <div className="login-form-wrapper">
        Login (Rescuer, Adopter, Admin)
        <div className="login-form">
          <Form
            name="login"
            onFinish={onFinish}
            validateMessages={validateMessages}
            scrollToFirstError
            {...formItemLayout}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Type your email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="Type your password" />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{ width: "100%" }}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <Button type="link" style={{ width: "100%" }} onClick={handleOnClick}>
            Don't have an account? Sign up now!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
