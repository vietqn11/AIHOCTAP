import React from 'react';

const PlaceholderPage = ({ pageName }) => (
    <div className="text-center p-8">
        <h2 className="text-xl font-semibold">{`Trang ${pageName}`}</h2>
        <p className="mt-4 text-gray-600">Chức năng này đang được phát triển. Vui lòng quay lại sau.</p>
    </div>
);

export default PlaceholderPage;