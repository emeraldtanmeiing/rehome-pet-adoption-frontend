import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../context/authContext";

import { Row, Col, Form, Button, Input, message } from "antd";
import { login } from "../../services/auth.services.js";

import "./login.scss";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const Auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (value) => {
    setIsLoading(true);

    const res = await login(value);

    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      Auth.setAuth({ type: res.type, accountID: res.accountID });

      if (res.type === "adopter") {
        navigate("/");
      } else if (res.type === "rescuer") {
        navigate(`/rescuer/pets?rescuerID=${res.accountID}`);
      } else if (res.type === "admin") {
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
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
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

  const gridProps = { xxl: 10, xl: 10, lg: 10, md: 24, sm: 24, xs: 24 }
  
  return (
    <div className="login">
      <div className="login-form-wrapper">
        <Row align="center">
          <Col {...gridProps} align="center" >
            <h1>Log In</h1>
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

              <Button
                type="link"
                style={{ width: "100%" }}
                onClick={handleOnClick}
              >
                Don't have an account? Sign up now!
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
