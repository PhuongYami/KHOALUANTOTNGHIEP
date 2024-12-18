import React from 'react';
import PropTypes from 'prop-types';
import FilterSelect from './FilterSelect';

const DiscoverFilters = ({ 
    filters, 
    onFilterChange, 
    onReset, 
    onApply 
}) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
        <h3 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-4">Discover Filters</h3>
        <div className="grid md:grid-cols-3 gap-4">
            {/* Age Range */}
            <div>
                <label className="text-sm text-neutral-600 block mb-2">Age Range</label>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.ageRange.min}
                        onChange={(e) =>
                            onFilterChange('ageRange', {
                                ...filters.ageRange,
                                min: Number(e.target.value),
                            })
                        }
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.ageRange.max}
                        onChange={(e) =>
                            onFilterChange('ageRange', {
                                ...filters.ageRange,
                                max: Number(e.target.value),
                            })
                        }
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800"
                    />
                </div>
            </div>

            {/* Interested In */}
            <FilterSelect
                label="Interested In"
                options={['Male', 'Female', 'Other']}
                value={filters.interestedIn}
                onChange={(value) => onFilterChange('interestedIn', value)}
            />

            {/* Location Radius */}
            <div>
                <label className="text-sm text-neutral-600 block mb-2">Location Radius (km)</label>
                <input
                    type="number"
                    placeholder="Radius"
                    value={filters.locationRadius}
                    onChange={(e) => onFilterChange('locationRadius', Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800"
                />
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
            <button 
                className="text-neutral-600 hover:text-neutral-800 transition" 
                onClick={onReset}
            >
                Reset
            </button>
            <button 
                onClick={onApply}
                className="bg-neutral-800 text-white px-6 py-2 rounded-full hover:bg-neutral-700 transition"
            >
                Apply Filters
            </button>
        </div>
    </div>
);

DiscoverFilters.propTypes = {
    filters: PropTypes.shape({
        ageRange: PropTypes.shape({
            min: PropTypes.number.isRequired,
            max: PropTypes.number.isRequired
        }).isRequired,
        interestedIn: PropTypes.string.isRequired,
        locationRadius: PropTypes.number.isRequired
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired
};

export default DiscoverFilters;