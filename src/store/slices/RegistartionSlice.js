import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basicInfo: {},
  addressInfo: {},
  kycInfo: {},
  nomineeInfo: {},
  bankInfo: {},
  earningInfo: {}
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    saveBasicInfo: (state, action) => {
      
      state.basicInfo = action.payload;
    },
    saveAddressInfo: (state, action) => {
      state.addressInfo = action.payload;
    },
    saveKycInfo: (state, action) => {
      
      state.kycInfo = action.payload;
    },
    saveNomineeInfo: (state, action) => {
      state.nomineeInfo = action.payload;
    },
    saveBankInfo: (state, action) => {
      state.bankInfo = action.payload;
    },
    saveEarningInfo: (state, action) => {
      state.earningInfo = action.payload;
    }
  }
});

export const {
  saveBasicInfo,
  saveAddressInfo,
  saveKycInfo,
  saveNomineeInfo,
  saveBankInfo,
  saveEarningInfo
} = registrationSlice.actions;

export default registrationSlice.reducer;