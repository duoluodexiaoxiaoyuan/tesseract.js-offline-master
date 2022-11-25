const express=require('express');
const multer = require('multer')
//设置保存的路径  dest  
var upload = multer({ dest:"./images" })
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
//这个cors包就是用来解决跨域问题的
const cors=require('cors');
const app=express();
app.use(cors());
//  解析 application/x-www-form-urlencoded【解析查询字符串格式参数】
app.use(express.urlencoded({ extended: true }));  //这个是用来接收post的表达数据
//  解析 application/json【解析JSON格式参数】
app.use(express.json());   




// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '5000000000kb' }));
// app.use(bodyParser.urlencoded({ extended: false }))




app.get("/", (req,res) => {
  if(req.url ==='/'){
    //response.writeHead(响应状态码，响应头对象): 发送一个响应头给请求。
    // res.writeHead(200,{'Content-Type':'text/html'})
    // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
    fs.readFile('./index.html','utf-8',function(err,data){
      if(err){
        throw err ;
      }
      res.end(data);
    });
  }
})




app.post("/shiBie", upload.single('avatar'),(req, res) => {
  // 读取我传入的图片
  fs.readFile(req.file.path,(err,files) => {
    if(err){
      throw err ;
    }
    console.log(files,)
    // 对图片进行重名名，加上.png的后缀
    fs.rename(req.file.path, req.file.path+'.png', err => {
      if(!err) {
        console.log('文件修改成功');
      } else {
        console.log('文件修改失败');
        console.log(err);
      }
    })
  });

  const worker = createWorker({
    langPath: path.join(__dirname, '..', 'lang-data'), 
    logger: m => console.log(m),
  });
  
  (async () => {
    await worker.load();
    await worker.loadLanguage('chi_sim+eng');  // 这样写就支持中文和英文
    await worker.initialize('chi_sim+eng');
    const { data: { text } } = await worker.recognize(path.join(__dirname, '..', 'images', req.file.filename+'.png'));
    console.log(text);
    res.send(text)
    await worker.terminate();
  })();
});

app.listen(8081,() => {
  console.log('8081服务启动');
})