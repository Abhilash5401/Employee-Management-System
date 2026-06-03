import axios from 'axios';

const AUTH_API = "http://localhost:9191/api/auth/login";

class AuthService {
  login(user) {
    return axios.post(AUTH_API, user);
  }
}

export default new AuthService();
