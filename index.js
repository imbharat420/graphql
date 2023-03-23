import express from "express"
import graphql from "graphql"
import connectDB from "./config/connectDB.js"
import { graphqlHTTP } from "express-graphql"
import schema from "./schema/user.js"
const app = express()

connectDB()
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
