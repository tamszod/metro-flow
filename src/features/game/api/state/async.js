export const generateStationNames = createAsyncThunk(
    'game/futureStation/name',
    async ({stationCount}, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`https://randomuser.me/api/?inc=name&results=${stationCount}`);
            return data;
        } catch (error) {
            return rejectWithValue({
                "status" : error.response.status,
            });
        }
    }
)