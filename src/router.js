const express = require('express');
const axios = require('axios');

const constants = require('./constants');
const config = require('../config/general');

const userController = require('./controllers/UserController');
const teamController = require('./controllers/TeamController');

const userService = require('./services/UserService');
const riotService = require('./services/RiotService');
const teamService = require('./services/TeamService');

const UserModel = require('./models/User');
const TeamModel = require('./models/Team');

// eslint-disable-next-line new-cap
const router = express.Router();

const userDatabaseService = userService(
    UserModel,
);

const riotUserService = riotService(
    axios,
    config,
);

const teamDatabaseService = teamService(
    TeamModel,
);

const user = userController(
    riotUserService,
    userDatabaseService,
    constants,
    teamDatabaseService,
);

const team = teamController(
    teamDatabaseService,
    userDatabaseService,
);
router.get('/users', user.getAllUsers.bind(user));//
router.get('/users/find', user.findUsersByTags.bind(user));//
router.get('/users/user', user.findUsersById.bind(user));//
router.post('/users', user.insertUser.bind(user));//
router.put('/users', user.updateUser.bind(user));//
router.delete('/users', user.deleteUser.bind(user));//
router.post('/users/addFriend', user.addFriend.bind(user));//
router.post('/users/acceptFriendship', user.acceptFriendship.bind(user));//
router.delete('/users/deleteFriend', user.deleteFriend.bind(user));//
router.post('/users/acceptTeam', user.acceptTeam.bind(user));//
router.delete('/users/deleteTeam', user.deleteTeam.bind(user));//

router.post('/teams', team.createTeam.bind(team));//
router.delete('/teams/deleteMember', team.deleteMember.bind(team));//
router.delete('/teams/deleteTeam', team.deleteTeam.bind(team));

module.exports = router;
