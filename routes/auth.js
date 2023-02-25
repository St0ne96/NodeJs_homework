const express = require('express');

const router = express.Router();
const { signupValidation } = require('../validations');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = process.env;

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    } catch (err) {}
});

router.post('/signup', async (req, res) => {
    try{
        const { nickname, password } = await signupValidation.validateAsync(
            req.body
        );
        // 디코딩을 할 수 있는 12만큼 소요됨 
        const hassPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            nickname,
            password: hassPassword ,
        });

        res.json(user);
    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({message: err.details[0].message});
        }

        res.status(500).json({ message: err.message });
    }
});

// 로그인 
router.post('/login', async (req, res) => {
    const { nickname, password } = req.body;

    try {
        const user = await User.findOne({ nickname });
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!user || !isPasswordCorrect){
           return  res.status(400).json({ message: "이메일 또는 비밀번호가 틀렸네요." });
        }

        res.json({ token: jwt.sign({ nickname }, env.JWT_SECRET_KEY )})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;