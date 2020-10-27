import { Table } from "antd";

const columns = [
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (_, item) => (
      <span style={{ color: item.keyType === "user" ? "#ff4d4f" : "#000000" }}>
        {item.user}
      </span>
    )
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    render: (_, item) => (
      <span style={{ color: item.keyType === "phone" ? "#ff4d4f" : "#000000" }}>
        {item.phone}
      </span>
    )
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address"
  }
];

function Book({ data }) {
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"] }}
      />
    </>
  );
}

export default Book;
