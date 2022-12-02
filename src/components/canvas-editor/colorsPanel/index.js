import React from "react";

function ColorsPanel ({colors=[],handleChangeColor}){
    return <div className="colors-container flex-Col justify-evenly items-center mt-10">
        {colors.map((color,i) => <div className="color-box" onClick={()=>handleChangeColor(color)} style={{backgroundColor:color}}/>)}
    </div>
}

export default ColorsPanel;
