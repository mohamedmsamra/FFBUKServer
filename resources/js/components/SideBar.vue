<template>
  <sidebar-menu :menu="menu" :collapsed="true"/>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Courses List"
        }
      ]
    };
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      axios.get('/api/sidebar').then(response => {
        for (const course of response.data.courses) {
          this.menu.push({
            href: `/courses/${course.id}/`,
            title: course.title,
            icon: "fa fa-book"
          });
        }

        this.menu.push({
          href: "/courses/create",
          title: "Add Course",
          icon: "fa fa-plus"
        });
      });
    }
  }
};
</script>

<style>
.v-sidebar-menu .collapse-btn:after {
  font-family: "Glyphicons Halflings";
  content: "\e120";
}

.v-sidebar-menu {
  z-index: 9999;
}
</style>
