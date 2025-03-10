import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { comment, Post } from "./post.model";

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) { }
    public async removeCommentOnPost(postId: string, comment: comment): Promise<{ success: boolean; post: Post }> {
        try {
            const post = await this.postModel.findById(postId);

            if (!post) {
                throw new Error('Post not found');
            }

            post.comments = post.comments.filter((c) => c.id.toString() !== comment.id);

            await post.save();


            return {
                success: true,
                post: post,
            };
        } catch (error) {
            throw new Error(`Failed to remove comment: ${error.message}`);
        }
    }

    public async updateCommentOnPost(postId: string, updatedComment: comment): Promise<{ success: boolean; post: Post }> {
        try {
            const updatedPost = await this.postModel.findByIdAndUpdate(
                postId,
                { $set: { "comments.$[elem].text": updatedComment.text } },
                { new: true, arrayFilters: [{ "elem.id": updatedComment.id }] }
            );

            if (!updatedPost) {
                throw new Error('Post not found');
            }

            return {
                success: true,
                post: updatedPost,
            };
        } catch (error) {
            throw new Error(`Failed to update comment: ${error.message}`);
        }
    }

    public async addComment(postId: string, comment: comment) {
        try {
            const post = await this.postModel.findById(postId);

            if (!post) {
                throw new Error('Post not found');
            }

            post.comments.push(comment);
            await post.save();

            return {
                success: true,
                post: post
            };
        } catch (error) {
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }


    public async likePost(postId: string, like: boolean, userId: string) {
        try {
            // Find the post by its ID
            let post = await this.postModel.findById(postId);

            if (!post) {
                // Handle the case where the post with the given ID is not found
                return { success: false, errorCode: 'post_not_found' };
            }

            // Check if the user's ID is already in the likedBy array
            const index = post.likedBy.indexOf(userId);

            if (!like && index === -1) {
                // Add user to likedBy array if not already liked
                post.likedBy.push(userId);
            } else if (like && index !== -1) {
                // Remove user from likedBy array if already liked
                post.likedBy.splice(index, 1);
            } else {
                // No change needed (like=true and already liked, or like=false and not liked)
                return { success: true, post };
            }

            // Save the updated post document
            await post.save();

            return { success: true, post };
        } catch (error) {
            // Handle any errors that occur during database operations
            console.error('Error in likePost:', error);
            return { success: false, errorCode: 'database_error' };
        }
    }


    public async getPostByUserName(name: string) {
        const posts = await this.postModel.find({ writer_name: name }).exec();
        if (posts.length > 0) {
            return {
                success: true,
                posts: posts,
            }
        } else {
            return {
                success: false,
                errorCode: "fail_to_find_posts"
            }
        }
    }
    public async getPostByUserId(data: any) {
        const posts = await this.postModel.find({ employee_id: data.id.toString() }).exec();
        if (posts.length > 0) {
            return {
                success: true,
                posts: posts,
            }
        } else {
            return {
                success: false,
                errorCode: "fail_to_find_posts"
            }
        }
    }

    public async removePost(post: any) {
        try {
            // Find and delete the notification by its ID
            const result = await this.postModel.findByIdAndDelete(post.post._id.toString());

            if (!result) {
                throw new Error('post was not found');
            }

            return {
                success: true,
                message: 'post removed successfully',
            };
        } catch (error) {
            // Handle errors and throw a descriptive message
            throw new Error(`Failed to remove post: ${error.message}`);
        }
    }


    public async editPost(post: any) {

        let p = await this.postModel.findById(post.post._id.toString());
        if (!p) {
            // Handle the case where the user with the given ID is not found
            return { success: false, errorCode: 'fail_to_find_post', };
        } else {
            p.title = post.post.title
            p.description = post.post.description
            p.picture = post.post.picture

            await p.save()
            return { success: true, post: p }
        }
    }
    public async postNewPost(post: any) {
        const newPost = new this.postModel({
            writer_name: post.writer_name,
            title: post.title,
            description: post.description,
            employee_id: post.employee_id,
            picture: post.postPicture
        });
        const result = await newPost.save();
        if (result) {
            return {
                success: true,
                post: {
                    id: newPost.id,
                    writer_name: newPost.writer_name,
                    title: newPost.title,
                    description: newPost.description,
                    employee_id: newPost.employee_id,
                    picture: post.postPicture

                },
            };
        } else {
            return {
                success: false,
                errorCode: 'fail_to_post',
            };
        }
    }
    public async getAllPosts() {
        const posts: Post[] = await this.postModel.find().exec();
        if (posts.length > 0) {
            return {
                success: true,
                posts: posts,
            }
        } else {
            return {
                success: false,
                errorCode: "fail_to_find_posts"
            }
        }
    }
}
