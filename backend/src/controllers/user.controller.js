const userRepository = require('../repositories/user.repository');

const listUsers = async (req, res, next) => {
  try {
    const users = await userRepository.listByOrganization(req.user.organization_id);
    return res.status(200).json({ status: 200, code: 'USERS_LISTED', data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers };
