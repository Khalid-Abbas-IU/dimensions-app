import React from "react";
import "./style.css"

const DimChangePopup =({imageData})=>{
    return (
        <div className="zoomIn-box-wrapper">
            <img className="zoomIn-box-img" src={imageData} alt="zoom in box"/>
        </div>
    )
}
export default DimChangePopup;
