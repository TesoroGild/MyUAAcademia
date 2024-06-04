import "./login.css";
import React from 'react';

function Login () {
    return (<>
        <div>
            <div></div>
            <div>
                <div>
                    <label htmlFor="email">Email :</label>
                    <input type="email" id="email" name="email" placeholder="Email" />
                    <p>Explication email</p>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe :</label>
                    <input type="password" id="password" name="password" placeholder="Password" />
                    <p>Explication password</p>
                </div>
                <button>Connection</button>
            </div>
        </div>
    </>)
}

export default Login;