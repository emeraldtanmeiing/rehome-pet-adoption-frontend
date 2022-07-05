import React, { useRef, useState } from "react";
import { map } from "lodash";
import { formatDate } from "../../helpers/date";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Avatar, Grid } from "antd";
import Highlighter from "react-highlight-words";
import ApplicationStatus from "../application-status/application-status";

import "./applications-listing.scss";

const ApplicationsListing = ({ applicationsList, showRescuer = true }) => {
  let data = map(applicationsList, (a, index) => {
    const interviewDate = a.interviewDate ? a.interviewDate : "-";
    const interviewTime = a.interviewTime ? a.interviewTime : "-";
    return {
      applicationID: a._id,
      key: index,
      pet: a.petID,
      petImage: a.petID.mainImage,
      petName: a.petID.name,
      petType: a.petID.type,
      adopterImage: a.adopterID.image,
      adopter: a.adopterID.name,
      adopterPhone: a.adopterID.phone,
      rescuer: a.rescuerID.name,
      rescuerPhone: a.rescuerID.phone,
      rescuerVerified: a.rescuerID.verified,
      appliedAt: formatDate(a.createdAt),
      status: a.status,
      interview: `${interviewDate}, ${interviewTime}`,
      interviewDate: a.interviewDate || null,
      note: showRescuer
        ? a.note
        : `For staff: ${a.noteInternal}. For applicant: ${a.note}`,
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
      dataIndex: "petName",
      key: "petName",
      fixed: breakpoint.md ? "left" : false,
      ...getColumnSearchProps("petName"),
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
      ...getColumnSearchProps("appliedAt"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return (
          <>
            <ApplicationStatus status={status} pet={record.pet} rescuerVerified={record.rescuerVerified} />
          </>
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
        { text: <span>Not Available</span>, value: "Not Available" },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Interview",
      dataIndex: "interview",
      key: "interview",
      sorter: (a, b) => new Date(a.interviewDate) - new Date(b.interviewDate),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("interview"),
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
      title: "Applicant",
      dataIndex: "adopter",
      key: "adopter",
      ellipsis: true,
      ...getColumnSearchProps("adopter"),
    });
    columns.push({
      title: "Applicant Phone",
      dataIndex: "adopterPhone",
      key: "adopterPhone",
      ...getColumnSearchProps("adopterPhone"),
    });
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
  if (showRescuer) {
    columns.push({
      title: "Action",
      key: "operation",
      width: 100,
      render: (record) => (
        <a href={`/adopt/application?applicationID=${record.applicationID}`}>
          View
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
