import Admin from '../model/admin.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';




// To register New Admin 

export const register = async (req, res) => { 
    try {
        const { name, phone, password, role } = req.body;

        if (!name || !phone || !password) {
            return res.status(401).json({ message: 'All Fields are required.!!!' });
        }

    
        const existingPhone = await Admin.findOne({ phone }); 
        if (existingPhone) {
            return res.status(401).json({ message: 'Phone Number Already Exists' });
        }

        const newAdmin = await Admin.create({
            name,
            phone,
            password,
            role
        });

        res.status(201).json({
            message: 'Admin Created successfully',
            newAdmin: {
                id: newAdmin._id,
                name: newAdmin.name,
                phone: newAdmin.phone
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// TO Login Admin

export const login =async (req, res) => {
    try{
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: ' All Fields are required.!!!'});
        }

        const admin = await Admin.findOne({ name });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid Name or Password '})
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Name or Password'});
        }

        const token = generateToken(admin._id, admin.role);

        res.status(201).json({
            message: 'Login Successfully',
            token,
            admin: {
                name: admin.name,
                phone: admin.phone
            }
        })
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}