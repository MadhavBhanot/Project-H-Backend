const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Job = require('../models/Job')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

async function createUsers(count = 1000) {
    let users = []
    for (let i = 0; i < count; i++) {
        const _id = faker.database.mongodbObjectId()
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const name = firstName + " " + lastName
        const username = faker.internet.userName({ firstName, lastName })
        const email = faker.internet.email()
        const password = await bcrypt.hash('12345678', 1)
        const phoneNumber = faker.phone.number().toString()
        const isVerified = faker.datatype.boolean()
        const data = {
            _id,
            name,
            username,
            email,
            phoneNumber,
            password,
            isVerified
        }
        users.push(data)
    }
    return await User.insertMany(users)
}

async function createJobs() {
    let jobs = []
    let verifiedUsers = await User.find({ isVerified: true });
    for (const user of verifiedUsers) {
        for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
            const _id = faker.database.mongodbObjectId()
            const postedBy = user._id
            const description = faker.word.words({ count: { min: 15, max: 40 } })
            const minReq = faker.word.words({ count: { min: 10, max: 20 } })
            const category = faker.helpers.arrayElement(['Technology', 'Finance', 'Education', 'Healthcare'])
            const imageurl = faker.image.url()
            const data = {
                _id,
                postedBy,
                description,
                minReq,
                category,
                imageurl
            }
            jobs.push(data)
        }
    }
    return await Job.insertMany(jobs)
}

async function userApplyingToJob() {
    let nonVerifiedUsers = await User.find({ isVerified: false });
    let jobs = await Job.find()
    for (const user of nonVerifiedUsers) {
        for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
            let job = faker.helpers.arrayElement(jobs)
            user.appliedJobs.push(job._id)
            job.applicants.push(user._id)
            await user.save()
            await job.save()
        }
    }
}

async function createPosts() {
    let posts = []
    let users = await User.find();
    for (const user of users) {
        for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
            const _id = faker.database.mongodbObjectId()
            const image = faker.image.url()
            const caption = faker.word.words({ count: { min: 3, max: 15 } })
            const author = user._id
            const data = {
                _id,
                image,
                caption,
                author,
            }
            posts.push(data)
        }
    }
    return await Post.insertMany(posts)
}

async function createComments() {
    let comments = []
    let users = await User.find();
    let posts = await Post.find();
    for (const user of users) {
        for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
            const _id = faker.database.mongodbObjectId()
            const content = faker.word.words({ count: { min: 3, max: 30 } })
            const authorId = user._id
            const postId = faker.helpers.arrayElement(posts)._id
            const data = {
                _id,
                content,
                authorId,
                postId,
            }
            comments.push(data)
            let post = await Post.findById(postId);
            post.comments.push(_id)
            await post.save();
        }
    }
    return await Comment.insertMany(comments)
}

async function createLikes() {
    let users = await User.find();
    let posts = await Post.find();
    for (const user of users) {
        for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
            const postId = faker.helpers.arrayElement(posts)._id
            let post = await Post.findById(postId)
            post.likes.push(user._id)
            await post.save()
            user.likedPosts.push(postId)
            await user.save()
        }
    }
}

async function createReplies() {
    let replies = []
    let users = await User.find();
    let posts = await Post.find();
    let comments = await Comment.find();
    for (const user of users) {
        for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
            const _id = faker.database.mongodbObjectId()
            const content = faker.word.words({ count: { min: 3, max: 30 } })
            const authorId = user._id
            const postId = faker.helpers.arrayElement(posts)._id
            const parentComment = faker.helpers.arrayElement(comments)._id
            const data = {
                _id,
                content,
                authorId,
                postId,
                parentComment
            }
            replies.push(data)
            let post = await Post.findById(postId);
            post.comments.push(_id)
            await post.save();
            let comment = await Comment.findById(parentComment);
            comment.replies.push(_id)
            await comment.save();
        }
    }
    return await Comment.insertMany(replies)
}

module.exports = {
    createUsers,
    createJobs,
    userApplyingToJob,
    createPosts,
    createComments,
    createLikes,
    createReplies
}