const express = require('express') // express 모듈 가져오기
const app = express() // 앱 만들기
const port = 5000 // 포트 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

// bodyParser는 클라이언트에서 오는 정보 분석해서 보내줌
// application/x-www-form-urlencoded 이렇게 된 데이터 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json       json 타입으로 된거 가져와서 분석
app.use(bodyParser.json()); 

const mongoose = require('mongoose') // mongoose는 mongodb 편하게 쓰기위한 툴이라 생각하면 됨
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 에러 안뜨기 위해 작성
}).then(() => console.log('MongoDB Connected...')) // 잘 연결되면 말해줌
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!')) // 루트 디렉터리에서 Hello World! 출력


app.post('/register', (req, res) => {

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




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))