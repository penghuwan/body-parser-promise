# body-parser-promise
Promise风格的bodyparser，接收request对象做为参数，返回解析后的body对象，返回结果前做了charset转换,解压缩,内容编码转换等处理

# Demo  
如果你想看看这个demo是怎么运作的，你可以
1. clone项目
```
git clone https://github.com/penghuwan/body-parser-promise.git
```
2. 安装相关依赖
```
npm install
```
3. 启动Node客户端和Node服务端
```
node client.js // Node.js客户端，向server发送gzip压缩后的消息
node server.js // Node.js服务端，负责解析每个请求的request.body，并输出
```
4. 在浏览器端刷新localhost:3000页面
5. 最后你可在server.js的进程控制台中看到输出：
```
// 来自client.js客户端发送的压缩body
我是一个被Gzip压缩后的数据 
// 来自前端请求，连续三次fetch的body
{ 
  data: '我是彭湖湾',
  contentType: 'application/json',
  charset: 'gbk' 
 }
 {
  data: '我是彭湖湾',
  contentType: 'application/x-www-form-urlencoded',
  charset: 'UTF-8' 
  }
  我是彭湖湾，这句话采用UTF-8格式编码，content-type为text/plain
```
