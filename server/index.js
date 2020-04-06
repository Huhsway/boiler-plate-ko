const express = require('express') // express 모듈 가져오기
const app = express() // 앱 만들기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// bodyParser는 클라이언트에서 오는 정보 분석해서 보내줌
// application/x-www-form-urlencoded 이렇게 된 데이터 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json       json 타입으로 된거 가져와서 분석
app.use(bodyParser.json()); 
app.use(cookieParser());

const mongoose = require('mongoose') // mongoose는 mongodb 편하게 쓰기위한 툴이라 생각하면 됨

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 에러 안뜨기 위해 작성
}).then(() => console.log('MongoDB Connected...')) // 잘 연결되면 말해줌
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!~~ ')) // 루트 디렉터리에서 Hello World! 출력

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))

app.post('/api/users/register', (req, res) => {

    // 회원 가입 할때 필요한 정보들을 client에서 가벼오면
    // 그것을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    // {
    //     id: "hello",
    //     password: "123"
    // }
    // bodyParser 때문에 이렇게 json 형식으로 저장 가능

    user.save((err, userInfo) => { // 데이터 베이스에 user 내용 save
        if (err) return res.json({success: false, err}) // 에러면 success false return
        return res.status(200).json({ // 에러 아니면 success true return
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user) => { // findOne은 몽고db 메소드
        if (!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            // 비밀번호까지 맞다면 토큰을 생성하기.

            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token) // x_auth라는 이름으로 쿠기가 들어감
                .status(200)
                .json({loginSuccess: true, userId: user._id});
            })
        })
    })
})


app.get('/api/users/auth', auth, (req, res) => { // auth는 사용자가 페이지 옮길때마다 로그인 되어 있는지 있는지 체크

    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user_id,
        isAdmin: req.user.role === 0 ? false : true, // role이 0 -> 일반유저, role이 0이 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => { // token을 지워주면 로그아웃 처리가 된다.
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""} 
        , (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

const port = 5000 // 포트 5000

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))