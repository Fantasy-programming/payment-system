import { google } from "googleapis";

import { MAIL_CLIENTID, MAIL_CLIENT_SECRET } from "../env";

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(
  MAIL_CLIENTID,
  MAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);
