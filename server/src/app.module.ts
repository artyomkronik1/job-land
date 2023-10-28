import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JobModule } from './job/job.module';
import { PostsModule } from './posts/posts.module';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://artiom:artiom@cluster0.tzbidvu.mongodb.net/artiom?retryWrites=true&w=majority',
    ),
    JobModule,
    PostsModule,
    MessageModule,
  ]})
export class AppModule {}
