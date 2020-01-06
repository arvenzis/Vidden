<template>
    <div>
        <div ref="sidebarButton" class="sidebar--open-button" @click="openCloseMenu" :class="{ hidden: !burgerIcon }">
            <span v-if="!this.isSideBarOpen">
              <i class="fa fa-chevron-circle-left"/>
            </span>
            <span v-else>
              <i class="fa fa-chevron-circle-right"/>
            </span>
        </div>

        <div ref="sideNav" class="sidebar__menu">
            <nav class="sidebar__menu__item-list">
                <slot/>
            </nav>
            <span class="close-button" @click="closeMenu" v-if="crossIcon">
                &times;
            </span>
        </div>

    </div>
</template>

<script>
    export default {
      name: 'menubar',
      data() {
        return {
          isSideBarOpen: false
        };
      },
      props: {
        isOpen: {
          type: Boolean,
          required: false
        },
        right: {
          type: Boolean,
          required: false
        },
        width: {
          type: [String],
          required: false,
          default: '200'
        },
        disableEsc: {
          type: Boolean,
          required: false
        },
        onStateChange: {
          type: Function,
          required: false
        },
        burgerIcon: {
          type: Boolean,
          required: false,
          default: true
        },
        crossIcon: {
          type: Boolean,
          required: false,
          default: true
        },
        disableOutsideClick: {
          type: Boolean,
          required: false,
          default: false
        }
      },
      methods: {
        openCloseMenu() {
          if(this.isSideBarOpen) {
            this.closeMenu();
          } else {
            this.openMenu();
          }
        },

        openMenu() {
          this.$emit('openMenu');
          this.isSideBarOpen = true;

          if (this.right) {
            this.$refs.sideNav.style.left = 'auto';
            this.$refs.sideNav.style.right = '0px';
          }
          this.$nextTick(function() {
            this.$refs.sideNav.style.width = this.width
              ? this.width + 'px'
              : '200px';
          });
        },

        closeMenu() {
          this.$emit('closeMenu');
          this.isSideBarOpen = false;
          this.$refs.sideNav.style.width = '0px';
        },

        closeMenuOnEsc(e) {
          e = e || window.event;
          if (e.key === 'Escape' || e.keyCode === 27) {
            this.closeMenu();
          }
        },
        documentClick(e) {
          let element = this.$refs.sidebarButton;
          let target = null;
          if (e && e.target) {
            target = e.target;
          }

          if (
            element &&
            element !== target &&
            !element.contains(target) &&
            e.target.className !== 'sidebar__menu' &&
            this.isSideBarOpen &&
            !this.disableOutsideClick
          ) {
            this.closeMenu();
          }
        }
      },

      mounted() {
        if (!this.disableEsc) {
          document.addEventListener('keyup', this.closeMenuOnEsc);
        }
      },
      created: function() {
        document.addEventListener('click', this.documentClick);
      },
      destroyed: function() {
        document.removeEventListener('keyup', this.closeMenuOnEsc);
        document.removeEventListener('click', this.documentClick);
      },
      watch: {
        isOpen: {
          deep: true,
          immediate: true,
          handler(newValue, oldValue) {
            this.$nextTick(() => {
              if (!oldValue && newValue) {
                this.openMenu();
              }
              if (oldValue && !newValue) {
                this.closeMenu();
              }
            });
          }
        },
        right: {
          deep: true,
          immediate: true,
          handler(oldValue, newValue) {
            if (oldValue) {
              this.$nextTick(() => {
                this.$refs.sideNav.style.left = 'auto';
                this.$refs.sideNav.style.right = '0px';
                document.querySelector('.sidebar__menu').style.left = 'auto';
                document.querySelector('.sidebar__menu').style.right = '0px';
              });
            }
            if (newValue) {
              if (
                this.$refs.sidebarButton.hasAttribute('style')
              ) {
                this.$refs.sidebarButton.removeAttribute('style');
                this.$refs.sideNav.style.right = 'auto';
                document
                  .querySelector('.sidebar--open-button')
                  .removeAttribute('style');
                document.getElementById('sideNav').style.right = 'auto';
                document.querySelector('.close-button').style.right='0px';
              }
            }
          }
        }
      }
    };
</script>