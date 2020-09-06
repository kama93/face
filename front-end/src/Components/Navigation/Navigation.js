import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Navigation= ({isSignedIn, loadUser})=>{
    if (isSignedIn){
        return (
                <nav style={{display:"flex", justifyContent:'flex-end'}}>
                    <Link to='/signin'>
                        <p 
                        onClick={() => loadUser({})} 
                        className='f3 link dim black underline pas pointer pa3 white'>Sign Out</p>
                    </Link>
                </nav>
                )
    }
    else{
        return  (
 
                <nav style={{display:"flex", justifyContent:'flex-end'}}>
                    <Link to='/signin'>
                        <p 
                        // onClick={()=>onRouteChange('signin')} 
                        className='f3 link dim black underline pas pointer pa3 white'>Sign In</p>
                    </Link>
                    <Link to='/register'>
                        <p 
                        // onClick={()=>onRouteChange('register')} 
                        className='f3 link dim black underline pas pointer pa3 white'>Register</p>
                    </Link>
                </nav>
            );
        }}
export default Navigation
