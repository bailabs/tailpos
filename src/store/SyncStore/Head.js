import { types } from "mobx-state-tree";

const Head = types.model("Head", {
  _id: types.identifier(),
  hash: types.string,
});

const HeadSyncStore = types
  .model("HeadSyncStore", {
    heads: types.array(Head),
  })
  .actions(self => ({
    addHead(head) {
      self.heads.push(head);
    },
  }));

const Store = HeadSyncStore.create({ heads: [] });

export default Store;
