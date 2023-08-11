const https = require('https');
const fs = require('fs'); // 用於讀取憑證文件

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };


const httpsServer = https.createServer(credentials, (req, res) => {
  // 在這裡處理伺服器請求和回應
});


const port = 443; // HTTPS 預設埠號
httpsServer.listen(port, () => {
  console.log(`HTTPS 伺服器已在埠號 ${port} 啟動`);
});
