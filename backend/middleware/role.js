export const roleMiddileware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated'});
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(401).json({ message: 'Access denied.'})
        }

        next();
    };
};