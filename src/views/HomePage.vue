<template>
  <div class="container">hello</div>
</template>

<script>
import Api from "@/service/api/Api";
export default {
  data: () => {
    return {};
  },
  async mounted() {
    // example call api
    const res = await Api.submit(
      "get",
      "https://tiles.skymapglobal.vn/styles/basic/style.json"
    );
    console.log(res);
  },
  methods: {},
};
</script>

<style scoped></style>
