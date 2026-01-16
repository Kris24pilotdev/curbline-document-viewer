import React from "react";

const spinnerStyle = {
  display: "inline-block",
  width: 64,
  height: 64,
};

const circleStyle = {
  fill: "none",
  stroke: "#1976d2",
  strokeWidth: 4,
  strokeLinecap: "round",
  animation: "spin 1s linear infinite",
};

const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <svg style={spinnerStyle} viewBox="0 0 50 50">
      <circle style={circleStyle} cx="25" cy="25" r="20" />
      <style>
        {`
                    @keyframes spin {
                        0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
                        50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
                        100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
                    }
                `}
      </style>
    </svg>
  </div>
);

export default Loading;
