// import loadSirv from "@/loadsirv";
import LoadSirv from "../LoadSirv";
import React, { useEffect } from "react";
function Smv() {
  useEffect(() => {
    if (typeof window.Sirv === "undefined") {
      LoadSirv().then(() => {
        window.Sirv.start();
      });
    } else {
      window.Sirv.start();
    }
  });
  return (
    <div className="container">
      <div className="Sirv basic">
        <div data-src="https://demo.sirv.com/example.spin" />
        {/* <div data-src="https://demo.sirv.com/image.jpg" data-type="zoom" />
        <div data-src="https://demo.sirv.com/video.mp4" /> */}
      </div>
    </div>
  );
}
export default Smv;
