
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { COLLEGES } from '../constants';
import { StudentVerificationData } from '../types';

type FormData = {
  collegeName: string;
  batchYear: string;
  collegeEmail: string;
  phone: string;
};

export const StudentVerification: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<{front: File | null, back: File | null}>({ front: null, back: null });
  const navigate = useNavigate();
  const { submitStudentVerification } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitStep1 = () => {
    setStep(2);
  };

  const onFinalSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const verificationData: StudentVerificationData = {
      collegeName: data.collegeName,
      batchYear: data.batchYear,
      collegeEmail: data.collegeEmail,
      idCardFront: files.front,
      idCardBack: files.back
    };

    const result = await submitStudentVerification(verificationData);

    setIsSubmitting(false);

    if (result.error) {
       alert(`Verification submission failed: ${result.error}`);
    } else {
       navigate('/dashboard', { state: { verificationSubmitted: true } });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [side]: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Student Verification</h2>
            <p className="mt-2 text-sm text-gray-600">
              Get verified to unlock flat 20% off on all bookings
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="text-xs mt-1">Details</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="text-xs mt-1">Documents</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(step === 1 ? onSubmitStep1 : onFinalSubmit)}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select College</label>
                  <select 
                    {...register('collegeName', { required: true })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                  >
                    <option value="">Select your college</option>
                    {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.collegeName && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch / Graduation Year</label>
                  <select 
                    {...register('batchYear', { required: true })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                  >
                    {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">College Email ID</label>
                  <input
                    type="email"
                    placeholder="you@college.edu.in"
                    {...register('collegeEmail', { 
                      required: "Required", 
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:edu|ac\.in)$/,
                        message: "Must be .edu or .ac.in email"
                      }
                    })}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                   {errors.collegeEmail && <span className="text-red-500 text-xs">{errors.collegeEmail.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone', { required: true, minLength: 10 })}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Card (Front)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors relative">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-emerald-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'front')} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                    {files.front && (
                      <div className="absolute inset-0 bg-green-50 flex items-center justify-center rounded-md">
                        <span className="flex items-center text-green-700 font-medium"><CheckCircle className="mr-2" size={16}/> {files.front.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Card (Back)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors relative">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-emerald-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'back')} required />
                        </label>
                      </div>
                    </div>
                    {files.back && (
                      <div className="absolute inset-0 bg-green-50 flex items-center justify-center rounded-md">
                        <span className="flex items-center text-green-700 font-medium"><CheckCircle className="mr-2" size={16}/> {files.back.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                   <div className="flex">
                     <div className="flex-shrink-0">
                       <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                     </div>
                     <div className="ml-3">
                       <h3 className="text-sm font-medium text-blue-800">Review Process</h3>
                       <div className="mt-2 text-sm text-blue-700">
                         <p>Verification typically takes 1-2 business days. You'll receive an email once approved.</p>
                       </div>
                     </div>
                   </div>
                 </div>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                    Back
                    </button>
                    <button
                    type="submit"
                    disabled={!files.front || !files.back || isSubmitting}
                    className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-emerald-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
