import React, {useEffect, useRef, useState} from 'react';
import {PopupProps} from "../../interfaces/popupProps";
import globalStyles from '../../assets/global-styles/styles.module.scss'
import Popup from "../popup/popup-component";
import {useTranslation} from "react-i18next";
import {warningProps} from "../../interfaces/warningProps";
const WarningPopup = (props:warningProps) => {
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const closeWarninDialog = ()=>{
        props.onClose()
    }
    if (!props.isOpen) return null;
    return (
        <div >
    <Popup  onClose={closeWarninDialog}>
        <div style={{display:'flex', flexDirection:'column', gap:'10px', padding:'20px'}}>
            {/*header*/}
            <div style={{display:'flex'}}>
                <span style={{fontSize:'25px'}} className={globalStyles.mainGreySpan}>{t('Are you sure')}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}> <div className={globalStyles.separate_line_grey}></div>  </div>
        {/*    body*/}
            <div>
                <span style={{fontSize:'19px'}} className={globalStyles.mainGreySpan}>{t('Changes will be dismissed')}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}> <div className={globalStyles.separate_line_grey}></div>  </div>
        {/*footer*/}
        <div style={{display:'flex', justifyContent:'space-around' }}>
            <button onClick={props.onConfirm} className={globalStyles.btn}>t{'Confirm'}</button>
            <button onClick={props.onCancel} className={globalStyles.btn}>t{'Cancel'}</button>
        </div>
        </div>
    </Popup>
        </div>
    );
};

export default WarningPopup;