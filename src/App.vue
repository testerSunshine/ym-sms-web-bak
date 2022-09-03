<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    metaInfo () {
      return {
        title: this.title,
        meta: [
          { vmid: 'keywords', name: 'keywords', content: '接码' },
          { vmid: 'keywords1', name: 'keywords1', content: '接码平台' },
          { vmid: 'keywords2', name: 'keywords2', content: '虚拟手机号' },
          { vmid: 'keywords3', name: 'keywords3', content: '验证码' },
          { vmid: 'keywords4', name: 'keywords4', content: 'jiema' },
          { vmid: 'keywords5', name: 'keywords5', content: 'yanzhengma' },
          { vmid: 'keywords6', name: 'keywords6', content: '手机号' },
          { vmid: 'keywords7', name: 'keywords7', content: '手机号小号' },
          { vmid: 'keywords8', name: 'keywords8', content: '虚拟小号' },
          { vmid: 'keywords9', name: 'keywords9', content: '虚拟号小号' },
          { vmid: 'keywords10', name: 'keywords10', content: '换绑' },
          { vmid: 'keywords11', name: 'keywords11', content: '注册' },
          { vmid: 'keywords12', name: 'keywords12', content: '注册小号' },
          { vmid: 'keywords13', name: 'keywords13', content: 'yima' },
          { vmid: 'keywords14', name: 'keywords14', content: 'yima123' },
          { vmid: 'keywords15', name: 'keywords15', content: '亿码' },
          { vmid: 'keywords16', name: 'keywords16', content: '临时手机号' },
        ]
      }
    },
}
</script>
