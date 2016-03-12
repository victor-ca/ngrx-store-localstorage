# ngrx-store-localstorage
Simple syncing between ngrx store and local storage

## Dependencies
`ngrx-store-localstorage` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular 2](https://github.com/angular/angular).

## Usage
```bash
npm install ngrx-store-localstorage --save
```

1. Configure your ngrx store as normal using `provideStore`. 
2. Using the provided `localStorageMiddleware` function, specify the slices of state you would like to keep synced with local storage. 
3. Optionally specify whether to rehydrate this state from local storage as `initialState` on application bootstrap.

```ts
import {bootstrap} from 'angular2/platform/browser';
import {TodoApp} from './todo-app';
import {provideStore} from "@ngrx/store";
import {localStorageMiddleware} from "ngrx-store-localstorage";

export function main() {
  return bootstrap(TodoApp, [
      provideStore({todos, visibilityFilter}),
      localStorageMiddleware(['todos', 'visibilityFilter'], true)
  ])
  .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', main);
```

## API
### `localStorageMiddleware(keys : string[], rehydrateState : boolean = false)`
Provide state (reducer) keys to sync with local storage. Optionally specify whether to rehydrate `initialState` from local storage on bootstrap.

#### Arguments
* `keys` \(*string[]*): State keys to sync with local storage
* `rehydrateState` \(*boolean? = false*): Pull initial state from local storage on startup