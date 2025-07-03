import React, { useState, useEffect } from 'react';
import sprinklerVideo from '../ks-images/sprinkler.mp4';
import rainwaterVideo from '../ks-images/rainwater.mp4';
import pipeVideo from '../ks-images/pipe.mp4';
import fencingImage from '../ks-images/fencing.jpg';
import elecImage from '../ks-images/elec.jpg';
import shedImage from '../ks-images/shed.jpg';
import labourImage from '../ks-images/labour.jpg';
import solarVideo from '../ks-images/solar.mp4';
import { MapPin } from 'lucide-react';
import { supabase } from './supabaseClient';

// Service Card Component
const ServiceCard = ({ title, description, children, locationLink }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-xl border border-green-100 shadow-sm p-6 max-w-sm mx-auto flex flex-col items-start transition-all duration-300 ${
        isHovered ? 'shadow-lg scale-105 border-green-300 bg-green-50' : ''
      }`}
      style={{ minHeight: 240 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Location icon at top right, only if locationLink is provided */}
      {locationLink && (
        <a
          href={locationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 text-green-700 hover:text-green-900"
          title="Open Location"
        >
          <MapPin className="h-6 w-6" />
        </a>
      )}
      <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>{title}
      </h3>
      <p className="text-base text-gray-600 mb-4 leading-normal">{description}</p>
      <div className="w-full">{children}</div>
    </div>
  );
};

// Request Form Component
const RequestForm = ({ isOpen, onClose, fields, onSubmit, serviceTitle }) => {
  const [formData, setFormData] = useState({ category: serviceTitle });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      setError('');
      setSuccess(false);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }
      // Check if user is a farmer
      const { data: farmerProfile } = await supabase
        .from('farmer_profile_table')
        .select('id, name, phone_number, address')
        .eq('id', user.id)
        .single();
      if (farmerProfile) {
        setFarmerProfile(farmerProfile);
        setFormData({
          name: farmerProfile.name,
          phone: farmerProfile.phone_number,
          address: farmerProfile.address,
          category: serviceTitle,
          categoryDescription: '',
        });
      } else {
        setFarmerProfile(null);
        setError('Please log in as a farmer to request this service.');
      }
      setLoading(false);
    };
    if (isOpen) fetchUserAndProfile();
    // eslint-disable-next-line
  }, [isOpen, serviceTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!user || !farmerProfile) {
      setError('Please log in as a farmer to request this service.');
      return;
    }
    // Insert into service_requests table (only farmer_id, category, description)
    const { error: insertError } = await supabase
      .from('service_requests')
      .insert([
        {
          farmer_id: farmerProfile.id,
          category: serviceTitle,
          description: formData.categoryDescription,
        },
      ]);
    if (insertError) {
      setError('Failed to submit request. Please try again.');
      return;
    }
    setSuccess(true);
    onSubmit(formData);
    // Optionally close the form after a short delay
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setFormData({ category: serviceTitle });
    }, 1500);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <h3 className="text-xl font-semibold mb-2">Login Required</h3>
          <p className="text-gray-700 mb-2">Please log in as a farmer to request this service.</p>
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Close</button>
            <button onClick={() => window.location.href = '/FarmerLogin'} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Login</button>
          </div>
        </div>
      </div>
    );
  }

  if (!farmerProfile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <h3 className="text-xl font-semibold mb-2">Farmer Access Only</h3>
          <p className="text-gray-700 mb-2">Please log in as a farmer to request this service.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Request Service</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              value={formData.name || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              value={formData.phone || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              value={formData.address || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              value={serviceTitle}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Description</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              placeholder="Describe your issue or requirement"
              value={formData.categoryDescription || ''}
              onChange={e => setFormData({ ...formData, categoryDescription: e.target.value })}
              required
              rows="3"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 mb-2">To update your profile details, go to Profile → Edit</p>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">Request submitted successfully!</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            disabled={success}
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

const Planning = () => {
  const [activeForm, setActiveForm] = useState(null);
  
  // Manual image positioning values (adjust these values to change image focus)
  const imagePositions = {
    fencing: { objectPosition: '50% -20%' },  // Move up
    elec: { objectPosition: '50% 30%' },      // Move down
    shed: { objectPosition: '50% -10%' },     // Move up slightly
    labour: { objectPosition: '50% 20%' }     // Move down slightly
  };

  const waterServices = [
    {
      id: 'borewell',
      title: 'Borewell Issues',
      description: 'Get help with dried borewells, new installations, or repairs.',
      locationLink: "https://www.google.com/maps/search/borewell+shop+near+me/@17.3465515,78.471724,11059m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box1
      fields: [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'village', label: 'Village', type: 'text', placeholder: 'Enter your village' },
        {
          name: 'status',
          label: 'Borewell Status',
          type: 'select',
          options: ['Dried', 'No Facility', 'Needs Repair', 'New Installation'],
        },
        {
          name: 'urgency',
          label: 'Urgency',
          type: 'radio',
          options: ['Low', 'Medium', 'High'],
        },
      ],
    },
    {
      id: 'canal',
      title: 'Canal Irrigation Access',
      description: 'Resolve issues with irrigation lines and water supply.',
      locationLink: "https://www.google.com/maps/search/irrigation+services+near+me/@17.3338734,78.476153,11060m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box2
      fields: [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter your phone number' },
        {
          name: 'issueType',
          label: 'Type of Issue',
          type: 'select',
          options: ['No Access', 'Broken Supply Line', 'Low Pressure', 'Other'],
        },
        {
          name: 'notes',
          label: 'Additional Notes',
          type: 'text',
          placeholder: 'Describe your issue in detail',
        },
      ],
    },
    {
      id: 'tanker',
      title: 'Water Tanker Booking',
      description: 'Book water tankers for your farm needs.',
      locationLink: "https://www.google.com/maps/search/water+tanker+shops+near+me/@17.3348008,78.4761524,11060m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box3
      fields: [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'village', label: 'Village', type: 'text', placeholder: 'Enter your village' },
        {
          name: 'litres',
          label: 'Litres Needed',
          type: 'number',
          placeholder: 'Enter litres required',
        },
        { name: 'date', label: 'Date Required', type: 'date' },
      ],
    },
    {
      id: 'storage',
      title: 'No Storage Tank / Farm Pond',
      description: 'Get help with water storage solutions for your farm.',
      locationLink: "", // box4
      fields: [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter your address' },
        {
          name: 'issueType',
          label: 'Issue Type',
          type: 'select',
          options: ['No Storage', 'Needs Repair', 'Needs Expansion'],
        },
        {
          name: 'action',
          label: 'Action Needed',
          type: 'select',
          options: ['Build New', 'Repair Existing'],
        },
      ],
    },
    {
      id: 'rainwater',
      title: 'Rainwater Harvesting Setup',
      description: 'Set up rainwater harvesting systems for sustainable water management.',
      locationLink: "https://www.google.com/maps/search/havesting+services+near+me/@17.3857329,78.3693603,22114m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box5
      fields: [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter your address' },
        {
          name: 'rooftopSize',
          label: 'Rooftop Size',
          type: 'select',
          options: ['Small (<100 sq ft)', 'Medium (100-500 sq ft)', 'Large (>500 sq ft)'],
        },
        {
          name: 'preferredMonth',
          label: 'Preferred Month for Setup',
          type: 'select',
          options: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
        },
      ],
    },
  ];

  const electricityServices = [
    {
      id: 'newConnection',
      title: 'New Electricity Connection',
      description: 'Apply for a new electricity connection for your farm.',
      locationLink: "https://www.google.com/maps/search/electrician+near+me/@17.3416908,78.5015103,691m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box6
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'issueType',
          label: 'Select Your Electricity Issue',
          type: 'select',
          options: [
            'Apply for New Electricity Connection',
            'Report Frequent Power Cuts',
            'Report Low Voltage Problem',
            'Request Solar Panel Installation',
            'Book a Local Electrician',
            'Other'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Visit',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'powerCuts',
      title: 'Power Cut Issues',
      description: 'Report frequent power cuts or voltage problems in your area.',
      locationLink: "https://www.google.com/maps/search/electrician+near+me/@17.3416908,78.5015103,691m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box7
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'issueType',
          label: 'Select Your Electricity Issue',
          type: 'select',
          options: [
            'Apply for New Electricity Connection',
            'Report Frequent Power Cuts',
            'Report Low Voltage Problem',
            'Request Solar Panel Installation',
            'Book a Local Electrician',
            'Other'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Visit',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'solarInstallation',
      title: 'Solar Panel Installation',
      description: 'Get help with solar panel installation for your farm.',
      locationLink: "https://www.google.com/maps/search/solar+panels+near+me/@17.3418206,78.482945,5530m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box8
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'issueType',
          label: 'Select Your Electricity Issue',
          type: 'select',
          options: [
            'Apply for New Electricity Connection',
            'Report Frequent Power Cuts',
            'Report Low Voltage Problem',
            'Request Solar Panel Installation',
            'Book a Local Electrician',
            'Other'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Visit',
          type: 'datetime-local',
        },
      ],
    },
  ];

  const infrastructureServices = [
    {
      id: 'fencing',
      title: 'Fencing Services',
      description: 'Get help with all your farm fencing needs - from installation to repairs.',
      locationLink: "https://www.google.com/maps/search/fence+supply+store/@17.3630637,78.4727379,346m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box9
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Fencing Service',
          type: 'select',
          options: [
            'Install new fencing',
            'Repair broken fencing',
            'Repaint/color fencing',
            'Replace or change fencing',
            'Sell old fencing',
            'Need labor for fencing installation',
            'Other fencing-related request'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'shed',
      title: 'Shed & Workspace Services',
      description: 'Professional shed construction, repair, and maintenance services.',
      locationLink: "https://www.google.com/maps/search/fabricators+near+me/@17.3492919,78.3657299,12z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box10
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Shed Service',
          type: 'select',
          options: [
            'Build new shed',
            'Repair existing shed',
            'Expand shed area',
            'Paint shed',
            'Other shed-related request'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'land',
      title: 'Land Preparation Services',
      description: 'Professional land preparation and development services.',
      locationLink: "", // box11
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Land Service',
          type: 'select',
          options: [
            'Level the land',
            'Clean/debrush the land',
            'Path or route making',
            'Road roller service',
            'Digging services',
            'Other land work'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'fire',
      title: 'Fire Safety Services',
      description: 'Ensure your farm\'s safety with professional fire safety services.',
      locationLink: "https://www.google.com/maps/search/fire+safety+services+near+me/@17.3491867,78.5040409,13z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box12
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Fire Safety Service',
          type: 'select',
          options: [
            'Request fire safety inspection',
            'Request fire extinguisher installation',
            'Build fire break line',
            'Install water buckets or tank',
            'General fire safety consultation',
            'Other fire safety needs'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
  ];

  const laborServices = [
    {
      id: 'farmWork',
      title: 'Farm Work Labor',
      description: 'Skilled labor for various farm operations.',
      locationLink: "", // box13
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Farm Work',
          type: 'select',
          options: [
            'Sowing',
            'Harvesting',
            'Weeding',
            'Irrigation help',
            'Fertilizer/pesticide application',
            'Other farm work'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Work',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'loading',
      title: 'Loading & Unloading Help',
      description: 'Professional help with loading and unloading operations.',
      locationLink: "", // box14
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Loading Service',
          type: 'select',
          options: [
            'At the farm',
            'For transport to market',
            'For moving into storage'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'transport',
      title: 'Transport Assistance',
      description: 'Professional transport and machinery operation services.',
      locationLink: "", // box15
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Transport Service',
          type: 'select',
          options: [
            'Need tractor driver',
            'Trolley/cart driver',
            'Manual labor for shifting goods'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'machinery',
      title: 'Machinery Operators',
      description: 'Skilled operators for various farm machinery.',
      locationLink: "", // box16
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Machinery Service',
          type: 'select',
          options: [
            'Help with sprayers',
            'Trained operator for tillers, harvesters',
            'Setup/tear-down machinery'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'construction',
      title: 'Construction Labor',
      description: 'Skilled labor for construction and development work.',
      locationLink: "https://www.google.com/maps/search/construction+labour+contractor/@17.4866661,78.3816603,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box17
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Construction Service',
          type: 'select',
          options: [
            'For fencing',
            'For shed work',
            'For land leveling or digging'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
    {
      id: 'misc',
      title: 'Miscellaneous Labor',
      description: 'General purpose labor and cleaning services.',
      locationLink: "https://www.google.com/maps/search/labour+provider+near+me/@17.3397523,78.331498,11z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D", // box18
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'address', label: 'Farm Address', type: 'textarea', placeholder: 'Enter your farm address' },
        {
          name: 'serviceType',
          label: 'Select Service Type',
          type: 'select',
          options: [
            'House/farm cleaning',
            'General purpose helper',
            'Other labor work'
          ],
        },
        {
          name: 'preferredDateTime',
          label: 'Preferred Date/Time for Service',
          type: 'datetime-local',
        },
      ],
    },
  ];

  // Add Transportation and Logistics services
  const transportationServices = [
    {
      id: 'cropTransport',
      title: 'Crop Transportation',
      description: 'Get help with transporting your crops to markets or storage facilities.',
      locationLink: 'https://www.google.com/maps/search/crop+transportation+near+me/',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'pickupLocation', label: 'Pickup Location', type: 'text', placeholder: 'Enter pickup location' },
        { name: 'dropLocation', label: 'Drop Location', type: 'text', placeholder: 'Enter drop location' },
        { name: 'cropType', label: 'Crop Type', type: 'text', placeholder: 'Type of crop' },
        { name: 'quantity', label: 'Quantity (kg)', type: 'number', placeholder: 'Enter quantity in kg' },
        { name: 'preferredDate', label: 'Preferred Date', type: 'date' },
      ],
    },
    {
      id: 'coldStorage',
      title: 'Cold Storage Access',
      description: 'Request access to cold storage facilities for your produce.',
      locationLink: 'https://www.google.com/maps/search/cold+storage+near+me/',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'produceType', label: 'Produce Type', type: 'text', placeholder: 'Type of produce' },
        { name: 'quantity', label: 'Quantity (kg)', type: 'number', placeholder: 'Enter quantity in kg' },
        { name: 'storageDuration', label: 'Storage Duration (days)', type: 'number', placeholder: 'Number of days' },
        { name: 'preferredStartDate', label: 'Preferred Start Date', type: 'date' },
      ],
    },
    {
      id: 'coldChain',
      title: 'Cold Chain Supply',
      description: 'Get support for cold chain logistics for perishable goods.',
      locationLink: 'https://www.google.com/maps/search/cold+chain+logistics+near+me/',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
        { name: 'produceType', label: 'Produce Type', type: 'text', placeholder: 'Type of produce' },
        { name: 'quantity', label: 'Quantity (kg)', type: 'number', placeholder: 'Enter quantity in kg' },
        { name: 'origin', label: 'Origin Location', type: 'text', placeholder: 'Enter origin location' },
        { name: 'destination', label: 'Destination Location', type: 'text', placeholder: 'Enter destination location' },
        { name: 'preferredDate', label: 'Preferred Date', type: 'date' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 pt-20">
      {/* Page Introduction */}
      <div className="w-full px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
          Infrastructure Planning for Farmers
        </h1>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          At Kisaan Suvidha, we help farmers plan and access essential local services for their farms — including water management, 
          electricity setup, land preparation, physical infrastructure, and labor support. Whether you need a borewell, solar panel, 
          fencing, or skilled labor, we bring these services closer to you.
        </p>
      </div>

      {/* Services Glimpse Section */}
      <div className="w-full px-4 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">What We Offer</h2>

        {/* Water Management - Sprinkler */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 bg-green-50 rounded-xl p-8 shadow-sm mb-2">
              <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>Modern Irrigation Systems
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Sprinkler irrigation systems offer efficient water distribution across your fields. 
                They help conserve water while ensuring uniform coverage, reducing water wastage and labor costs.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <video
                  className="w-full h-full object-cover rounded-lg border-2 border-green-100 shadow-md transition-transform duration-300 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={sprinklerVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Water Management - Rainwater */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row-reverse gap-4 items-center">
            <div className="w-full md:w-1/2 bg-green-50 rounded-xl p-6 shadow-sm mb-2">
              <h3 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>Rainwater Harvesting
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Rainwater harvesting systems help farmers store and utilize rainwater effectively. 
                This sustainable practice reduces dependency on groundwater and helps combat water scarcity.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <video
                  className="w-full h-full object-cover rounded-lg border-2 border-green-100 shadow-md transition-transform duration-300 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={rainwaterVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Water Management - Pipe */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2 bg-green-50 rounded-xl p-6 shadow-sm mb-2">
              <h3 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>Efficient Water Distribution
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Modern pipe irrigation systems ensure precise water delivery to crops. 
                They minimize water loss through evaporation and provide better control over water distribution.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <video
                  className="w-full h-full object-cover rounded-lg border-2 border-green-100 shadow-md transition-transform duration-300 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={pipeVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Fencing Solutions */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Farm Fencing</h3>
              <p className="text-base text-gray-700">
                Secure your farm with our range of fencing solutions. From traditional to modern fencing options, 
                we provide durable and cost-effective protection for your agricultural land.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <img
                  src={fencingImage}
                  alt="Farm Fencing"
                  style={{ objectPosition: imagePositions.fencing.objectPosition }}
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Electricity Setup */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Electricity Solutions</h3>
              <p className="text-base text-gray-700">
                Reliable power solutions for your farm. From grid connections to backup systems, 
                we ensure your farm operations run smoothly with consistent power supply.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <img
                  src={elecImage}
                  alt="Electricity Setup"
                  style={{ objectPosition: imagePositions.elec.objectPosition }}
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Storage Sheds */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Storage Solutions</h3>
              <p className="text-base text-gray-700">
                Custom storage solutions for your farm produce and equipment. Our sheds and storage units 
                are designed to protect your assets from weather and pests.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <img
                  src={shedImage}
                  alt="Storage Sheds"
                  style={{ objectPosition: imagePositions.shed.objectPosition }}
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Solar Solutions */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Solar Power</h3>
              <p className="text-base text-gray-700">
                Sustainable energy solutions with solar power systems. Reduce your electricity costs 
                and contribute to a greener environment with our solar installations.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <video
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={solarVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Labor Support */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Skilled Labor</h3>
              <p className="text-base text-gray-700">
                Access to skilled agricultural workers and technicians. We connect you with experienced 
                professionals for all your farming and infrastructure needs.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center">
              <div className="aspect-square w-48 md:w-64 relative group flex items-center justify-center">
                <img
                  src={labourImage}
                  alt="Skilled Labor"
                  style={{ objectPosition: imagePositions.labour.objectPosition }}
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Services Section */}
      <div className="w-full px-4 mb-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Water-Related Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {waterServices.map((service, idx) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              locationLink={service.locationLink}
            >
              <button
                onClick={() => setActiveForm(service.id)}
                className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-white py-2 px-4 rounded-lg shadow hover:from-green-600 hover:to-lime-500 transition-all duration-200 font-semibold text-sm mt-2"
              >
                Request Service
              </button>
            </ServiceCard>
          ))}
        </div>
      </div>

      {/* Electricity Services Section */}
      <div className="w-full px-4 mb-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Electricity-Related Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {electricityServices.map((service, idx) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              locationLink={service.locationLink}
            >
              <button
                onClick={() => setActiveForm(service.id)}
                className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-white py-2 px-4 rounded-lg shadow hover:from-green-600 hover:to-lime-500 transition-all duration-200 font-semibold text-sm mt-2"
              >
                Request Service
              </button>
            </ServiceCard>
          ))}
        </div>
      </div>

      {/* Land and Physical Infrastructure Services Section */}
      <div className="w-full px-4 mb-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Land and Physical Infrastructure Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {infrastructureServices.map((service, idx) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              locationLink={service.locationLink}
            >
              <button
                onClick={() => setActiveForm(service.id)}
                className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-white py-2 px-4 rounded-lg shadow hover:from-green-600 hover:to-lime-500 transition-all duration-200 font-semibold text-sm mt-2"
              >
                Request Service
              </button>
            </ServiceCard>
          ))}
        </div>
      </div>

      {/* Labor Services Section */}
      <div className="w-full px-4 mb-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Labor & Physical Work Assistance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {laborServices.map((service, idx) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              locationLink={service.locationLink}
            >
              <button
                onClick={() => setActiveForm(service.id)}
                className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-white py-2 px-4 rounded-lg shadow hover:from-green-600 hover:to-lime-500 transition-all duration-200 font-semibold text-sm mt-2"
              >
                Request Service
              </button>
            </ServiceCard>
          ))}
        </div>
      </div>

      {/* Transportation and Logistics Section */}
      <div className="w-full px-4 mb-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transportation and Logistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {transportationServices.map((service, idx) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              locationLink={service.locationLink}
            >
              <button
                onClick={() => setActiveForm(service.id)}
                className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-white py-2 px-4 rounded-lg shadow hover:from-green-600 hover:to-lime-500 transition-all duration-200 font-semibold text-sm mt-2"
              >
                Request Service
              </button>
            </ServiceCard>
          ))}
        </div>
      </div>

      {/* Forms */}
      {waterServices.map((service) => (
        <RequestForm
          key={service.id}
          isOpen={activeForm === service.id}
          onClose={() => setActiveForm(null)}
          serviceTitle={service.title}
          onSubmit={(data) => console.log(data)}
        />
      ))}
      {electricityServices.map((service) => (
        <RequestForm
          key={service.id}
          isOpen={activeForm === service.id}
          onClose={() => setActiveForm(null)}
          serviceTitle={service.title}
          onSubmit={(data) => console.log(data)}
        />
      ))}
      {infrastructureServices.map((service) => (
        <RequestForm
          key={service.id}
          isOpen={activeForm === service.id}
          onClose={() => setActiveForm(null)}
          serviceTitle={service.title}
          onSubmit={(data) => console.log(data)}
        />
      ))}
      {laborServices.map((service) => (
        <RequestForm
          key={service.id}
          isOpen={activeForm === service.id}
          onClose={() => setActiveForm(null)}
          serviceTitle={service.title}
          onSubmit={(data) => console.log(data)}
        />
      ))}
      {transportationServices.map((service) => (
        <RequestForm
          key={service.id}
          isOpen={activeForm === service.id}
          onClose={() => setActiveForm(null)}
          serviceTitle={service.title}
          onSubmit={(data) => console.log(data)}
        />
      ))}
    </div>
  );
};

export default Planning; 