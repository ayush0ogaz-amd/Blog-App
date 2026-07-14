import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comments.js";

dotenv.config();

const demoUsers = [
  { FullName: "Maya Sharma", email: "maya.demo@blogspace.test" },
  { FullName: "Rohan Mehta", email: "rohan.demo@blogspace.test" },
  { FullName: "Priya Nair", email: "priya.demo@blogspace.test" },
];

const demoPosts = [
  {
    title: "Five small habits that make writing easier",
    desc: "Writing consistently does not need a dramatic routine. Start with a small idea, protect ten quiet minutes, and give yourself permission to make an imperfect first draft. These gentle habits make it easier to return tomorrow.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "A quieter way to plan your week",
    desc: "Instead of filling every hour, make space for the work that actually matters. A short weekly reset can help you choose three priorities, leave room for surprise, and finish the week with more energy.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "What I learned from building in public",
    desc: "Sharing progress before everything is polished feels uncomfortable, but it invites better feedback. Here are the small practices that helped turn public updates into a useful learning loop.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "The joy of a well-designed reading corner",
    desc: "A favourite chair, soft light, and one shelf of books can change the way a room feels. You do not need a large home library to make reading feel like a ritual.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "How to take notes you will actually revisit",
    desc: "Useful notes are not a complete transcript. Capture the idea in your own words, add why it matters, and leave a connection to something you already know. The result is a knowledge base that stays alive.",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "A beginner's guide to digital minimalism",
    desc: "Digital minimalism is not about rejecting technology. It is about choosing tools that support your values and turning off the noisy defaults that compete for your attention.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const password = await bcrypt.hash("Demo@12345", 10);
  const users = [];

  for (const userData of demoUsers) {
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      { $setOnInsert: { ...userData, password, role: "user", profile: null } },
      { new: true, upsert: true },
    );
    users.push(user);
  }

  let createdPosts = 0;
  for (const [index, postData] of demoPosts.entries()) {
    let post = await Blog.findOne({ title: postData.title });
    if (!post) {
      post = await Blog.create(postData);
      createdPosts += 1;

      const comment = await Comment.create({
        postId: post._id,
        userId: users[index % users.length]._id,
        comment: "This is a thoughtful read. Thanks for sharing your perspective!",
      });
      post.comments.push(comment._id);
      await post.save();
    }
  }

  console.log(`Seed complete: ${users.length} demo users ready; ${createdPosts} blogs added.`);
  console.log("Demo user password: Demo@12345");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
