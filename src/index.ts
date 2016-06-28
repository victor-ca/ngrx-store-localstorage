const INIT_ACTION = "@ngrx/store/init";
const detectDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

//correctly parse dates from local storage
const parseWithDates = (jsonData: string) => {
    return JSON.parse(jsonData, (key: any, value: any) => {
        if (typeof value === 'string' && (detectDate.test(value))) {
            return new Date(value);
        }
        return value;
    });
};

const validateStateKeys = (keys: any[]) => {
    return keys.map(key => {
        let attr = key;

        if (typeof key == 'object') {
          attr = Object.keys(key)[0];
        }

        if(typeof(attr) !== 'string'){
            throw new TypeError(
                `localStorageSync Unknown Parameter Type: `
                + `Expected type of string, got ${typeof attr}`
            );
        }
        return key;
    });
};

const rehydrateApplicationState = (keys: string[]) => {
    return keys.reduce((acc, curr) => {
        if (typeof curr == 'object') {
          curr = Object.keys(curr)[0];
        }
        let stateSlice = localStorage.getItem(curr);
        if(stateSlice){
            return Object.assign({}, acc, { [curr]: parseWithDates(stateSlice) })
        }
        return acc;
    }, {});
};

const syncStateUpdate = (state : any, keys : string[]) => {
    keys.forEach(key => {

        let stateSlice = state[key];

        if (typeof key == 'object') {
          let name = Object.keys(key)[0];
          stateSlice = state[name];

          if (key[name]) {
            stateSlice = key[name].map(function (memo, attr) {
              memo[attr] = stateSlice[attr];
              return memo;
            }, {});
          }

          key = name;
        }

        if (typeof(stateSlice) !== 'undefined') {
            try{
                localStorage.setItem(key, JSON.stringify(stateSlice));
            } catch(e){
                console.warn('Unable to save state to localStorage:', e);
            }
        }
    });
};

export const localStorageSync = (keys : any[], rehydrate : boolean = false) => (reducer : any) => {
    const stateKeys = validateStateKeys(keys);
    const rehydratedState = rehydrate ? rehydrateApplicationState(stateKeys) : undefined;

    return function(state = rehydratedState, action : any){
        /*
         Handle case where state is rehydrated AND initial state is supplied.
         Any additional state supplied will override rehydrated state for the given key.
         */
        if(action.type === INIT_ACTION && rehydratedState){
            state = Object.assign({}, state, rehydratedState);
        }
        const nextState = reducer(state, action);
        syncStateUpdate(nextState, stateKeys);
        return nextState;
    };
};
