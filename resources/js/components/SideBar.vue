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
                    
                ]
            }
        },
        created(){
            this.getCourses();
        },
        props:{
            coursename: Array,        },
        methods: {
            getCourses(){
                if(this.coursename !==null){
                    console.log(this.coursename);
                    for(let i = 0; i<this.coursename.length;i++){
                        console.log(this.coursename[i].title)
                        this.menu.push({href:'/courses/'+this.coursename[i].id+'/',title:this.coursename[i].title,icon:'fa fa-book'})
                    };
                    this.menu.push({href:'/courses/create',title:'Add Course',icon:'fa fa-plus'});
                    console.log(this.menu)
                }
                else{
                    console.log("false")
                }
            }
        }
    }
</script>

<style>
    .v-sidebar-menu .collapse-btn:after {
        
     font-family: 'Glyphicons Halflings';
    content: "\e120"; 
}

.container.v-sidebar-menu{
    width: 500px;
}
</style>
