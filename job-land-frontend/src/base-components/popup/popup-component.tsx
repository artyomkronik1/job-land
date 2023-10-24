import React, {useEffect, useRef, useState} from 'react';
import {PopupProps} from "../../interfaces/popupProps";
import styles from './popup.module.scss'
const Popup = (props:PopupProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    // listening when user click outside of popup so close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                props.onClose()
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
const closeDialog=()=>{
    console.log('c')
    props.onClose()
}
    return (
        <div className={styles.dialog}>
            <div className={styles.dialogContent}  ref={dialogRef}>
                <div style={{display:'flex', justifyContent:'end', flex:'1 1 auto'}} >< div  onClick={closeDialog} className={styles.closeIcon}> <i   className={`fa-solid fa-x `}></i></div></div>
                <div style={{padding:'20px', marginTop:'-60px'}}> {props.children}</div>
            </div>
        </div>
    );
};

export default Popup;