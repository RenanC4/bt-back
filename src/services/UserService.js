class UserService {
  constructor(userModel) {
    this._userModel = userModel;
  }

  async getAllUsers(offset) {
    try {
			const users = await this._userModel.find().skip(offset);
			offset = users.length === 10 ?
			offset + 10 :
			offset

			const allUsers = {offset, users}
			console.log(allUsers)
      return allUsers;
    } catch (e) {
      return e;
    }
  }

  async findUsersByTags(splitedTags) {
    try {
      const users = await this._userModel.find({tags: {$all: splitedTags}});
      return users;
    } catch (e) {
      return e;
    }
  }

  async findUsersById(_id) {
    try {
      const user = await this._userModel.findOne({_id});
      return user;
    } catch (e) {
      return e;
    }
  }

  async findUserByName(name) {
    try {
      const user = await this._userModel.findOne({name});
      return user;
    } catch (e) {
      return e;
    }
  }

  async createUser({name, summonerId, accountId, level, bio, tags, status, rank}) {
    try {
			const friends = []
			const teams = []
      const user = await this._userModel.create({
        name,
        summonerId,
        accountId,
        level,
        bio,
        tags,
        status,
        rank,
      });
      return user;
    } catch (e) {
      return e;
    }
  }

  async updateUser(_id, bio, tags) {
    try {
      const response = await this._userModel.updateOne({_id}, {
        $set: {
          bio,
          tags,
        },
        upsert: true,
      });
      return response;
    } catch (e) {
      return e;
    }
  }

  async deleteUser(_id) {
    try {
      await this._userModel.deleteOne({_id});
    } catch (e) {
      return e;
    }
  }

  async updateFriendsList(_id, friends) {
    await this._userModel.updateOne({_id}, {
      $set: {
        friends,
      },
      upsert: true,
    });
  }

  async addTeam(_id, teamId, role, status, name) {
    const userInformation = await this.findUsersById(_id);
    const teams = userInformation.teams || Array;
    teams.push({name, teamId, role, status});
    await this._userModel.updateOne({_id}, {
      $set: {
        teams,
      },
      upsert: true,
    });
	}

  async removeTeam(_id, teamId) {
    const userInformation = await this.findUsersById(_id);
    const teams = userInformation.teams;

    const newListOfTeams = await teams.filter((team) => {
      team.teamId != teamId;
      return;
    });
    await this._userModel.updateOne({_id}, {
      $set: {
        teams: newListOfTeams,
      },
      upsert: true,
    });
  }

  async updateTeamsList(_id, teamId) {
    const userInformation = await this.findUsersById(_id);
    const teams = userInformation.teams;
    await teams.forEach((team) => {
      if (team.teamId == teamId) {
        team.status = 'aceito';
      }
    });
    await this._userModel.updateOne({_id}, {
      $set: {
        teams,
      },
      upsert: true,
    });
  }
}

module.exports = (userModel) =>
  new UserService(userModel);
