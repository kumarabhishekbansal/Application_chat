import axios from 'axios';
const API_URL='api/user';

export const getAllUser=async(access_token)=>{
    console.log("enter react getAllUser");
    const getUser=await axios.get(API_URL+`/`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
    if(getUser.data.data)
    {
        console.log("react side ",getUser.data.data);
        return Promise.resolve(getUser.data.data);
    }else{
        return [];
    }
}

export const getAllUserKeyword=async(access_token,keyword)=>{
  console.log("enter react getAllUserKeyword : ",keyword);
  console.log("enter react getAllUserKeyword : ",access_token);
  const getUser=await axios.get(API_URL+`/?search=${keyword}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  if(getUser.data.data)
  {
      console.log("react side getAllUserKeyword ",getUser.data.data);
      return Promise.resolve(getUser.data.data);
  }else{
      return [];
  }
}

