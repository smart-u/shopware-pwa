<template>
<div v-if="address">
  <div class="shipping__content">
  <p class="shipping__address">
    <span class="shipping__client-name">
      {{ firstName }} {{ lastName }}
    </span>
    <br />
    {{ street }}
    <br />
    {{ zipcode }} {{ city }}
    <br />
    {{ country }}
  </p>
  <p class="shipping__address" v-if="phone">
    {{ phone }}
  </p>
  </div>
  <div class="shipping__actions">
    <SfIcon
      icon="shipping"
      :color="isDefaultShipping ? 'primary' : 'grey'"
      size="md"
      role="button"
      v-on:click="$emit('selectDefaultAddress', address.id, 'shipping')"
      :title="isDefaultShipping ? 'Default shipping address' : 'set as default'"
      :class="isDefaultShipping ? 'info' : null"
      />
    <span v-if="isDefaultShipping" class="mobile-only">default shipping address</span>
    <SfIcon
      icon="credits"
      :color="isDefaultBilling ? 'primary' : 'grey'"
      size="md"
      role="button"
      v-on:click="$emit('selectDefaultAddress', address.id, 'billing')"
      :title="isDefaultBilling ? 'Default billing address' : 'set as default'"
      :class="isDefaultBilling ? 'info' : null"
      />
      <span v-if="isDefaultBilling" class="mobile-only">default billing address</span>
    <SfIcon
      icon="cross"
      :color="isDefaultBilling || isDefaultShipping ? 'grey' : 'pink-primary'"
      size="xs"
      role="button"
      title="Delete"
      v-on:click="(isDefaultBilling || isDefaultShipping) || $emit('deleteAddress', address.id)"
      :class="{ info: isDefaultBilling || isDefaultShipping }"
    />
  </div>
</div>
</template>
<script>

import { SfProperty, SfTabs, SfList, SfButton, SfIcon, SfBadge, SfCheckbox } from '@storefront-ui/vue'
import { useUser } from '@shopware-pwa/composables'

export default {
  name: "Address",
  components: {SfProperty, SfTabs, SfList, SfButton, SfIcon, SfBadge, SfCheckbox},
  props: {
    address: {
      type: Object,
      default: () => {}
    },
    isDefaultBilling: {
      type: Boolean,
    },
    isDefaultShipping: {
      type: Boolean,
    }
  },
  computed: {
    firstName() {
      return this.address.firstName
    },
    lastName() {
      return this.address.lastName
    },
    street() {
      return this.address.street
    },
    city() {
      return this.address.city
    },
    zipcode() {
      return this.address.zipcode
    },
    phone() {
      return this.address.phoneNumber
    },
    country() {
      return this.address.country && address.country.name
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles.scss';
@import '~@storefront-ui/shared/styles/helpers/visibility';
@mixin for-mobile {
  @media screen and (max-width: $desktop-min) {
    @content;
  }
}
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.shipping {

  &:last-child {
    border-bottom: 1px solid $c-light;
  }
  &__content {
    flex: 1;
    color: $c-text;
    font-size: $font-size-small-mobile;
    font-weight: 300;
    line-height: 1.6;
    @include for-desktop {
      font-size: $font-size-small-desktop;
    }
  }
  &__actions {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }

    .sf-icon {
      margin-left: 10px;
    } 

    .sf-icon:not(.info) {
      margin-left: 10px;
      cursor: pointer;
    }

    .sf-button {
      font-size: 0.7rem;
    }
  }
  &__button-mark {
    background-color: $c-light;
    color: $c-text-muted;
    @include for-desktop {
      margin-left: $spacer-big;
    }
  }
  &__address {
    margin: 0 0 $spacer-big 0;
    &:last-child {
      margin: 0;
    }
  }
  &__client-name {
    font-size: $font-size-regular-desktop;
    font-weight: 500;
  }
}
</style>
