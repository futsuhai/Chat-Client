import { ITokens } from "./tokens.model";

export interface IAccount {
    id: string;
    login: string;
    email: string;
    name: string;
    surname: string;
    city: string;
    age: string;
    bio: string;
    socialMediaUrls: string[];
    specializations: string[];
    tokens: ITokens;
}