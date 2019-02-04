import * as React from "react";
import { Button, Text } from "native-base";
import SearchableDropdown from "react-native-searchable-dropdown";
import { Col, Grid } from "react-native-easy-grid";

export default class SearchableDropdownComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barcodeState: false,
        };
    }

    render() {
        return (
            <Grid>
                <Col style={{ justifyContent: "center", width: "75%" }}>
                    <SearchableDropdown
                        onTextChange={text => {
                            if (text){
                                this.props.searchCustomer(text);
                            }
                        } }
                        onItemSelect={item => item}
                        // containerStyle={{
                        //     padding: 5
                        // }}
                        textInputStyle={{
                            fontSize: 18,
                            padding: 12,
                            borderWidth: 2,
                            borderColor: "#DCDCDC",
                        }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: "#ddd",
                            borderColor: "#bbb",
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                        itemTextStyle={{
                            color: "#222",
                        }}
                        itemsContainerStyle={{
                            maxHeight: 140,
                        }}
                        defaultIndex={0}
                        items={this.props.searchedCustomers}
                        placeholder="Customer"
                        resetValue={false}
                        underlineColorAndroid="transparent"
                        enableEmptySections
                        editable={false}
                    />
                </Col>
                <Col
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "25%",
                    }}
                >
                    <Button
                        onPress={() => this.props.modalVisibleChange(true)}
                        style={{ marginLeft: 10 }}
                    >
                        <Text>Add Customer</Text>
                    </Button>
                </Col>
            </Grid>
        );
    }
}
