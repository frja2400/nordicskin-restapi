const User = require('../models/user');

// Hämta alla användare
exports.getAllUsers = async (request, h) => {
    try {
        return h.response({ users: await User.find() }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not fetch users' }).code(500);
    }
};

// Hämta användare med specifikt id
exports.getUserById = async (request, h) => {
    try {
        // Hämta id från routens parametrar
        const { id } = request.params;
        // Hämta användaren från databasen
        const user = await User.findById(id);

        if (!user) {
            return h.response({ error: 'User not found' }).code(404);
        }
        return h.response({ user }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not fetch user' }).code(500);
    }
};

// Lägg till användare
exports.addUser = async (request, h) => {
    try {
        // Skapa en ny instans med payload
        const user = new User(request.payload);
        // Spara instansen i databasen
        const savedUser = await user.save();

        return h.response({ user: savedUser }).code(201);
    } catch (error) {
        return h.response({ error: 'Could not add user' }).code(500);
    }
};

// Uppdatera användare med specifikt id
exports.updateUserById = async (request, h) => {
    try {
        const { id } = request.params;
        // Hämta data att uppdatera från payload
        const updateData = request.payload;

        // Hitta och uppdatera användaren med data från request.payload och returnera den uppdaterade användaren
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return h.response({ error: 'User not found' }).code(404);
        }
        return h.response({ user: updatedUser }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not update user' }).code(500);
    }
};

// Ta bort användare med specifikt id
exports.deleteUserById = async (request, h) => {
    try {
        const { id } = request.params;
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return h.response({ error: 'User not found' }).code(404);
        }

        return h.response({ user: deleteUser }).code(200);
    } catch (error) {
        return h.response({ error: 'Could not delete user' }).code(500);
    }
};