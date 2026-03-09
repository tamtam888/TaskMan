import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const SignInWithGoogle = ({ onSignIn }) => {
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const [, payload] = idToken.split(".");
      const decoded = JSON.parse(atob(payload));

      const user = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
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
