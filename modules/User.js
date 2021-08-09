const {Schema, model, Types} = require ('mongoose')

const schema= new Schema ({
    email: {
        //тип
        type: String,
        //флаг обязательный
        required: true,
        // + уникальность e-mail
        unique: true
    },
    password: {
        //тип
        type: String,
        //флаг обязательный
        required: true,
    },
    link: [{
        //тип для пользователя свой ( у всех разный )
        type: Types.ObjectId,
        //флаг обязательный
        ref: 'Link',
    }],

})

module.exports = model('User', schema)

