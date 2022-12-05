import React from "react";
import "./style.css"
import Button from "../../common/Button";

const DimChangePopup =({imageData,zoomOut,zoomIn})=>{
    return (
        <div className="zoom-container">
            <div className="zoomIn-box-wrapper">
                <img className="zoomIn-box-img" src={imageData} alt="zoom in box"/>
            </div>
            <div className="zoom-in-out-btn-wrapper">
                <Button customClass="zoomin-out-btn" text="-" onClicked={zoomOut}/>
                <Button customClass="zoomin-out-btn" text="+" onClicked={zoomIn}/>
            </div>
        </div>

    )
}
export default DimChangePopup;
