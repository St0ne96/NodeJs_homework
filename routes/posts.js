const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const { Post, User, Like, sequelize, Sequelize } = require('../models');
const { postCreateValidation,
    postUpdateValidation,
 } = require('../validations')

// 게시글 조회 
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
           // attributes: { exclude: ['userId']},
           attributes: [
            'id',
            'title',
            'content',
            [Sequelize.fn('count', Sequelize.col('likes.id')), 'numOfLikes'],
           ],
           include: [
            { model: User, as: 'user', attributes: ['nickname'] },
            {
                   model: Like,
                   as: 'likes',
                   attributes: [],
            },
         ],
        group:['postId'],
        order:[[Sequelize.literal('numOfLikes'), 'DESC']]
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
router.post('/', authMiddleware, async (req, res) => {
    const { currentUser } = res.locals;
    const userId = currentUser.id;
    try {
        const { title, content } = await postCreateValidation.validateAsync(
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

//좋아요 
router.post('/:id/like', authMiddleware, async (req,res) => {
    const { id: postId } = req.params; 
    const { currentUser: { id: userId },} = res.locals; 

    try {
        const like = await Like.findOne({
            where: {userId, postId},
        });

        const isLikeAlready = !!like;

        if (isLikeAlready) {
            const deleteLike = await Like.destroy({ where: { userId, postId, },});
            res.json(deleteLike);
        } else {
            const postedlike = await Like.create({ userId, postId, });
            res.json(postedlike);
        }
    } catch (err) {
        res.status(500).json({ message: err. message });
    }
})

module.exports = router;