import React from "react";

const CollegeMap = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📍 College Small Tour</h2>

      <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-2xl shadow-lg">
        <iframe
          style={{ maxWidth: "100%", width: "100%", height: "430px" }}
          src="https://www.klapty.com/tour/tunnel/GL70LW1Ut3"
          frameBorder="0"
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; vr"
        ></iframe>
      </div>
    </div>
  );
};

export default CollegeMap;
