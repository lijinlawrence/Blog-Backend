import Post from "../model/postSchema.js";
import User from "../model/userSchema.js";


export const createPost = async (req, res, next) => {
  const { title,about, body, tags } = req.body;
  const  userId  = req.payload; // get the userId and name from the middleware



  if (!title || !about || !body || !tags) {
    res.status(400);
    const err = new Error("Please enter all fieleds");
    return next(err);
  }

  try {
    const user = await User.findById(userId);
    const newPost = new Post({
      title,
      about,
      body,
      tags: tags.split(",").map((tag) => tag.trim()),
      userId,
      name:user.name
     
     
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
   
    res.status(500).json({ error: "Server error" });

  }
};


export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find(); // Fetch all posts from the database
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

 export const getSinglePost = async (req , res)=>{
    const postId = req.params.id
    try {
        const posts = await Post.findById(postId)
        if(!posts){
           res.status(400).json({message:"Posts not Found"})
        }else{
            res.status(200).json(posts)
        }
        
    } catch (error) {
        res.status(500).json({ message: "Post couldn't get" });

    }
 } 


 // Get posts by a specific user
export const getUserPost = async (req, res) => {
  const userId = req.payload;
 

  try {
    const userPosts = await Post.find({  userId });
    if (userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
} 


 export const deletePost= async(req,res)=>{
  //get project detaols
  const{id}=req.params
  try {
    const post=await Post.findById(id)
    if(!post){
      return res.status(404).json({message:"Post not found"})
    }
  const posts = await Post.findByIdAndDelete({_id:id})
    res.status(200).json({posts,message:"Post Deleted successfully"});

  } catch (err) {
    res.status(401).json(err);

  }
}

export const favoritePost =async (req,res)=>{
  const id = req.params.id
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Toggle the favorite status for the current user
    if (post.favorites.includes(req.user._id)) {
      // If already favorited, unfavorite
      post.favorites.pull(req.user._id);
    } else {
      // If not favorited, favorite
      post.favorites.push(req.user._id);
    }

    await post.save();
    res.status(200).send({ message: "Favorite status updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Server Error" });
  }

}