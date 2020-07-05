const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require("method-override")
const expressSanitizer = require("express-sanitizer")
const mongoose = require('mongoose')
const app = express()

// App Configuration
mongoose.connect("mongodb://localhost/blogApp")
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))

// Mongoose Model Configuration
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String, 
    created: {type: Date, default: Date.now}
})
const Post = mongoose.model("post", postSchema)

// Routes
app.get('/', (req, res) => {
    res.redirect("/blogs")
})

// Index Route
app.get('/blogs', (req, res) => {
    Post.find({}, (err, allPosts) => {
        if (err) {
            console.log(error)
        } else {
            res.render("index", {posts: allPosts})
        }
    })
})

// Create Route
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.santize(req.body.blog.body)
    Post.create(req.body.blog, (err, blog) => {
        if (err) {
            console.log(err)
        } else {
            console.log(blog)
            res.redirect('/blogs')
        }
    })
})

// New Route
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

// Show Route
app.get('/blogs/:id', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            console.log(post)
            res.render('show', {blog: post})
        }
    })
})

// Edit Route 
app.get('/blogs/:id/edit', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            res.render("edit", {post : post})
        }
    })
})

// Update Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.santize(req.body.blog.body)
    Post.findByIdAndUpdate(req.params.id, req.body.blog, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

// Destroy Route
app.delete('/blogs/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, req.body.blog, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/")
        } else {
            res.redirect("/")
        }
    })
})

app.listen("3000", () => {
    console.log("Blog Server is Running.")
})