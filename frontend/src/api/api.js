import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ElimibugApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = 'get') {
    // console.debug('API Call:', endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}/`;
    const headers = { Authorization: `Bearer ${ElimibugApi.token}` };
    const params = method === 'get' ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get list of all bugs */

  static async getBugs() {
    let res = await this.request('bug');

    return res.bug;
  }

  /** Get details on a bug by id. */

  static async getBug(id) {
    let res = await this.request(`bug/${id}`);
    return res.bug;
  }

  /** Get list of all projects */

  static async getProjects() {
    let res = await this.request('bug/project');
    console.log(res.project);
    return res.project;
  }

  /** User methods */

  /** Signup for site */

  static async signup(data) {
    let res = await this.request('auth/register', data, 'post');
    return res.token;
  }

  /** Get token for login from username, password */

  static async login(data) {
    let res = await this.request('auth/token', data, 'post');
    return res.token;
  }

  /** Save user profile page */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, 'patch');
    console.log(res.user);
    return res.user;
  }

  /** Get the current user */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  //   /** Jobs methods */

  //   /** Get list of jobs (filtered by title if not undefined) */

  //   static async getJobs(title) {
  //     let res = await this.request('jobs', { title });
  //     return res.jobs;
  //   }

  //   /** Apply to a job */

  //   static async applyToJob(username, id) {
  //     await this.request(`users/${username}/jobs/${id}`, {}, 'post');
  //   }
}

// // for now, put token ("testuser" / "password" on class)
// ElimibugApi.token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ' +
//   'SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.' +
//   'FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc';

export default ElimibugApi;
