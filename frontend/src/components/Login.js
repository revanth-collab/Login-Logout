import { React, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners";
import axios from 'axios';


const Login = () => {
    const navigate = useNavigate()
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errormsg, setErrorMsg] = useState('')
    const [error, setError] = useState(false)
    const [loader, setLoading] = useState(false)

    const submitForm = async (e) => {
        e.preventDefault()
        console.log(username, password)
        try {
            setLoading(true)
            const userData = { username, password }
            const url = "https://login-logout-wdyh.onrender.com/login"
            // const options = {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": 'application/json'
            //     },
            //     body: JSON.stringify(userData)
            // }
            // const response = await axios.post(url, options);
            const response = await axios.post(url, userData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data);
            localStorage.setItem('auth_token', response.data.token)
            setError(false)
            navigate("/");
        } catch (err) {
            setError(true);
            if (err.response && err.response.status === 401) {
                setErrorMsg("Invalid username or password");
            } else {
                setErrorMsg(err.message);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <section className="bg">
                <div className="login-container">
                    <h2>Login</h2>
                    <form id="loginForm" onSubmit={submitForm}>
                        <div className="input-group">
                            <label htmlFor="Email">Email</label>
                            <input type="email" id="username" value={username} name="Email" placeholder="Email" required onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {!loader && <button className="login-button" type="submit">Login</button>}
                        {loader && <div className="loader-button">
                            <ClipLoader color="#36d7b7" size={18} />
                        </div>}
                        <p className="text">Don't have Account <Link to="/register">Register</Link></p>
                        {error && <p id="error-message">{errormsg}</p>}
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Login