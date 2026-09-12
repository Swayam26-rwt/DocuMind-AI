export function ChatMessage({role,content}:{role:string,content:string}){return <div className="card"><b>{role}</b><p>{content}</p></div>}
