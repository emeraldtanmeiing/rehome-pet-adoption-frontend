import React from "react";
import { Pie } from "@ant-design/plots";
import { isEmpty } from "lodash";

import "./chart.scss";

const DonutChart = ({ title, data }) => {
  const config = {
    autoFit: true,
    label: {
      style: {
        fill: "red",
        opacity: 0.6,
        fontSize: 24,
      },
      rotate: true,
    },
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.4,
    innerRadius: 0,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 15,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 15,
        },
      },
    },
  };

  return isEmpty(title) || isEmpty(data) ? null : (
    <div className="donutChart">
      <h3 className="donutChart-title">{title}</h3>
      <Pie {...config} />
    </div>
  );
};

export default DonutChart;
