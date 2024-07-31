import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company } from "./company.model";
import { Post } from "../posts/post.model";
import { Message } from "../message/message.model";

@Injectable()
export class CompanyService {
    constructor(@InjectModel('Company') private readonly companyModel: Model<Company>) { }

    async addNewCompany(company: any) {


        const newCompany = new this.companyModel({
            name: company.name,
            location: company.location,
            about: company.about,
            jobs: company.jobs,
            workers: company.workers,
            profilePicture: company.profilePicture,
            backgroundPicture: company.backgroundPicture
        });
        const result = await newCompany.save();
        if (result) {
            return {
                success: true,
                job: {

                    id: newCompany.id,
                    name: newCompany.name,
                    location: newCompany.location,
                    about: newCompany.about,
                    jobs: newCompany.jobs,
                    workers: newCompany.workers,
                    profilePicture: newCompany.profilePicture,
                    backgroundPicture: newCompany.backgroundPicture
                },
            };
        } else {
            return {
                success: false,
                errorCode: 'fail_to_post_company',
            };
        }
    }


    async getAll() {
        const compnies: Company[] = await this.companyModel.find().exec();
        if (compnies.length > 0) {
            return {
                success: true,
                compnies: compnies,
            }
        } else {
            return {
                success: false,
                errorCode: "fail_to_find_compnies"
            }
        }
    }

}
