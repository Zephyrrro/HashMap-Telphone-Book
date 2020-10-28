import React, { Component } from "react";
import {
  Modal,
  Select,
  Input,
  Button,
  Divider,
  Table,
  message,
  Popconfirm
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HashMapContext from "../store/context";
import {
  ModalProps,
  KeyType,
  SearchModalState,
  TableItem
} from "../utils/types";

const { Option } = Select;

class SearchModal extends Component<ModalProps, SearchModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      keyType: "user",
      placeholder: "请输入用户名",
      searchText: "",
      searchResult: [],
      searchLength: 0,
      popVisible: false
    };
  }

  reset = () => {
    this.setState({
      keyType: "user",
      placeholder: "请输入用户名",
      searchText: "",
      searchResult: [],
      popVisible: false
    });
  };

  handleCancel = () => {
    const { onClose } = this.props;
    onClose();
    this.reset();
  };

  handleKeyTypeChange = (value: KeyType) => {
    this.setState({
      keyType: value,
      placeholder: value === "user" ? "请输入用户名" : "请输入电话"
    });
  };

  handleSearchTextChange = (e: any) => {
    this.setState({
      searchText: e.target.value
    });
  };

  handleSearch = () => {
    this.setState({ searchResult: [] }, () => {
      const { searchText, keyType } = this.state;
      const { value, searchLength } = HashMapContext.get(keyType, searchText);
      this.setState({ searchLength });
      if (!value) {
        message.error("查无此项");
      } else {
        this.setState({
          searchResult: [{ keyType, key: searchText, ...value }]
        });
      }
    });
  };

  handleDelete = (item: TableItem) => {
    if (HashMapContext.remove(item.keyType, item.key)) {
      message.success("删除成功~");
      this.handleCancel();
    } else {
      message.error("删除失败！");
    }
  };

  render() {
    const {
      keyType,
      placeholder,
      searchText,
      searchResult,
      searchLength
    } = this.state;
    const { visible } = this.props;
    const columns = [
      {
        title: "User",
        dataIndex: "user",
        key: "user"
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text: any, item: TableItem) => (
          <>
            <Popconfirm
              title='确定删除此项？'
              onConfirm={() => this.handleDelete(item)}
              onCancel={() => this.setState({ popVisible: false })}
              okText='确定'
              cancelText='返回'
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </>
        )
      }
    ];
    return (
      <>
        <Modal
          title='搜索'
          visible={visible}
          footer={[
            <Button key='back' onClick={this.handleCancel}>
              关闭
            </Button>
          ]}
          width='45vw'
          onCancel={this.handleCancel}
          centered
        >
          <div style={styles.topContainer}>
            <Select
              style={styles.select}
              defaultValue='user'
              value={keyType}
              onChange={this.handleKeyTypeChange}
            >
              <Option value='user'>以用户名为键搜索</Option>
              <Option value='phone'>以电话为键搜索</Option>
            </Select>
            <Input
              placeholder={placeholder}
              onChange={this.handleSearchTextChange}
              value={searchText}
              style={{ margin: "0 20px 0 40px " }}
            />
            <Button
              shape='circle'
              icon={<SearchOutlined />}
              onClick={this.handleSearch}
            />
          </div>
          <Divider>搜索长度：{searchLength}</Divider>
          <Table
            columns={columns}
            dataSource={searchResult}
            pagination={false}
          />
        </Modal>
      </>
    );
  }
}

const styles = {
  select: {
    width: "200px"
  },
  topContainer: {
    display: "flex",
    padding: "0 20px"
  }
};

export default SearchModal;
