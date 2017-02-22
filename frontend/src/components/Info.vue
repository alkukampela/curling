<template>
  <transition name="info">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <a class="button close" @click="$emit('close')">
              x
            </a>
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {

  }
</script>
