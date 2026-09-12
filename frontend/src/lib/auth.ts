export const auth={setToken:(t:string)=>localStorage.setItem('token',t),getToken:()=>localStorage.getItem('token'),logout:()=>localStorage.removeItem('token')};
