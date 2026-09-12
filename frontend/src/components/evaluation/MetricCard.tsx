export function MetricCard({name,value}:{name:string,value:number}){return <div className="card"><b>{name}</b><h2>{value.toFixed(3)}</h2></div>}
