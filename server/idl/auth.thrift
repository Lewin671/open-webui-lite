namespace go auth

struct LoginRequest {
    1: string email
    2: string password
}

struct LoginResponse {
    1: string accessToken
    2: string refreshToken
    3: i32 expiresIn
}

struct RefreshRequest {
    1: string refreshToken
}

struct RefreshResponse {
    1: string accessToken
    2: i32 expiresIn
}

struct UserInfo {
    1: string id
    2: string email
    3: string name
    4: string avatar
    5: string createdAt
}

struct GetUserInfoResponse {
    1: UserInfo user
}

service AuthService {
    LoginResponse Login(1: LoginRequest req)
    RefreshResponse Refresh(1: RefreshRequest req)
    GetUserInfoResponse GetUserInfo(1: string accessToken)
}
