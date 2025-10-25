import React from 'react';
import { Page, PageProps } from '../../types';
import { DIALOGUE_SCRIPTS } from '../../constants';
import { SpeakerIcon } from '../icons/Icons';

const RolePlayScriptSelectionPage = ({ navigate }: PageProps) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Chọn kịch bản để đóng vai</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DIALOGUE_SCRIPTS.map(script => (
                    <div key={script.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{script.title}</h3>
                        <p className="font-semibold mb-2">Chọn vai của em:</p>
                        <div className="flex space-x-4">
                            {script.characters.map(character => (
                                <button
                                    key={character}
                                    onClick={() => navigate(Page.RolePlayReading, { script, userCharacter: character })}
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-transform transform hover:scale-105"
                                >
                                    <span className="ml-2">Vai: {character}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RolePlayScriptSelectionPage;