import { React, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners";
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from 'axios';


const Register = () => {
    const navigate = useNavigate();
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
            const url = " https://login-logout-wdyh.onrender.com/register"
            const response = await axios.post(url, userData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data)
            alert("User registered successfully!");
            setError(false)
            navigate("/login");
        } catch (err) {
            setError(true);
            if (err.response && err.response.status === 401) {
                setErrorMsg("Invalid username or password");
            } else {
                setErrorMsg(err.response.data.message);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <section className="bg">
                <div className="login-container">
                    <div className="button-container">
                        <button className="button">
                            <Link className="link" to="/login"><MdOutlineArrowBackIos size={10} />
                            </Link>
                        </button>
                        <h2>Register</h2>
                    </div>

                    <form id="loginForm" onSubmit={submitForm}>
                        <div className="input-group">
                            <label htmlFor="Email">Email</label>
                            <input type="email" id="username" value={username} name="Email" placeholder="Email" required onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {!loader && <button className="login-button" type="submit">Register</button>}
                        {loader && <div className="loader-button">
                            <ClipLoader color="#36d7b7" size={18} />
                        </div>}
                        {error && <p id="error-message">{errormsg}</p>}
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Register