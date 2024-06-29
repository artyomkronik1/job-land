import React, { useEffect, useRef, useState } from 'react';
import styles from './profile-image.module.scss'
import { User } from '../../interfaces/user';
export interface profileProps {
    size?: string;
    user: User;
}
const ProfileImage = (props: profileProps) => {
    const getColorByLetter = (letter: string) => {
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
        const selectedOption = colorOptions.find(option => option.letters.includes(letter?.toUpperCase()));
        return selectedOption ? selectedOption.color : '#808080'; // Default color
    }
    const getbackgroundColor = () => {
        if (props) {
            let first_name = ""
            const spaceIndex = props.user.name?.indexOf(" "); // Find the index of the space
            if (spaceIndex != -1) {
                first_name = props.user.name?.substring(0, spaceIndex);
                return getColorByLetter(first_name[0]);
            } else {
                return getColorByLetter(props.user.name[0]);
            }
        }
    }

    const initials = (): string => {
        const spaceIndex = props.user.name.indexOf(" "); // Find the index of the space
        if (spaceIndex != -1) {
            const first_name = props.user.name.substring(0, spaceIndex);
            const last_name = props.user.name.substring(spaceIndex + 1);
            return first_name[0] + last_name[0];
        }
        else {
            return props.user.name[0]
        }
    }
    return (
        <>
            {!props.user.profilePicture || props.user.profilePicture.length == 0 ? (
                <div className={styles.profileForm} style={{ backgroundColor: `${getbackgroundColor()}`, minWidth: props.size == 'big' ? '170px' : '50px', height: props.size == 'big' ? '170px' : '50px' }} >
                    <span style={{ display: 'flex', justifyContent: "center", alignItems: 'center', fontWeight: 'bold', fontSize: props.size == 'big' ? '70px' : '25px' }}>{initials()}</span>
                </div>
            ) :

                <img src={props.user.profilePicture} style={{ width: props.size == 'big' ? '150px' : '50px', height: props.size == 'big' ? '150px' : '50px', borderRadius: '50%' }} />

            }
        </>

    )
}
export default ProfileImage