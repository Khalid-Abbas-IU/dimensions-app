import React from "react";

const Button =({text,onClicked,customClass=""})=>{
    return <div title={text === "-" ? "zoom out" : "zoom in"} className="btn-wrapper">
        <button className={`customBtn ${customClass}`} onClick={onClicked}>{text}</button>
    </div>
}
export default Button;
