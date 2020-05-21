class TeamService {
  constructor(teamModel) {
    this._teamModel = teamModel;
  }

  async checkIfExists(name) {
    try {
      const team = await this._teamModel.findOne({name});
      console.log(team);
      return team;
    } catch (e) {
      return e;
    }
  }

  async createTeam(name, description, captain, members) {
    try {
      const team = await this._teamModel.create({
        name,
        description,
        captain,
        members,
      });
      return team;
    } catch (e) {
      return e;
    }
  }

  async deleteTeam(_id) {
    try {
      await this._teamModel.deleteOne({_id});
    } catch (e) {
      return e;
    }
  }

  async removeMember(role, teamId ) {
    try {
      const team = await this._teamModel.findOne({_id: teamId});
      const newListOfMembers = await team.members.filter((member) => member.role != role);

      await this._teamModel.updateOne({_id: teamId}, {
        $set: {
          members: newListOfMembers,
        },
        upsert: true,
      });
      return;
    } catch (e) {
      return e;
    }
  }

  async updateMemberList(role, teamId) {
    try {
      const team = await this._teamModel.findOne({_id: teamId});
      const members = team.members;
      await members.forEach((member) => {
        if (member.role === role) {
          member.status = 'aceito';
        }
      });
      await this._teamModel.updateOne({_id: teamId}, {
        $set: {
          members,
        },
        upsert: true,
      });
      return;
    } catch (e) {
      return e;
    }
  }
}

module.exports = (teamModel) =>
  new TeamService(teamModel);
