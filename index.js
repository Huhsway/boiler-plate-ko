const express = require('express') // express 모듈 가져오기
const app = express() // 앱 만들기
const port = 5000 // 포트 5000

const mongoose = require('mongoose') // mongoose는 mongodb 편하게 쓰기위한 툴이라 생각하면 됨
mongoose.connect('mongodb+srv://huhsway:tmdghl402@youtubeclone-uot7q.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 에러 안뜨기 위해 작성
}).then(() => console.log('MongoDB Connected...')) // 잘 연결되면 말해줌
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!')) // 루트 디렉터리에서 Hello World! 출력

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))