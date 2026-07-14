import React, { useEffect, useState } from 'react';
import { get } from '../../services/Endpoint';



export default function Admin() {
 const [counts, setCounts] = useState({ users: 0, posts: 0, comments: 0 })
  useEffect(()=>{
    const GetData=async()=>{
      try {
        const request= await get('/dashboard')
        const response= request.data

        console.log(response)
        if (request.status===200) {
          setCounts(response.counts)
        }
      } catch (error) {
        console.error('Unable to load dashboard data:', error)
      }
    }
    GetData()
  },[])
  return (
<>
<div>
      <h2 className="mb-4 text-white">Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">{counts.users}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Posts</h5>
              <p className="card-text">{counts.posts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Comments</h5>
              <p className="card-text">{counts.comments}</p>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
}
