import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from "./company.service";
import { Message } from "../message/message.model";
@Controller('companies')
export class CompanyController {
    constructor(private companyService: CompanyService) { }
    // get
    @Get()
    async getAllCompanies() {
        return this.companyService.getAll();

    }


    @Post('')
    async postNewJob(@Body() company: any) {
        return this.companyService.addNewCompany(company)
    }

}
