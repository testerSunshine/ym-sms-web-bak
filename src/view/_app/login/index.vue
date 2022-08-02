<template>
    <div class="login-page">
        <canvas id="login-background"/>

        <div class="login-container" @click.stop>
            <div class="title">
                {{ title }}
                <set-animation :value="loginBackgroundAnimation" custom-class="set-animation" @select="setAnimation"/>
            </div>

            <component :is="component"/>

        </div>
      <waning-dialog v-model="editDialog" type="recharge" @success="success"></waning-dialog>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {title} from '@/config'
import SetAnimation from "./SetAnimation"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import WaningDialog from "./WaningDialog";
import {isEmpty} from "@/util"
import {isMobile} from "@/util/browser"
import {elSuccess} from "@/util/message";

export default {
    name: 'login',

    components: {LoginForm, RegisterForm, SetAnimation, WaningDialog},

    data() {
      return {
        editDialog: true,
        title: title
      }
    },
    computed: {
        ...mapState('app', ['loginBackgroundAnimation']),

        component() {
            const formType = this.$route.path.substring(1)
            return `${[...formType].join('')}-form`
        }
    },

    methods: {
        clearAnimation() {
            if (this.animationInstance) {
                this.animationInstance.stop()
                this.animationInstance = null
            }
        },

        setAnimation(value) {
            this.clearAnimation()
            this.$store.commit('app/loginBackgroundAnimation', value)
            if (isEmpty(value)) return
            import(`@/plugin/canvasAnimation/${value}`)
                .then(_ => this.animationInstance = new _.default(document.getElementById('login-background')))
        },
        success() {
          this.editDialog = false
          this.handleGetWallet()
        },
    },

    mounted() {
        this.animationInstance = null
        //移动端关闭动画，太卡
        !isMobile() && this.setAnimation(this.loginBackgroundAnimation)
    },

    beforeDestroy() {
        this.clearAnimation()
        this.$message.closeAll()
    },

}
</script>

<style lang="scss" src="./style.scss"></style>
