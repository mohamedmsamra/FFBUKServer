<template>
  <sidebar-menu :menu="menu" />
</template>

<script>
    export default {
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Main Navigation',
                    },
                    {
                        href: '/',
                        title: 'Dashboard',
                        icon: 'fa fa-user',
                    },
                    {
                        title: 'Courses',
                        icon: 'fa fa-book',
                    },
                    {
                        title: 'Assignments',
                        icon: 'fa fa-edit',
                    },
                    {
                        title: 'Feedback Best Practices',
                        icon: 'fa fa-comments',
                    }
                ]
            }
        }
    }
</script>