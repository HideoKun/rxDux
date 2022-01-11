// RxJS v6+
import {
  Subject,
  BehaviorSubject,
  withLatestFrom,
  of,
  isObservable,
} from 'rxjs';
import {
  map,
  scan,
  tap,
  mergeMap,
  delay,
  switchMap,
  skip,
  share,
} from 'rxjs/operators';
import { mergeRight, equals, compose } from 'ramda';

// #FEAT redux store
// https://redux.js.org/api/store

export { compose } from 'ramda';

export const applyMiddleware =
  (...middlewares) =>
  (middlewareAPI) => {
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));

    return compose(...chain)((a) => console.log(a, 'identity dispatch') || a);
  };

export const createStore = (
  _reducer,
  preloadedState = {},
  storeEnhancer?: any
) => {
  const reducer$ = new BehaviorSubject(_reducer);
  const actions$ = new Subject();
  const finalStore$ = new BehaviorSubject(preloadedState);

  // main redux handlers ----------------------------------

  const dispatch = actions$.next.bind(actions$);
  const getState = finalStore$.getValue.bind(finalStore$);
  const replaceReducer = reducer$.next.bind(reducer$);
  const subscribe = (xx) => {
    const sub = finalStore$.subscribe(xx);
    return () => sub.unsubscribe();
  };

  // core parts ------------------------------------------

  const middlewareAPI = {
    getState,
    dispatch: (a) => console.log(a, 'original dispatch should be here'),
  };

  const _storeEnhancer = storeEnhancer && storeEnhancer(middlewareAPI);

  const store$ = actions$
    .pipe(
      // tap(console.log),
      mergeMap((x) => {
        // todo supoort async payload
        return isObservable(x) ? x : of(_storeEnhancer ? _storeEnhancer(x) : x);
      }),

      withLatestFrom(reducer$),
      scan((state, [action, reducer]) => {
        console.log('store$-scan', action); // logger

        // INTERNAL ACTIONS ---

        if (action.type === '@RESET_STORE') {
          return action.payload;
        }

        // STANDARD ACTIONS ---

        return action?.type
          ? //
            reducer[action.type](state, action)
          : state;
      }, preloadedState),
      // @todo do not emmit on same ref
      mergeMap((data) => {
        finalStore$.next(data); // @todo simplify

        return finalStore$;
      })
    )
    .subscribe(() => {}); // @TODO - ugly rxjs hack enforcing stream usage

  return {
    // redux store api according to https://redux.js.org/api/store
    dispatch,
    getState,
    subscribe,
    replaceReducer,
    // some more fun :)
    store$: finalStore$.pipe(share()),
    resetStore: (newState = {}) =>
      actions$.next({ type: '@RESET_STORE', payload: newState }),
  };
};

type Selector = Function | string;

const useSelectors = (selector: Selector[]) => {
  // selectotr[] string for ramda path
  // const [state, setState] =  useState();
  // use context to get store$
  // store$.pipe(distinct until changes for objects).subscribe(setState)
  // return state
};

// --- CONNECT ---
// hoc with useSelectors

// --- RESELECT ---
// useSelector variant with ramda memoize
