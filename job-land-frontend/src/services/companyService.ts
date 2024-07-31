// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import { Job } from "../interfaces/job";
import { Company } from '../interfaces/company';


const BASE_URL: string = 'http://localhost:3002';

const CompanyService = {

	async addNewCompany(company: Company) {
		try {
			const result = await axios.post(`${BASE_URL}/companies`, company);
			if (result.data.success) {
				return result.data;
			} else {
				return result.data;
			}
		} catch (error) {
			console.error('Error post new company:', error);
		}
	},
	async getAllCompanies() {
		try {
			const result = await axios.get(`${BASE_URL}/companies`);
			if (result.data.success) {
				return result;
			} else {
				return result.data;
			}
		} catch (error) {
			console.error('Error get all companies:', error);
		}
	}


}


export default CompanyService;
