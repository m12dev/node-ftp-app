const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send("Hello express");
});

app.listen(PORT, ()=>{
    console.log("Express server is running")
});