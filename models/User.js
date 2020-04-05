const mongoose = require('mongoose');
// 스키마 만들기
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // trim = true는 누가 john ann@naver.com 이렇게 치면 이 스페이스를 없애주는 역할을 함
        unique: 1 // 똑같은 이메일 쓰지 못하게 unique는 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 관리자인지 아닌지 이런 역할을 Number로 구분
        type: Number,
        default: 0
    },
    image: String,
    token: { // 토큰 줘서 유효성 관리
        type: String
    },
    tokenExp: { // 토큰 유효성 기간
        type: Number
    }

})

const User = mongoose.model('User', userSchema) // 유저 이름과 스키마 넣어줌

module.exports = { User }