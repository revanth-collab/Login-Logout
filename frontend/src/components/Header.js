import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
    const handleLogoutButton = () => {
        localStorage.removeItem('auth_token')
        navigate('/login')
    }
    return (
        <div className='header-container'>
            <Link className='link' to="/"><h1 className=''>Website</h1></Link>
            <div className='header-routes'>
                <Link className="link">Home</Link>
                <Link className="link">About</Link>
                <button type="button" className='logout-button' onClick={handleLogoutButton}>
                    logout
                </button>
            </div>
        </div>
    )
}

export default Header