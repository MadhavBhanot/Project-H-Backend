// const Comment = require('../../models/Comment')
// const User = require('../../models/User')

// <<<<<<< pr-branch
// async function replyToComment(req, res) {
//     try {
//         // Find the parent comment
//         let parentComment = await Comment.findById(req.params.id)
//         if (!parentComment) {
//             return res.status(404).json({ message: "Parent Comment Not Found" })
//         }

//         // Get the user from Clerk ID
//         const user = await User.findOne({ clerkId: req.userId })
//         if (!user) {
//             return res.status(404).json({ message: "User Not Found" })
//         }

//         // Create a new comment as a reply
//         const replyComment = new Comment({
//             content: req.body.content,
//             authorId: user._id,
//             postId: parentComment.postId, // Use the same post ID as parent comment
//             parentComment: parentComment._id // Reference to parent comment
//         });

//         // Save the reply comment
//         await replyComment.save();

//         // Add the reply's ID to parent comment's replies array
//         parentComment.replies.push(replyComment._id);
//         await parentComment.save();

//         // Populate the reply with author details
//         await replyComment.populate({
//             path: 'authorId',
//             select: 'username profileImg clerkId'
//         });

//         return res.status(200).json({ 
//             message: "Comment Reply Added Successfully", 
//             reply: {
//                 _id: replyComment._id,
//                 content: replyComment.content,
//                 createdAt: replyComment.createdAt,
//                 author: {
//                     _id: replyComment.authorId._id,
//                     username: replyComment.authorId.username,
//                     imageUrl: replyComment.authorId.profileImg
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error adding reply:', error);
//         return res.status(500).json({ message: "Error adding reply" });
//     }
// =======
// // Reply to a comment
// const replyToComment = async (req, res) => {
//   const { id } = req.params
//   const { content } = req.body
//   if (!content) {
//     return res.status(400).json({ message: 'Please enter a comment' })
//   }
//   const comment = await Comment.findById(id)
//   if (!comment) {
//     return res.status(404).json({ message: 'Comment not found' })
//   }
//   const user = await User.findOne({ clerkId: req.userId })
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' })
//   }
//   const newComment = new Comment({
//     content,
//     authorId: user._id,
//     postId: comment.postId,
//     replies: [],
//   })
//   await newComment.save()
//   comment.replies.push(newComment._id)
//   await comment.save()
//   return res
//     .status(200)
//     .json({ message: 'Comment added successfully', data: newComment })
// >>>>>>> main
// }

// module.exports = replyToComment
