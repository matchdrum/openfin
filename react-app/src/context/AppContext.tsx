// src/context/AppContext.tsx
import React, {
    createContext,
    useContext,
    useReducer,
    type ReactNode
} from 'react';

export type Theme = 'light' | 'dark';

export interface User {
    id: string;
    name: string;
}

export interface AppState {
    user: User | null;
    theme: Theme;
}

export type Action =
    | { type: 'SET_USER'; payload: User }
    | { type: 'LOGOUT_USER' }
    | { type: 'SET_THEME'; payload: Theme };

const initialState: AppState = {
    user: null,
    theme: 'light',
};


function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'LOGOUT_USER':
            return { ...state, user: null };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        default:
            return state;
    }
}

interface AppContextProps {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
