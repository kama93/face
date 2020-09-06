import React, { useState } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import PhotoPlace from './Components/PhotoPlace/PhotoPlace';
import Particles from 'react-particles-js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";



const particlesOptions={
    particles:{
        number:{
            value:150,
            density:{
                enable:true,
                value_area:800,
            }
        }
        }
    };


function App() {
    const [input, setInput] = useState('');
    const [image, setImage] = useState('');
    const [box, setBox]= useState({});
    const [route, setRoute]= useState('signin');
    const [isSignedIn, setIsSignedIn]= useState(false);
    const [user, setUser]=useState({
            id:'',
            name:'',
            email:'',
            entries: 0,
            joined: ''});

    
    const onChange = (e) => {
        setInput(e.target.value)
    };

     const calculateBoxPosition=(data)=>{
        const faceClarifai= data.outputs[0].data.regions[0].region_info.bounding_box;
        const image= document.getElementById('inputImage');
        const width= Number(image.width);
        const height=Number(image.height);

        return {
            leftCol: faceClarifai.left_col* width,
            topRow: faceClarifai.top_row* height,
            rightCol: width- (faceClarifai.right_col* width),
            bottomRow: height- (faceClarifai.bottom_row* height)

        }
    }

    const placeFaceBox=(box)=>{
        setBox(box);
    }

const loadUser=(data)=>{
        setUser({  id: data.id,
                    name: data.name,
                    email: data.email,
                    entries: data.entries,
                    joined: data.joined
                })
        if (data.id) {
            setIsSignedIn(true)
        } else {
            setIsSignedIn(false)
            setImage('')

            }
        }

const onButtonClick=()=>{
    setImage(input);
    fetch('/api/imageurl', {
                    method:'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        input: input })
    })
    .then (response=> response.json())
    .then(
        function(response) {
            if(response){
                fetch('/api/image', {
                    method:'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: user.id
                    })
                })
                .then (response=> response.json())
                .then(count=>{
                    setUser({...user, ['entries']: count})
                })
                .catch(console.log)
            }

            placeFaceBox(calculateBoxPosition(response))
        },
        function(err) {
            console.log(err)
        }
    );
};

 
  return (
    <div className='App'>
        <Particles className='particles'
                params={particlesOptions}
                />
        <Router>
            <Navigation isSignedIn={isSignedIn} loadUser={loadUser}/>
            <Switch>
                <Route path='/home'>
                    <div>
                        <Logo/>
                        <Rank name= {user.name} entries={user.entries}/>
                        <ImageLinkForm 
                            onChange={onChange} 
                            onButtonClick={onButtonClick}/>
                        <PhotoPlace setImage={image} box={box}/>
                    </div>
                </Route>
                <Route path='/signin'>
                    <SignIn loadUser={loadUser}/>
                </Route>
                <Route path='/register'>
                    <Register loadUser={loadUser} />
                </Route>
                <Redirect from='/' to='/signin' />

            </Switch>
         </Router>
    </div>
  );
}

export default App;
