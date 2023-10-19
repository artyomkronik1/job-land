import React, { useState } from 'react';
import styles from './dropdown.module.scss'
import {DropdownProps} from "../../interfaces/DropdownProps";
import JobFilterBtn from "../job-filter-btn/job-filter-btn";

const DropDown = (props:DropdownProps)=> {
    const [openDrop, setopenDrop] = useState(false);
    const [value, setvalue] = useState('');

    const dropDownOptions=    props.options.map((value, index)=>(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <li  key={index} onClick={()=>props.changeDropValue(value)} className={styles.dropdownOption}>{value}</li>
        </div>
    ))
    return(
        <div>
            <i onClick={()=>setopenDrop(!openDrop)} style={{color: '#a9acb1', 'fontSize':'15px'}} className={`fa fa-caret-${openDrop ? 'up' : 'down'}`}   ></i>
            {openDrop && (
                <ul className={styles.dropdown}>
                    {dropDownOptions}
                </ul>
            )}
        </div>
    )
}
export default DropDown