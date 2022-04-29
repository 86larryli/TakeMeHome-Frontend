<template>
  <a-modal
    title="Text Message Test (GRADER ONLY)"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="Phone Number">
        <a-input
          v-decorator="[
            'phone',
            {
              rules: [
                {
                  required: true,
                  message:
                    'Please input your correct phone number! (Number only, no space/dash)',
                  len: 10,
                },
              ],
            },
          ]"
          style="width: 100%"
        >
          <a-select
            slot="addonBefore"
            v-decorator="['prefix', { initialValue: '1' }]"
            style="width: 70px"
          >
            <a-select-option value="1"> +1 </a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import global from "@/GlobalVars";
import axios from "axios";

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "phone" });
  },
  methods: {
    notify(watchListRecord, phoneprefix, phone) {
      axios
        .post(global.requestURL + "/watchlist/notify", {
          watchListRecord,
          phoneprefix,
          phone,
        })
        .then((response) => {
          console.log(response.data);
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.confirmLoading = true;
          this.notify(this.watchListRecord, values.prefix, values.phone);
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
          }, 2000);
        }
      });
    },
    showModal(watchListRecord) {
      this.visible = true;
      this.watchListRecord = watchListRecord;
    },
    handleCancel(e) {
      console.log(e);
      console.log("Clicked cancel button");
      this.visible = false;
    },
  },
};
</script>