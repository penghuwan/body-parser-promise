const http = require('http');
const url = require('url');
const fs = require('fs');
const util = require('util');
const zlib = require('zlib');

const Koa = require('koa');
const app = new Koa();

var webpack = require('webpack');
var webpackMiddleware = require("koa-webpack-dev-middleware");
var webpackConfig = require('./webpack.config.js');

const contentType = require('content-type');
const iconv = require('iconv-lite');

const promisify = util.promisify;
// node 11.7版本以上才支持此方法
const brotliDecompress = zlib.brotliDecompress && promisify(zlib.brotliDecompress);

const gunzip = promisify(zlib.gunzip);
const inflate = promisify(zlib.inflate);

const querystring = require('querystring');

async function transformEncode(buffer, encode) {
    let resultBuf = null;
    debugger;
    switch (encode) {
        case 'br':
            if (!brotliDecompress) {
                throw new Error('Node版本过低！ 11.6版本以上才支持brotliDecompress方法')
            }
            resultBuf = await brotliDecompress(buffer);
            break;
        case 'gzip':
            resultBuf = await gunzip(buffer);
            break;
        case 'deflate':
            resultBuf = await inflate(buffer);
            break;
        default:
            resultBuf = buffer;
            break;
    }
    return resultBuf;
}

function transformCharset(buffer, charset) {
    charset = charset || 'UTF-8';
    // iconv将Buffer转化为对应charset编码的String
    const result = iconv.decode(buffer, charset);
    return result;
}

function formatData(str, contentType) {
    let result = '';
    switch (contentType) {
        case 'text/plain':
            result = str;
            break;
        case 'application/json':
            result = JSON.parse(str);
            break;
        case 'application/x-www-form-urlencoded':
            // 是否转码
            // querytring.unescape()
            result = querystring.parse(str);
            break;
        default:
            break;
    }
    return result;
}

function getRequestBody(req, res) {
    return new Promise(async (resolve, reject) => {
        const chunks = [];
        req.on('data', buf => {
            chunks.push(buf);
        })
        req.on('end', async () => {
            let buffer = Buffer.concat(chunks);
            // 获取content-encoding
            const encode = req.headers['content-encoding'];
            // 获取content-type
            const { type, parameters } = contentType.parse(req);
            // 获取charset
            const charset = parameters.charset;
            // 解压缩
            buffer = await transformEncode(buffer, encode);
            // 转换字符编码
            const str = transformCharset(buffer, charset);
            // 根据类型输出不同格式的数据，如字符串或JSON对象
            const result = formatData(str, type);
            resolve(result);
        })
    }).catch(err => { throw err; })
}

app.use(webpackMiddleware(webpack(webpackConfig))),

    app.use(async (ctx) => {
        const req = ctx.req;
        const res = ctx.res;
        let pathname = url.parse(req.url).pathname;
        let data = null;
        let targetPath = null;
        if (pathname === '/post') {
            const body = await getRequestBody(req, res);
            console.log(body);
            res.statusCode = 200;
            res.end();
            return;
        }
        if (pathname === '/') {
            pathname = '/index.html'
        }
        targetPath = `.${pathname}`;
        if (fs.existsSync(targetPath)) {
            data = fs.readFileSync(targetPath);
            res.statusCode = 200;
            res.end(data);
        }
    });

app.listen(3000);