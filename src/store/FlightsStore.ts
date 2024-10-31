import { makeObservable } from 'mobx';

class FlightsStore {
  constructor() {
    makeObservable(this);
  }
}

export default new FlightsStore();
