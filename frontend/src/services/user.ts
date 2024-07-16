import axios from "axios";

import { UserInfo } from "./user.types";

const BASEURI = "http://localhost:3001/api/users";

const getMe = async () => {
  const response = await axios.get<UserInfo>(`${BASEURI}/me`);
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get<UserInfo[]>(`${BASEURI}`);
  return response.data;
};

export default { getUsers, getMe };
