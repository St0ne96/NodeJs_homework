const { User } = require('../models');
const jwt = require('jsonwebtoken');

const env = process.env;

const authMiddleware = async (req, res, next)=> {
    const { authorization = ''} = req.headers;
    const [ tokenType, token ] = authorization.split(' '); // ['Bearer', <token> ]

    const isTokenValid = token && tokenType === 'Bearer'; // true or false 

    if (!isTokenValid) {
        return res.status(401).json({ message: '로그인 후 사용 가능해요', });
    }

    try {
        const { nickname } = jwt.verify(token, env.JWT_SECRET_KEY );
        const user = await User.findOne({ where: {nickname} });

        res.locals.currentUser = user; 
        next();
    } catch (err) {
        res.status(401).json({ message: '로그인 후 사용 가능합니다.'});
    }
};

module.exports = authMiddleware;