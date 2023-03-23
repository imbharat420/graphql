import graphql, { GraphQLID, GraphQLSchema } from "graphql";
import axios from "axios"
import User from "../models/User.js"
import Template from "../models/Template.js"
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
} = graphql


const UserType = new GraphQLObjectType({
    name:"User",
    fields: {
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        avatar: { type: GraphQLString },
        password: { type: GraphQLString }
    }
})

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: {
    url: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const UploadedImageType = new GraphQLObjectType({
  name: "UploadedImage",
  fields: {
    url: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
    expires_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const TemplateType = new GraphQLObjectType({
  name: "Template",
  fields: {
    images: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ImageType))) },
    currentImage: { type: new GraphQLNonNull(ImageType) },
    uploadedImage: { type: new GraphQLNonNull(UploadedImageType) },
    user: {
        type: new GraphQLNonNull(UserType),
        resolve(parentValue, args) {
            return User.findOne({ _id: parentValue.user })
        }
    },
    
  },
});

 
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return User.findOne({ _id: args.id })
            }
        },
        template:{
            type: TemplateType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return Template.findOne({ _id: args.id })
            }
        }
    }
}); 

const ImageInputType = new GraphQLInputObjectType({
    name: 'ImageInput',
    fields: () => ({
        url: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLID },
        width: { type: new GraphQLNonNull(GraphQLInt) },
        height: { type: new GraphQLNonNull(GraphQLInt) },
    })
});

const UploadedImageInputType = new GraphQLInputObjectType({
    name: 'UploadedImageInput',
    fields: () => ({
        url: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLID },
        width: { type: new GraphQLNonNull(GraphQLInt) },
        height: { type: new GraphQLNonNull(GraphQLInt) },
        expires_at: { type: new GraphQLNonNull(GraphQLString) },
    })
});



const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                avatar: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return User.create(args)
            }
        },
        deleteUser:{
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, args) {
                return User.findByIdAndDelete(args.id)
            }
        },

        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                avatar: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return User.findByIdAndUpdate(args.id, args, { new: true })
            }
        },


        addTemplate: {
            type: TemplateType,
            args: {
                images: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ImageInputType))) },
                currentImage: { type: new GraphQLNonNull(ImageInputType) },
                uploadedImage: { type: new GraphQLNonNull(UploadedImageInputType) },
                user: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parentValue, args) {
                // create a new template object with the input arguments
                const newTemplate = new Template({
                    images: args.images,
                    currentImage: args.currentImage,
                    uploadedImage: args.uploadedImage,
                    user: args.user
                });
                
                try {
                    // save the new template to the database and return it as the result of the mutation
                    const result = await newTemplate.save();
                    return result;
                } catch (err) {
                    throw new Error(err);
                }
            }
        },
        deleteTemplate:{
            type: TemplateType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, args) {
                return Template.findByIdAndDelete(args.id)
            }
        },
        
        editTemplate: {
            type: TemplateType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                images: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ImageInputType))) },
                currentImage: { type: new GraphQLNonNull(ImageInputType) },
                uploadedImage: { type: new GraphQLNonNull(UploadedImageInputType) },
                user: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parentValue, args) {
                // find the Template document by its ID
                const template = await Template.findById(args.id);
                
                if (!template) {
                    throw new Error(`Template with ID ${args.id} not found`);
                }
                
                // update the template's fields with the input arguments
                template.images = args.images;
                template.currentImage = args.currentImage;
                template.uploadedImage = args.uploadedImage;
                template.user = args.user;
                
                try {
                    // save the updated template to the database and return it as the result of the mutation
                    const result = await template.save();
                    return result;
                } catch (err) {
                    throw new Error(err);
                }
            }
        },

        pushImage: {
            type: ImageType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) },
                id: { type: GraphQLID },
                width: { type: new GraphQLNonNull(GraphQLInt) },
                height: { type: new GraphQLNonNull(GraphQLInt) },
                templateId: { type: new GraphQLNonNull(GraphQLString) }
            },
            async  resolve(parentValue, args) {
                 // create a new Image object with the input arguments
                const currentImage = { 
                    url: args.url, 
                    id: args.id, 
                    width: args.width, 
                    height: args.height 
                };
                
                try {
                    // find the Template document by its ID and update it with the new Image
                    const updatedTemplate = await Template.findByIdAndUpdate(
                        args.templateId,
                        {
                            $set: { currentImage },
                            $push: { images: currentImage },
                        },
                        { new: true }
                    );
                    // return the newly created Image as the result of the mutation
                    return updatedTemplate.images[updatedTemplate.images.length - 1];
                } catch (err) {
                    throw new Error(err);
                }
            }
        },

      
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                email: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                avatar: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return User.findByIdAndUpdate(args.id, args, { new: true })
            }
        },
    }
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
})

export default schema
