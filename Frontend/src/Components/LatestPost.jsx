import React from "react";
import {useNavigate} from "react-router-dom";


export default function LatestPost({posts}){


const navigate = useNavigate();



const truncate=(text)=>{

return text.length>120 
? text.substring(0,120)+"..."
: text;

}



return(

<div className="container">


<h2 className="section-title">
Latest Posts
</h2>



<div className="row">


{
posts.map((blog)=>(


<div 
className="col-lg-4 col-md-6 mb-4"
key={blog._id}
>


<div className="blog-card">


<img
src={blog.image}
alt={blog.title}
/>



<div className="card-content">


<h3>
{blog.title}
</h3>


<p>
{truncate(blog.desc)}
</p>


<button
onClick={()=>navigate(`/blog/${blog._id}`)}
>
Read More
</button>


</div>


</div>



</div>


))
}


</div>


</div>

)

}