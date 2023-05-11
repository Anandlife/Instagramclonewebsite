const express = require( 'express' )

const router = express.Router()

const mongoose = require( 'mongoose' )

const requirelogin = require( '../middleware/requireLogin' )

const Post = mongoose.model( "Post" )


router.get( '/allpost', requirelogin, ( req, res ) =>
{
    Post.find()
        .populate( "postedBy", "_id name" )
        .then( posts =>
        {
            res.json( { posts } )
        } )
        .catch( err =>
        {
            console.log( err )
        } )
} )


router.post( '/createpost', requirelogin, ( req, res ) =>
{
    const { title, body, pic } = req.body

    if ( !title || !body || !pic )
    {
        return res.status( 422 ).json( { error: "Please add all the fields" } )
    }


    req.user.password = undefined

    const post = new Post( {
        title,
        body,
        photo: pic,
        postedBy: req.user

    } )

    post.save().then( result =>
    {
        res.json( { post: result } )
    } )
        .catch( err =>
        {
            console.log( err )
        } )


} )

router.get( '/mypost', requirelogin, ( req, res ) =>
{
    Post.find( { postedBy: req.user._id } )
        .populate( "postedBy", "_id name" )
        .then( mypost =>
        {
            res.json( { mypost } )
        } )
        .catch( err =>
        {
            console.log( err )
        } )
} )

router.put( '/like', requirelogin, ( req, res ) =>
{
    Post.findByIdAndUpdate( req.body.postId, {

        $push: { likes: req.user._id },
    }, {
        new: this.true
    } ).exec( ( err, result ) =>
    {
        if ( err )
        {
            return res.status( 422 ).json( { error: err } )
        }
        else
        {
            res.json( result )
        }
    } )
} )

router.put( '/unlike', requirelogin, ( req, res ) =>
{
    Post.findByIdAndUpdate( req.body.postId, {

        $pull: { likes: req.user._id },
    }, {
        new: this.true
    } ).exec( ( err, result ) =>
    {
        if ( err )
        {
            return res.status( 422 ).json( { error: err } )
        }
        else
        {
            res.json( result )
        }
    } )
} )

router.put( '/comment', requirelogin, ( req, res ) =>
{

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate( req.body.postId, {

        $push: { comments: req.comment},
    }, {
        new: this.true
    } )
        .populate("comments:postedBy", "_id name")
        
        .exec( ( err, result ) =>
    {
        if ( err )
        {
            return res.status( 422 ).json( { error: err } )
        }
        else
        {
            res.json( result )
        }
    } )
} )

module.exports = router 