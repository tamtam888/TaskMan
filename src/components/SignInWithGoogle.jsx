import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const SignInWithGoogle = ({ onSignIn }) => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const userInfo = await userInfoResponse.json();
      
      const user = {
        name: decodedPayload.name || userInfo.name,
        email: decodedPayload.email || userInfo.email,
        accessToken: token,
      };
      
      onSignIn(user);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed.");
    }
  };

  return (
    <div className="signin-container">
      <h2>Welcome to TaskMan 👋</h2>
      <p>Please sign in with Google</p>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => alert("Login Failed")}
        useOneTap
      />
    </div>
  );
};

export default SignInWithGoogle;