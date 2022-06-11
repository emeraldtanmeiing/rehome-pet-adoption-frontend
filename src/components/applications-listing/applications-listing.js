import { map } from "lodash";
import { formatDate } from "../../helpers/date";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Avatar, Tag, Grid } from "antd";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import "./applications-listing.scss";

const ApplicationsListing = ({ applicationsList, showRescuer = true }) => {
  let data = map(applicationsList, (a, index) => {
    return {
      applicationID: a._id,
      key: index,
      petImage: a.petID.mainImage,
      pet: a.petID.name,
      petType: a.petID.type,
      adopterImage: a.adopterID.image,
      adopter: a.adopterID.name,
      adopterPhone: a.adopterID.phone,
      rescuer: a.rescuerID.name,
      rescuerPhone: a.rescuerID.phone,
      appliedAt: a.createdAt,
      status: a.status,
      interviewTime: a.interviewTime || null,
      note: a.note || null,
    };
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const breakpoint = Grid.useBreakpoint();
  const columns = [
    {
      title: "Pet",
      dataIndex: "petImage",
      key: "petImage",
      fixed: breakpoint.md ? "left" : false,
      render: (image) => <Avatar src={image} alt="image" size="large" />,
    },
    {
      title: "Pet",
      dataIndex: "pet",
      key: "pet",
      fixed: breakpoint.md ? "left" : false,
      ...getColumnSearchProps("pet"),
    },
    {
      title: "Type",
      dataIndex: "petType",
      key: "petType",
      filters: [
        { text: <span>Dog</span>, value: "Dog" },
        { text: <span>Cat</span>, value: "Cat" },
      ],
      onFilter: (value, record) => record.petType.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Applied",
      dataIndex: "appliedAt",
      key: "appliedAt",
      sorter: (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt),
      sortDirections: ["descend", "ascend"],
      render: (date) => formatDate(date),
    },
    // {
    //   title: "Applicant",
    //   dataIndex: "adopterImage",
    //   key: "adopterImage",
    //   render: (image) => <Avatar src={image} alt="image" size="large" />,
    // },
    {
      title: "Applicant",
      dataIndex: "adopter",
      key: "adopter",
      ellipsis: true,
      ...getColumnSearchProps("adopter"),
    },
    {
      title: "Applicant Phone",
      dataIndex: "adopterPhone",
      key: "adopterPhone",
      ...getColumnSearchProps("adopterPhone"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (tag) => {
        let color;
        switch (tag) {
          case "To Review":
            color = "orange";
            break;
          case "To Interview":
            color = "geekblue";
            break;
          case "To Approve":
            color = "magenta";
            break;
          case "To Pay":
            color = "cyan";
            break;
          case "To Pick up":
            color = "purple";
            break;
          case "Completed":
            color = "green";
            break;
          case "Rejected":
            color = "red";
            break;
          case "Cancelled":
            color = "red";
            break;
          case "Deactivated":
            color = null;
            break;
          default:
            color = null;
        }
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
      filters: [
        { text: <span>To Review</span>, value: "To Review" },
        { text: <span>To Interview</span>, value: "To Interview" },
        { text: <span>To Approve</span>, value: "To Approve" },
        { text: <span>To Pay</span>, value: "To Pay" },
        { text: <span>To Pick up</span>, value: "To Pick up" },
        { text: <span>Completed</span>, value: "Completed" },
        { text: <span>Rejected</span>, value: "Rejected" },
        { text: <span>Cancelled</span>, value: "Cancelled" },
        { text: <span>Deactivated</span>, value: "Deactivated" },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Interview",
      dataIndex: "interviewTime",
      key: "interviewTime",
      render: (date) => formatDate(date, true),
      sorter: (a, b) => new Date(a.interviewTime) - new Date(b.interviewTime),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      ...getColumnSearchProps("note"),
    },
  ];
  if (showRescuer) {
    columns.push({
      title: "Rescuer",
      dataIndex: "rescuer",
      key: "rescuer",
      ...getColumnSearchProps("rescuer"),
    });
    columns.push({
      title: "Rescuer Phone",
      dataIndex: "rescuerPhone",
      key: "rescuerPhone",
      ...getColumnSearchProps("rescuerPhone"),
    });
  }
  if (!showRescuer) {
    columns.push({
      title: "Action",
      key: "operation",
      width: 100,
      render: (record) => (
        <a href={`/rescuer/application?applicationID=${record.applicationID}`}>
          Edit
        </a>
      ),
    });
  }

  return (
    <div className="applications-listing">
      <Table columns={columns} dataSource={data} scroll={{ x: 1000 }} />
    </div>
  );
};

export default ApplicationsListing;
