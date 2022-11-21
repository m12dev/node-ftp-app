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

const blobName = "recv.txt";
const containerName = process.env.BLOB_CONTAINERNAME;
const connectionString = process.env.BLOB_CONNECTIONSTRING;

const blobClient = new BlockBlobClient(connectionString, containerName, blobName);

(async () => {
    console.log("START");
    const downloadResult = await blobClient.downloadToFile(blobName);
    await ftp.connect(ftpConnectionStrings);
    await ftp.put(blobName,blobName);
    await ftp.list('/').then(list => {
        console.log(list[1].name);
    });
    await ftp.end().then(result => {
        if (!result) {
            console.log("FTP OK");
        }
    });
    fs.unlinkSync(blobName);
    console.log(downloadResult);
    console.log("END");
})();