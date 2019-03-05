<template>
  <sidebar-menu :menu="menu" :collapsed="true" />
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
                        href: '/courses/create',
                        title: 'Add Course',
                        icon: 'fa fa-book',
                    }
                ]
            }
        },
        created(){
            this.getCourses();
        },
        props:{
            coursename: Object,        },
        methods: {
            getCourses(){
                if(this.coursename !==null){
                    console.log(this.coursename);
                    for(let i = 0; i<this.coursename.length;i++){
                        console.log(this.coursename[i].title)
                        this.menu.push({href:'/courses/'+this.coursename[i].id+'/',title:this.coursename[i].title,icon:'fa fa-book'})
                    }
                    console.log(this.menu)
                }
                else{
                    console.log("false")
                }
            }
        }
    }
</script>