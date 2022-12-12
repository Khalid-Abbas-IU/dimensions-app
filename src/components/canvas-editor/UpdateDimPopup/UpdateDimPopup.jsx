import Input from "../../common/Input";
import DimDropDown from "../DimensionDropDown/DimDropDown";
import React from "react";
import ColorsPanel from "../colorsPanel";
const UpdateDimPopup =({isDimPop, dimensionInputText,handleChangeColor,handleChangeDimension,selectedDimension,changeDimensionSymbol,showDropDownList,setShowDropDownList})=> {
    return (
        <div className="update-properties-popup">
        <div className="dim-change">
            {
                isDimPop ? <>
                    <div className="dim-box">
                        <span>Mesure</span>
                        <div className="popup-inner-wrapper content-center">
                            <Input value={dimensionInputText} onChange={handleChangeDimension}/>
                            <DimDropDown selectedOption={selectedDimension} onSelectOption={changeDimensionSymbol}
                                         showDropDownList={showDropDownList} setShowDropDownList={setShowDropDownList}/>
                        </div>
                    </div>
                    <div className="dim-box">
                        <span>Taille</span>
                        <div className="popup-inner-wrapper content-center">
                            <div className="dim-update-range">
                                <input type="range" min="0" max="100"/>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="dim-box">
                        <span>Épaisseur</span>
                        <div className="popup-inner-wrapper content-center">
                            <div className="dim-update-range">
                                <input type="range" min="0" max="100"/>
                            </div>
                        </div>
                    </div>
                    <div className="dim-box">
                        <span>Couleur</span>
                        <div className="popup-inner-wrapper content-center">
                            <ColorsPanel handleChangeColor={handleChangeColor}/>
                        </div>
                    </div>
                </>
            }
        </div>
        </div>
    )
}
export default UpdateDimPopup;