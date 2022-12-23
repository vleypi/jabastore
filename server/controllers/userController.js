const ApiError = require('../error/ApiError')
const {User, Basket} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id,email,role) =>{
    return jwt.sign(
        {id,email,role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController{

    async registration(req,res,next){
        const {email,password,role} = req.body

        if(!email || !password){
            return next(ApiError.badRequest('Некорректный email или пароль'))
        }

        const candidate = await User.findOne({where: {email}})
        if(candidate){
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const hashedPassword = await bcrypt.hash(password,5)
        const user = await User.create({email,role,password: hashedPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id,email,role)
        return res.json({token})
    }

    async login(req,res){
        
    }

    async check(req,res,next){
        const {id} = req.query
        if(!id){
            return next(ApiError.badRequest('Не задан Id'))
        }
        res.json(id)
    }
}

module.exports = new UserController()