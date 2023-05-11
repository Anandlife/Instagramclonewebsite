const express = require( 'express' )

const app = express()

const mongoose = require( 'mongoose' )

const PORT = 5000



const { MONGOURI } = require( './keys' )







mongoose.connect( MONGOURI )

mongoose.set( 'strictQuery', false );

mongoose.connection.on( 'connected', () =>
{
    console.log( "Mongo is Connected Yeah" );
} )

mongoose.connection.on( 'error', ( err ) =>
{
    console.log( "Error in Connecting", err );
} )

// 0bi1WeXTfEzO22kA

// const customMiddleWare = ( req, res, next ) =>
// {

//     console.log( "MiddleWare executed" );

//     next();

// }

// app.use( customMiddleWare );

// app.get( '/', ( req, res ) =>
// {
//     console.log( "Home" );
//     res.send( "This is Home page" );
// } )

// app.get( '/about', customMiddleWare, ( req, res ) =>
// {
//     console.log( "About" );

//     res.send( "This is About Page" );
// } )

app.listen( PORT, () =>
{

    console.log( "Server is Running on PORT ", PORT );
} )


require( './models/user' )

require( './models/post' )

app.use( express.json() )

app.use( require( './routes/auth' ) )

app.use( require( './routes/post' ) )