import React from "react";
const colors=[
    {name:"Red"	, hex:"#FF0000", rgb:"rgb(255, 0, 0)"},
    {name:"Yellow"	, hex:"#FFFF00", rgb:"rgb(255, 255, 0)"},
    {name:"Green"	, hex:"#008000", rgb:"rgb(0, 128, 0)"},
    {name:"Blue"	, hex:"#0000FF", rgb:"rgb(0, 0, 255)"},
    {name:"Black"	, hex:"#000000", rgb:"rgb(0, 0, 0)"},
    {name:"White" , hex:"#FFFFFF", rgb:"rgb(255, 255, 255)"},
    // {name:"Silver"	, hex:"#C0C0C0", rgb:"rgb(192, 192, 192)"},
    // {name:"Gray"	, hex:"#808080", rgb:"rgb(128, 128, 128)"},
    // {name:"Black"	, hex:"#000000", rgb:"rgb(0, 0, 0)"},
    // {name:"Maroon"	, hex:"#800000", rgb:"rgb(128, 0, 0)"},
    // {name:"Olive"	, hex:"#808000", rgb:"rgb(128, 128, 0)"},
    // {name:"Lime"	, hex:"#00FF00", rgb:"rgb(0, 255, 0)"},
    // {name:"Green"	, hex:"#008000", rgb:"rgb(0, 128, 0)"},
    // {name:"Aqua"	, hex:"#00FFFF", rgb:"rgb(0, 255, 255)"},
    // {name:"Teal"	, hex:"#008080", rgb:"rgb(0, 128, 128)"},
    //
    // {name:"Navy"	, hex:"#000080", rgb:"rgb(0, 0, 128)"},
    // {name:"Fuchsia"	, hex:"#FF00FF", rgb:"rgb(255, 0, 255)"},
    // {name:"Purple"	, hex:"#800080", rgb: "rgb(128, 0, 128)"}
]
function ColorsPanel ({handleChangeColor}){
    return <div className="colors-container">
        {colors.map((color,i) => <div key={i} className="color-box" onClick={()=>handleChangeColor(color.hex)} style={{backgroundColor:color.hex}}/>)}
    </div>
}

export default ColorsPanel;
