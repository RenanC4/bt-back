class TeamController {
  constructor(teamService, userService) {
    this._teamService = teamService;
    this._userService = userService;
  }

  async createTeam(req, res, next) {
    try {
      const {name, description, members} = req.body;
      const _id = req.headers.authorization;
      const teamExists = await this._teamService.checkIfExists(name);
      if (teamExists) return res.json({status: 200, message: 'Ooops, ja existe um time com esse nome!'});
      const createdTeam = await this._teamService.createTeam(name, description, _id, members);
      members.forEach( async(member) => {
        await this._userService.addTeam(member.id, createdTeam._id, member.role, 'pendente', name);
      });
      return res.json({status: 200, message: 'Time Criado com sucesso!'});
    } catch (e) {
      e.status = 500;
      return next(e);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      const {teamName} = req.body;
      const _id = req.headers.authorization;

      const team = await this._teamService.checkIfExists(teamName);

      if (team.captain !== _id) return res.json({status: 403, message: 'Somente o capitão do time pode desfazer o time!'});

      await this._teamService.deleteTeam(team._id);
      team.members.forEach(async(member) => {
        console.log('removeu');
        await this._userService.removeTeam(member.id, team._id);
      });
      return res.json({status: 200, message: 'Time Removido com sucesso!'});
    } catch (e) {
      e.status = 500;
      return next(e);
    }
  }

  async deleteMember(req, res, next) {
    try {
      const {teamId, memberId, role} = req.body;
      await this._userService.removeTeam(memberId, teamId);
      await this._teamService.removeMember(role, teamId);
      return res.json({status: 200, message: 'Usuário removido com sucesso!'});
    } catch (e) {
      e.status = 500;
      return next(e);
    }
  }
}

module.exports = (teamService, userService) =>
  new TeamController(teamService, userService);
