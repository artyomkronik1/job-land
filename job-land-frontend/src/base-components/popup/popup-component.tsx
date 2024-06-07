import React, {useEffect, useRef, useState} from 'react';
import {PopupProps} from "../../interfaces/popupProps";
import styles from './popup.module.scss'
import UserStore from "../../store/user";
const Popup = (props:PopupProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    return (
        <div className={styles.dialog} dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
            <div className={props.size=='small'?styles.dialogContent_small: styles.dialogContent}  ref={dialogRef}>
                <div style={{display:'flex', justifyContent:'end', flex:'1 1 auto'}} >< div className={styles.closeIcon}> <i   className={`fa-solid fa-x `}></i></div></div>
                <div style={{padding:'20px', marginTop:'-60px'}}> {props.children}</div>
            </div>
        </div>
    );
};

export default Popup;