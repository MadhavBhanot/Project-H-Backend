const { connectDB, disconnectDB, dropDatabase } = require("../config/configDB");
const { createUsers, createJobs, userApplyingToJob, createPosts, createComments, createLikes, createReplies } = require("./extraSeeding.generation");

async function seedDB() {
    await connectDB();
    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');
    console.log('Seeding Users');
    await createUsers();
    console.log('Seeding Jobs')
    await createJobs();
    console.log('Seeding Applicants')
    await userApplyingToJob();
    console.log('Seeding Posts')
    await createPosts()
    console.log('Seeding Comments')
    await createComments()
    console.log('Seeding Likes')
    await createLikes()
    console.log('Seeding Replies')
    await createReplies()
    console.log('Database seeded!');

    await disconnectDB()
}

seedDB().catch(err => console.log(err));