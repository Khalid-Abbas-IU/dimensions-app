import React from "react";

const Button =({text,onClicked,customClass=""})=>{
    return <div className="btn-wrapper">
        <button className={`customBtn ${customClass}`} onClick={onClicked}>{text}</button>
    </div>
}
export default Button;
