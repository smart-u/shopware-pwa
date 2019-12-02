<template>
  <!-- <router-link :to="getRouterLink"> -->
  <SfProductCard
    :title="product.name || ''"
    :image="require('~/assets/productB.jpg')" 
    :regular-price="getUnitPrice"
    :isOnWishlist="false"
    :scoreRating="5"
    :link="getRouterLink"
    @click:wishlist="toggleWishlist"
    class="products__product-card"
    >
    <template #title={title}>
      <div class="product-card-title">
        <h3 class="product-card-title__title">
          {{ title }}
        </h3>
      </div>
    </template>
  </SfProductCard>
  <!-- </router-link> -->
</template>

<script>
import { SfProductCard } from "@storefront-ui/vue";
import { useCart } from "@shopware-pwa/composables"

export default {
  components: {
    SfProductCard
  },
  setup () {
    const {addProduct} = useCart()
    return {
      addProduct
    }
  },
  data() {
    return {};
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // should be replaced with prettyUrl attribute when pretty urls are included in product entity
    getRouterLink() {
      return `/detail/${this.product.id}`
    },
    getUnitPrice() {
      return (
        this.product.calculatedPrice && this.product.calculatedPrice.unitPrice
      );
    },
    getImageUrl() {
      return this.product.cover ? this.product.cover.media.url : "";
    }
  },
  methods: {
    async toggleWishlist() {
      await this.addProduct({id: this.product.id, quantity: 1})
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles.scss";

.product-card-title {
  height: 4em;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  &__title {
    font-family: $body-font-family-secondary;
    font-size: $font-size-regular-mobile;
    font-weight: 300;
    line-height: 1.6;
    margin: $spacer-small 0;
    @media (min-width: $desktop-min) {
      margin: $spacer 0 $spacer-small;
      font-size: $font-size-regular-desktop;
    }
    &:hover {
      cursor: pointer;
      color: $c_gray;
    }
  }
}
</style>