const {Router} = require('express')

 //шифрование//хеширование и сравнение паролей
 const bcrypt = require('bcryptjs');

 //фейковый ТОКЕН самопал из файла default.json
const config = require('config')

 //фейковый json
 const jwt = require('jsonwebtoken');

//Валидация
 const {check, validationResult} = require('express-validator');

//Модель Юзера (шаблон)
const User = require('../modules/User')
const router = Router()

 //' префикс-/api/auth' + путь /register
 // ' префикс-/api/auth/register
router.post(
    '/register',
     // + валидация полей на express
     [
         check('email',
             'Некорректный e-mail, пробуйте ввести снова').isEmail(),
         check('password',
            'Минимальная длина пароля 8 символов')
             .isLength({min: 8})
     ],
     async (req, res) => {
         try {
             console.log('Body:', req.body) //проверка входящих данных
            //Здесь валидируются входящие поля
            const errors = validationResult(req)
             if (!errors.isEmpty()) {
                 return res.status(400).json(
                     {
                         errors: errors.array(),
                         message: 'Некорректные данные при регистрации'
                     })
             }

            /***********************************/
             const {email, password} = req.body
             /***********************************/
             const candidate = await User.findOne({email: email})
             /***********************************/
            if (candidate) {
                 return res.status(400).json({message: 'Такой пользователь уже занят'})
             }
             /***********************************/
             const hashedPassword = await bcrypt.hash(password, 12)
             const user = new User({email, password: hashedPassword})
             /***********************************/
             await user.save()
            res.status(201).json({message: 'Пользоватль создан'})

         } catch (e) {
             res.status(500).json({message: 'Запрос не коррекный, пробуй снова'})
         }
     })


 //' префикс-/api/auth'+ путь /login
 router.post('/login',
     [
         check('email',
             'Введите корректный e-mail').normalizeEmail().isEmail(),
         check('password',
             'Введите пароль').exists(),

     ],
     async (req, res) => {
         try {

             //Здесь валидируются входящие поля
             const errors = validationResult(req)
             if (!errors.isEmpty()) {
                return res.status(400).json(
                    {
                        errors: errors.array(),
                         message: 'Некорректные данные при входе в систему'
                     })
             }

             /***********************************/
             const {email, password} = req.body
             /***********************************/
             const user = await User.findOne({email: email})
             /***********************************/
             if (!user) {
                return res.status(400).json({message: 'Такой пользователь не найден'})
             }
             /***********************************/
             const isMatch = await bcrypt.compare(password, user.password)
             if (!isMatch) {
                 return res.status(400).json({message: 'Не верный пароль, попробуйте снова'})
             }

             const token = jwt.sign(
                 {userId: user.id},
                config.get('jwtSecret'),
                 {expiresIn: '4h'}
             )
             res.json({token, userId: user.id})


        } catch (e) {
            res.status(500).json({message: 'Запрос не корректный, пробуй снова'})
        }
     })


 module.exports = router


