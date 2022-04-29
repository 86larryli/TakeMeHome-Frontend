<template>
  <div class="watchlist">
    <div class="push-status">
      <h3>Notification Service Status:</h3>
      <a-badge status="success" text="Text Messages" />
      <br />
      <a-badge status="default" text="Bark Notifications" />
    </div>

    <div class="my-watchlist">
      <h3 style="margin-top: 32px">My Watchlist:</h3>
      <a-table
        :columns="columns"
        :row-key="(record) => record['_id']"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
      >
        <span slot="date_day" slot-scope="text, record">
          {{ record.flightdate }} {{ record.flightday }}
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="unwatchFlight(record)">Remove</a>
          <a-divider type="vertical" />
          <a @click="notify(record)">Send Notification (GRADER ONLY)</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import global from "@/GlobalVars";
import axios from "axios";

const queryData = (params) => {
  return axios.get(global.requestURL + "/watchlist/get", {
    params: params,
  });
};

const columns = [
  {
    title: "Flight No.",
    dataIndex: "flightno",
    width: "20%",
  },
  {
    title: "Date",
    dataIndex: "flightdate",
    sorter: true,
    width: "20%",
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
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
    notify(watchListRecord) {
      console.log("watchListRecord", watchListRecord);
    },
    unwatchFlight(watchListRecord) {
      axios
        .post(global.requestURL + "/watchlist/delete", watchListRecord)
        .then((response) => {
          if (response.data.success) {
            console.log(response.data);
            this.fetch();
          }
        });
    },
    fetch(params = {}) {
      this.loading = true;
      queryData({
        ...params,
      }).then(({ data }) => {
        console.log(data);
        if (data.success) {
          const pagination = { ...this.pagination };
          pagination.total = data.totalCount;
          this.loading = false;
          this.data = data.rows;
        }
      });
    },
  },
};
</script>
