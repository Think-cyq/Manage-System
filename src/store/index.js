import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        currentPathName:''
    },
    mutations: {
        setPath(state) {
            state.currentPathName = localStorage.getItem("currentPathName")
        },
        logout(state){
            //清空缓存
            localStorage.removeItem("user")
            localStorage.removeItem("menu")
            router.push("/login")
        }
    }
})

export default store