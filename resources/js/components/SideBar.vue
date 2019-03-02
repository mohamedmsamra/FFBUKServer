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
                        title: 'Courses List',
                    },
                    {
                        href: '/courses/',
                        title: 'Courses',
                        icon: 'fa fa-user',
                    },
                    {
                        href: '/courses/create',
                        title: 'Add Course',
                        icon: 'fa fa-book',
                    }
                ]
            }
        }
    }
</script>