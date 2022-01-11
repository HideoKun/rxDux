import { is, path } from "ramda";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSubscribe } from "./utils";

const StoreContext = createContext(null);
const DispatchContext = createContext(null);

export const Provider = ({ store, children }) => {
  return (
    <StoreContext.Provider value={store.store$}>
      <DispatchContext.Provider value={store.dispatch}>
        {children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  );
};

type Selector = Function | string;

export const useSelector = (_selector: Selector) => {
  const [state, setState] = useState();

  const store$ = useContext(StoreContext);

  useSubscribeWith(store$, (_store) => {
    console.log("init sub");
    setState(
      is(String, _selector)
        ? path(_selector.split("."), _store)
        : _selector(_store)
    );
  });

  console.log("use selector ------------------------");

  return state;
};

export const useDispatch = () => {
  const dispatch = useContext(DispatchContext);

  return dispatch;
};

// BEYOND

// const useSelectors = (selector: Selector[]) => {
//   // selectotr[] string for ramda path
//   // const [state, setState] =  useState();
//   // use context to get store$
//   // store$.pipe(distinct until changes for objects).subscribe(setState)
//   // return state
// };
