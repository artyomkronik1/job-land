import React, { useEffect, useRef, useState } from 'react';
import { PopupProps } from "../../interfaces/popupProps";
import globalStyles from '../../assets/global-styles/styles.module.scss'
import Popup from "../popup/popup-component";
import { useTranslation } from "react-i18next";
import { warningProps } from "../../interfaces/warningProps";
const WarningPopup = (props: warningProps) => {
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const closeWarninDialog = () => {
        props.onClose()
    }
    if (!props.isOpen) return null;
    return (
        <div >
            <Popup popupTitle='' width='50vh' size={'small'} onClose={closeWarninDialog}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '30vh', justifyContent: 'center' }}>
                    {/*header*/}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <span style={{ fontSize: '35px' }} className={globalStyles.mainSpan}>{t('Warning')}</span>
                    </div>
                    {/*    body*/}
                    <div style={{ padding: '20px' }}>
                        <span style={{ fontSize: '19px' }} className={globalStyles.mainSpan}>{t(props.warningText)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}> <div className={globalStyles.separate_line_grey}></div>  </div>
                    {/*footer*/}
                    <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                        <button style={{ width: '100%' }} onClick={props.onConfirm} className={globalStyles.btn}>{t('Confirm')}</button>
                        <button onClick={props.onCancel} style={{ width: '100%' }} className={globalStyles.btn_border}>{t('Cancel')}</button>
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default WarningPopup;