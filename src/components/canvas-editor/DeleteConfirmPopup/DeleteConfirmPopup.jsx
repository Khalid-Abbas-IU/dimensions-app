import Button from "../../common/Button";
import React from "react";

const DeleteConfirmPopup =({handleClick})=>{
    return (
        <div className="dimension-change-pop content-center">
            <div className="main-popup-wrapper">
                <span>Do you want to delete arrow?</span>
                <div className="pop-btns-wrapper">
                    <Button text={"NO"} onClicked={()=>handleClick("",true)} customClass="cancel-btn"/>
                    <Button text={"YES"} onClicked={handleClick}/>
                </div>
            </div>
        </div>
    )
}
export default DeleteConfirmPopup;
