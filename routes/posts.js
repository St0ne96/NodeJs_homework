const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const { postCreateValidation,
    postUpdateValidation,
 } = require('../validations')

// 게시글 조회 
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, as: 'user', attributes: ['nickname'] }],
            attributes: { exclude: ['userId']},
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// 게시글 상세 조회
router.get('/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const post = await Post.findByPk(id, {
            include: [{ model: User, as: 'user', attributes: ['nickname']}],
            attributes: { exclude: ['userId']},
        });

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 게시글 작성
router.post('/', async (req, res) => {
    try {
        const { title, content, userId } = await postCreateValidation.validateAsync(
            req.body
        );
        const post = await Post.create({
            title,
            content,
            userId,
        });
        res.json(post);
    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({message: err.details[0].message});
        }

        res.status(500).json({ message: err.message });
    }
});

// 게시글 수정
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const fieldsToBeUpdated = await postUpdateValidation.validateAsync(
            req.body
        );
        const updatePost = await Post.update(fieldsToBeUpdated, {
            where: { id },
        });
        res.json(updatePost);
    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({message: err.details[0].message});
        }

        res.status(500).json({ message: err.message });
    }
});

// 게시글 삭제
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.destroy({ where: { id }});

        res.status(200).json({ message: "게시글을 정상적으로 삭제했습니다."});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;