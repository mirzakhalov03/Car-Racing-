import { createSlice } from '@reduxjs/toolkit';

const raceSlice = createSlice({
  name: 'race',
  initialState: { isRacing: false, winner: null },
  reducers: {
    startRace: (state) => {
      state.isRacing = true;
      state.winner = null; 
    },
    resetRace: (state) => {
      state.isRacing = false;
      state.winner = null;
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
  },
});

export const { startRace, resetRace, setWinner } = raceSlice.actions;
export default raceSlice.reducer;