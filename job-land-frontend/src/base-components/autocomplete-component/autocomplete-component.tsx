import React, { useState, useRef, useEffect } from 'react';
import styles from '../text-input/text-input-field.module.scss';
import globalStyles from '../../assets/global-styles/styles.module.scss'
import userStore from '../../store/user';
import jobsStore from '../../store/job';

export interface AutoCompleteProps {
	options: string[];
	type: string;
	placeHolder: string;
	value: string;
	onChange: (value: string) => void;
	size?: string;
	background?: string;
	text: string;
}

const AutoCompleteComponent: React.FC<AutoCompleteProps> = ({
																options,
																type,
																placeHolder,
																value,
																onChange,
																size,
																text,
																background,
															}) => {
	const [localVal, setLocalVal] = useState('');
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Filter options based on the current input value and reset when options change
	useEffect(() => {
		console.log('Options updated or input changed');

		if (localVal.length > 0) {
			setFilteredOptions(options.filter(option => option.toLowerCase().includes(localVal.toLowerCase())));
		} else {
			setFilteredOptions(options); // Reset to original options when input is cleared

		}
	}, [localVal, options]); // Listen for changes in both localVal and options

	// Close the dropdown if clicked outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
				dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleOptionClick = (option: string) => {
		onChange(option);
		setLocalVal('');
		setIsDropdownOpen(false);
		setFilteredOptions([]);
	};

	const typing = (val: string) => {
		setLocalVal(val);
		onChange(val);
	};

	return (
		<div className={styles.form} style={{ background }}>
			<label className={size === 'small' ? styles.small_title : styles.title} htmlFor="form3Example3">
				{text}
			</label>
			<input
				onClick={() => setIsDropdownOpen(true)}
				ref={inputRef}
				style={{ width: '100%', borderRadius: '25px' }}
				type={type}
				value={value}
				placeholder={placeHolder}
				onChange={(e) => typing(e.target.value)}
				className={size === 'small' ? styles.input_small : styles.input}
			/>

			{isDropdownOpen && (
				<div style={{width:'103%', display:'flex', position:'relative', justifyContent:'center'}}>
				<div ref={dropdownRef} style={{
					width: '100%',
					display: 'flex',
					position: 'absolute',
					flexDirection: 'column',
					gap: '10px',
					overflowX:'clip',
					overflowY:'scroll',
					minHeight:'100px',
					maxHeight: '200px',  // Adjust max height based on your design
				}}>
					{filteredOptions.length > 0 && (
						<ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'absolute', width: '100%', top: '0px' }}>
							{filteredOptions.map((option, index) => (
								<li onClick={() => handleOptionClick(option)} className={globalStyles.liSearchValues} key={index}>
									<span className={globalStyles.mainSpan}>{option}</span>
								</li>
							))}
						</ul>
					)}
				</div>
				</div>
			)}
		</div>
	);
};

export default AutoCompleteComponent;
