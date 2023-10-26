import React, {useEffect, useRef, useState} from 'react';
import styles from './profile-image.module.scss'
export interface profileProps{
    name:string
}
const ProfileImage = (props:profileProps)=> {
   const getColorByLetter = (letter: string)=> {
        const colorOptions = [
            { letters: ['A', 'B', 'C'], color: '#FF5733' },
            { letters: ['D', 'E', 'F'], color: '#33FF57' },
            { letters: ['G', 'H', 'I'], color: '#5733FF' },
            { letters: ['J', 'K', 'L'], color: '#229bdc' },
            { letters: ['M', 'N', 'O'], color: '#dcd922' },
            { letters: ['P', 'Q', 'R'], color: '#f87e96' },
            { letters: ['S', 'T', 'U'], color: '#7ef8c5' },
            { letters: ['V', 'W'], color: '#9355f5' },
            { letters: ['Y', 'Z'], color: '#a81616' },
            // Define more color options for other letters
        ];
        const selectedOption = colorOptions.find(option => option.letters.includes(letter.toUpperCase()));
        return selectedOption ? selectedOption.color : '#808080'; // Default color
    }
    const getbackgroundColor = () =>{
        console.log(props)
        if(props) {
            let first_name = ""
            const spaceIndex = props?.name?.indexOf(" "); // Find the index of the space
            if (spaceIndex != -1) {
                first_name = props?.name?.substring(0, spaceIndex);
                return getColorByLetter(first_name[0]);
            } else  {
                return getColorByLetter(props?.name[0]);
            }
        }
    }

    const initials= ():string=> {
        const spaceIndex = props.name.indexOf(" "); // Find the index of the space
        if (spaceIndex != -1) {
            const first_name = props.name.substring(0, spaceIndex);
            const last_name = props.name.substring(spaceIndex + 1);
            return first_name[0] + last_name[0];
        }
        else{
            return props.name[0]
        }
    }
    return(
      <div className={styles.profileForm} style={{backgroundColor:`${getbackgroundColor()}`}} >
          <span style={{display:'flex', justifyContent:"center", alignItems:'center', fontWeight:'bold', fontSize:'25px'}}>{ initials() }</span>
      </div>
    )
}
export default ProfileImage