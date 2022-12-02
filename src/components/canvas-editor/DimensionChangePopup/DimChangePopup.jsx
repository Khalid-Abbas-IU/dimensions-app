import Input from "../../common/Input";
import DimDropDown from "../DimensionDropDown/DimDropDown";
import Button from "../../common/Button";
import React from "react";

const DimChangePopup =({dimensionInputText,handleChangeDimension,selectedDimension,changeDimensionSymbol,updateDimensionText,showDropDownList,setShowDropDownList})=>{
    return (
        <div className="dimension-change-pop content-center">
            <div className="main-popup-wrapper">
                <span>CHANGE DIMENSION</span>
                <div className="popup-inner-wrapper">
                    <Input value={dimensionInputText} onChange={handleChangeDimension}/>
                    <DimDropDown selectedOption={selectedDimension} onSelectOption={changeDimensionSymbol} showDropDownList={showDropDownList} setShowDropDownList={setShowDropDownList}/>
                </div>
                <div className="pop-btns-wrapper">
                    <Button text={"CANCEL"} onClicked={()=>updateDimensionText("",true)} customClass="cancel-btn"/>
                    <Button text={"ADD"} onClicked={updateDimensionText}/>

                </div>
            </div>
        </div>
    )
}
export default DimChangePopup;
