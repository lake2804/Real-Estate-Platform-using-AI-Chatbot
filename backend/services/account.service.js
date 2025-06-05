import { regexEmail } from "../constants/index.js";
import account from "../schemas/account.schema.js";
import bcrypt from "bcrypt";

const passwordHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Error hashing password");
    }
}
const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        if (!regexEmail.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const checkExistedUser = await getUserByEmail(email);
        if (checkExistedUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const data = await account.create({
            fullName,
            email,
            password: await passwordHash(password)
        });
        if (!data) {
            return res.status(400).json({ error: "User registration failed" });
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error during registration" });
    }

}

const getUserByEmail = async (email) => {
    return await account.findOne({ email }).select("-password -__v").lean();
}



const getUser = async (req, res) => {
    try {
        const { email } = req.query;
        if (!regexEmail.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const data = await getUserByEmail(email);
        if (!data) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
            user: data,
            message: "User found successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Server error!" });
    }
}


const deleteUser = async (email, res) => {
    try {
        const checkExistedUser = await getUserByEmail(email);
        if (!checkExistedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        await account.deleteOne({ email });
        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ error: "Server error during user deletion" });
    }
}


const updateUser = async (req, res) => {
    try {
        const {email, fullName} = req.body;

        if (!email || !fullName) {
            return res.status(400).json({ error: "Email and full name are required" });
        }

        const data = await account.findOneAndUpdate(
            { email },
            { $set: { fullName}},
            { new:true, }
        ).select("-password -__v").lean();
        res.status(200).json({ message: "User updated successfully", user: data });
    } catch (error) {
        res.status(500).json({ error: "Server error during user update" });
    }
}


export default { register, getUser, deleteUser, updateUser };
