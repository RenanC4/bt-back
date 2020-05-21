class RiotService {
  constructor(axios, config) {
    this._axios = axios;
    this._config = config;
  }

  async findUserByName(name) {
    try {
      const url = `${this._config.rito.USER_URL}/${name}`;
      console.log(url);
      const {id, accountId, summonerLevel} =
        await this._axios.get(url, {
          params: {api_key: this._config.rito.API_KEY},
        },
        ).then((response) => {
          return response.data;
        });
      return {id, accountId, summonerLevel};
    } catch (e) {
      return e;
    }
  }


  async getUserFullInfo(id) {
    try {
      const url = `${this._config.rito.USER_FULL_URL}/${id}`;
      console.log(url);
      const userFullInfo =
        await this._axios.get(url, {
          params: {api_key: this._config.rito.API_KEY},
        },
        ).then((response) => {
          return response.data;
        });
      return userFullInfo;
    } catch (e) {
      return e;
    }
  }
}

module.exports = (axios, config) =>
  new RiotService(axios, config);
