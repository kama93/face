import React, { useState } from 'react';
import { useHistory} from 'react-router-dom'

const Register= ({loadUser})=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const history=useHistory();
    
    const onEmailChange=(event)=> {
        setEmail(event.target.value)
    }
    
    const onPasswordChange=(event)=> {
        setPassword(event.target.value)
    }

    const onNameChange=(event)=> {
        setName(event.target.value)
    }
    
    const onSubmitSignIn=()=>{
        fetch('https://salty-castle-65749.herokuapp.com/register', {
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                name: name
            })
        })
        .then (response=> response.json())
        .then(user => {
            if (user.id) {
                loadUser(user)
                history.push('/home')
           } else {
            alert('you need register')
           }
        })
    }
    return(
        <article className='br3 ba dark-gray b--white-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center'>
            <main className="pa4 white-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input 
                            className="pa2 input-reset ba bg-transparent hover-white w-100" 
                            type="text" 
                            name="name"  
                            id="name" 
                            style={{borderColor:'white'}}
                            onChange={onNameChange}/>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input 
                            className="pa2 input-reset ba bg-transparent hover-white w-100" 
                            type="email" 
                            name="email-address"  
                            id="email-address" 
                            style={{borderColor:'white'}}
                            onChange={onEmailChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                            className="b pa2 input-reset ba bg-transparent hover-white w-100" 
                            type="password" 
                            name="password"  
                            id="password" 
                            style={{borderColor:'white'}}
                            onChange={onPasswordChange}/>
                        </div>
                    </fieldset>
                    <div className="">
                        <input 
                        className="b ph3 pv2 input-reset ba b--white bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Register" 
                        style={{color:'white'}}
                        onClick={onSubmitSignIn}/>
                        
                    </div>
                </div>
            </main>
        </article>
    );
}

export default Register