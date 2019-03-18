import { observable, action } from "mobx";
import {
  asyncStorageKeys,
  setObjectInAsync,
  getObjectFromAsync,
} from "../../services/asyncStorage";

class UntypedState {
  @observable shifts = [];

  constructor() {
    getObjectFromAsync(asyncStorageKeys.SHIFTS).then(shifts => {
      shifts.map(shift => this.shifts.push(shift));
    });
  }

  @action
  setShifts(shifts) {
    this.shifts = shifts;
  }

  @action
  addShift(shift) {
    this.shifts.push(shift);
    setObjectInAsync(asyncStorageKeys.SHIFTS, this.shifts);
  }
}

export default new UntypedState();
