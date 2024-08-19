import { api as axios } from "@/lib/axios";
import { NewUser, User, UserPersonalUpdate, UserUpdate } from "./user.types";

const BASEURI = "/users";

const getMe = async () => {
  const response = await axios.get<User>(`${BASEURI}/me`);
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get<User[]>(`${BASEURI}`);
  return response.data;
};

const getUser = async (id: string) => {
  const response = await axios.get<User>(`${BASEURI}/${id}`);
  return response.data;
};

const createUser = async (data: NewUser) => {
  const response = await axios.post<User>(`${BASEURI}`, data);
  return response.data;
};

const deleteUsers = async (id: string | string[]) => {
  await axios.delete<User>(`${BASEURI}`, {
    data: { ids: id },
  });
};

const updateUser = async (id: string, data: UserUpdate) => {
  const response = await axios.put<User>(`${BASEURI}/${id}`, data);
  return response.data;
};

const resetPassword = async (id: string) => {
  await axios.post(`${BASEURI}/reset-password/${id}`);
};

const updateProfile = async (data: UserPersonalUpdate) => {
  await axios.put<User>(`${BASEURI}/me`, data);
};

export default {
  resetPassword,
  getUsers,
  getMe,
  getUser,
  updateProfile,
  createUser,
  updateUser,
  deleteUsers,
};
