import React, { Component } from "react";
import { Button, Layout, Menu, Upload, message, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SendOutlined,
  UploadOutlined
} from "@ant-design/icons";
import XLSX from "xlsx";
import { TableItem } from "./utils/types";

import TelData from "./utils/TelData";
import Book from "./components/Book";
import CreateModal from "./components/CreateModal";
import SearchModal from "./components/SearchModal";
import { TelHashMap } from "./store/global";
// import TableContext from "./store/context"

import { getMockData } from "./mock";

import "./css/App.sass";

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  state = {
    createModalShow: false,
    searchModalShow: false,
    isImporting: false,
    data: TelHashMap.getAllData()
  };

  handleCreateModalClose = () => {
    this.setState({ data: TelHashMap.getAllData(), createModalShow: false });
  };

  handleSearchModalClose = () => {
    this.setState({ data: TelHashMap.getAllData(), searchModalShow: false });
  };

  handleExport = () => {
    const { data } = this.state;
    if (!data.length) {
      message.warn("数据为空~");
      return;
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, "export.xlsx");
  };

  handleImport = async (e: any, isMock: boolean) => {
    TelHashMap.clear();
    this.setState({ data: [] });

    if (isMock) {
      this.setState({ isImporting: true });

      const mockData = await getMockData();
      this.setState({ data: this.setupHashMap(mockData), isImporting: false });
      message.success("导入成功~");
    } else {
      const { file } = e;
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        const fileData = ev.target.result;
        const workbook = XLSX.read(fileData, { type: "binary" });
        const { SheetNames, Sheets } = workbook;
        const tableData: Array<TableItem> = XLSX.utils.sheet_to_json(
          Sheets[SheetNames[0]]
        );
        this.setState({ data: this.setupHashMap(tableData) });
        message.success("导入成功~");
      };
      reader.readAsBinaryString(file);
    }
  };

  setupHashMap = (data: Array<TableItem>) => {
    data.forEach(item => {
      const { keyType, key, ...rest } = item;
      const telData = new TelData(rest);
      TelHashMap.put(keyType, key, telData);
    });

    return TelHashMap.getAllData();
  };

  render() {
    const { data, createModalShow, searchModalShow, isImporting } = this.state;

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
              <Button
                icon={<SendOutlined />}
                className='button'
                onClick={this.handleExport}
              >
                导出数据
              </Button>

              <Tooltip title='导入前会清空现有数据'>
                <Upload
                  customRequest={e => this.handleImport(e, false)}
                  showUploadList={false}
                  accept='.xlsx, .xls'
                >
                  <Button icon={<UploadOutlined />} className='button'>
                    导入数据
                  </Button>
                </Upload>
              </Tooltip>

              <Button
                icon={<UploadOutlined />}
                className='button'
                onClick={() => this.handleImport(null, true)}
                loading={isImporting}
                disabled={isImporting}
              >
                导入Mock
              </Button>
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
