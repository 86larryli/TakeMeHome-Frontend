<template>
  <a-table
    :columns="columns"
    :row-key="(record) => record['_id']"
    :data-source="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template slot="date_day" slot-scope="text, record">
      {{ record.flightdate }} {{ record.flightday }}
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
    scopedSlots: { customRender: "date_day" },
  },
  {
    title: "Flight No.",
    dataIndex: "flightno",
    width: "10%",
  },
  {
    title: "Departure",
    dataIndex: "depcity",
    width: "10%",
  },
  {
    title: "Arrival",
    dataIndex: "arrcity",
    width: "10%",
  },
  {
    title: "Airline",
    dataIndex: "airline",
    width: "15%",
  },
  {
    title: "Stops",
    dataIndex: "stops",
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
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      // Remove empty filters from clicking `Reset`
      for (let column in filters) {
        if (filters[column].length == 0) {
          delete filters[column];
        }
      }

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
        pagination.total = data.totalCount;
        this.loading = false;
        this.data = data.rows;
        this.pagination = pagination;

        // Load column filters
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].dataIndex == "depcity") {
            this.columns[i]["filters"] = data.columnFilters.depcity;
          } else if (this.columns[i].dataIndex == "arrcity") {
            this.columns[i]["filters"] = data.columnFilters.arrcity;
          } else if (this.columns[i].dataIndex == "airline") {
            this.columns[i]["filters"] = data.columnFilters.airline;
          }
        }
      });
    },
  },
};
</script>