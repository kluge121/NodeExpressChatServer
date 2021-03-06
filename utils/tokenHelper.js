const jwt = require('jsonwebtoken');
const TOKEN_SECRET = 'secret';


module.exports.tokenGenerator = function (data) { // 모듈용 토큰 발급함수

    return jwt.sign({id: data}, TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d'
    });
};


function tokenGenerator(data) { // 토큰인증에 사용할 토큰 발급 함수

    return jwt.sign({id: data}, TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d'
    });
}


module.exports.isValid = function (token, nickname, res, result) { // 토큰 확인

    //토큰이 유효하지 않을시 조건없이 그냥 재발급해줌 -> 계정에 대한 보안 x

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            let resObj;
            if (err) {
                let reToken = tokenGenerator(nickname);
                resObj = {
                    msg: 'token reissuance',
                    accessToken: reToken,
                    modify: result[0]['modify']
                };

            }
            const returnBoolean = (decoded.id === nickname);

            if (returnBoolean) {
                resObj = {
                    msg: 'success',
                    accessToken: 'remind',
                    modify: result[0]['modify']

                };
            } else {
                let reToken = tokenGenerator(nickname);
                resObj = {
                    msg: 'token reissuance',
                    accessToken: reToken,
                    modify: result[0]['modify']
                }
            }
            res.send(JSON.stringify(resObj));
        }
    );
};


