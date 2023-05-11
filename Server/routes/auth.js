const express = require( 'express' )

const router = express.Router()

const mongoose = require( 'mongoose' )

const User = mongoose.model( "User" )

const bcrypt = require( 'bcryptjs' )

const jwt = require( 'jsonwebtoken' )

const { JWT_SECRET } = require( '../keys' )

const requireLogin = require( '../middleware/requireLogin' )


router.get( '/', ( req, res ) =>
{

    res.send( "Hello" );
} )


// router.get( '/protected', requireLogin, ( req, res ) =>
// {
//     res.send( "Hello User" )
// } )



router.post( '/signup', ( req, res ) =>
{
    // console.log( req.body )

    const { name, email, password } = req.body

    if ( !email || !password || !name )
    {
        return res.status( 422 ).json( { error: "Please add all the fields" } )
    }

    // res.json( { message: "successfully posted" } )

    User.findOne( { email: email } )
        .then( ( savedUser ) =>
        {
            if ( savedUser )
            {

                return res.status( 422 ).json( { error: "user already exists with that email" } )

            }

            bcrypt.hash( password, 12 )
                .then( hashedpassword =>
                {

                    const user = new User( {
                        email,
                        password: hashedpassword,
                        name
                    } )


                    user.save()
                        .then( user =>
                        {
                            res.json( { message: "saved successfully" } )
                        } )
                        .catch( err =>
                        {
                            console.log( err )
                        } )

                } )

        } )

        .catch( err =>
        {
            console.log( err )
        } )
} )


router.post( '/signin', ( req, res ) =>
{
    const { email, password } = req.body

    if ( !email || !password )
    {

        res.status( 422 ).json( { error: "Pleas add email and password" } )
    }
    User.findOne( { email: email } )
        .then( savedUser =>
        {
            if ( !savedUser )
            {
                return res.status( 422 ).json( { error: "Invalid user and password" } )
            }
            bcrypt.compare( password, savedUser.password )
                .then( doMatch =>
                {
                    if ( doMatch )
                    {
                        // res.json( { message: " Successfully signed In" } )

                        const token = jwt.sign( { _id: savedUser._id }, JWT_SECRET )

                        const { _id, name, email } = savedUser

                        res.json( { token, user: { _id, name, email } } )
                    }
                    else
                    {
                        return res.status( 422 ).json( { error: "Invalid Email or password" } )

                    }
                } )
                .catch( err =>
                {
                    console.log( err )
                } )
        } )
} )

module.exports = router

