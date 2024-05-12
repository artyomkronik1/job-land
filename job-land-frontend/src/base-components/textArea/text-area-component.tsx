import React, { useState } from 'react';
import styles from './textarea.module.scss'
import sendImage from '../../../src/assets/images/send.svg';

const TextAreaComponent = ({textPlaceHolder, onSendClick, onChange }:any)=> {
    return(
        <div className={styles.textAreaContainer}>
        <textarea placeholder={textPlaceHolder} onChange={event => onChange(event)} className={styles.textArea} rows={4} cols={5} maxLength={250}></textarea>
            <img src={sendImage} alt="Send" className={styles.sendImage} onClick={onSendClick}/>
        </div>
    )
}
export default TextAreaComponent