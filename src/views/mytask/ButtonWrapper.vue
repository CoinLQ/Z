<style></style>
<template>
  <Button :size="sz" @click="click">{{name}}</Button>
</template>
<script>
  export default {
    name: 'ButtonWrapper',
    props: [ 'text', 'size' ],
    computed: {
      name() {
        return this.text;
      },
      sz() {
        return this.size;
      }
    },
    methods: {
      click(event) {
        let e = Object.create(event, {
          vm: {
            value: this,
            writable: false
          }
        })
        this.$emit('click', e);
      }
    }
  }
</script>
