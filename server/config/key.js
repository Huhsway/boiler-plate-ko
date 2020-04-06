if(process.env.NODE_ENV === 'production'){ // 환경 변수 설정 배포 상태면 (./prod) 로컬 상태면 (./dev)
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}