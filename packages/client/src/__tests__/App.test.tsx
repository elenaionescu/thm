import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

describe('App', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockImplementation((url) => {
            if (url.includes('/search?q=mock')) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        hotels: [{ hotel_name: "Mock Hotel", city: "Mock City", country: "Mock Country" }],
                        cities: [{ name: "Mock City" }],
                        countries: [{ country: "Mock Country" }]
                    })
                });
            }
            return Promise.resolve({
                json: () => Promise.resolve({ hotels: [], cities: [], countries: [] })
            });
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render search input and display results', async () => {
        render(<App />);

        const searchInput = screen.getByPlaceholderText(/search for hotels, cities, or countries/i);
        fireEvent.change(searchInput, { target: { value: 'mock' } });

        const hotelResult = await screen.findByText(/mock hotel - mock city, mock country/i);
        expect(hotelResult).toBeInTheDocument();

        const cityResult = await screen.findByText(/mock city/i);
        expect(cityResult).toBeInTheDocument();

        const countryResult = await screen.findByText(/mock country/i);
        expect(countryResult).toBeInTheDocument();
    });

    it('should clear search results when clear button is clicked', async () => {
        render(<App />);

        const searchInput = screen.getByPlaceholderText(/search for hotels, cities, or countries/i);
        fireEvent.change(searchInput, { target: { value: 'mock' } });

        const hotelResult = await screen.findByText(/mock hotel - mock city, mock country/i);
        expect(hotelResult).toBeInTheDocument();

        const clearButton = screen.getByText(/clear/i);
        fireEvent.click(clearButton);

        expect(searchInput).toHaveValue('');
        expect(screen.queryByText(/mock hotel - mock city, mock country/i)).not.toBeInTheDocument();
    });
});
