import React, { useState } from 'react';
import styles from './textarea.module.scss'
import sendImage from '../../../src/assets/images/send.svg';

const TextAreaComponent = ({value, textPlaceHolder, onSendClick, onChange, color }:any)=> {
    const handleKeyDown = (event:any) => {
        // Check if the pressed key is Enter (key code 13)
        if (event.keyCode === 13) {
            // Prevent the default behavior of the Enter key in textarea
            event.preventDefault();
            // Trigger the click event on the button
            onSendClick();
        }
    };
    return(
        <div className={styles.textAreaContainer} style={{background: color=='grey'? '#f4f2ee' : 'white'}}   >
        <textarea   style={{background: color=='grey'? '#f4f2ee' : 'white'}}              onKeyDown={handleKeyDown} placeholder={textPlaceHolder} value={value} onChange={event => onChange(event)} className={styles.textArea} rows={4} cols={5} maxLength={250}></textarea>
           <button style={{border:"none", background: color=='grey'? '#f4f2ee' : 'white'}} onClick={onSendClick}>
            <img src={sendImage} alt="Send" className={styles.sendImage} />
           </button>
        </div>
    )
}
export default TextAreaComponent