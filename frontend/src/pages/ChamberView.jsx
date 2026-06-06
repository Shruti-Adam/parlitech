import React from 'react';
import Parliament3D from '../components/chamber/Parliament3D';

const ChamberView = ({ activeSpeaker, votingResults }) => {
  return (
    <div className="p-3 md:p-6">
      <div className="mb-4">
        <h2 className="heading-2">3D Parliamentary Chamber</h2>
        <p className="text-gray-400 text-sm">Lok Sabha • 245 Seats • Real-time Visualization</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs">
          <div className="flex items-center"><div className="w-3 h-3 bg-success rounded-full mr-1"></div><span>For</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-error rounded-full mr-1"></div><span>Against</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-warning rounded-full mr-1"></div><span>Abstain</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-info rounded-full mr-1"></div><span>Speaking</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-primary rounded-full mr-1"></div><span>Government</span></div>
        </div>
      </div>
      <Parliament3D activeSpeaker={activeSpeaker} votingResults={votingResults} />
      <div className="mt-4 text-center text-xs text-gray-500">
        <i className="bi bi-info-circle mr-1"></i>
        Hover over any seat to view MP details • Click for profile
      </div>
    </div>
  );
};

export default ChamberView;