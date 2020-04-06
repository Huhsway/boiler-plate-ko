const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 // salt를 이용해서 비밀번호 암호화 salyRounds = 10 이면 10자리인 salt를 만들어서 비밀번호를 암호화
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){ // 비밀번호를 바꿀때만 다른거 바뀔때도 암호화 매번 하면 안되니까
        // 비밀번호를 암호화 시킨다.

        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash // 성공하면 hash된 비밀번호로 바꿈
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb){

    //plainPassword 1234567 암호화된 비밀번호 $2b$10$lLd0o3V2wgDllb23RFcGr.t3dl8Rok2D9i2DKgjyd0t6dcG6K4R6e 맞는지 확인 해야함

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })

}

userSchema.methods.generateToken = function (cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 사용하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken') // user id와 토큰을 합쳐서 누구인지 알 수 있도록함

    //  user._id + 'secretToken' = token 유저의 id와 secretToken을 더해 암호화
    //  ->
    //  'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //user._id + '' = token
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){ 
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema) // 유저 이름과 스키마 넣어줌

module.exports = { User }