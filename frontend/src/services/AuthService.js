import axios from 'axios';

const AUTH_API = "https://ravishing-ambition-production-5ef5.up.railway.app/api/auth/login";

class AuthService {
  login(user) {
    return axios.post(AUTH_API, user);
  }
}

export default new AuthService();
