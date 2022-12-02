import React, {useState} from "react";
import "./style.css"

const dimensions = ["in","cm","mm","ft"]
const DimDropDown =({selectedOption = "Dropdown",onSelectOption,showDropDownList, setShowDropDownList})=>{
    const [dimensionsList] = useState([...dimensions])
    const toggleDropDown=()=>{
        setShowDropDownList(!showDropDownList)
    }
    return <div className="dropdown-wrapper">
        <button className="dropbtn content-center" onClick={toggleDropDown}>{selectedOption}</button>
        <div className="dropdown-content">
        {
            showDropDownList && dimensionsList.map(dim => <span onClick={()=>onSelectOption(dim)}>{dim}</span>)
        }
        </div>

    </div>
}
export default DimDropDown;
