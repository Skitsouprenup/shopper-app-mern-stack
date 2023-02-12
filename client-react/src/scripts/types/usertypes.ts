import { OrderModel } from "./ordertypes";

export interface UserSliceInit {
    fetchingUser: boolean,
    status: "SUCCESS" | "FAILED" | "INITIAL",
    isLoggedIn: boolean,
    errorState: boolean,
}

export interface RegistrationCredentials {
    username: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    middlename: string,
}

export interface CredentialsType {
    username: string,
    accesstoken: string,
}

export interface FetchedUser {
    accesstoken: string,
    username: string,
    firstname: string,
    middleInitial: string,
    lastname: string,
    email: string,
    createdAt: string,
    orders: Array<OrderModel>,
}
