import { Component } from "react";
import { Modal, Radio, Input, Tooltip, message } from "antd";
import TelData from "../utils/TelData";
import HashMapContext from "../store/context";

class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyType: "user",
      user: "",
      phone: "",
      address: ""
    };
  }

  static contextType = HashMapContext;

  reset = () => {
    this.setState({ keyType: "user", user: "", phone: "", address: "" });
  };

  handleOk = () => {
    const { keyType, user, phone, address } = this.state;
    const newItem = new TelData({ phone, user, address });
    this.context.put(keyType, newItem[keyType], newItem);
    message.success("添加成功~");

    this.handleCancel();
  };

  handleCancel = () => {
    const { onClose } = this.props;
    this.reset();
    onClose();
  };

  handleKeyTypeChange = e => {
    this.setState({
      keyType: e.target.value
    });
  };

  handleUserChange = e => {
    this.setState({
      user: e.target.value
    });
  };

  handlePhoneChange = e => {
    this.setState({
      phone: e.target.value
    });
  };

  handleAddressChange = e => {
    this.setState({
      address: e.target.value
    });
  };

  render() {
    const { keyType, user, phone, address } = this.state;
    const { visible } = this.props;
    return (
      <>
        <Modal
          title='新建'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='添加'
          cancelText='取消'
          centered
        >
          <Radio.Group
            value={keyType}
            onChange={this.handleKeyTypeChange}
            style={{ width: "100%" }}
          >
            <div style={styles.radioContainer}>
              <Tooltip title='选取用户名作为key值'>
                <Radio value='user' style={styles.radio} />
              </Tooltip>
              <Input
                addonBefore={<span style={styles.label}>用户名</span>}
                placeholder='请输入用户名'
                onChange={this.handleUserChange}
                value={user}
              />
            </div>
            <div style={styles.radioContainer}>
              <Tooltip title='选取电话作为key值'>
                <Radio value='phone' style={styles.radio} />
              </Tooltip>
              <Input
                addonBefore={<span style={styles.label}>电话</span>}
                placeholder='请输入电话号码'
                onChange={this.handlePhoneChange}
                value={phone}
              />
            </div>
            <div style={styles.radioContainer}>
              <Radio
                value='address'
                style={{ ...styles.radio, visibility: "hidden" }}
                disabled
              />
              <Input
                addonBefore={<span style={styles.label}>地址</span>}
                placeholder='请输入地址'
                onChange={this.handleAddressChange}
                value={address}
              />
            </div>
          </Radio.Group>
        </Modal>
      </>
    );
  }
}

const styles = {
  radioContainer: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0"
  },
  radio: {
    height: "30px",
    lineHeight: "30px",
    marginRight: "20px"
  },
  label: {
    display: "inline-block",
    width: "50px",
    height: "20px",
    color: "#000000D9",
    textAlign: "center"
  }
};

export default CreateModal;
