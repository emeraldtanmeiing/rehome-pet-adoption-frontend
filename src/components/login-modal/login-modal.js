import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import AuthContext from "../../context/authContext";

import { Form, Button, Input, Modal, message } from "antd";
import { login, logout } from "../../services/auth.services.js";

import "./login-modal.scss";

// loading={loadings[0]}
const LoginModal = ({ visible, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const Auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (value) => {
    setIsLoading(true);

    const res = await login(value);

    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      form.resetFields();
      Auth.setAuth({ type: res.type, accountID: res.accountID });
      setIsLoading(false);
      onCancelModal();
    }
  };

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const tailFormItemLayout = {
    wrapperCol: { span: 24 }
  }

  const onClickToSignup = () => {
    navigate("/signup");
  };

  const onCancelModal = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <div className="login-modal">
      <div className="login-modal-form-wrapper">
        <div className="login-modal-form">
          <Modal
            title="Log In"
            visible={visible}
            onCancel={onCancelModal}
            footer={null}
          >
            <Form
              form={form}
              name="login-modal"
              onFinish={onFinish}
              validateMessages={validateMessages}
              scrollToFirstError
              initialValues={{ email: null, password: null }}
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
              onClick={onClickToSignup}
            >
              Don't have an account? Sign up now!
            </Button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
