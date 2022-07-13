import React from "react";
import { Line } from "@ant-design/plots";
import { isEmpty } from "lodash";

import "./chart.scss";

const LineChart = ({ title, data }) => {
  const config = {
    color: '#f38434',
    data,
    xField: 'month',
    yField: 'value',
    label: {},
    point: {
      size: 5,
      shape: 'point',
      style: {
        fill: 'white',
        stroke: '#f38434',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#f38434',
          fill: '#f38434',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  return isEmpty(title) || isEmpty(data) ? null : (
    <div className="lineChart">
      <h3 className="lineChart-title">{title}</h3>
      <Line {...config} />
    </div>
  );
};

export default LineChart;
