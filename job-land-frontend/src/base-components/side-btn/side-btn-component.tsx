import React, { useState } from 'react';
import styles from './side-btn.module.scss'
interface GreyBtnProps {
    iconType: string;
    btnName:string;
}
const GreyBtn: React.FC<GreyBtnProps>  = ({iconType, btnName})=> {
    return(
        <div className={styles.form}>
                <i className={`${iconType} ${styles.btn}`} ></i>
                <span className={styles.btn}> {btnName}</span>
        </div>
    )
}
export default GreyBtn