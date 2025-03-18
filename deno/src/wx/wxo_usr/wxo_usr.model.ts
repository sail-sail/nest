
export interface FetchUserInfo {
  
  openid: string;
  
  nickname: string;
  
  sex: 0 | 1 | 2;
  
  province: string;
  
  city: string;
  
  country: string;
  
  headimgurl: string;
  
  privilege: string[];
  
  unionid?: string;
  
}
