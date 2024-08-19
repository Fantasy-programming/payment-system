import { api as axios } from "@/lib/axios";
import { UserAlertingRequest, UserAlertingSettings } from "./preference.types";

const BASEURI = "/preferences";

const getPrefs = async () => {
  const response = await axios.get<UserAlertingSettings>(`${BASEURI}/user`);
  return response.data;
};

const updatePrefs = async (data: UserAlertingRequest) => {
  const response = await axios.put<UserAlertingSettings>(
    `${BASEURI}/user`,
    data,
  );
  return response.data;
};

export default { getPrefs, updatePrefs };
