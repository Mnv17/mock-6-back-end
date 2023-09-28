const Blog = require('../modules/blog');
const User = require('../modules/user');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.userId; 

    const newBlog = new Blog({
      title,
      content,
      category,
      author: userId,
    });

    await newBlog.save();

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');

    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate('author', 'username');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content, category } = req.body;
    const userId = req.userId; 

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    blog.title = title;
    blog.content = content;
    blog.category = category;

    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId; 

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await blog.remove();

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId; 

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this blog' });
    }

    blog.likes.push(userId);
    await blog.save();

    res.status(200).json({ message: 'Blog liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a comment to a blog
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { username, content } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = { username, content };
    blog.comments.push(comment);
    await blog.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
