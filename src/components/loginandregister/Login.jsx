;
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/Authprovider';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import auth from '../../../firebase/firebase.config';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {

  
  const {loading} = useContext(AuthContext)

  if(loading){
      return <div>  <span className="loading loading-spinner text-info loading-xl mt-40 "></span>  <h2 className='text-xl  text-teal-700'>! please wait content is Loading . . . . </h2>  </div>
  }

  const {logIn} = useContext(AuthContext);
  // const [message,setMessage] = useState('')
  const location = useLocation();
  const returnHome = useNavigate()

  const handleToSubmit = e =>{

    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password')
    // console.log(email,password)
    // setMessage('')

    logIn(email,password)
    .then((result) => {
      const users = {
        email,
        loginTime : result.user?.metadata?.lastSignInTime
      }

      fetch('https://backend-server-beta.vercel.app/users',{
        method: 'PATCH',
        headers : {
          'content-type' : 'application/json'
        },
        body: JSON.stringify(users)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      returnHome(location?.state ? location.state : '/');
    })
    .catch((error)=>{
      // setMessage(`${error.message} !invalid data`);
      console.log(error.message,'login uncomplete');
    })

  }


const googleProvider = new GoogleAuthProvider();
const handleGoogleSingIn = () =>{
      signInWithPopup(auth, googleProvider)
      .then(result => {
        console.log(result.user)
        returnHome(location?.state ? location.state : '/');
        
      })
      .catch(error => console.log(error.message))
}

    return (
     <>

      <div className="hero-content my-1 md:flex block w-full bg-[#0059E7]  ">     
        <img className='md:w-[50%]' src="https://img.freepik.com/free-vector/cyber-data-security-online-concept-illustration-internet-security-information-privacy-protection_1150-37328.jpg"  />

        <div className='md:w-[40%]'>
        <form onSubmit={handleToSubmit} className="card-body w-full space-y-3  items-center h-[500px] ">

        <div className="form-control w-full mx-auto ">
         <h1 className='lg:text-4xl  font-bold text-white'>Acccount Login </h1>
         <p className='text-slate-300 text-[14px] lg:text-lg py-3'>Plese login your account and get the services, Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa, officia.</p>
        </div>

        <div className="form-control w-full  md:w-[80%] mx-auto ">
        <label className=" text-white text-lg text-left mb-2">Email </label>
        <input type="email"  name='email' placeholder="enter your email" className="input rounded-none " required />
        </div>

        <div className="form-control w-full md:w-[80%] mx-auto ">
        <label className=" text-left text-white text-lg mb-2 ">Password  </label>
        <input type="password" name='password' placeholder="enter your password" className="input rounded-none" required />
        </div>

        <div className="form-control w-full  md:w-[80%] mx-auto "> 
              <button className="btn btn-success mt-4 border-0 rounded-none hover:bg-slate-500 ">Login</button> 
              <Link to={'/register'} className='py-2 text-left text-[12px] lg:text-lg  text-white' >don't have an any account ? <span className="text-lime-400">please register </span></Link> 
        </div>
        </form>
         <div className='w-[80%] mx-auto'>
        <button onClick={handleGoogleSingIn} className="border-2 lg:mt-10 bg-slate-300 border-white p-2 flex  justify-center w-full lg:w-[22rem] mx-auto font-bold  "> <FcGoogle className="text-2xl mr-3"> </FcGoogle>  Continue with Google</button> 
         </div>
        </div>
     </div>

     
     </>
    );
};

export default Login;


