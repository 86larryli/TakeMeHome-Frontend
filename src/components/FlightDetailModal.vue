<template>
  <a-modal
    v-model="visible"
    :title="`Flight Detail for ${flight.flightdate} ${flight.flightno}`"
    @ok="handleOk"
  >
    <a-descriptions layout="vertical" :column="4" size="middle" bordered>
      <a-descriptions-item label="Flight Date" :span="1">{{
        flight.flightdate
      }}</a-descriptions-item>

      <a-descriptions-item label="Flight No." :span="1">{{
        flight.flightno
      }}</a-descriptions-item>

      <a-descriptions-item label="Departure" :span="1">{{
        flight.depcity
      }}</a-descriptions-item>

      <a-descriptions-item label="Arrival" :span="1">{{
        flight.arrcity
      }}</a-descriptions-item>

      <a-descriptions-item label="Airline" :span="4">
        {{ flight.airline }}
      </a-descriptions-item>

      <a-descriptions-item label="Stops" :span="4">
        {{ flight.stops }}
      </a-descriptions-item>

      <a-descriptions-item
        label="Testing Requirements for Passengers with Inactivated Vaccine"
        :span="4"
      >
        <a-descriptions layout="vertical" :column="1" size="small" bordered>
          <a-descriptions-item label="Self Health Monitoring">
            Start Date:
            {{ testing["Inactivated"]["Self-Monitoring"]["dayOffSet"][0] }}
            &nbsp;&nbsp; End Date:
            {{
              testing["Inactivated"]["Self-Monitoring"]["dayOffSet"][1]
            }}&nbsp;&nbsp;<strong>(INCLUSIVE)</strong>
          </a-descriptions-item>

          <a-descriptions-item label="PCR Test #1">
            Date:
            {{ testing["Inactivated"]["PCR 1"]["dayOffSet"].join(" or ") }} ({{
              testing["Inactivated"]["PCR 1"]["time"]
            }})
          </a-descriptions-item>

          <a-descriptions-item label="PCR Test #2">
            Date:
            {{ testing["Inactivated"]["PCR 2"]["dayOffSet"].join(" or ") }} ({{
              testing["Inactivated"]["PCR 2"]["time"]
            }})
          </a-descriptions-item>

          <a-descriptions-item label="PCR Test #3">
            Date:
            {{ testing["Inactivated"]["PCR 3"]["dayOffSet"].join(" or ") }} ({{
              testing["Inactivated"]["PCR 3"]["time"]
            }}) <br />
            <strong>{{ testing["Inactivated"]["PCR 3"]["note"] }}</strong>
          </a-descriptions-item>

          <a-descriptions-item
            label="Antigen Test (Test Result Needed at Gate)"
          >
            Date:
            {{ testing["Inactivated"]["Antigen 1"]["dayOffSet"][0] }} ({{
              testing["Inactivated"]["Antigen 1"]["time"]
            }})
          </a-descriptions-item>
        </a-descriptions>
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
import global from "../GlobalVars";
import axios from "axios";

const queryData = (params) => {
  return axios.get(global.requestURL + "/flights/getFlightDetail", {
    params: params,
  });
};

export default {
  data() {
    return {
      flight: {},
      testing: {
        Inactivated: {
          "Self-Monitoring": {
            dayOffSet: [],
          },
          "PCR 1": {
            dayOffSet: [],
            time: "",
          },
          "PCR 2": {
            dayOffSet: [],
            time: "",
          },
          "PCR 3": {
            dayOffSet: [],
            time: "",
            note: "",
          },
          "Antigen 1": {
            dayOffSet: [],
            time: "",
          },
        },
      },
      loading: false,
      visible: false,
    };
  },
  methods: {
    showModal(flightSchedule) {
      this.flight = flightSchedule;
      this.visible = true;
      this.fetch({ flightScheduleId: flightSchedule._id });
    },
    handleOk(e) {
      this.visible = false;
      console.log("handleOk", e);
    },
    fetch(params = {}) {
      this.loading = true;
      queryData({
        ...params,
      }).then(({ data }) => {
        this.loading = false;
        this.testing = data.testingRequirement;
      });
    },
  },
};
</script>