const zlib = require('zlib');
const request = require('request');
const data = zlib.gzipSync(Buffer.from("我是一个被Gzip压缩后的数据"));
request({
    method: 'POST',
    url: 'http://127.0.0.1:3000/post',
    headers: {//设置请求头
        "Content-Type": "text/plain",
        "Content-Encoding": "gzip"
    },
    body: data
})