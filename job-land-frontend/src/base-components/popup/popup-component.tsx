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

    if (!props.isOpen) return null;

    return (
        <div className={styles.dialog}>
            <div className={styles.dialogContent}  ref={dialogRef}>
                {props.children}
                <button onClick={props.onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;