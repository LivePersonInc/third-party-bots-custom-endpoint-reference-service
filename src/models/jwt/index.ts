import { JwtPayload } from "jsonwebtoken";

export interface IJwt extends JwtPayload {
  scope: string;
}
