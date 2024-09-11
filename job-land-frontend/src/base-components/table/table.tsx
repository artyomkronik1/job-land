import React, { useState } from 'react';
import styles from './table.module.scss'; // Import the CSS file
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

export interface TableProps {
	onClickRow: (col: string) => void;
	rows: any[];
	columns: (keyof any)[];
	rowCount: number;
	pageSize: number;
}

const Table = (tableProps: TableProps) => {
	//language

	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const totalPages = Math.ceil(tableProps.rowCount / tableProps.pageSize);
	const paginatedRows = tableProps.rows.slice((currentPage - 1) * tableProps.pageSize, currentPage * tableProps.pageSize);

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
						{tableProps.columns.map((col, index) => (
							<th key={index}>{t(String(col))}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{paginatedRows.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{tableProps.columns.map((col, colIndex) => (
								<td key={colIndex} onClick={() => tableProps.onClickRow(tableProps.rows[rowIndex])}>{t(String(row[col]))}</td>
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
		</div >
	);
};

export default Table;
