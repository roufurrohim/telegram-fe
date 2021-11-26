const initialState = {
    all:[],
    loadAll: false,
    errorAll: false,
    errorAllMessage: "Data Not Found",
    details:[],
    loadDetails: false,
    errorDetails: false,
    errorDetailsMessage: "Data Not Found"
}

const userReducer = (state=initialState, action) => {
    switch (action.type) {
        case "GET_USERS_PENDING":
            return {
                ...state,
                loadAll: true
            }

        case "GET_USERS_FULLFILLED":
            return {
                ...state,
                loadAll: false,
                all: action.payload.data,
                errorAllMessage: "Get Users Success"
            }

        case "GET_USERS_REJECTED": {
            return {
                ...state,
                loadAll: false,
                errorAllMessage: action.payload
            }
        }
        
        case "GET_USER_DETAILS_PENDING":
            return {
                ...state,
                loadDetails: true
            }

        case "GET_USER_DETAILS_FULLFILLED":
            return {
                ...state,
                loadDetails: false,
                details: action.payload,
                errorDetailsMessage: "Get Users Success"
            }

        case "GET_USER_DETAILS_REJECTED": {
            return {
                ...state,
                loadDetails: false,
                errorDetailsMessage: action.payload
            }
        }
    
        default:
            return state
    }
}

export default userReducer