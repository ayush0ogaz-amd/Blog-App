import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { post } from "../services/Endpoint";
import { removeUser } from "../redux/AuthSlice";
import toast from "react-hot-toast";


export default function Navbar(){

    const user = useSelector(
        (state)=>state.auth.user
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();



    const logout = async()=>{

        try{

            const res = await post("/auth/logout");

            dispatch(removeUser());

            toast.success(res.data.message);

            navigate("/login");


        }catch(error){

            toast.error("Logout failed");

        }

    }



return(

<header className="site-header">
<nav className="custom-navbar" aria-label="Main navigation">


<div className="brand">

<Link to="/">
BlogSpace
</Link>

</div>



<div className="nav-menu">


<Link to="/">
Home
</Link>



{
!user ?

<>

<Link to="/login">
Login
</Link>


<Link to="/register">
Register
</Link>

</>


:

<>


{user.role === "admin" && (
<Link to="/dashboard">
Dashboard
</Link>
)}

<Link to={`/profile/${user._id}`}>
Profile
</Link>


<button
onClick={logout}
className="logout-btn"
>
Logout
</button>


</>

}



</div>


</nav>
</header>

)

}
