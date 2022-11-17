const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const { BlockBlobClient } = require("@azure/storage-blob");
require('dotenv').config();

const ftp = new PromiseFtp();
const ftpConnectionStrings = {
    host: process.env.FTP_HOSTNAME,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD
}

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const blobName = "hello.txt";
const containerName = process.env.BLOB_CONTAINERNAME;
const connectionString = process.env.BLOB_CONNECTIONSTRING;

const blobClient = new BlockBlobClient(connectionString, containerName, blobName);

(async () => {
    console.log("START")
    await ftp.connect(ftpConnectionStrings);
    const rs = await ftp.get(blobName);
    const ws = fs.createWriteStream(blobName);
    rs.pipe(ws);
    await ftp.end().then(result => {
        if (!result) {
            console.log("FTP OK");
        }
    });
    await blobClient.uploadFile(blobName, uploadOptions);
    fs.unlinkSync(blobName);
    console.log("END");
})();

/*
//async/awaitを使わないコード
console.log("START");
ftp.connect(ftpConnectionStrings)
    .then(() => {
        return ftp.get(blobName);
    }).then(data => {
        data.pipe(fs.createWriteStream(blobName));
        return ftp.end();
    }).then(result => {
        if (!result) {
            console.log("FTP OK");
        }
        return new Promise(resolve => {
            blobClient.uploadFile(blobName, uploadOptions);
            resolve();
        });
    }).then(() => {
        fs.unlinkSync(blobName);
        console.log("END");
    });
*/