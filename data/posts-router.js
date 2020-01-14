const router = require("express").Router();

const Posts = require("./db");

//Request handlers go here.

/* 

***~ EXAMPLE OF ROUTER ACTION SYNTAX: ~***

router.action("/", (request, response) => {
    const id = request.params.id;
    if (REQUIRED && parameters) {
        Database.doThing().then().catch()
    }
    else{ 
        response.send("Post not updated. Please supply the post's REQUIRED PARAMETERS.");    
    }
}); 

*/

router.post("/", (request, response) => {
    // console.log(request);
    if (request.body.title && request.body.contents) {
        Posts.insert(request.body)
            .then((newPostID) => {
                response.status(201).json({
                    ...request.body,
                    ...newPostID
                })
            })
            .catch((error) => {
                response.status(500).json({
                    errorText: "There was an error while saving the post to the database.",
                    errorMessage: error,
                })
                console.log("ERROR IS: ", error);
            });
    }
    else {
        response.send("Post not posted (kek). Please supply the post's title and contents.");
    }
})

router.post("/:id/comments", (request, response) => {
    const id = request.params.id;
    if (request.body.text && request.params.id) {
        Posts.insertComment(request.body)
            .then((commentID) => {
                response.status(201).json({ ...request.body, ...commentID })
            })
            .catch((error) => {
                response.status(500).json({
                    errorText: "There was an error while saving the comment to the database.",
                    errorMessage: error,
                })
                console.log("ERROR IS: ", error);
            });
    }
    else {
        response.status(400).json({ error: "Comment not posted, please supply some text and an ID..." })
    }
})

router.get("/", (request, response) => {
    Posts.find()
        .then((posts) => {
            response.status(200).json({ ...posts });
        })
        .catch((error) => {
            response.status(500).json({
                errorText: "There was an error while getting posts from the database.",
                errorMessage: error,
            })
            console.log("ERROR IS: ", error);
        });
})

router.get("/:id", (request, response) => {
    const id = request.params.id;
    Posts.findById(id)
        .then((post) => {
            if (post) {
                response.status(200).json({
                    ...post
                })
            }
            else {
                response.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch((error) => {
            response.status(500).json({
                errorText: "There was an error while getting the post from the database.",
                errorMessage: error,
            })
            console.log("ERROR IS: ", error);
        });
})

router.get("/:id/comments", (request, response) => {
    const id = request.params.id;
    Posts.findPostComments(id)
        .then((comments) => {
            // console.log("COMMENTS AFTER ROUTER GET ARE: ", comments);
            // console.log(comments);
            if (comments.length !== 0) {
                response.status(200).json({ ...comments });
            }
            else {
                response.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch((error) => {
            response.status(500).json({
                errorText: "There was an error while getting the comments from the database.",
                errorMessage: error,
            })
            console.log("ERROR IS: ", error);
        });
})

router.delete("/:id", (request, response) => {
    const id = request.params.id;
    Posts.remove(id)
        .then((recordsDeleted) => {
            if (recordsDeleted !== 0) {
                response.status(200).json({ ...recordsDeleted });
            }
            else {
                response.status(404).json({ message: "A post with the specified ID does not exist." })
            }
        })
        .catch((error) => {
            response.status(500).json({
                errorText: "There was an error while getting the comments from the database.",
                errorMessage: error,
            })
            console.log("ERROR IS: ", error);
        });
})

router.put("/:id", (request, response) => {
    const id = request.params.id;
    if (request.body.title && request.body.contents) {
        Posts.update(id, request.body)
            .then((postsUpdated) => {
                if (postsUpdated) {
                    response.status(200).json({ ...request.body });
                }
                else {
                    response.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
                }
            })
            .catch((error) => {
                response.status(500).json({
                    errorText: "Internal server read error on HTTP request.",
                    errorMessage: error,
                })
                console.log("ERROR IS: ", error);
            });
    }
    else {
        response.send("Post not updated. Please supply the post's title and contents.");
    }
});

module.exports = [router];