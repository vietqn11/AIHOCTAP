import React from 'react';

const SubjectHomePageLayout = ({ title, activities }) => {
    return (
        <main className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => (
                    <button
                        key={index}
                        onClick={activity.onClick}
                        className={`bg-gradient-to-br ${activity.color} text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                    >
                        <div className="mb-4">{activity.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
                        <p className="text-sm opacity-90">{activity.description}</p>
                    </button>
                ))}
            </div>
        </main>
    );
};

export default SubjectHomePageLayout;