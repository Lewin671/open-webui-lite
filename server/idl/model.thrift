namespace go model

struct AIModel {
    1: string id
    2: string name
    3: i32 context
    4: i32 maxTokens
    5: string description
    6: bool available
}

struct GetModelsResponse {
    1: list<AIModel> data
}

service ModelService {
    GetModelsResponse GetModels()
}
