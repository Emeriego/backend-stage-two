const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models');
const { addToBlacklist } = require('../helpers/blacklist');


exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.create({
      name: `${firstName}'s Organisation`,
      description: '',
    });

    await user.addOrganisation(organisation);

    const token = jwt.sign({ userId: user.userId }, 'secretKey', {
      expiresIn: '1h',
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, 'secretKey', {
      expiresIn: '1h',
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers['authorization'];
    addToBlacklist(token);
    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      statusCode: 500,
    });
  }
};


exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user; // Assuming req.user is populated by authMiddleware

  try {
    const user = await User.findOne({
      where: { userId: id },
      include: [
        {
          model: Organisation,
          as: 'Organisations',
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        statusCode: 404,
      });
    }

    if (user.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access',
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        organisations: user.organisations,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      statusCode: 500,
    });
  }
};
