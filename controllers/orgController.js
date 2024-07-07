const { Organisation, User } = require('../models');

exports.getAllOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll();
    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Error retrieving organisations',
      statusCode: 400,
    });
  }
};

exports.getUserOrganisations = async (req, res) => {
  const { userId } = req.user; // Assuming req.user is populated by authMiddleware

  try {
    const user = await User.findOne({
      where: { userId },
      include: [
        {
          model: Organisation,
          as: 'Organisations',
          through: { attributes: [] }, // to exclude attributes from the join table
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

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: user.Organisations.map(org => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    });
  } catch (error) {
    console.error('Error retrieving organisations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      statusCode: 500,
    });
  }
};


exports.getOrganisationById = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.user; // Assuming req.user is populated by authMiddleware

  try {
    const organisation = await Organisation.findOne({
      where: { orgId: orgId },
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] }, // Exclude join table attributes
          where: { userId },
          required: true, // Ensure the user must belong to the organisation
        },
      ],
    });

    if (!organisation) {
      return res.status(404).json({
        status: 'error',
        message: 'Organisation not found or access denied',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error('Error retrieving organisation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      statusCode: 500,
    });
  }
};

exports.createOrganisation = async (req, res) => {
  const { userId } = req.user; // Assuming req.user is populated by authMiddleware
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Name is required',
      statusCode: 400,
    });
  }

  try {
    const organisation = await Organisation.create({
      name,
      description,
    });

    const user = await User.findByPk(userId);
    if (user) {
      await user.addOrganisation(organisation);
    }

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error('Error creating organisation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      statusCode: 500,
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'User ID is required',
      statusCode: 400,
    });
  }

  try {
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: 'error',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        statusCode: 404,
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    console.error('Error adding user to organisation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      statusCode: 500,
    });
  }
};
