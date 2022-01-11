import { delay, of } from 'rxjs';

// #FEAT @reduxjs/toolkit
// https://redux-toolkit.js.org/api/createAction

type ACTION = {
  type: string;
  payload: any;
};

export const createAction = (type: string) => {
  function creator(payload) {
    // return of({ type, payload }).pipe(delay(3000)); // # @TODO
    return { type, payload };
  }

  creator.toString = () => type;

  return creator;
};
