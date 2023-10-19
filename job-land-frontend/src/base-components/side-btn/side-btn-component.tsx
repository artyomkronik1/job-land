import React, { useState } from 'react';
import styles from './side-btn.module.scss'
interface GreyBtnProps {
    iconType: string;
    btnName:string;
    onClick:()=>void;
}
const GreyBtn: React.FC<GreyBtnProps>  = ({iconType, btnName, onClick})=> {
    const [active, setactive] = useState(false);
    console.log(active)
    const click=()=>{
        setactive(!active)
        onClick()
    }
    return(
        <div className={`${styles.form}`} onClick={click}>
                <i className={`${iconType} ${styles.btn}`} ></i>
                <span className={styles.btn}> {btnName}</span>
        </div>
    )
}
export default GreyBtn