import React,{useEffect,useState} from "react";
import LatestPost from "../Components/LatestPost";
import {get} from "../services/Endpoint";
import toast from "react-hot-toast";


export default function Home(){


const [blogs,setBlogs]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{


async function loadBlogs(){


try{


const res=await get("/blog/GetPosts");


console.log(res.data);



if(res.data.success){

setBlogs(res.data.posts);

}



}catch(error){

console.log(error);

toast.error("Unable to load blogs");


}

finally{

setLoading(false);

}


}


loadBlogs();


},[]);



return(

<>


<section className="hero">


<div>


<h1>
Welcome To BlogSpace
</h1>


<p>
Share ideas, stories and knowledge
</p>

<a className="hero-cta" href="#latest-posts">Explore stories</a>


</div>


</section>



<section className="posts-section" id="latest-posts">


{

loading ?

<h2 className="loader">
Loading...
</h2>


:

<LatestPost posts={blogs}/>


}


</section>


</>


)

}
