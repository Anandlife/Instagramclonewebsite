import React, { useState } from "react";

import { Link, useHistory } from 'react-router-dom';

import M from 'materialize-css'

const Signup = () =>
{

    const history = useHistory()

    const [ name, setName ] = useState( "" )
    const [ password, setPassword ] = useState( "" )
    const [ email, setEmail ] = useState( "" )

    const PostData = () =>
    {

        if ( ! /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test( email ) )
        {

            M.toast( { html: "Invalid Email Id", classes: "#d32f2f red darken-2" } )

            return


        }

        if ( !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test( password ) )
        {

            M.toast( { html: "PassWord Should be: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character ", classes: "#d32f2f red darken-2" } )

            return



        }


        fetch( "/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {
                name,
                password,
                email
            } )
        } )
            .then( res => res.json() )

            .then( data =>
            {
                if ( data.error )
                {
                    M.toast( { html: data.error, classes: "#d32f2f red darken-2" } )
                }
                else
                {
                    M.toast( { html: data.message, classes: "#00c853 green accent-4" } )
                    history.push( '/signin' )
                }
            } ).catch( err =>
            {
                console.log( err )
            } )


    }



    return (

        <div className="mycard">



            <div className="card auth-card input-field">

                <h2>Instagram</h2>

                <input type="text" placeholder="name"

                    value={name}
                    onChange={( e ) => setName( e.target.value )}

                />
                <input type="text" placeholder="email"

                    value={email}
                    onChange={( e ) => setEmail( e.target.value )}

                />
                <input type="password" placeholder="password"

                    value={password}
                    onChange={( e ) => setPassword( e.target.value )}

                />

                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                    onClick={() => PostData()}>
                    Signup
                </button>

                <h5>

                    <Link to="/signin"> Already have an account? </Link>
                </h5>




            </div>

        </div>



    )
}

export default Signup