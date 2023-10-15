import React, { useState } from 'react';
import styles from './grey-btn.module.scss'
interface GreyBtnProps {
    faType: string;
}
const GreyBtn: React.FC<GreyBtnProps>  = ({faType})=> {
    return(
        <>
        <i className={`${faType} ${styles.btn}`} ></i>
        </>
    )
}
export default GreyBtn