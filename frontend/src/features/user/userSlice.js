import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import { toast } from 'sonner';


// Fetch current user
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) =>
    {
        try
        {
            const response = await userApi.getCurrentUser();
            return response.data.data; // Return user object
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
        }
    }
);

// Fetch user profile by ID
export const fetchUserProfileById = createAsyncThunk(
    'user/fetchUserProfileById',
    async (userId, { rejectWithValue }) =>
    {
        try
        {
            const response = await userApi.getUserById(userId);
            return response.data.data; // Make sure to return the entire user object
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
        }
    }
);
// Update current user
export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (userData, { rejectWithValue }) =>
    {
        try
        {
            const response = await userApi.updateUser(userData);
            return response.data.data; // Return updated user object
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (profileData, { rejectWithValue }) =>
    {
        try
        {
            const response = await userApi.updateUserProfile(profileData);
            return response.data.data; // Return updated profile object
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);
// Change user password
export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (passwordData, { rejectWithValue }) =>
    {
        try
        {
            const response = await userApi.changePassword(passwordData);
            return response.data.message; // Assuming backend returns a success message
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    });
export const fetchProfileCompleteness = createAsyncThunk(
    'user/fetchProfileCompleteness',
    async (userId, { rejectWithValue }) =>
    {
        try
        {
            const response = await userApi.getProfileCompleteness(userId);
            return response.data.completeness;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile completeness');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        userId: null,
        profileCompleteness: 0,
        userPreferences: {
            defaultFilters: {
                ageRange: { min: 20, max: 55 },
                interestedIn: "Female",
                location: { lat: 10.61905, lng: 106.614395 },
                locationRadius: 30,
            }
        }
    },
    reducers: {
        clearError(state)
        {
            state.error = null;
        },
        setUserPreferences(state, action)
        {
            state.userPreferences = {
                ...state.userPreferences,
                ...action.payload
            };
        },
        clearUser(state)
        {
            state.userId = null;
        }
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch profile completeness
            .addCase(fetchProfileCompleteness.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileCompleteness.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.profileCompleteness = action.payload;
            })
            .addCase(fetchProfileCompleteness.rejected, (state, action) =>
            {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.user = action.payload;
                state.userId = action.payload._id;
                // Automatically update default filters if user has profile
                if (action.payload.profile)
                {
                    state.userPreferences.defaultFilters = {
                        ageRange: action.payload.profile.preferenceAgeRange || state.userPreferences.defaultFilters.ageRange,
                        interestedIn: action.payload.profile.interestedIn || state.userPreferences.defaultFilters.interestedIn,
                        location: action.payload.profile.location?.coordinates || state.userPreferences.defaultFilters.location,
                        locationRadius: action.payload.profile.locationRadius || state.userPreferences.defaultFilters.locationRadius,
                    };
                }
            })
            .addCase(fetchCurrentUser.rejected, (state, action) =>
            {
                state.loading = false;
                state.error = action.payload;
            })

            // Update current user
            .addCase(updateUser.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateUser.rejected, (state, action) =>
            {
                state.loading = false;
                state.error = action.payload;
            })

            // Update user profile
            .addCase(updateUserProfile.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.user.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) =>
            {
                state.loading = false;
                state.error = action.payload;
            })
            // Change password
            .addCase(changePassword.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) =>
            {
                state.loading = false;
                toast.success('Password changed successfully!');
            })
            .addCase(changePassword.rejected, (state, action) =>
            {
                state.error = action.payload;
                state.loading = false;
                toast.error(action.payload || 'Failed to change password');
            })
            .addCase(fetchUserProfileById.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfileById.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfileById.rejected, (state, action) =>
            {
                state.loading = false;
                state.user = null;
                state.error = action.payload || 'An error occurred';
            });
    },
});

export const { clearError, setUserPreferences, clearUser } = userSlice.actions;
export default userSlice.reducer;
