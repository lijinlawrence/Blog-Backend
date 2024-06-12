import io from "../index.js";
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
      name:user.name,

     
     
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
   
    res.status(500).json({ error: "Server error" });

  }
};

// updatePost

export const updatePost = async(req,res)=>{
  const  id  = req.params.id;
  console.log(id);
  const { title,about, body, tags } = req.body;
  try {
    const posts = await Post.findByIdAndUpdate( id );
    if (!posts) {
        res.status(404);
        return res.status(404).json({ message: "post not found" });
      }
  posts.title = title ||posts.title
  posts.about = about ||posts.about
  posts.body = body ||posts.body
  posts.tags = tags ? tags.split(",").map((tag) => tag.trim()) : posts.tags;
  const  updatedPost = await posts.save()
  res.status(200).json({
    updatedPost, // ippadiyum ezhuthalam
    id:updatedPost._id,
    title:updatedPost.title,
    about:updatedPost.about,
    body:updatedPost.body,
    tags:updatedPost.tags,
    message:"post updated succesfully"
  })

  } catch (error) {
    res.status(500).json({ message: error });
  }
}



// getAllPosts with pagination
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(parseInt(limit));
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};





  // get single Post
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



// DeletePost

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





//  get Favorite Post

// export const getFavoritesForAllPosts = async (req, res) => {
//   try {
//     const allPosts = await Post.find();
//     if (!allPosts) {
//       return res.status(404).json({ message: 'No posts found' });
//     }

//     // Aggregate favorites from all posts
//     const allFavorites = allPosts.reduce((favorites, post) => {
//       return favorites.concat(post.favorites);
//     }, []);

//     res.status(200).json({ allFavorites });
//   } catch (error) {
//     console.error('Error fetching favorites:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// Favorite a post
export const favoritePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.payload;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const index = post.favorites.indexOf(userId);
    if (index === -1) {
      post.favorites.push(userId);
    } else {
      post.favorites.splice(index, 1);
    }

    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};





// Get user's favorite posts with pagination
export const getUserFavoritePosts = async (req, res) => {
  const userId = req.payload;

  try {
    const { page = 1, limit = 3 } = req.query;
    const skip = (page - 1) * limit;

    const favoritePosts = await Post.find({ favorites: userId }).skip(skip).limit(parseInt(limit));
    const totalFavorites = await Post.countDocuments({ favorites: userId });

    res.status(200).json({
      favoritePosts,
      totalPages: Math.ceil(totalFavorites / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching favorite posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




// // Add comment to a post
// export const addComments = async (req, res) => {
//   const postId = req.params.id;
//   const userId = req.payload;
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ message: "Comment text is required" });
//   }

//   try {
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const comment = {
//       text,
//       postedBy: userId,
//     };

//     post.comments.push(comment);
//     await post.save();

//     // Emitting real-time update
//     io.emit("commentAdded", { postId, comment });

//     res.status(201).json({ message: "Comment added successfully", post });
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Delete a comment from a post
// export const deleteComment = async (req, res) => {
//   const postId = req.params.postId;
//   const commentId = req.params.commentId;

//   try {
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

//     if (commentIndex === -1) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Remove the comment from the post
//     post.comments.splice(commentIndex, 1);
//     await post.save();

//     // Emit a real-time update
//     io.emit("commentDeleted", { postId, commentId });

//     res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };







// Add comment to a post
export const addComments = async (req, res) => {
  const postId = req.params.id;
  const userId = req.payload;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      text,
      postedBy: userId,
    };

    post.comments.push(comment);
    await post.save();

    // Emit real-time update
    io.emit("new-comment", post.comments);

    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment from a post
export const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Remove the comment from the post
    post.comments.splice(commentIndex, 1);
    await post.save();

    // Emit a real-time update
    io.emit("comment-deleted", { postId, commentId });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};