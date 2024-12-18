import React from 'react';
import { Users, GraduationCap, Clock } from 'lucide-react';
import DetailItem from './DetailItem';

const ProfileDetails = ({ profile }) => {
    return (
        <div className="p-8 flex flex-col">
            <div className="flex-grow">
                {/* About Section */}
                <section className="mb-6">
                    <h3 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-4 flex items-center">
                        <Users className="mr-3 text-neutral-600" />
                        About
                    </h3>
                    <p className="text-neutral-600 italic h-20 overflow-hidden">
                        {profile.bio || 'No bio available.'}
                    </p>
                </section>

                {/* Details Section */}
                <section className="mb-6">
                    <h3 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-4 flex items-center">
                        <GraduationCap className="mr-3 text-neutral-600" />
                        Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Occupation - Full width */}
                        <div className="col-span-2">
                            <DetailItem 
                                label="Occupation" 
                                value={profile.occupation} 
                                className="truncate"
                            />
                        </div>

                        {/* Education - Full width */}
                        <div className="col-span-2">
                            <DetailItem 
                                label="Education" 
                                value={profile.education} 
                                className="truncate"
                            />
                        </div>

                        {/* Other fields - 2 rows, 2 columns */}
                        <DetailItem 
                            label="Height"
                            value={`${profile.height?.$numberDecimal || 'Not specified'} m`}
                            className="truncate"
                        />
                        <DetailItem 
                            label="Interested In" 
                            value={profile.interestedIn} 
                            className="truncate"
                        />
                        <DetailItem 
                            label="Drinking" 
                            value={profile.drinking} 
                            className="truncate"
                        />
                        <DetailItem 
                            label="Smoking" 
                            value={profile.smoking} 
                            className="truncate"
                        />
                    </div>
                </section>

                {/* Life Goals */}
                <section>
                    <h3 className="text-2xl font-light text-neutral-800 border-b pb-3 mb-4 flex items-center">
                        <Clock className="mr-3 text-neutral-600" />
                        Goals
                    </h3>
                    <div className="flex space-x-2">
                        <DetailItem 
                            label="Relationship Goal" 
                            value={profile.goals} 
                        />
                        <DetailItem 
                            label="Children" 
                            value={`${profile.children} `} 
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfileDetails;