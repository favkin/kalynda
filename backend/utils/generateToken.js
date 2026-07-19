import jwt from 'jsonwebtoken';


export const generateToken = (id) => {
    return jwt.sign(
        { id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '3h'}
    );
};

