<template>
  <a-form :form="form" @submit="handleSubmit" style="max-width: 80%">
    <a-form-item v-bind="formItemLayout" label="Username">
      <a-input
        v-decorator="[
          'username',
          {
            rules: [
              {
                required: true,
                message: 'Please input your username!',
                whitespace: true,
              },
            ],
          },
        ]"
      />
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="Password" has-feedback>
      <a-input
        v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          },
        ]"
        type="password"
      />
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="Confirm Password" has-feedback>
      <a-input
        v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]"
        type="password"
        @blur="handleConfirmBlur"
      />
    </a-form-item>

    <a-form-item v-bind="formItemLayout">
      <span slot="label">
        Phone Number&nbsp;
        <a-tooltip
          title="We need your phone number in order to send you text messages regarding your flights."
        >
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-input
        v-decorator="[
          'phone',
          {
            rules: [
              { required: false, message: 'Please input your phone number!' },
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
          <a-select-option value="86"> +86 </a-select-option>
        </a-select>
      </a-input>
    </a-form-item>

    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit"> Register </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import global from "@/GlobalVars";
import axios from "axios";

export default {
  data() {
    return {
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    handleSubmit(e) {
      let self = this;
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          axios
            .post(global.requestURL + "/register", values)
            .then(function (response) {
              if (response.data.success) {
                self.$router.push("/login");
              }
            });
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
  },
};
</script>