const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const { default: helmet } = require('helmet');

const app=express();
const PORT=process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('Database conneted successfully'))
.catch((e)=>console.log('cannot connect to database',e))

app.listen(PORT,()=>{
    console.log(`App is running in port:${PORT}`);
})

