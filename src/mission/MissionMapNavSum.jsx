export function MissionMapNavSum({navDataTot}) {
   return (
       <div style={{
           display: 'flex',
           justifyContent: 'space-around',
           width: '250px',
           position: 'absolute',
           backgroundColor: '#fff',
           bottom: '-30px',
           left: 'calc(50% - 125px)',
           overflowY: 'auto',
           borderRadius: '4px',
           padding: '5px',
           boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 2px',
       }}>
           <div>
               <span style={{fontFamily: 'monospace'}}>{navDataTot?.length}</span> <span
               style={{color: '#a1a1a1'}}>mt</span>
           </div>
           <div>
               <span style={{fontFamily: 'monospace'}}>{navDataTot?.time}</span> <span
               style={{color: '#a1a1a1'}}>min</span>
           </div>
       </div>
   )
}