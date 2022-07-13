const initialState = {
    isLogin: false,
    isLoading: false,
    wallets: [],
    wallet: '',
    totalRevenue: 0,
    totalCostBasis: 0,
    realizedShortTermGains: 0,
    realizedLongTermGains: 0,
    totalRealizedGains: 0,
    realizedRoi: 0,
    timeFrame: '5000',
    gainType: "",
    actionType: "all",
    perPage: 10,
    currentPage: 1,
    pageIndex: 'history',
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        
        case "AUTH":
            return {
                ...state,
                isLogin: action.payload
            };

        case "ADD_WALLET": 
            if(state.wallets.length && state.wallets.findIndex(e => e.address == action.payload.address) > -1) {
                return {
                    ...state
                }
            } else {
                return {
                    ...state,
                    wallets: [
                        ...state.wallets,
                        action.payload
                    ]
                };
            }
            

        case "SET_LOAD":
            return {
                ...state,
                isLoading: action.payload
            };

        case "DELETE_WALLET": 
            return state.filter((element) => {
                return element.address != action.payload.address;
            })

        case "TOTAL_REVENUE":
            return {
                ...state,
                totalRevenue: action.payload
            };

        case "TOTAL_COST_BASIS":
            return {
                ...state,
                totalCostBasis: action.payload
            };
        
        case "REALIZED_SHORT_TERM_GAINS":
            return {
                ...state,
                realizedShortTermGains: action.payload
            };

        case "REALIZED_LONG_TERM_GAINS":
            return {
                ...state,
                realizedLongTermGains: action.payload
            };

        case "TOTAL_REALIZED_GAINS":
            return {
                ...state,
                totalRealizedGains: action.payload
            };

        case "REALIZED_ROI": 
            return {
                ...state,
                realizedRoi: action.payload
            };

        case "SET_TIMEFRAME": 
            return {
                ...state,
                timeFrame: action.payload
            }

        case "SET_GAIN_TYPE":
            return {
                ...state,
                gainType: action.payload
            };

        case "SET_ACTION_TYPE":
            return {
                ...state,
                actionType: action.payload
            };

        case "SET_PER_PAGE":
            return {
                ...state,
                perPage: action.payload
            };

        case "SET_CURRENT_PAGE":
            return {
                ...state,
                currentPage: action.payload
            };
        case "SET_WALLET":
            return {
                ...state,
                wallet: action.payload
            };
        default:
            return state
    }
}

export default userReducer;