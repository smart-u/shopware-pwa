import { ref, Ref, computed } from "@vue/composition-api";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCustomer,
  getCustomerOrders,
  getCustomerOrderDetails,
  getCustomerAddresses,
  setDefaultCustomerBillingAddress,
  setDefaultCustomerShippingAddress,
  deleteCustomerAddress
} from "@shopware-pwa/shopware-6-client";
import { Customer } from "@shopware-pwa/shopware-6-client/src/interfaces/models/checkout/customer/Customer";
import { getStore } from "@shopware-pwa/composables";
import { Order } from "@shopware-pwa/shopware-6-client/src/interfaces/models/checkout/order/Order";
import {
  CustomerAddress,
  AddressType
} from "@shopware-pwa/shopware-6-client/src/interfaces/models/checkout/customer/CustomerAddress";
import { CustomerRegistrationParams } from "@shopware-pwa/shopware-6-client/src/interfaces/request/CustomerRegistrationParams";

/**
 * @alpha
 */
export interface UseUser {
  login: ({
    username,
    password
  }: {
    username?: string;
    password?: string;
  }) => Promise<boolean>;
  register: ({}: CustomerRegistrationParams) => Promise<boolean>;
  user: Ref<Customer | null>;
  orders: Ref<Order[] | null>;
  addresses: Ref<CustomerAddress[] | null>;
  loading: Ref<boolean>;
  error: Ref<any>;
  isLoggedIn: Ref<boolean>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  loadOrders: () => Promise<void>;
  getOrderDetails: (orderId: string) => Promise<Order>;
  loadAddresses: () => Promise<void>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  markAddressAsDefault: ({
    addressId,
    type
  }: {
    addressId?: string;
    type?: AddressType;
  }) => Promise<string | boolean>;
}

/**
 * @alpha
 */
export const useUser = (): UseUser => {
  let vuexStore = getStore();
  const loading: Ref<boolean> = ref(false);
  const error: Ref<any> = ref(null);
  const orders: Ref<Order[] | null> = ref(null);
  const addresses: Ref<CustomerAddress[] | null> = ref(null);
  const user: any = computed(() => {
    return vuexStore.getters.getUser;
  });

  const login = async ({
    username,
    password
  }: { username?: string; password?: string } = {}): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await apiLogin({ username, password });
      return true;
    } catch (e) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
      await refreshUser();
    }
  };

  const register = async (
    params: CustomerRegistrationParams
  ): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await apiRegister(params);
      return true;
    } catch (e) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiLogout();
    } catch (e) {
      error.value = e.message;
    } finally {
      await refreshUser();
    }
  };

  const refreshUser = async (): Promise<void> => {
    const user = await getCustomer();
    vuexStore.commit("SET_USER", user);
  };

  const loadOrders = async (): Promise<void> => {
    const fetchedOrders = await getCustomerOrders();
    orders.value = fetchedOrders;
  };

  const getOrderDetails = async (orderId: string): Promise<Order> => {
    return getCustomerOrderDetails(orderId);
  };

  const loadAddresses = async (): Promise<void> => {
    try {
      addresses.value = await getCustomerAddresses();
    } catch (e) {
      error.value = e.message;
    }
  };

  const markAddressAsDefault = async ({
    addressId,
    type
  }: {
    addressId?: string;
    type?: AddressType;
  }): Promise<boolean> => {
    if (!addressId || !type) {
      return false;
    }

    try {
      switch (type) {
        case AddressType.billing:
          await setDefaultCustomerBillingAddress(addressId);
          break;
        case AddressType.shipping:
          await setDefaultCustomerShippingAddress(addressId);
          break;
        default:
          return false;
      }
      await refreshUser();
    } catch (e) {
      error.value = e.message;
      return false;
    }

    return true;
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    try {
      await deleteCustomerAddress(addressId);
      return true;
    } catch (e) {
      console.error("useUser:deleteAddress", e);
      error.value = e.message;
    }

    return false;
  };

  const isLoggedIn = computed(() => !!user.value);

  return {
    login,
    register,
    user,
    error,
    loading,
    isLoggedIn,
    refreshUser,
    logout,
    orders,
    loadOrders,
    getOrderDetails,
    loadAddresses,
    addresses,
    markAddressAsDefault,
    deleteAddress
  };
};
