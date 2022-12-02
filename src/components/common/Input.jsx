import React from "react";

const Input =({value,onChange})=>{
    return <div className="dim-input-wrapper">
        <input className="inputDimension" type="text" value={value} onChange={onChange}/>
    </div>
}
export default Input;
