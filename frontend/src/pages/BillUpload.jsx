import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { billAPI } from '../services/api';

const BillUpload = ({ onBillProcessed }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const response = await billAPI.upload(file);
      setAnalysis(response.data);
      if (onBillProcessed) {
        onBillProcessed(response.data);
      }
      toast.success('Bill analyzed successfully');
    } catch (error) {
      console.error('Error uploading bill:', error);
      toast.error('Failed to analyze bill');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Upload Bill Document</h3>
        
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
          <i className="bi bi-file-pdf text-4xl text-gray-500"></i>
          <p className="text-gray-400 mt-2">Upload PDF bill for AI analysis</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="bill-upload"
          />
          <label
            htmlFor="bill-upload"
            className="inline-block mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition"
          >
            Select PDF
          </label>
          {file && (
            <p className="text-xs text-green-500 mt-2">
              <i className="bi bi-check-circle-fill mr-1"></i>
              {file.name}
            </p>
          )}
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 btn-primary w-full disabled:opacity-50"
        >
          {uploading ? (
            <><i className="bi bi-hourglass-split animate-spin mr-2"></i>Analyzing...</>
          ) : (
            <><i className="bi bi-cloud-upload mr-2"></i>Analyze Bill</>
          )}
        </button>
      </div>

      {analysis && (
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">AI Analysis Results</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Executive Summary</p>
              <p className="text-gray-300 text-sm mt-1">{analysis.summary}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Key Points</p>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                {analysis.key_points?.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-green-500 text-xs uppercase tracking-wider">Advantages</p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                  {analysis.advantages?.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-red-500 text-xs uppercase tracking-wider">Disadvantages</p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                  {analysis.disadvantages?.map((dis, i) => (
                    <li key={i}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Economic Impact</p>
              <p className="text-gray-300 text-sm mt-1">{analysis.economic_impact}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Social Impact</p>
              <p className="text-gray-300 text-sm mt-1">{analysis.social_impact}</p>
            </div>
            
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
              <p className="text-primary-400 text-xs uppercase tracking-wider">AI Recommendation</p>
              <p className="text-gray-300 text-sm mt-1">{analysis.ai_recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillUpload;