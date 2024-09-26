import { google } from "googleapis";

import env from "../env";

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(
  env.MAIL_CLIENTID,
  env.MAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);
