<template>
  <a-layout id="components-layout-demo-custom-trigger" style="height: 100%">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo">Take Me Home</div>
      <a-menu
        theme="dark"
        mode="inline"
        @click="handleClick"
        :selectedKeys="[$route.path]"
        :default-selected-keys="['/']"
      >
        <a-menu-item key="/">
          <a-icon type="database" />
          <span>Flight Schedule</span>
        </a-menu-item>
        <a-menu-item key="/watchlist">
          <a-icon type="notification" />
          <span>My Watch List</span>
        </a-menu-item>
        <a-menu-item key="/profile">
          <a-icon type="user" />
          <span>User Profile</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <span v-if="this.$cookies.isKey('username')" class="username"
          >Welcome back, {{ this.$cookies.get("username") }}</span
        >
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  mounted() {
    // No Authentication
    if (!this.$cookies.isKey("username")) {
      //   alert("No Authentication");
    }
  },
  data() {
    return {
      collapsed: false,
    };
  },
  methods: {
    handleClick(item) {
      if (item.key !== this.$route.path) {
        this.$router.push(item.key);
      }
    },
  },
};
</script>

<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}
#components-layout-demo-custom-trigger .logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  font-size: 20px;
}

.username {
  float: right;
  margin-right: 32px;
}
</style>