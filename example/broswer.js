var iconv = require('iconv-lite');
var querystring = require('querystring');
var gbkBody = {
    data: "我是彭湖湾",
    contentType: 'application/json',
    charset: 'gbk'
};
// 转化为JSON数据
var gbkJson = JSON.stringify(gbkBody);
// 转为gbk编码
var gbkData = iconv.encode(gbkJson, "gbk");

var isoData = iconv.encode("我是彭湖湾，这句话采用UTF-8格式编码，content-type为text/plain", "UTF-8")

// 测试内容类型为application/json和charset=gbk的情况
fetch('/post', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json; charset=gbk'
    },
    body: gbkData
});

// 测试内容类型为application/x-www-form-urlencoded和charset=UTF-8的情况
fetch('/post', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: querystring.stringify({
        data: "我是彭湖湾",
        contentType: 'application/x-www-form-urlencoded',
        charset: 'UTF-8'
    })
});

// 测试内容类型为text/plain的情况
fetch('/post', {
    method: 'POST',
    headers: {
        "Content-Type": 'text/plain; charset=UTF-8'
    },
    body: isoData
});