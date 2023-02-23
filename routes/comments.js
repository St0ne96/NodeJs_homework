const express = require('express');
const router = express.Router();
const { Comment, Post } = require('../models');
const { commentCreateValidation, commetUpdateValidation } = require('../validations')

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findByPk(postId);
        // getComments post models => 관계형성 함수 
        const postComments = await post.getComments();
        res.json(postComments);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// 게시글 댓글 작성 
router.post('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const { content, userId } = await commentCreateValidation.validateAsync(
            req.body
        );
        const comment = await Comment.create({
            content,
            userId,
            postId,
        });
        res.json(comment);
    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({message: err.details[0].message});
        }

        res.status(500).json({ message: err.message });
    }
});

// 댓글 수정
router.patch('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const fieldsToUpdate = await commetUpdateValidation.validateAsync(
            req.body
        );
        const updatedComment = await Comment.update(fieldsToUpdate, {
            where: { id },
        });

        res.json(updatedComment);
    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({message: err.details[0].message});
        }

        res.status(500).json({ message: err.message });
    }
});

// 댓글 삭제
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteComment = await Comment.destroy({ where: { id }});
        res.json(deleteComment);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
module.exports = router; 