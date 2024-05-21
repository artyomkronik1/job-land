import React, { useState } from 'react';
import {TextInputFieldProps} from "../../interfaces/TextInputField";
import styles from './text-input-field.module.scss'

 const TextInputField = (props:TextInputFieldProps)=> {
    return(
        <div className={styles.form}>

            <label className={props.size=='small' ? styles.small_title : styles.title} htmlFor="form3Example3">
                {props.text}
            </label>
            <input
                type={props.type}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                id="form3Example3"
                className={props.size=='small'? styles.input_small: styles.input}
                
            />
        </div>
    )
}
export default TextInputField