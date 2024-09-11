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
	const [localVal, setLocalVal] = useState('')
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Filter options based on the current input value
	useEffect(() => {
		console.log(localVal.length);

		if (localVal.length > 0) {
			setFilteredOptions(options.filter(option => option.toLowerCase().includes(localVal.toLowerCase())));

			setIsDropdownOpen(true);
		}
		else if (localVal.length == 0) {
			setFilteredOptions(jobsStore.companies.map(company => company.name));
			//setIsDropdownOpen(true);

		}

	}, [localVal, options]);

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
		setLocalVal('')
		setIsDropdownOpen(false);
		setFilteredOptions([]);
	};
	const typing = (val: string) => {
		setLocalVal(val)
		onChange(val)
	}
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
				<div ref={dropdownRef} style={{ width: '100%', display: 'flex', position: 'relative', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}
				>

					{localVal.length > 0 ? (
						<ul style={{
							display: 'flex', flexDirection: 'column', gap: '20px', position: 'absolute', width: '100%', top: '0px'
						}}>
							{filteredOptions.map((option, index) => (
								<li onClick={() => handleOptionClick(option)} className={globalStyles.liSearchValues} key={index}><span className={globalStyles.mainSpan}>{option}</span></li>

							)
							)}
						</ul>
					) :
						<ul style={{
							display: 'flex', flexDirection: 'column', gap: '20px', position: 'absolute', width: '100%', top: '0px'
						}}>
							{filteredOptions.map((option, index) => (
								<li onClick={() => handleOptionClick(option)} className={globalStyles.liSearchValues} key={index}><span className={globalStyles.mainSpan}>{option}</span></li>

							)
							)}
						</ul>
					}

				</div>
			)}



			{/* {isDropdownOpen && localVal && filteredOptions.length > 0 && (
				<div
					ref={dropdownRef}
					className={styles.dropdown}
					style={{ width: '100%', display: 'flex', position: 'relative', justifyContent: 'center', marginInlineStart: '20px', flexDirection: 'column', gap: '10px' }}
				>
					{filteredOptions.map((option, index) => (
						<div style={{ display: 'flex', background: '#dcdcdc', overflow: 'scroll', justifyContent: 'start', paddingInlineStart: '10px', maxHeight: '100px', alignItems: 'center', top: '-5px', position: 'absolute', width: '100%' }}
						>
							<span
								key={index}
								className={styles.dropdownItem}
								onClick={() => handleOptionClick(option)}
							>
								{option}
							</span>
						</div>
					))}
				</div>
			)} */}
		</div>
	);
};

export default AutoCompleteComponent;
