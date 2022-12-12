import React from "react";
import "./style.css"
const ZoomInBox =({imageData})=>{
    return (
        <div className="zoom-container">
            <div className="zoomIn-box-wrapper">
                <img className="zoomIn-box-img" src={imageData} alt="zoom in box"/>
            </div>
        </div>

    )
}
export default ZoomInBox;
