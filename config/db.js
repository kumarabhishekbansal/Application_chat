const mongoose=require("mongoose");
// console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL,{
}).then(()=>{
    console.log('mongo connect success');
}).catch((err)=>{
  console.log(err);
    console.log("mongo connection unsuccess");
})