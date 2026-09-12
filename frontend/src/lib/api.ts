const API_URL=process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000/api/v1";
export async function api<T>(path:string, options:RequestInit={}):Promise<T>{
 const token=typeof window!=="undefined"?localStorage.getItem("token"):null;
 const headers=new Headers(options.headers);
 if(!(options.body instanceof FormData)) headers.set("Content-Type","application/json");
 if(token) headers.set("Authorization",`Bearer ${token}`);
 const r=await fetch(API_URL+path,{...options,headers});
 if(!r.ok) throw new Error(await r.text());
 return r.json();
}
