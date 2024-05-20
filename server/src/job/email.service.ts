import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;


    constructor() {
        // Initialize Nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host:'mail.openjavascript.info',
            port:465,
            secure:true,
            auth: {
                user: 'test@openjavascript.info', // Your Gmail address
                pass: 'NodeMailer123!', // Your Gmail password or App password
            },
        });

    }

    async sendEmail(to: string, subject: string, text: string) {

        try {
            // Send email
            await this.transporter.sendMail( {
                from: 'OpenJavaScript <test@openjavascript.info',
                to: to,
                subject: subject,
                text: text
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
