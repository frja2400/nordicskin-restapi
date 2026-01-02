const User = require('../models/user');
const bcrypt = require('bcrypt');

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

        // Blockera lösenordsändringar via denna route
        if (updateData.password) {
            return h.response({ error: 'Password cannot be updated via this endpoint' }).code(400);
        }

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

// Funktion för att registrera en ny användare med lösenordshashning
exports.registerUser = async (request, h) => {
    try {
        const { name, email, phone, department, password } = request.payload;

        // Kontrollera om e-post redan finns
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return h.response({ error: 'Email already registered' }).code(400);
        }

        // Hasha lösenordet
        const hashedPassword = await bcrypt.hash(password, 10);

        // Skapa ny användare med hashat lösenord
        const newUser = new User({
            name,
            email,
            phone,
            department,
            password: hashedPassword
        });

        // Spara användaren
        const savedUser = await newUser.save();

        return h.response({ user: savedUser }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Could not register user' }).code(500);
    }
};

// Funktion för att logga in en användare
exports.loginUser = async (request, h) => {
    try {
        const { email, password } = request.payload;

        // Hitta användaren med email
        const user = await User.findOne({ email });
        if (!user) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        // Jämför lösenord med hash
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        // Sätt HTTP-only cookie med session
        request.cookieAuth.set({ id: user._id, name: user.name });

        return h.response({ message: 'Login successful', user: { id: user._id, name: user.name } }).code(200);

    } catch (error) {
        console.error(error);
        return h.response({ error: 'Could not log in user' }).code(500);
    }
};

// Logga ut-funktion
exports.logoutUser = (request, h) => {
    // Tar bort cookien
    request.cookieAuth.clear();

    return h.response({ message: 'Logged out successfully' }).code(200);
};

// Hämta info om inloggad användare
exports.getMe = async (request, h) => {
    try {
        const userId = request.auth.credentials.id;

        const user = await User.findById(userId);
        if (!user) {
            return h.response({ message: 'User not found' }).code(401);
        }

        return user;
    } catch (error) {
        return h.response({ message: 'Could not fetch user' }).code(500);
    }
};