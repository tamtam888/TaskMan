import React from "react";
import "./Title.css";

function Title() {
  return (
    <header className="title-header">
      <div className="title-content">
        <img src="/pacwhite.png" alt="Mdone Icon" className="dane-icon" />
        <div>
          <h1>TaskMan</h1>
          <p className="subtitle">Your task guide to victory!</p>
        </div>
      </div>
    </header>
  );
}

export default Title;
