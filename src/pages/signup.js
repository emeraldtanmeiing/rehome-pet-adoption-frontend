import React from "react";
import { Form, Button, Input, Selector } from "antd";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const handleSignUpAsRescuer = () => {
    navigate("/rescuer/signup")
  }

  return (
    <div className="signup">
      Sign up
      {/* <Form>
        <Form.Item name="name" label="Name">
          <Input placeholder="Type your name"
        </Form.Item>
      </Form> */}
      <button onClick={handleSignUpAsRescuer}>Sign up as rescuer</button>
    </div>
  );
}

export default Signup;

// type: "rescuer",
// name: "rescuer1",
// email: "rescuer15@gmail.com",
// phone: "0123334444",
// password: passwordHash,
// active: true,

// //rescuer
// verified: false,
// address: "address1",
// description: "description1",
// facebookLink: "facebookLink1",
// instagramLink: "instagramLink1",
// organizationWebsiteLink: "organizationWebsiteLink1",