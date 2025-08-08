import { saveItinerary } from './itinerary';

// Mock FirebaseConfig
jest.mock('../config/FirebaseConfig', () => ({
  auth: { currentUser: { uid: 'user1', email: 'user@example.com' } },
  db: {},
}));

const mockCollection = jest.fn(() => ({}));
const mockDoc = jest.fn(() => ({ id: 'doc1' }));
const mockSetDoc = jest.fn(() => Promise.resolve());

jest.mock('firebase/firestore', () => ({
  collection: (...args: any[]) => mockCollection(...args),
  doc: (...args: any[]) => mockDoc(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
}));

describe('saveItinerary', () => {
  beforeEach(() => {
    mockCollection.mockClear();
    mockDoc.mockClear();
    mockSetDoc.mockClear();
  });

  it('writes itinerary and related collections', async () => {
    const tripPlan: any = {
      flight_details: [{ departure_city: 'NYC', arrival_city: 'LON' }],
      hotel: { options: [{ name: 'Hotel' }] },
      places_to_visit: [{ name: 'Place' }],
      itinerary: [{ day: 1, schedule: {} }],
    };
    const itinerary: any = {
      id: 'it1',
      userId: 'user1',
      destination: { city: 'London' },
      startDate: '2025-12-01',
      endDate: '2025-12-05',
      bookings: [],
      createdAt: 0,
      updatedAt: 0,
    };
    await saveItinerary(tripPlan, itinerary, {}, 'user@example.com');
    // root document plus flights, hotels, places, days
    expect(mockSetDoc).toHaveBeenCalled();
  });
});
