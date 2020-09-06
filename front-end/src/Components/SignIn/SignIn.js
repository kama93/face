import React, { useState } from 'react';
import { useHistory} from 'react-router-dom'

const SignIn= ({ loadUser})=>{
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    
    const history=useHistory();

    const onEmailChange=(event)=> {
        setSignInEmail(event.target.value)
    }
    
    const onPasswordChange=(event)=> {
        setSignInPassword(event.target.value)
    }
    
    const onSubmitSignIn=()=>{
        fetch('/api/signin', {
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword,

            })
        })
        .then(user => user.json())
      .then(user => {
        if(user.id){
          loadUser(user);
          history.push('/home')
        }
        else {
            alert('Wrong password or email')
           }
      })
       
    }
    return(
        <article className='br3 ba dark-gray b--white-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center'>
            <main className="pa4 white-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
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
                                className="b pa2 input-reset ba bg-transparent  hover-white w-100" 
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
                        value="Sign in" 
                        style={{color:'white'}}
                        onClick={onSubmitSignIn}/>
                    </div>
                    <div className="lh-copy mt3">
                      <p onClick={() => history.push('/register')} className="f6 link dim white db">REGISTER</p>
                    </div>
                </div>
            </main>
        </article>
        )
}

export default SignIn