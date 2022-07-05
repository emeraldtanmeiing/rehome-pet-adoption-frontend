import React, { useEffect, useRef, useState } from "react";
import { map } from "lodash";
import { formatDate } from "../../helpers/date";
import { getAccounts } from "../../services/auth.services";
import Cookies from "js-cookie";
import Highlighter from "react-highlight-words";

import { Button, Input, Space, Table, Avatar, Tag, Grid, message } from "antd";
import {
  SearchOutlined,
  FacebookFilled,
  InstagramFilled,
  GlobalOutlined,
} from "@ant-design/icons";

import "./rescuers-listing.scss";
import RescuerStatus from "../../components/rescuer-status/rescuer-status";

const RescuersListing = () => {
  const [rescuers, setRescuers] = useState({
    status: "idle",
    data: null,
  });

  useEffect(() => {
    fetchRescuers();
  }, []);

  const fetchRescuers = async () => {
    setRescuers({ ...rescuers, status: "loading" });

    const res = await getAccounts({ type: "rescuer" });

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setRescuers({
        ...rescuers,
        status: "success",
        data: res.accountsList,
      });
    }
  };

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
      title: "",
      dataIndex: "image",
      key: "image",
      render: (image) => <Avatar src={image} size="large" />,
      width: "6%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      width: "15%",
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified, record) => {
        return <RescuerStatus verified={verified} />;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address, record) => {
        return (
          <>
            {address}, {record.postcode} {record.city}, {record.stateOrProvince}
          </>
        );
      },
      width: "20%",
    },
    {
      title: "Links",
      dataIndex: "facebookLink",
      key: "facebookLink",
      className: "short",
      render: (facebookLink, record) => {
        return (
          <div className="links">
            {facebookLink && (
              <Button
                size="small"
                icon={<FacebookFilled style={{ color: "grey" }} />}
                onClick={() => {
                  window.open(record.facebookLink);
                }}
              />
            )}

            {record.instagramLink && (
              <Button
                size="small"
                icon={<InstagramFilled style={{ color: "grey" }} />}
                onClick={() => {
                  window.open(record.instagramLink);
                }}
              />
            )}

            {record.organizationWebsiteLink && (
              <Button
                size="small"
                icon={<GlobalOutlined style={{ color: "grey" }} />}
                onClick={() => {
                  window.open(record.organizationWebsiteLink);
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <a href={`/admin/rescuer?rescuerID=${record._id}`}>Edit</a>
      ),
    },
  ];

  return (
    <div className="rescuers-listing">
      {rescuers.status === "success" && (
        <Table
          columns={columns}
          dataSource={rescuers.data}
          scroll={{ x: 1000 }}
        />
      )}
    </div>
  );
};

export default RescuersListing;
