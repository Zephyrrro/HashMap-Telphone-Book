import { Component } from "react";
import {
  Button,
  Layout,
  Menu,
  Upload,
  message,
  Tooltip,
  Popconfirm
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SendOutlined,
  UploadOutlined
} from "@ant-design/icons";
import XLSX from "xlsx";

import TelData from "./utils/TelData";
import Book from "./components/Book";
import CreateModal from "./components/CreateModal";
import SearchModal from "./components/SearchModal";
import HashMapContext from "./store/context";

import { mock } from "./mock";

import "./css/App.sass";

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalShow: false,
      searchModalShow: false
    };
  }

  static contextType = HashMapContext;

  handleCreateModalClose = () => {
    this.setState({ createModalShow: false });
  };

  handleSearchModalClose = () => {
    this.setState({ searchModalShow: false });
  };

  handleExport = isMock => {
    const data = isMock ? mock : this.context.getAllData();
    if (!data.length) {
      message.warn("数据为空~");
      return;
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, "export.xlsx");
  };

  handleUpload = e => {
    const { file } = e;
    const reader = new FileReader();
    reader.onload = e => {
      const fileData = e.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      const { SheetNames, Sheets } = workbook;
      const tableData = XLSX.utils.sheet_to_json(Sheets[SheetNames[0]]);

      this.context.clear();
      tableData.forEach(item => {
        const { keyType, key, ...rest } = item;
        const telData = new TelData(rest);
        this.context.put(keyType, key, telData);
      });

      message.success("导入成功~");
      this.forceUpdate();
    };
    reader.readAsBinaryString(file);
  };

  render() {
    const { createModalShow, searchModalShow } = this.state;

    const data = this.context.getAllData();

    return (
      <Layout className='layout'>
        <CreateModal
          visible={createModalShow}
          onClose={this.handleCreateModalClose}
        />
        <SearchModal
          visible={searchModalShow}
          onClose={this.handleSearchModalClose}
        />
        <Header>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={["1"]}>
            <Menu.Item key='1'>B18030226</Menu.Item>
          </Menu>
        </Header>
        <Content>
          <div className='site-layout-content'>
            <div className='button-group'>
              <Button
                icon={<PlusOutlined />}
                type='primary'
                className='button'
                onClick={() => this.setState({ createModalShow: true })}
              >
                添加数据
              </Button>
              <Button
                icon={<SearchOutlined />}
                className='button'
                onClick={() => this.setState({ searchModalShow: true })}
              >
                搜索/删除
              </Button>
              <Popconfirm
                title='是否导出mock'
                onConfirm={() => this.handleExport(false)}
                onCancel={() => this.handleExport(true)}
                okText='否'
                cancelText='是'
              >
                <Button icon={<SendOutlined />} className='button'>
                  导出数据
                </Button>
              </Popconfirm>

              <Tooltip title='导入前会清空现有数据'>
                <Upload
                  customRequest={this.handleUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />} className='button'>
                    导入数据
                  </Button>
                </Upload>
              </Tooltip>
            </div>
            <Book data={data} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          HashMap-Telphone-Book ©2020 Created by B18030226
        </Footer>
      </Layout>
    );
  }
}
