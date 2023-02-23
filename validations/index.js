const Joi = require('joi');

const signupValidation = Joi.object({
    //alphanum => 숫자랑 문자랑 유효성 검사를 해주는 함수 
    nickname: Joi.string().alphanum().not('').required(),
    password: Joi.string().min(3).not('').required(),
    confirm: Joi.equal(Joi.ref('password')).required().messages({
        'any.only':'비밀번호가 일치하지 않네요',
    }),
});

const postCreateValidation = Joi.object({
    title: Joi.string().not('').required(),
    content: Joi.string().not('').required(),
    userId: Joi.number().required(),
});


const postUpdateValidation = Joi.object({
    title: Joi.string().optional().not(''),
    content: Joi.string().optional().not(''),
    userId: Joi.forbidden(),
});

const commentCreateValidation = Joi.object({
    content: Joi.string().not('').required(),
    userId: Joi.number().required(),
    postId: Joi.forbidden(),
});

const commetUpdateValidation = Joi.object({
    content: Joi.string().not('',)
});

module.exports = {
    signupValidation,
    postCreateValidation,
    postUpdateValidation,
    commentCreateValidation,
    commetUpdateValidation,
};