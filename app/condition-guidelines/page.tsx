// app/condition-guidelines/page.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, BookOpen, Disc, Gamepad, Film, Package, Star, Info, ArrowLeft, Sparkles, Shield } from 'lucide-react';

// Simplified interface for category guidelines
interface CategoryGuidelines {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  acceptable: string[];
  notAcceptable: string[];
  notes?: string;
  color: string;
  bgColor: string;
}

export default function ConditionGuidelines() {
  const [activeTab, setActiveTab] = useState('books');

  // Updated data structure focusing on a single "Gently Used" standard per category
  const categories: CategoryGuidelines[] = [
    {
      id: 'books',
      name: 'Books',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'We look for books that are in a clean, readable condition with all pages and covers intact.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      acceptable: [
        'Light shelf wear on cover edges or spine',
        'Minor corner bumping or creasing',
        'Clean pages with no significant markings',
        'Intact dust jacket (if originally included)',
        'Price stickers or residue on the cover'
      ],
      notAcceptable: [
        'Water, mold, or moisture damage',
        'Missing pages, covers, or dust jackets',
        'Any underlining, highlighting, or notes on pages',
        'Owner\'s name or inscriptions',
        'Strong odors (e.g., smoke, mildew)',
        'Ex-library books (with stamps, stickers, etc.)',
        'Broken or detached spines',
        'Obscured or unreadable text',
        'Remainder marks on page edges'
      ]
    },
    {
      id: 'cds',
      name: 'CDs',
      icon: <Disc className="w-5 h-5" />,
      description: 'Discs must play perfectly. Original cases and booklets are required for the best value.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      acceptable: [
        'Light surface marks or scuffs that do not affect playback',
        'Minor scuffs or cracks on the jewel case',
        'Intact and readable booklet/artwork (normal wear and tear is acceptable)',
        'Original case and booklet included'
      ],
      notAcceptable: [
        'Deep scratches or cracks that cause skipping',
        'Missing discs, booklets, or original cover art',
        'Torn, water-damaged, or moldy booklets',
        'Promotional, burned, or bootleg copies',
        'Significant water damage to cover art or inserts'
      ]
    },
    {
      id: 'games',
      name: 'Video Games',
      icon: <Gamepad className="w-5 h-5" />,
      description: 'Games must be fully playable and include their original case, cover art, and manual.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      acceptable: [
        'Light, cosmetic scratches on the disc that don\'t affect gameplay',
        'Minor wear on the case or cartridge label',
        'Complete with original case, cover art, manual, and inserts',
        'Sticker residue on the case'
      ],
      notAcceptable: [
        'Non-working or game-breaking damage',
        'Missing original case, cover art, or manual',
        'Cracked or heavily damaged discs or cartridges',
        'Counterfeit or pirated copies',
        'Region-locked games incompatible with US consoles'
      ],
      notes: 'Games missing their original case or cover art will not be accepted.'
    },
    {
      id: 'dvds',
      name: 'DVDs & Blu-rays',
      icon: <Film className="w-5 h-5" />,
      description: 'All discs must play without interruption and come with their original case and artwork.',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      acceptable: [
        'Light surface marks that don\'t affect playback',
        'Minor wear or cracks on the case',
        'All original inserts and cover art present',
        'Box sets with minor shelf wear'
      ],
      notAcceptable: [
        'Deep scratches or cracks that cause skipping or freezing',
        'Missing discs from a set',
        'Missing original cover art',
        'Bootleg, copied, or promotional discs',
        'Severe damage to packaging or water-damaged cover art',
        'Former rental or ex-library copies'
      ]
    }
  ];

  const activeCategory = categories.find(cat => cat.id === activeTab) || categories[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-all duration-200 group bg-white/60 hover:bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-white/50"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Our 'Gently Used' Standard
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We accept a wide range of gently used media. Use these guidelines to see what we look for and what to avoid sending. This ensures you get a fair and fast valuation.
            </p>
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white/60 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                  activeTab === category.id
                    ? `${category.bgColor} ${category.color} shadow-xl scale-105`
                    : 'bg-white/80 text-gray-600 hover:text-gray-900 hover:bg-white/90'
                }`}
              >
                <div className={`p-1 rounded-lg ${activeTab === category.id ? 'bg-white/50' : 'bg-gray-100'}`}>
                  {category.icon}
                </div>
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12 mb-12">
          <div className={`mb-8 p-6 rounded-2xl ${activeCategory.bgColor} border-2`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-xl bg-white shadow-md ${activeCategory.color}`}>
                {activeCategory.icon}
              </div>
              <div>
                <h2 className={`text-3xl font-bold ${activeCategory.color} mb-2`}>
                  {activeCategory.name} Guidelines
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {activeCategory.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Acceptable Column */}
            <div className="bg-green-50/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-green-200/50 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-2 bg-green-500 rounded-xl shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800">
                  What We Accept
                </h3>
              </div>
              <ul className="space-y-4">
                {activeCategory.acceptable.map((item, index) => (
                  <li key={index} className="flex items-start space-x-4 bg-white/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Acceptable Column */}
            <div className="bg-red-50/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-red-200/50 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-2 bg-red-500 rounded-xl shadow-lg">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-red-800">
                  What We Don't Accept
                </h3>
              </div>
              <ul className="space-y-4">
                {activeCategory.notAcceptable.map((item, index) => (
                  <li key={index} className="flex items-start space-x-4 bg-white/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                      <XCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {activeCategory.id === 'games' && activeCategory.notes && (
            <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-lg mb-2">Important Note</h4>
                  <p className="text-blue-800 font-medium">{activeCategory.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 sm:p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "What if I'm unsure about my item's condition?",
                answer: "Please review our guidelines carefully. If you're still in doubt, it's best not to send the item. Our quality team reviews all items and will recycle anything that doesn't meet our standards."
              },
              {
                question: "Do you accept items without barcodes?",
                answer: "Yes, we accept items without barcodes. We also accept Amazon ASIN numbers as valid identifiers for your items."
              },
              {
                question: "How are valuations determined?",
                answer: "Valuations are based on current market demand, condition, and our current inventory levels. Prices are updated regularly to reflect market changes."
              },
              {
                question: "What happens to rejected items?",
                answer: "Items that don't meet our 'gently used' standards are responsibly recycled. We are unable to return rejected items, so please check your items carefully."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}