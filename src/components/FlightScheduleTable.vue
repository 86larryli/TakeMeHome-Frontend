<template>
  <a-table
    :columns="columns"
    :row-key="(record) => record['_id']"
    :data-source="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template slot="date" slot-scope="date">
      {{ formatDate(date) }}
    </template>

    <template slot="schedule" slot-scope="schedule">
      {{ formatFlightSchedule(schedule) }}
    </template>
  </a-table>
</template>
<script>
import global from "../GlobalVars";
import axios from "axios";

const queryData = (params) => {
  return axios.get(global.requestURL + "/flights/getFlightSchedules", {
    params: params,
  });
};
const columns = [
  {
    title: "Date",
    dataIndex: "flightdate",
    sorter: true,
    width: "10%",
    scopedSlots: { customRender: "date" },
  },
  {
    title: "Departure",
    dataIndex: "depcity",
    filters: [
      { text: "底特律", value: "底特律" },
      { text: "纽约", value: "纽约" },
      { text: "洛杉矶", value: "洛杉矶" },
      { text: "达拉斯", value: "达拉斯" },
      { text: "西雅图", value: "西雅图" },
      { text: "旧金山", value: "旧金山" },
    ],
    width: "10%",
  },
  {
    title: "Arrival",
    dataIndex: "arrcity",
    filters: [
      { text: "广州", value: "广州" },
      { text: "厦门", value: "厦门" },
      { text: "北京", value: "北京" },
      { text: "深圳", value: "深圳" },
      { text: "福州", value: "福州" },
      { text: "上海", value: "上海" },
    ],
    width: "10%",
  },
  {
    title: "Airline",
    dataIndex: "airline",
    filters: [
      { text: "中国东方航空公司", value: "中国东方航空公司" },
      { text: "中国南方航空股份有限公司", value: "中国南方航空股份有限公司" },
      { text: "达美航空公司", value: "达美航空公司" },
      { text: "厦门航空有限公司", value: "厦门航空有限公司" },
      { text: "中国国际航空股份有限公司", value: "中国国际航空股份有限公司" },
      { text: "美国航空公司", value: "美国航空公司" },
      { text: "美国联合航空公司", value: "美国联合航空公司" },
    ],
    width: "20%",
  },
  {
    title: "Schedule",
    dataIndex: "flightschedule",
    width: "20%",
    scopedSlots: { customRender: "schedule" },
  },
  {
    title: "Stops",
    dataIndex: "stops",
    width: "20%",
  },
];

export default {
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].filters) {
        for (let x = 0; x < columns[i].filters.length; x++) {
          columns[i].filters[x].text = this.translate(
            columns[i].filters[x].text
          );
        }
      }
    }
  },
  methods: {
    translate(jsonData) {
      let translateMap = {
        中国东方航空公司: "China Eastern Airlines",
        中国南方航空股份有限公司: "China Southern Airlines",
        达美航空公司: "Delta",
        厦门航空有限公司: "Xiamen Air",
        中国国际航空股份有限公司: "Air China",
        美国航空公司: "American Airlines",
        美国联合航空公司: "United Airlines",
        技术经停: "Technical Stop",
        首尔: "Seoul",
        浦东: "Shanghai (PVG)",
        首都: "Beijing (PEK)",
        底特律: "Detroit",
        纽约: "New York",
        洛杉矶: "Los Angeles",
        达拉斯: "Dallas",
        西雅图: "Seattle",
        旧金山: "San Francisco",
        广州: "Guangzhou",
        厦门: "Xiamen",
        北京: "Beijing",
        深圳: "Shenzhen",
        福州: "Fuzhou",
        上海: "Shanghai",
        天津: "Tianjin",
      };

      if (typeof jsonData == "string") {
        return translateMap[jsonData];
      }

      let stringData = JSON.stringify(jsonData);
      for (let cn in translateMap) {
        stringData = stringData.replaceAll(cn, translateMap[cn]);
      }
      return JSON.parse(stringData);
    },
    formatDate(date) {
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    formatFlightSchedule(flightSchedule) {
      const dayMap = {
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thur",
        5: "Fri",
        6: "Sat",
        7: "Sun",
      };
      flightSchedule = flightSchedule.split("");
      flightSchedule = flightSchedule.filter((day) => day !== ".");
      flightSchedule = flightSchedule.map((day) => dayMap[day]);
      return flightSchedule.join(", ");
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        filters,
      });
    },
    fetch(params = {}) {
      this.loading = true;
      queryData({
        pageSize: 10,
        ...params,
      }).then(({ data }) => {
        const pagination = { ...this.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = 200;
        this.loading = false;
        this.data = this.translate(data);
        this.pagination = pagination;
      });
    },
  },
};
</script>