import React from "react";
import "./SideZooms.css"
import leftArrowHead from "../../../assets/arrow-102-48.png"
const SideZooms =({zoomBySideBtn})=>{
    return (
        <>
         <div className="side-zooms left-side-zoom-btn content-center" onClick={()=>zoomBySideBtn("","left")}>
             <img src={leftArrowHead} width="30" height="30" alt="left-side-arrow"/>
         </div>
         <div className="side-zooms right-side-zoom-btn content-center" onClick={()=>zoomBySideBtn("","right")}>
             <img src={leftArrowHead} width="30" height="30" alt="left-side-arrow"/>
         </div>
         <div className="side-zooms top-side-zoom-btn content-center" onClick={()=>zoomBySideBtn("","top")}>
             <img src={leftArrowHead} width="30" height="30" alt="left-side-arrow"/>
         </div>
         <div className="side-zooms bottom-side-zoom-btn content-center" onClick={()=>zoomBySideBtn("","bottom")}>
             <img src={leftArrowHead} width="30" height="30" alt="left-side-arrow"/>
         </div>
        </>

    )
}
export default SideZooms;
