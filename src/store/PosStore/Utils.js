import uuidv1 from "uuid/v1";

export function generateId() {
  return uuidv1();
}

export function isUUID(uuid) {
  if (uuid === undefined) {
    uuid = "";
  }
  let str = uuid.split("_");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    str[1],
  );
}

export function assignUUID(snapshot, collection) {
  if (!snapshot._id) {
    return Object.assign({}, snapshot, {
      _id: collection + "/" + generateId(),
    });
  } else {
    return Object.assign({}, snapshot);
  }
}
