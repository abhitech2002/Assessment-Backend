import mongoose from 'mongoose'

const signUpSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
        {
            timestamps: true
        }

)

export const SignUp = mongoose.model('SignUp', signUpSchema)