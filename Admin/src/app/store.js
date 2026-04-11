import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../features/auth/adminAuthSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import adminProductReducer from '../features/products/adminProductSlice';
import adminCategoryReducer from '../features/categories/adminCategorySlice';
import adminOrderReducer from '../features/orders/adminOrderSlice';
import adminCouponReducer from '../features/coupons/adminCouponSlice';
import adminUserReducer from '../features/users/adminUserSlice';
import adminContactReducer from '../features/contacts/adminContactSlice';
import adminCartReducer from '../features/carts/adminCartSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    dashboard: dashboardReducer,
    adminProduct: adminProductReducer,
    adminCategory: adminCategoryReducer,
    adminOrder: adminOrderReducer,
    adminCoupon: adminCouponReducer,
    adminUser: adminUserReducer,
    adminContact: adminContactReducer,
    adminCart: adminCartReducer
  }
});