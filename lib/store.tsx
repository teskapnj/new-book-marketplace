"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface Listing {
  views: number;
  featured: any;
  id: string;
  status: "pending" | "approved" | "rejected";
  title: string;
  bundleItems: any[];
  totalItems: number;
  totalValue: number;
  submittedDate: string;
  reviewedDate?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

interface StoreContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'submittedDate'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([
    {
      id: "demo-1",
      status: "approved",
      title: "15 Book Collection in Like New Condition",
      bundleItems: [
        { id: "1", isbn: "9781234567890", category: "book", condition: "like-new", quantity: 2, price: 5.00, image: null },
        { id: "2", isbn: "9781234567891", category: "book", condition: "good", quantity: 1, price: 3.00, image: null },
        { id: "3", isbn: "9781234567892", category: "book", condition: "like-new", quantity: 1, price: 4.00, image: null },
        { id: "4", isbn: "9781234567893", category: "book", condition: "good", quantity: 2, price: 3.50, image: null },
        { id: "5", isbn: "9781234567894", category: "book", condition: "like-new", quantity: 1, price: 6.00, image: null }
      ],
      totalItems: 15,
      totalValue: 75.50,
      submittedDate: "2024-01-15",
      views: 0,
      featured: undefined
    },
    {
      id: "demo-2",
      status: "approved",
      title: "12 Mixed Media Collection in Good Condition",
      bundleItems: [
        { id: "6", isbn: "9781234567895", category: "cd", condition: "good", quantity: 1, price: 4.00, image: null },
        { id: "7", isbn: "9781234567896", category: "dvd", condition: "like-new", quantity: 1, price: 6.00, image: null },
        { id: "8", isbn: "9781234567897", category: "game", condition: "good", quantity: 1, price: 8.00, image: null },
        { id: "9", isbn: "9781234567898", category: "cd", condition: "like-new", quantity: 2, price: 5.00, image: null }
      ],
      totalItems: 12,
      totalValue: 60.00,
      submittedDate: "2024-01-14",
      reviewedDate: "2024-01-15",
      views: 0,
      featured: undefined
    },
    {
      id: "demo-3",
      status: "pending",
      title: "10 Game Collection in Excellent Condition",
      bundleItems: [],
      totalItems: 10,
      totalValue: 120.00,
      submittedDate: "2024-01-16",
      views: 0,
      featured: undefined
    }
  ]);

  const addListing = (newListing: Omit<Listing, 'id' | 'submittedDate'>) => {
    const listing: Listing = {
      ...newListing,
      id: `listing-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setListings(prev => [listing, ...prev]);
    console.log("New listing added:", listing);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, ...updates } : listing
    ));
  };

  return (
    <StoreContext.Provider value={{ listings, addListing, updateListing }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}