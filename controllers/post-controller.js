
const db = require("../db/index");
const Post = db.posts;
const Op = db.Sequelize.Op;


const createPost = (req, res) => {

    if (!req.body) {
        res.status(400).json({
            success: false,
            error: 'You must provide a Post',
        });
        return;
    }

    const post = {
        title: req.body.title,
        text: req.body.text,
        disease: req.body.disease,
        classification: req.body.classification,
        practice: req.body.practice,
        important: req.body.important,
        recommendation: req.body.recommendation


    };

    Post.create(post)
        .then(() => {
            return res.status(201).json({
                success: true,
                id: post.id,
                message: 'Post created!',
            })
        })
        .catch(err => {
            return res.status(400).json({
                err,
                message: 'Post not created!'});
        });
};
const updatePost = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    const id = req.params.id;

    Post.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if(num==1){
                return res.status(200).json({
                    success: true,
                    id: Post.id,
                    message: 'Post updated!',
                })}
            else {
                return res.status(404).json({
                    message: 'Post not found!',
                })
            }
        })
        .catch(err => {
            return res.status(404).json({
                err,
                message: 'Post not updated!',
            })
        });
};

const deletePost = (req, res) => {
    const id = req.params.id;

    Post.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).json({ success: true, message: 'Post deleted'});
            } else {
                return res.status(404).json({ success: false, error: `Post not found` });
            }
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        });
};

const getPostById = (req, res) => {
    const id = req.params.id;

    Post.findByPk(id)
        .then(data => {
            if(data==null){
                return res.status(400).json({success: false, message: "no post found"})
            }
            return res.status(200).json({ success: true, data: data })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        });

};

const getPosts =  (req, res) => {

    Post.findAll()
        .then(data => {
            return res.status(200).json({ success: true, data: data})
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err });
        });
};

//
module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPostById,
}
