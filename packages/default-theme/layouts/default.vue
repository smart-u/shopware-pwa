<template>
  <div class="layout">
    <TopNavigation />
    <SfBreadcrumbs
      v-show="getBreadcrumbs.length > 0"
      :breadcrumbs="getBreadcrumbs"
      v-on:click="redirectTo"
      class="sw-breadcrumbs"/>
    <nuxt />
    <SwCart />
    <SwFooter />
    <SwBottomNavigation class="layout__bottom-navigation"/>
  </div>
</template>

<script>
import { SfBreadcrumbs } from '@storefront-ui/vue'
import TopNavigation from '../components/TopNavigation'
import SwBottomNavigation from '../components/SwBottomNavigation'
import SwCart from '../components/SwCart'
import SwFooter from '../components/cms/elements/SwFooter'

export default {
  components: {
    SfBreadcrumbs,
    TopNavigation,
    SwCart,
    SwFooter,
    SwBottomNavigation
  },
  computed: {
    componentBreadcrumbs() {
      // TODO probably move to vuex now as it's not rendered on server side
      return (
        this.$route.matched.map((r) => {
          return r.components.default.options.data().breadcrumbs
        })[0] || {}
      )
    },
    getBreadcrumbs () {
      return Object.keys(this.componentBreadcrumbs).map(key => this.componentBreadcrumbs[key]).map(breadcrumb => ({
        text: breadcrumb.name,
        route: {
          link: breadcrumb.path
        }
      }))
    },
    
  },
  methods: {
    redirectTo(route) {
      return this.$router.push(route.link);
    }
  }
}
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';
@import '~@storefront-ui/shared/styles/helpers/visibility';
@import '~@storefront-ui/vue/src/utilities/transitions/transitions';

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

body {
  padding: 0;
  margin: 0;
}

.layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1320px;
    margin: auto;
  }
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &__bottom-navigation {
    @include for-desktop() {
      display: none;
    }
  }
}

.sw-breadcrumbs {
  padding: $spacer-big $spacer-extra-big $spacer-extra-big;
}

/* Delete firefox outline */
:focus {
  outline: none;
}
::-moz-focus-inner {
  border: 0;
}
</style>
