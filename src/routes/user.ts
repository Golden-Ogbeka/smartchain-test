import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../schema/userSchema';

const router = express.Router();
const SECRET = 'SECRET';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and Password are required' });
    }

    const UserFound = await User.findOne({ username, password });
    if (UserFound) {
      //Check if token is still active
      const activeToken = UserFound.token ? jwt.verify(UserFound.token, SECRET) : false;
      if (!activeToken) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });

        UserFound.token = token;
        await UserFound.save();

        return res.send({
          message: 'Login Successful',
          user: UserFound,
        });
      } else {
        // Log user in without creating a new token
        return res.send({
          message: 'Login Successful',
          user: UserFound,
        });
      }
    } else {
      return res.status(401).send({ message: 'Incorrect username or password' });
    }
  } catch (error) {
    return res.status(500).send({ 'Server error': error });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and Password are required' });
    }

    const UserFound = await User.findOne({ username });
    if (UserFound) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    const newUser = await new User({
      username,
      password,
    });
    await newUser.save();

    return res.send({
      message: 'Registration Successful',
      user: newUser,
    });
  } catch (error) {
    return res.status(500).send({ 'Server error': error });
  }
});

router.post('/logout', async (req, res) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        message: 'Invalid User',
      });
    }

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, '');
    const userVerified = jwt.verify(token, SECRET);

    if (userVerified) {
      const UserFound = await User.findOne({ token });
      if (UserFound) {
        const newToken = jwt.sign({ username: UserFound?.username }, SECRET, {
          expiresIn: '1h',
        });

        UserFound.token = newToken;

        UserFound.save();
      } else {
        return res.status(401).send({
          message: 'Invalid Token',
        });
      }
      return res.send({
        message: 'Logout Successful',
      });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Server Error ' + error });
  }
});

// View users
router.get('/', async (req, res) => {
  try {
    const UsersFound = await User.find();
    return res.send({
      message: 'Users retrieved',
      users: UsersFound,
    });
  } catch (error) {
    return res.status(500).send({ 'Server error': error });
  }
});

export default router;
