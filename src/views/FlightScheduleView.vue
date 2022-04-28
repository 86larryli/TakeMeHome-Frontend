<template>
  <div>
    <FlightDetailModal ref="FlightDetailModal" />

    <a-table
      :columns="columns"
      :row-key="(record) => record['_id']"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="date_day" slot-scope="text, record">
        {{ record.flightdate }} {{ record.flightday }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="showFlightDetail(record)">Details</a>
        <a-divider type="vertical" />
        <a @click="underDevNotification">Watch</a>
        <a-divider type="vertical" />
        <a @click="underDevNotification" class="ant-dropdown-link">
          More actions <a-icon type="down" />
        </a>
      </span>
    </a-table>
  </div>
</template>
<script>
import FlightDetailModal from "@/components/FlightDetailModal";
import global from "@/GlobalVars";
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
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  components: { FlightDetailModal },
  data() {
    return {
      data: [],
      pagination: {},
      columns,
      loading: false,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    showFlightDetail(flightSchedule) {
      this.$refs.FlightDetailModal.showModal(flightSchedule);
    },
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
    underDevNotification() {
      this.$notification.open({
        message: "Under Development",
        icon: <a-icon type="smile" style="color: #108ee9" />,
        description: "Sorry, this feature is currently under development...",
        duration: 4.5,
      });
    },
  },
};
</script>