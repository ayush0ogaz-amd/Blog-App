import React, { useEffect, useState } from "react";
import LatestPost from "../Components/LatestPost";
import { get } from "../services/Endpoint";
import { toast } from "react-hot-toast";

export default function Home() {

    const [blogs,setBlogs] = useState([]);
    const [loading,setLoading] = useState(true);


    useEffect(()=>{

        const fetchBlogs = async()=>{

            try{

                const res = await get("/blog/GetPosts");

                if(res.data.success){
                    setBlogs(res.data.posts);
                }

            }catch(error){

console.log(error.response);

toast.error(
error.response?.data?.message ||
"Unable to load blogs"
);

}
            finally{
                setLoading(false);
            }

        }


        fetchBlogs();

    },[]);



    return(

        <>

        {/* Hero */}

        <section className="hero">

            <div className="overlay">

            <h1>
                Welcome To My Blog
            </h1>

            <p>
              Explore stories, ideas and knowledge
            </p>

            </div>

        </section>



        {/* Posts */}

        <section className="posts-section">


        {
            loading ?

            <div className="loader">
                Loading...
            </div>

            :

            <LatestPost posts={blogs}/>

        }


        </section>


        </>

    )

}