<template>
  <div>
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=5201586f697d302f2849a3297284913a"
    ></script>
    <script
      src="https://webapi.amap.com/maps?v=1.4.15&key=5201586f697d302f2849a3297284913a&plugin=AMap.PlaceSearch"
    ></script>
    <link rel="stylesheet" href="https://at.alicdn.com/t/font_1467162_wilr7pj52j.css" />
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/header";
import Footer from "@/components/footer";
export default {
  components: {
    Header,
    Footer
  },
  mounted() {}
};
</script>
<style lang="less">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}
ul,
li,
ol {
  list-style: none;
}
a {
  text-decoration: none;
  color: inherit;
}
em,
i {
  font-style: normal;
}
</style>
