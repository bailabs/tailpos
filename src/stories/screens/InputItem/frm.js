export default class Form {
  constructor(component) {
    this.component = component;
  }

  _setState = (state) => {
    this.component.setState(state);
  }

  _getShape = () => {
    return this.component.state.colorAndShape[0].shape;
  }

  _getColor = () => {
    return this.component.state.colorAndShape[0].color;
  }

  onChangeName = (name) => {
    this._setState({ name });
  }

  onChangeCategory = (category) => {
    this._setState({ category });
  }

  onChangePrice = (price) => {
    const newPrice = price.slice(1);
    this._setState({ price: newPrice });
  }

  setSoldByEach = () => {
    this._setState({ soldBy: "Each" });
  }

  setSoldByWeight = () => {
    this._setState({ soldBy: "Weight" });
  }

  onChangeBarcode = (barcode) => {
    this._setState({ barcode, barcodeState: "Form" });
  }

  onChangeBarcodeState = (barcodeState) => {
    this._setState({ barcodeState });
  }

  onChangeSku = (sku) => {
    this._setState({ sku });
  }

  onChangeColor = (color) => {
    this._setState({
      colorAndShape: [ { color, shape: this._getShape() } ]
    });
  }

  onChangeShape = (shape) => {
    this._setState({
      colorAndShape: [ { color: this._getColor(), shape }]
    });
  }
}
