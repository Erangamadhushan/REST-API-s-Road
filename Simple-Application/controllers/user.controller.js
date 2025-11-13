exports.getUsers = (req, res) => {
    res.json({ message: 'Returning list of users' });
}

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Returning user with ID ${userId}` });
}

exports.createUser = (req, res) => {
    const newUser = req.body;
    res.json({ message: 'User created', user: newUser });
}

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    res.json({ message: `User with ID ${userId} updated`, updatedUser });
}

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User with ID ${userId} deleted` });
}

