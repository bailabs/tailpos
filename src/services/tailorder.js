exports.sendOrder = function(origin, order) {
  const url = `${origin}/api/v1/orders`;

  const fetchData = {
    method: "POST",
    body: JSON.stringify(order),
  };

  return fetch(url, fetchData).then(response => response.json());
};

exports.printOrder = function(origin, order) {
  const url = `${origin}/api/v1/print_order`;

  const fetchData = {
    method: "POST",
    body: JSON.stringify(order),
  };

  return fetch(url, fetchData).then(response => response.json());
};

exports.tailOrderLine = function(line) {
  return {
    itemCode: line.item_name,
    rate: line.price,
    qty: line.qty,
  };
};
