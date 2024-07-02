import React, { useEffect, useRef, useState } from 'react';
import { PopupProps } from "../../interfaces/popupProps";
import styles from './popup.module.scss'
import globals from '../../assets/global-styles/styles.module.scss';
import UserStore from "../../store/user";
import { useTranslation } from 'react-i18next';
const Popup = (props: PopupProps) => {
    const { t } = useTranslation();

    const dialogRef = useRef<HTMLDivElement>(null);
    return (
        <div className={styles.dialog} dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>

            <div className={props.size == 'small' ? styles.dialogContent_small : styles.dialogContent} style={{ width: props.width }} ref={dialogRef}>
                <div style={{ marginTop: '-15px', paddingTop: '10px', paddingBottom: '10px', display: 'flex', width: props.width, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', background: 'white', borderBottom: '1px solid #f1f1f1', flex: '1 1 auto', position: 'absolute' }} >
                    <span className={globals.mainSpan} style={{ fontSize: '25px', marginInlineStart: '20px', display: 'flex' }}>{t(props.popupTitle)}</span>

                    < div className={styles.closeIcon}> <i style={{ cursor: 'pointer' }} className={`fa-solid fa-x `}></i></div>

                </div>

                <div style={{ padding: '20px', marginTop: '50px' }}> {props.children}</div>
            </div>
        </div >
    );
};

export default Popup;