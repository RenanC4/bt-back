class UserController {
	constructor(riotService, userService, constants, teamService) {
		this._riotService = riotService;
		this._userService = userService;
		this._constants = constants;
		this._teamService = teamService;
	}

	async _createFriendshipObjects(userId, username, friendUserId, friendName) {
		const userObject = {
			username: friendName,
			_id: friendUserId,
			status: 'enviado',
		};
		const friendObject = {
			username,
			_id: userId,
			status: 'pendente',
		};
		return { userObject, friendObject };
	}

	async getAllUsers(req, res, next) {
		try {
			console.log(req.query)
			const offset = Number(req.query.offset) || 0

			const users = await this._userService.getAllUsers(offset);
			return res.json(users);
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async findUsersByTags(req, res, next) {
		try {
			const { tags } = req.query;
			let splitedTags;
			!tags ? splitedTags = [] :
				splitedTags = tags.split(',');
			const users = await this._userService.findUsersByTags(splitedTags);
			return res.json(users);
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async findUsersById(req, res, next) {
		try {
			const userId = req.headers.authorization;
			const user = await this._userService.findUsersById(userId);
			return res.json(user);
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async insertUser(req, res, next) {
		try {
			const { name } = req.body;
			const userExists = await this._userService.findUserByName(name);
			if (userExists) {
				return res.json(userExists);
			}

			const { id: summonerId, accountId, summonerLevel: level } =
				await this._riotService.findUserByName(name);

			const userFullInfo = await this._riotService.getUserFullInfo(summonerId);

			const rank = new Array;
			userFullInfo.forEach((info) => {
				rank.push(
					{
						ranked: info.queueType,
						tier: info.tier, rank: info.rank,
					},
				);
			});

			let rankTag;
			rank.length === 0 ? rankTag = '#UNRANKED' :
				rankTag = `#${rank[0].tier}`;

			const bio = 'Digite algo legal sobre voce';
			const tags = ['#FORFUN', rankTag, '#ROLE'];
			const status = 'online';
			const userToInsert = {
				name,
				summonerId,
				accountId,
				level,
				bio,
				tags,
				status,
				rank,
			};
			const createUser = await this._userService.createUser(userToInsert);
			return res.json(createUser);
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async updateUser(req, res, next) {
		try {
			const { _id, bio, tags } = req.body.data;
			const teste = await this._userService.updateUser(_id, bio, tags);
			return res.json({ status: 200, message: 'Usuário editado com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async deleteUser(req, res, next) {
		try {
			const { _id } = req.body;
			await this._userService.deleteUser(_id);
			return res.json({ status: 200, message: 'Usuário removido com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async addFriend(req, res, next) {
		try {
			const { friendId, friendName, name, _id } = req.body;

			const { userObject, friendObject } = await this._createFriendshipObjects(_id, name, friendId, friendName);
			const userInfo = await this._userService.findUsersById(_id);
			const myFriendsList = userInfo.friends;
			const haveFriendInList = myFriendsList.find((friend) => friend._id === friendId);
			if (haveFriendInList) return res.json({ status: 200, message: 'Ooops, você ja enviou uma solicitação para esse usuario!' });
			myFriendsList.push(userObject);
			await this._userService.updateFriendsList(_id, myFriendsList);

			const friendInfo = await this._userService.findUsersById(friendId);
			const myFriendsFriendList = friendInfo.friends;
			const haveFriendInFriendsList = myFriendsFriendList.find((friend) => friend._id === _id);
			if (haveFriendInFriendsList) return res.json({ status: 200, message: 'Ooops, você ja enviou uma solicitação para esse usuario!' });
			myFriendsFriendList.push(friendObject);
			await this._userService.updateFriendsList(friendId, myFriendsFriendList);

			return res.json({ status: 200, message: 'Solicitação enviada com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async acceptFriendship(req, res, next) {
		try {
			const { _id, friendId } = req.body;
			const userInfo = await this._userService.findUsersById(_id);
			const userFriends = userInfo.friends;
			await userFriends.forEach((friend) => {
				if (friend._id === friendId) {
					friend.status = 'aceito';
				}
			});
			await this._userService.updateFriendsList(_id, userFriends);

			const friendInfo = await this._userService.findUsersById(friendId);
			const friendFriends = friendInfo.friends;
			await friendFriends.forEach((friend) => {
				if (friend._id === _id) {
					friend.status = 'aceito';
				}
			});
			await this._userService.updateFriendsList(friendId, friendFriends);
			return res.json({ status: 200, message: 'Adicionado com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async deleteFriend(req, res, next) {
		try {
			const { friendId, _id } = req.body;
			const userInfo = await this._userService.findUsersById(_id);
			const userFriends = userInfo.friends;

			const newListOfFriends = await userFriends.filter((friend) => friend._id !== friendId);
			await this._userService.updateFriendsList(_id, newListOfFriends);

			const friendInfo = await this._userService.findUsersById(friendId);
			const friendFriends = friendInfo.friends;
			const newListOfFriendsFriends = await friendFriends.filter((friend) => friend._id !== _id);

			await this._userService.updateFriendsList(friendId, newListOfFriendsFriends);
			return res.json({ status: 200, message: 'Removido com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async acceptTeam(req, res, next) {
		try {
			const _id = req.headers.authorization;
			const { teamId, role } = req.body;
			await this._userService.updateTeamsList(_id, teamId);
			await this._teamService.updateMemberList(role, teamId);
			return res.json({ status: 200, message: 'Time aceito com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}

	async deleteTeam(req, res, next) {
		try {
			const _id = req.headers.authorization;
			const { teamId, role } = req.body;

			this._userService.removeTeam(_id, teamId);
			this._teamService.removeMember(role, teamId);
			return res.json({ status: 200, message: 'Time removido com sucesso!' });
		} catch (e) {
			e.status = 500;
			return next(e);
		}
	}
}

module.exports = (axios, userModel, constants, teamService) =>
	new UserController(axios, userModel, constants, teamService);
