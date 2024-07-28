import React, { useState } from 'react';
import styles from './table.module.scss'; // Import the CSS file
import { useTranslation } from 'react-i18next';

interface TableProps<T> {
	rows: T[];
	columns: (keyof T)[];
	rowCount: number;
	pageSize: number;
}

const Table = <T extends object>({ rows, columns, rowCount, pageSize }: TableProps<T>) => {
	//language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const totalPages = Math.ceil(rowCount / pageSize);
	const paginatedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<div className={styles.tableContainer}>
			<table>
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th key={index}>{t(String(col))}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{paginatedRows.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((col, colIndex) => (
								<td key={colIndex}>{t(String(row[col]))}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className={styles.pagination}>
				<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
					Previous
				</button>
				<span>Page {currentPage} of {totalPages}</span>
				<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		</div>
	);
};

export default Table;
