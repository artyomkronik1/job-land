import React, { useState } from 'react';
import {TextInputFieldProps} from "../../interfaces/TextInputField";
import styles from './text-input-field.module.scss'

 const TextInputField = (props:TextInputFieldProps)=> {
    return(
        <div className={styles.form}>
            <label className={styles.title} htmlFor="form3Example3">
                {props.text}
            </label>
            <input
                type={props.type}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                id="form3Example3"
                className={styles.input}
                
            />
        </div>
    )
}
export default TextInputField